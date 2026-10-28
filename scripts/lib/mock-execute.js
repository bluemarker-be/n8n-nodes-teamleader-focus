/**
 * Runs operations of the BUILT Teamleader Focus node (dist/) against a mocked
 * n8n execution context, without network access. Shared by the sideload
 * generator and by ad-hoc request/output regression checks.
 *
 * Parameters are answered with typed fixtures derived from the node's own
 * property definitions (declared type and default), so structured parameters
 * such as JSON line arrays or collections get a value of the right shape.
 */

const path = require('path');

const DIST_NODE = path.join(__dirname, '..', '..', 'dist', 'nodes', 'TeamleaderFocus', 'TeamleaderFocus.node.js');

function loadNode(distNode = DIST_NODE) {
	delete require.cache[distNode];
	const { TeamleaderFocus } = require(distNode);
	return new TeamleaderFocus();
}

/** Every resource/operation pair declared by the node. */
function listOperations(node) {
	const pairs = [];
	for (const prop of node.description.properties.filter((p) => p.name === 'operation')) {
		for (const resource of prop.displayOptions?.show?.resource ?? []) {
			for (const option of prop.options) pairs.push([resource, option.value]);
		}
	}
	return pairs;
}

function fixtureFor(prop) {
	const d = prop.default;
	switch (prop.type) {
		case 'collection':
		case 'fixedCollection':
			return d ?? {};
		case 'json': {
			try {
				const parsed = JSON.parse(d);
				if (parsed && (typeof parsed === 'object')) return d;
			} catch {
				// fall through
			}
			return '[]';
		}
		case 'number':
			return d ?? 1;
		case 'boolean':
			return d ?? false;
		case 'options':
			return d !== '' && d !== undefined ? d : prop.options?.[0]?.value ?? 'x';
		case 'multiOptions':
			return d ?? [];
		case 'dateTime':
			return d || '2026-01-01T00:00:00.000Z';
		default:
			return d !== '' && d !== undefined ? d : 'x';
	}
}

/**
 * Build a getNodeParameter implementation for one resource/operation.
 * `overrides` win; then the n8n-style fallback argument; then a typed fixture.
 */
function makeGetNodeParameter(node, resource, operation, overrides = {}) {
	const props = node.description.properties;
	const matches = (p) => {
		const show = p.displayOptions?.show ?? {};
		if (show.resource && !show.resource.includes(resource)) return false;
		if (show.operation && !show.operation.includes(operation)) return false;
		return true;
	};
	return (name, itemIndex, fallback) => {
		const perItem = overrides[name];
		if (perItem !== undefined) return typeof perItem === 'function' ? perItem(itemIndex) : perItem;
		if (name === 'resource') return resource;
		if (name === 'operation') return operation;
		const prop = props.find((p) => p.name === name && matches(p));
		// Like n8n: a visible parameter resolves to its stored (declared) default,
		// even when the caller passes a fallback. Required-looking parameters
		// without a usable default get a typed fixture so the request is made.
		if (prop) return fallback !== undefined && prop.default !== undefined ? prop.default : fixtureFor(prop);
		return fallback !== undefined ? fallback : 'x';
	};
}

/**
 * Execute one resource/operation.
 * @param {object} opts
 * @param {object} [opts.params]    parameter overrides (value or (itemIndex) => value)
 * @param {number} [opts.items]     number of input items (default 1)
 * @param {Function} [opts.respond] (requestOptions, callIndex) => response
 * @param {boolean} [opts.continueOnFail] default true
 * @returns {Promise<{calls: {uri: string, body: object}[], output: object[], error?: Error}>}
 */
async function execute(node, resource, operation, opts = {}) {
	const calls = [];
	const items = Array.from({ length: opts.items ?? 1 }, () => ({ json: {} }));
	const respond = opts.respond ?? (() => ({ data: { id: 'x', location: 'https://example.invalid' } }));
	const ctx = {
		getInputData: () => items,
		getNodeParameter: makeGetNodeParameter(node, resource, operation, { returnAll: false, limit: 2, ...opts.params }),
		getNode: () => ({ name: 'Teamleader Focus', type: 'teamleaderFocus', typeVersion: 1, parameters: {} }),
		continueOnFail: () => opts.continueOnFail ?? true,
		helpers: {
			requestOAuth2: async (_credential, requestOptions) => {
				const call = {
					uri: requestOptions.uri.replace(/^https:\/\/api\.focus\.teamleader\.eu/, ''),
					body: requestOptions.body === undefined ? undefined : JSON.parse(JSON.stringify(requestOptions.body)),
				};
				calls.push(call);
				return respond(call, calls.length - 1);
			},
			httpRequest: async () => Buffer.from(''),
			prepareBinaryData: async () => ({ data: '', mimeType: 'application/octet-stream' }),
			assertBinaryData: () => ({ data: '', mimeType: 'application/octet-stream', fileName: 'f' }),
			getBinaryDataBuffer: async () => Buffer.from(''),
			returnJsonArray: (d) => (Array.isArray(d) ? d : [d]).map((json) => ({ json })),
			// Mirrors n8n: attaches the paired item to every produced item.
			constructExecutionMetaData: (data, { itemData }) => data.map((x) => ({ ...x, pairedItem: itemData })),
		},
	};
	try {
		const out = await node.execute.call(ctx);
		return { calls, output: out[0] };
	} catch (error) {
		return { calls, output: [], error };
	}
}

module.exports = { loadNode, listOperations, execute, DIST_NODE };
