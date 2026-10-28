#!/usr/bin/env node
/**
 * Generates nodes/TeamleaderFocus/SideloadOptions.ts:
 *   - OPERATION_ENDPOINTS: the endpoint every node operation calls, plus the
 *     relationship paths it can sideload ("Sideload Related Objects").
 *   - SPEC_INCLUDES: every `includes` value the spec documents per endpoint.
 *     These are always sent.
 *
 * Teamleader supports sideloading on every endpoint that returns objects:
 * any relationship represented as a {type, id} object can be requested via
 * the `include` body parameter using its dot-notation path (for example
 * `lead.customer`). See https://developer.focus.teamleader.eu/docs/sideloading
 *
 * The OpenAPI spec does not document `include` itself, so this script:
 *   1. Walks each endpoint's response schema in the newest spec and collects
 *      the dot-paths of every {type, id} relationship that is reached through
 *      at most one array (deeper ids such as grouped_lines.line_items.product
 *      are left out on purpose).
 *   2. Runs every resource/operation of the BUILT node (dist/) against a
 *      mocked n8n context to record which endpoint it actually calls.
 *
 * Usage:  npm run build && npm run generate:sideload && npm run build
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { loadNode, listOperations, execute, DIST_NODE } = require('./lib/mock-execute');

const ROOT = path.join(__dirname, '..');
const SPEC_DIR = path.join(ROOT, 'api-specs');
const OUT_FILE = path.join(ROOT, 'nodes', 'TeamleaderFocus', 'SideloadOptions.ts');

/** Paths may pass through at most this many arrays (e.g. `custom_fields.definition`). */
const MAX_ARRAYS = 1;

/**
 * Operations deliberately left out of OPERATION_ENDPOINTS, with the reason.
 * Any other operation that fails or does not make exactly one call is an error.
 */
const KNOWN_SKIPPED = {
	'file/download': 'two calls (files.info + files.download) and binary output',
};

// ─── 1. Relationship paths and includes per endpoint, from the newest spec ───

const semver = (f) => f.replace('.yaml', '').split('.').map(Number);
const specFile = fs
	.readdirSync(SPEC_DIR)
	.filter((f) => /^\d+\.\d+\.\d+\.yaml$/.test(f))
	.sort((a, b) => {
		const [x, y] = [semver(a), semver(b)];
		return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
	})
	.pop();
const spec = yaml.load(fs.readFileSync(path.join(SPEC_DIR, specFile), 'utf8'));

/** Flatten allOf compositions into a single schema (oneOf/anyOf are kept as alternatives). */
function merge(schema) {
	if (!schema || typeof schema !== 'object' || !schema.allOf) return schema;
	const out = { ...schema, properties: { ...(schema.properties || {}) } };
	delete out.allOf;
	for (const part of schema.allOf) {
		const m = merge(part);
		if (!m) continue;
		if (m.properties) Object.assign(out.properties, m.properties);
		if (m.items && !out.items) out.items = m.items;
		if (m.type && !out.type) out.type = m.type;
		for (const key of ['oneOf', 'anyOf']) if (m[key]) out[key] = [...(out[key] || []), ...m[key]];
	}
	return out;
}

const isRelationship = (s) => s && s.properties && s.properties.type && s.properties.id;
const isArray = (s) => s && (s.type === 'array' || s.items);

function collectPaths(schema, prefix, arrays, out, depth) {
	const s = merge(schema);
	if (!s || depth > 12) return;
	// Each alternative is walked on its own, with its own array count.
	for (const key of ['oneOf', 'anyOf']) {
		for (const alt of s[key] || []) collectPaths(alt, prefix, arrays, out, depth + 1);
	}
	if (isArray(s)) {
		if (arrays + 1 > MAX_ARRAYS) return; // e.g. grouped_lines.line_items.product
		collectPaths(s.items, prefix, arrays + 1, out, depth + 1);
		return;
	}
	if (prefix && isRelationship(s)) {
		out.add(prefix);
		return;
	}
	for (const [key, value] of Object.entries(s.properties || {})) {
		collectPaths(value, prefix ? `${prefix}.${key}` : key, arrays, out, depth + 1);
	}
}

const pathsByEndpoint = {};
const includesByEndpoint = {};
for (const [endpoint, item] of Object.entries(spec.paths)) {
	const op = item.post || item.get;

	// Documented `includes` values: the request parameter's example, plus every
	// `includes=<token>` mentioned anywhere in the response schema
	// (e.g. "Only included with request parameter `includes=pagination`").
	const includes = new Set();
	const requestBody = op?.requestBody?.content?.['application/json'];
	const requestIncludes = merge(requestBody?.schema)?.properties?.includes;
	const example = requestIncludes?.example ?? requestBody?.example?.includes;
	if (typeof example === 'string') example.split(',').forEach((v) => v.trim() && includes.add(v.trim()));

	const schema = op?.responses?.['200']?.content?.['application/json']?.schema;
	if (schema) {
		for (const m of JSON.stringify(schema).matchAll(/includes=([a-z_]+)/g)) includes.add(m[1]);
	}
	if (includes.size > 0) includesByEndpoint[endpoint] = [...includes].sort();

	if (!schema) continue;
	const root = merge(schema);
	// Some responses (e.g. tickets.info) omit the `data` wrapper in the spec.
	let data = merge(root.properties?.data ?? root);
	// For list endpoints the top-level array is the list itself: paths are per record.
	if (isArray(data)) data = data.items;
	const paths = new Set();
	collectPaths(data, '', 0, paths, 0);
	if (paths.size > 0) pathsByEndpoint[endpoint] = [...paths].sort();
}

// ─── 2. Which endpoint does each node operation call? ────────────────────────

if (!fs.existsSync(DIST_NODE)) {
	console.error('dist/ not found — run `npm run build` first.');
	process.exit(1);
}

(async () => {
	const node = loadNode();
	const entries = [];
	const failures = [];
	const skipped = new Set();

	for (const [resource, operation] of listOperations(node)) {
		const key = `${resource}/${operation}`;
		const { calls, output, error } = await execute(node, resource, operation);
		const outputError = error?.message ?? output.find((x) => x.json && x.json.error)?.json.error;

		if (KNOWN_SKIPPED[key]) {
			if (calls.length === 1 && !outputError) {
				failures.push(`${key}: listed in KNOWN_SKIPPED but now makes a single call — remove it from the list`);
			}
			skipped.add(key);
			continue;
		}
		if (outputError || calls.length !== 1) {
			failures.push(`${key}: ${outputError ?? `made ${calls.length} calls`}`);
			continue;
		}
		const endpoint = calls[0].uri;
		entries.push({ resource, operation, endpoint, paths: pathsByEndpoint[endpoint] ?? [] });
	}

	for (const key of Object.keys(KNOWN_SKIPPED)) {
		if (!skipped.has(key)) failures.push(`${key}: listed in KNOWN_SKIPPED but no longer exists`);
	}
	if (failures.length > 0) {
		console.error(`Operation discovery failed:\n  ${failures.join('\n  ')}`);
		process.exit(1);
	}

	// ─── 3. Write the TypeScript file ─────────────────────────────────────────

	const q = (s) => `'${s.replace(/'/g, "\\'")}'`;
	const body = entries
		.map((e) => {
			const paths = e.paths.length ? `[\n${e.paths.map((p) => `\t\t\t${q(p)},`).join('\n')}\n\t\t]` : '[]';
			return `\t{\n\t\tresource: ${q(e.resource)},\n\t\toperation: ${q(e.operation)},\n\t\tendpoint: ${q(e.endpoint)},\n\t\tpaths: ${paths},\n\t},`;
		})
		.join('\n');
	const includesBody = Object.keys(includesByEndpoint)
		.sort()
		.map((ep) => `\t${q(ep)}: [${includesByEndpoint[ep].map(q).join(', ')}],`)
		.join('\n');

	const ts = `// AUTO-GENERATED by scripts/generate-sideload-paths.js from api-specs/${specFile}.
// Do not edit by hand: run \`npm run build && npm run generate:sideload && npm run build\`.

export interface OperationEndpoint {
\tresource: string;
\toperation: string;
\t/** The single endpoint this operation calls. */
\tendpoint: string;
\t/** Relationship paths that can be sideloaded via \`include\` (at most ${MAX_ARRAYS} array deep). */
\tpaths: string[];
}

export const OPERATION_ENDPOINTS: OperationEndpoint[] = [
${body}
];

/** \`includes\` values documented in the spec, per endpoint. Always sent. */
export const SPEC_INCLUDES: Record<string, string[]> = {
${includesBody}
};
`;
	fs.writeFileSync(OUT_FILE, ts);
	const withPaths = entries.filter((e) => e.paths.length > 0);
	console.log(
		`Wrote ${entries.length} operations (${withPaths.length} with sideload paths, ${withPaths.reduce((n, e) => n + e.paths.length, 0)} paths) and ${Object.keys(includesByEndpoint).length} includes endpoints from ${specFile} to ${path.relative(ROOT, OUT_FILE)}. Skipped: ${[...skipped].join(', ') || 'none'}`,
	);
})();
