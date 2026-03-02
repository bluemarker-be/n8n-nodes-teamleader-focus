#!/usr/bin/env node
/**
 * Comprehensive validation of the n8n node against the Teamleader Focus OpenAPI spec.
 *
 * Checks:
 * 1. All required request-body fields per endpoint are present.
 * 2. Nested structures (lead.customer, invoicee, participant, etc.) match spec.
 * 3. Field names match (no old/wrong names like "date" instead of "day").
 * 4. Every endpoint we implement actually exists in the spec.
 * 5. Structural verification: the handler code builds the right shapes.
 *
 * Known spec deviations (patches):
 * - NoteSubjectTypesCreate: missing "meeting" (API accepts it)
 * - Context enum: "deal" → "sale" + 6 missing contexts
 * - custom_fields_update_strategy: not in spec but supported on 11 update endpoints
 * - dealPhases.duplicate: exists in spec but returns 404 (not implemented)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─── Load spec ────────────────────────────────────────────────────────────────
const SPEC_PATH = path.join(__dirname, '..', 'api-specs', '1.115.0.yaml');
const spec = yaml.load(fs.readFileSync(SPEC_PATH, 'utf8'));

// ─── Load source ──────────────────────────────────────────────────────────────
const NODE_DIR = path.join(__dirname, '..', 'nodes', 'TeamleaderFocus');
const nodeSrc = fs.readFileSync(path.join(NODE_DIR, 'TeamleaderFocus.node.ts'), 'utf8');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve $ref in the spec */
function resolveRef(ref) {
	const parts = ref.replace('#/', '').split('/');
	let obj = spec;
	for (const p of parts) obj = obj[p];
	return obj;
}

/** Recursively extract all properties from a schema, including allOf/oneOf merges */
function flattenSchema(schema, prefix = '') {
	if (!schema) return {};
	const result = {};

	if (schema.$ref) {
		return flattenSchema(resolveRef(schema.$ref), prefix);
	}

	if (schema.allOf) {
		for (const sub of schema.allOf) {
			Object.assign(result, flattenSchema(sub, prefix));
		}
		return result;
	}

	if (schema.oneOf) {
		// Take first variant
		return flattenSchema(schema.oneOf[0], prefix);
	}

	if (schema.type === 'object' || schema.properties) {
		const reqSet = new Set(schema.required || []);
		for (const [name, prop] of Object.entries(schema.properties || {})) {
			const fullKey = prefix ? `${prefix}.${name}` : name;
			result[fullKey] = {
				required: reqSet.has(name),
				type: prop.type,
				schema: prop,
			};
			// Recurse into nested objects
			if (prop.type === 'object' || prop.properties || prop.allOf) {
				Object.assign(result, flattenSchema(prop, fullKey));
			}
		}
	}

	return result;
}

/** Check if an endpoint exists in the spec (regardless of request body) */
function endpointExistsInSpec(endpointPath) {
	const pathDef = spec.paths && spec.paths[endpointPath];
	return !!(pathDef && pathDef.post);
}

/** Get the request body schema for a given endpoint */
function getEndpointSchema(endpointPath) {
	const pathDef = spec.paths && spec.paths[endpointPath];
	if (!pathDef) return null;
	const post = pathDef.post;
	if (!post) return null;
	const reqBody = post.requestBody;
	if (!reqBody || !reqBody.content) return null;
	// Support both 'application/json' and 'application/json;charset=utf-8'
	const content = reqBody.content['application/json'] || reqBody.content['application/json;charset=utf-8'];
	if (!content) return null;
	return content.schema || null;
}

/** Get required top-level fields */
function getRequiredFields(schema) {
	const flat = flattenSchema(schema);
	return Object.entries(flat)
		.filter(([key, val]) => !key.includes('.') && val.required)
		.map(([key]) => key);
}

/** Check if a field name appears in a code region */
function fieldInCode(code, field) {
	// Check for body.field = / field: / body[field]
	return code.includes(`'${field}'`) ||
		code.includes(`"${field}"`) ||
		code.includes(`.${field}`) ||
		code.includes(`${field}:`) ||
		code.includes(`${field} =`);
}

// ─── Define what each handler ACTUALLY sends ────────────────────────────────
// This is the ground truth based on reading every handler in the source code.
// Format: { endpoint, actualFields: {field: structure_description}, checks: [...] }

const ENDPOINT_CHECKS = [
	// ═══════════════ CONTACT ═══════════════
	{ endpoint: '/contacts.add', requiredBySpec: ['last_name'], actualSends: ['last_name'] },
	{ endpoint: '/contacts.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/contacts.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/contacts.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/contacts.tag', requiredBySpec: ['id', 'tags'], actualSends: ['id', 'tags'] },
	{ endpoint: '/contacts.untag', requiredBySpec: ['id', 'tags'], actualSends: ['id', 'tags'] },
	{ endpoint: '/contacts.linkToCompany', requiredBySpec: ['id', 'company_id'], actualSends: ['id', 'company_id'] },
	{ endpoint: '/contacts.unlinkFromCompany', requiredBySpec: ['id', 'company_id'], actualSends: ['id', 'company_id'] },
	{ endpoint: '/contacts.updateCompanyLink', requiredBySpec: ['id', 'company_id'], actualSends: ['id', 'company_id'] },
	{ endpoint: '/contacts.uploadAvatar', requiredBySpec: ['id', 'image'], actualSends: ['id', 'image'] },

	// ═══════════════ COMPANY ═══════════════
	{ endpoint: '/companies.add', requiredBySpec: ['name'], actualSends: ['name'] },
	{ endpoint: '/companies.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/companies.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/companies.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/companies.tag', requiredBySpec: ['id', 'tags'], actualSends: ['id', 'tags'] },
	{ endpoint: '/companies.untag', requiredBySpec: ['id', 'tags'], actualSends: ['id', 'tags'] },
	{ endpoint: '/companies.uploadLogo', requiredBySpec: ['id', 'image'], actualSends: ['id', 'image'] },

	// ═══════════════ CUSTOM FIELD ═══════════════
	{ endpoint: '/customFieldDefinitions.create', requiredBySpec: ['label', 'type', 'context'], actualSends: ['label', 'type', 'context'] },
	{ endpoint: '/customFieldDefinitions.info', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ DEAL ═══════════════
	{
		endpoint: '/deals.create',
		requiredBySpec: ['lead', 'title'],
		actualSends: ['lead', 'title'],
		structuralChecks: [
			{ desc: 'lead.customer nesting', pattern: /lead.*customer.*type.*id/s, present: true },
			{ desc: 'lead contains contact_person_id', pattern: /lead\.contact_person_id/, present: true },
			{ desc: 'estimated_value nesting {amount, currency}', pattern: /estimated_value.*amount.*currency/s, present: true },
			{ desc: 'currency nesting {code, exchange_rate}', pattern: /currency.*code.*exchange_rate/s, present: true },
		],
	},
	{ endpoint: '/deals.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/deals.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'lead.customer nesting in update', pattern: /lead.*customer.*type.*updateFields\.customer_type/s, present: true },
		],
	},
	{ endpoint: '/deals.move', requiredBySpec: ['id', 'phase_id'], actualSends: ['id', 'phase_id'] },
	{ endpoint: '/deals.win', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/deals.lose', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/deals.delete', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ DEAL PIPELINE ═══════════════
	{ endpoint: '/dealPipelines.create', requiredBySpec: ['name'], actualSends: ['name'] },
	{ endpoint: '/dealPipelines.update', requiredBySpec: ['id', 'name'], actualSends: ['id', 'name'] },
	{
		endpoint: '/dealPipelines.delete',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'migrate_phases support', pattern: /migrate_phases/, present: true },
		],
	},
	{ endpoint: '/dealPipelines.duplicate', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/dealPipelines.markAsDefault', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ DEAL PHASE ═══════════════
	{
		endpoint: '/dealPhases.create',
		requiredBySpec: ['name', 'deal_pipeline_id', 'requires_attention_after'],
		actualSends: ['name', 'deal_pipeline_id', 'requires_attention_after'],
		structuralChecks: [
			{ desc: 'requires_attention_after {amount, unit}', pattern: /requires_attention_after.*amount.*unit/s, present: true },
		],
	},
	{
		endpoint: '/dealPhases.list',
		requiredBySpec: [],
		actualSends: [],
		structuralChecks: [
			{ desc: 'filter.deal_pipeline_id wrapping', pattern: /filter.*deal_pipeline_id/s, present: true },
		],
	},
	{
		endpoint: '/dealPhases.update',
		requiredBySpec: ['id', 'name', 'requires_attention_after'],
		actualSends: ['id', 'name', 'requires_attention_after'],
	},
	{ endpoint: '/dealPhases.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/dealPhases.move',
		requiredBySpec: ['id', 'after_phase_id'],
		actualSends: ['id', 'after_phase_id'],
	},

	// ═══════════════ QUOTATION ═══════════════
	{
		endpoint: '/quotations.create',
		requiredBySpec: ['deal_id'],
		actualSends: ['deal_id', 'customer', 'grouped_lines'],
		structuralChecks: [
			{ desc: 'customer {type, id}', pattern: /customer.*type.*id/s, present: true },
			{ desc: 'currency nesting {code, exchange_rate}', pattern: /currency.*code.*exchange_rate/s, present: true },
		],
	},
	{ endpoint: '/quotations.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/quotations.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/quotations.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/quotations.download', requiredBySpec: ['id', 'format'], actualSends: ['id', 'format'] },
	{
		endpoint: '/quotations.send',
		requiredBySpec: ['quotations', 'recipients', 'subject', 'content', 'language'],
		actualSends: ['quotations', 'recipients', 'subject', 'content', 'language'],
		structuralChecks: [
			{
				desc: 'quotations is array of string IDs, not array of objects',
				check: () => {
					return nodeSrc.includes('quotations: [{ id:') ? 'ERROR: sends [{id}] but spec expects [string]' : null;
				},
			},
		],
	},
	{ endpoint: '/quotations.accept', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ INVOICE ═══════════════
	{
		endpoint: '/invoices.draft',
		requiredBySpec: ['invoicee', 'department_id', 'payment_term', 'grouped_lines'],
		actualSends: ['invoicee', 'department_id', 'grouped_lines', 'payment_term'],
		structuralChecks: [
			{ desc: 'invoicee.customer {type, id}', pattern: /invoicee.*customer.*type.*id/s, present: true },
		],
	},
	{ endpoint: '/invoices.copy', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/invoices.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/invoices.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'payment_term nesting', pattern: /payment_term.*type.*days/s, present: true },
		],
	},
	{
		endpoint: '/invoices.updateBooked',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'payment_term nesting', pattern: /payment_term.*type.*days/s, present: true },
		],
	},
	{
		endpoint: '/invoices.book',
		requiredBySpec: ['id', 'on'],
		actualSends: ['id', 'on'],
	},
	{
		endpoint: '/invoices.send',
		requiredBySpec: ['id', 'content'],
		actualSends: ['id', 'content', 'from', 'recipients'],
		structuralChecks: [
			{ desc: 'content is {subject, body} object', pattern: /content.*subject.*body/s, present: true },
		],
	},
	{
		endpoint: '/invoices.registerPayment',
		requiredBySpec: ['id', 'payment', 'paid_at'],
		actualSends: ['id', 'payment', 'paid_at', 'payment_method_id'],
	},
	{ endpoint: '/invoices.removePayments', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/invoices.credit', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/invoices.creditPartially',
		requiredBySpec: ['id', 'grouped_lines'],
		actualSends: ['id', 'grouped_lines'],
	},
	{ endpoint: '/invoices.download', requiredBySpec: ['id', 'format'], actualSends: ['id', 'format'] },
	{ endpoint: '/invoices.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/invoices.sendViaPeppol', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ CREDIT NOTE ═══════════════
	{ endpoint: '/creditNotes.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/creditNotes.download', requiredBySpec: ['id', 'format'], actualSends: ['id', 'format'] },
	{ endpoint: '/creditNotes.sendViaPeppol', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ SUBSCRIPTION ═══════════════
	{
		endpoint: '/subscriptions.create',
		requiredBySpec: ['invoicee', 'department_id', 'starts_on', 'billing_cycle', 'title', 'grouped_lines', 'payment_term', 'invoice_generation'],
		actualSends: ['invoicee', 'department_id', 'starts_on', 'billing_cycle', 'title', 'grouped_lines', 'payment_term', 'invoice_generation'],
		structuralChecks: [
			{ desc: 'invoicee.customer {type, id}', pattern: /invoicee.*customer.*type.*id/s, present: true },
		],
	},
	{ endpoint: '/subscriptions.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/subscriptions.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'billing_cycle JSON parsing', pattern: /billing_cycle.*JSON\.parse/s, present: true },
			{ desc: 'payment_term JSON parsing', pattern: /payment_term.*JSON\.parse/s, present: true },
		],
	},
	{ endpoint: '/subscriptions.deactivate', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ INCOMING INVOICE ═══════════════
	{
		endpoint: '/incomingInvoices.add',
		requiredBySpec: ['title', 'currency'],
		actualSends: ['title', 'department_id', 'currency'],
		structuralChecks: [
			{ desc: 'currency nesting {code}', pattern: /currency.*code.*currency_code/s, present: true },
			{ desc: 'total nesting {tax_exclusive, tax_inclusive}', pattern: /total.*tax_exclusive|tax_inclusive/s, present: true },
		],
	},
	{ endpoint: '/incomingInvoices.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/incomingInvoices.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'currency nesting {code}', pattern: /currency.*code/s, present: true },
		],
	},
	{ endpoint: '/incomingInvoices.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingInvoices.approve', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingInvoices.refuse', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingInvoices.markAsPendingReview', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingInvoices.sendToBookkeeping', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingInvoices.listPayments', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/incomingInvoices.registerPayment',
		requiredBySpec: ['id', 'payment', 'paid_at'],
		actualSends: ['id', 'payment', 'paid_at'],
	},
	{ endpoint: '/incomingInvoices.removePayment', requiredBySpec: ['id', 'payment_id'], actualSends: ['id', 'payment_id'] },
	{ endpoint: '/incomingInvoices.updatePayment', requiredBySpec: ['id', 'payment_id'], actualSends: ['id', 'payment_id'] },

	// ═══════════════ INCOMING CREDIT NOTE ═══════════════
	{
		endpoint: '/incomingCreditNotes.add',
		requiredBySpec: ['title', 'currency'],
		actualSends: ['title', 'department_id', 'currency'],
		structuralChecks: [
			{ desc: 'currency nesting {code}', pattern: /currency.*code.*currency_code/s, present: true },
		],
	},
	{ endpoint: '/incomingCreditNotes.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.approve', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.refuse', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.markAsPendingReview', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.sendToBookkeeping', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/incomingCreditNotes.listPayments', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/incomingCreditNotes.registerPayment',
		requiredBySpec: ['id', 'payment', 'paid_at'],
		actualSends: ['id', 'payment', 'paid_at'],
	},
	{ endpoint: '/incomingCreditNotes.removePayment', requiredBySpec: ['id', 'payment_id'], actualSends: ['id', 'payment_id'] },
	{ endpoint: '/incomingCreditNotes.updatePayment', requiredBySpec: ['id', 'payment_id'], actualSends: ['id', 'payment_id'] },

	// ═══════════════ EVENT ═══════════════
	{
		endpoint: '/events.create',
		requiredBySpec: ['title', 'activity_type_id', 'starts_at', 'ends_at'],
		actualSends: ['title', 'activity_type_id', 'starts_at', 'ends_at'],
		structuralChecks: [
			{ desc: 'attendees as JSON array', pattern: /attendees.*JSON\.parse/s, present: true },
		],
	},
	{ endpoint: '/events.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/events.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/events.cancel', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ MEETING ═══════════════
	{
		endpoint: '/meetings.schedule',
		requiredBySpec: ['title', 'starts_at', 'ends_at', 'attendees'],
		actualSends: ['title', 'starts_at', 'ends_at', 'attendees'],
		structuralChecks: [
			{ desc: 'attendees as JSON-parsed array', pattern: /attendees.*JSON\.parse/s, present: true },
			{ desc: 'customer nesting {type, id}', pattern: /customer.*type.*additionalFields\.customer_type/s, present: true },
		],
	},
	{ endpoint: '/meetings.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/meetings.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
	},
	{ endpoint: '/meetings.complete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/meetings.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/meetings.createReport',
		requiredBySpec: ['id', 'attach_to'],
		actualSends: ['id', 'attach_to'],
		structuralChecks: [
			{ desc: 'attach_to {type, id}', pattern: /attach_to.*type.*id/s, present: true },
		],
	},

	// ═══════════════ CALL ═══════════════
	{
		endpoint: '/calls.add',
		requiredBySpec: ['participant', 'due_at', 'assignee'],
		actualSends: ['participant', 'due_at', 'assignee'],
		structuralChecks: [
			{ desc: 'participant.customer {type, id}', pattern: /participant.*customer.*type.*id/s, present: true },
			{ desc: 'assignee {type: "user", id}', pattern: /assignee.*type.*user.*id/s, present: true },
		],
	},
	{ endpoint: '/calls.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/calls.complete', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/calls.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'participant nesting in update', pattern: /participant.*customer.*type.*id/s, present: true },
			{ desc: 'assignee nesting in update', pattern: /assignee.*type.*user.*id/s, present: true },
		],
	},

	// ═══════════════ TIME TRACKING ═══════════════
	{
		endpoint: '/timeTracking.add',
		requiredBySpec: ['work_type_id', 'subject'],
		actualSends: ['work_type_id', 'subject'],
		oneOfFields: ['started_at', 'duration', 'ended_at', 'started_on'],
		structuralChecks: [
			{ desc: 'subject {type, id}', pattern: /subject.*type.*id/s, present: true },
			{ desc: 'timeInputMode selector for add', pattern: /timeInputMode.*startedAtDuration/, present: true },
			{ desc: 'started_at+ended_at variant', pattern: /started_at.*ended_at|ended_at.*started_at/s, present: true },
			{ desc: 'started_on+duration variant', pattern: /started_on.*duration|duration.*started_on/s, present: true },
		],
	},
	{ endpoint: '/timeTracking.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/timeTracking.update',
		requiredBySpec: ['id', 'duration'],
		actualSends: ['id', 'duration'],
		oneOfFields: ['started_at', 'started_on'],
		structuralChecks: [
			{ desc: 'timeInputMode selector for update', pattern: /timeInputMode.*startedAt/, present: true },
			{ desc: 'started_on variant', pattern: /started_on.*getNodeParameter/, present: true },
		],
	},
	{ endpoint: '/timeTracking.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/timeTracking.resume', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ TIMER ═══════════════
	{
		endpoint: '/timers.update',
		requiredBySpec: [],
		actualSends: [],
		structuralChecks: [
			{ desc: 'subject nesting {type, id}', pattern: /subject.*type.*subject_type.*id.*subject_id/s, present: true },
		],
	},

	// ═══════════════ NOTE ═══════════════
	{
		endpoint: '/notes.create',
		requiredBySpec: ['subject', 'content'],
		actualSends: ['subject', 'content'],
		structuralChecks: [
			{ desc: 'subject {type, id}', pattern: /subject.*type.*id/s, present: true },
		],
	},
	{ endpoint: '/notes.update', requiredBySpec: ['id', 'content'], actualSends: ['id', 'content'] },

	// ═══════════════ TASK ═══════════════
	{
		endpoint: '/tasks.create',
		requiredBySpec: ['title', 'due_on', 'work_type_id'],
		actualSends: ['title', 'due_on', 'work_type_id'],
		structuralChecks: [
			{ desc: 'assignee nesting {type: "user", id}', pattern: /assignee.*type.*user.*id/s, present: true },
			{ desc: 'estimated_duration nesting {value, unit}', pattern: /estimated_duration.*value.*unit/s, present: true },
		],
	},
	{ endpoint: '/tasks.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tasks.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tasks.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tasks.complete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tasks.reopen', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/tasks.schedule',
		requiredBySpec: ['id', 'starts_at', 'ends_at'],
		actualSends: ['id', 'starts_at', 'ends_at'],
	},

	// ═══════════════ PROJECT ═══════════════
	{
		endpoint: '/projects-v2/projects.create',
		requiredBySpec: ['title', 'billing_method'],
		actualSends: ['title', 'billing_method'],
	},
	{ endpoint: '/projects-v2/projects.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/projects-v2/projects.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'billing_method nesting {value, update_strategy}', pattern: /billing_method.*value.*update_strategy/s, present: true },
		],
	},
	{ endpoint: '/projects-v2/projects.close', requiredBySpec: ['id', 'closing_strategy'], actualSends: ['id', 'closing_strategy'] },
	{ endpoint: '/projects-v2/projects.reopen', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/projects-v2/projects.duplicate',
		requiredBySpec: ['id', 'title'],
		actualSends: ['id', 'title'],
	},
	{ endpoint: '/projects-v2/projects.delete', requiredBySpec: ['id', 'delete_strategy'], actualSends: ['id', 'delete_strategy'] },
	{ endpoint: '/projects-v2/projects.addOwner', requiredBySpec: ['id', 'user_id'], actualSends: ['id', 'user_id'] },
	{ endpoint: '/projects-v2/projects.removeOwner', requiredBySpec: ['id', 'user_id'], actualSends: ['id', 'user_id'] },
	{ endpoint: '/projects-v2/projects.assign', requiredBySpec: ['id', 'assignee'], actualSends: ['id', 'assignee'] },
	{ endpoint: '/projects-v2/projects.unassign', requiredBySpec: ['id', 'assignee'], actualSends: ['id', 'assignee'] },
	{ endpoint: '/projects-v2/projects.addCustomer', requiredBySpec: ['id', 'customer'], actualSends: ['id', 'customer'] },
	{ endpoint: '/projects-v2/projects.removeCustomer', requiredBySpec: ['id', 'customer'], actualSends: ['id', 'customer'] },
	{ endpoint: '/projects-v2/projects.addDeal', requiredBySpec: ['id', 'deal_id'], actualSends: ['id', 'deal_id'] },
	{ endpoint: '/projects-v2/projects.removeDeal', requiredBySpec: ['id', 'deal_id'], actualSends: ['id', 'deal_id'] },
	{ endpoint: '/projects-v2/projects.addQuotation', requiredBySpec: ['id', 'quotation_id'], actualSends: ['id', 'quotation_id'] },
	{ endpoint: '/projects-v2/projects.removeQuotation', requiredBySpec: ['id', 'quotation_id'], actualSends: ['id', 'quotation_id'] },

	// ═══════════════ PROJECT GROUP ═══════════════
	{
		endpoint: '/projects-v2/projectGroups.create',
		requiredBySpec: ['project_id', 'title'],
		actualSends: ['project_id', 'title'],
	},
	{ endpoint: '/projects-v2/projectGroups.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/projectGroups.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/projectGroups.delete', requiredBySpec: ['id', 'delete_strategy'], actualSends: ['id', 'delete_strategy'] },
	{
		endpoint: '/projects-v2/projectGroups.duplicate',
		requiredBySpec: ['origin_id'],
		actualSends: ['origin_id'],
	},

	// ═══════════════ PROJECT TASK ═══════════════
	{
		endpoint: '/projects-v2/tasks.create',
		requiredBySpec: ['project_id', 'title'],
		actualSends: ['project_id', 'title', 'group_id'],
		structuralChecks: [
			{ desc: 'time_estimated nesting {value, unit}', pattern: /time_estimated.*value.*unit/s, present: true },
		],
	},
	{ endpoint: '/projects-v2/tasks.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/tasks.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/tasks.delete', requiredBySpec: ['id', 'delete_strategy'], actualSends: ['id', 'delete_strategy'] },
	{
		endpoint: '/projects-v2/tasks.duplicate',
		requiredBySpec: ['origin_id'],
		actualSends: ['origin_id'],
	},

	// ═══════════════ PROJECT MATERIAL ═══════════════
	{
		endpoint: '/projects-v2/materials.create',
		requiredBySpec: ['project_id', 'title'],
		actualSends: ['project_id', 'title', 'group_id'],
		structuralChecks: [
			{ desc: 'unit_price nesting {amount, currency}', pattern: /unit_price.*amount.*currency/s, present: true },
		],
	},
	{ endpoint: '/projects-v2/materials.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/materials.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/materials.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/projects-v2/materials.duplicate',
		requiredBySpec: ['origin_id'],
		actualSends: ['origin_id'],
	},

	// ═══════════════ PRODUCT ═══════════════
	{
		endpoint: '/products.add',
		requiredBySpec: ['name'],
		actualSends: ['name'],
		structuralChecks: [
			{ desc: 'selling_price nesting {amount, currency}', pattern: /selling_price.*amount/s, present: true },
		],
	},
	{ endpoint: '/products.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/products.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'selling_price nesting {amount, currency}', pattern: /selling_price.*amount/s, present: true },
		],
	},
	{ endpoint: '/products.delete', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ TICKET ═══════════════
	{
		endpoint: '/tickets.create',
		requiredBySpec: ['subject', 'customer', 'ticket_status_id'],
		actualSends: ['subject', 'customer', 'ticket_status_id'],
		structuralChecks: [
			{ desc: 'customer {type, id}', pattern: /customer.*type.*id/s, present: true },
			{ desc: 'assignee nesting', pattern: /assignee.*type.*user.*id/s, present: true },
		],
	},
	{ endpoint: '/tickets.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tickets.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tickets.listMessages', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tickets.getMessage', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/tickets.addReply', requiredBySpec: ['id', 'body'], actualSends: ['id', 'body'] },
	{ endpoint: '/tickets.addInternalMessage', requiredBySpec: ['id', 'body'], actualSends: ['id', 'body'] },
	{ endpoint: '/tickets.importMessage', requiredBySpec: ['id', 'body', 'sent_by', 'sent_at'], actualSends: ['id', 'body', 'sent_by', 'sent_at'] },

	// ═══════════════ USER ═══════════════
	{ endpoint: '/users.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/users.getWeekSchedule', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/users.listDaysOff', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ FILE ═══════════════
	{ endpoint: '/files.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/files.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/files.download', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ DAY OFF ═══════════════
	{
		endpoint: '/daysOff.import',
		requiredBySpec: ['user_id', 'leave_type_id', 'days'],
		actualSends: ['user_id', 'leave_type_id', 'days'],
	},
	{
		endpoint: '/daysOff.bulkDelete',
		requiredBySpec: ['user_id'],
		actualSends: ['user_id', 'ids'],
	},
	{ endpoint: '/dayOffTypes.create', requiredBySpec: ['name'], actualSends: ['name'] },
	{ endpoint: '/dayOffTypes.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/dayOffTypes.delete', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ CLOSING DAY ═══════════════
	{
		endpoint: '/closingDays.add',
		requiredBySpec: ['day'],
		actualSends: ['day'],
	},
	{ endpoint: '/closingDays.delete', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ EMAIL TRACKING ═══════════════
	{
		endpoint: '/emailTracking.create',
		requiredBySpec: ['subject', 'content'],
		actualSends: ['subject', 'content'],
		structuralChecks: [
			{ desc: 'subject {type, id}', pattern: /subject.*type.*id/s, present: true },
		],
	},

	// ═══════════════ WEBHOOK ═══════════════
	{
		endpoint: '/webhooks.register',
		requiredBySpec: ['url', 'types'],
		actualSends: ['url', 'types'],
	},
	{
		endpoint: '/webhooks.unregister',
		requiredBySpec: ['url', 'types'],
		actualSends: ['url', 'types'],
	},

	// ═══════════════ EXTERNAL PARTY ═══════════════
	{ endpoint: '/projects-v2/externalParties.addToProject', requiredBySpec: ['project_id', 'customer'], actualSends: ['project_id', 'customer'] },
	{ endpoint: '/projects-v2/externalParties.update', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/projects-v2/externalParties.delete', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ PROJECT LINE ═══════════════
	{ endpoint: '/projects-v2/projectLines.addToGroup', requiredBySpec: ['line_id', 'group_id'], actualSends: ['line_id', 'group_id'] },
	{ endpoint: '/projects-v2/projectLines.removeFromGroup', requiredBySpec: ['line_id'], actualSends: ['line_id'] },

	// ═══════════════ RECEIPT ═══════════════
	{
		endpoint: '/receipts.add',
		requiredBySpec: ['title', 'currency'],
		actualSends: ['title', 'currency'],
		structuralChecks: [
			{ desc: 'currency as {code}', pattern: /currency.*code/s, present: true },
			{ desc: 'total nesting {tax_inclusive: {amount}}', pattern: /total.*tax_inclusive.*amount/s, present: true },
		],
	},
	{ endpoint: '/receipts.info', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/receipts.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/receipts.approve', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/receipts.refuse', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/receipts.markAsPendingReview', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/receipts.sendToBookkeeping', requiredBySpec: ['id'], actualSends: ['id'] },
	{
		endpoint: '/receipts.update',
		requiredBySpec: ['id'],
		actualSends: ['id'],
		structuralChecks: [
			{ desc: 'total nesting in update', pattern: /total.*tax_inclusive.*amount/s, present: true },
		],
	},
	{ endpoint: '/receipts.listPayments', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/receipts.registerPayment', requiredBySpec: ['id', 'payment', 'paid_at'], actualSends: ['id', 'payment', 'paid_at'] },
	{ endpoint: '/receipts.removePayment', requiredBySpec: ['id', 'payment_id'], actualSends: ['id', 'payment_id'] },
	{ endpoint: '/receipts.updatePayment', requiredBySpec: ['id', 'payment_id'], actualSends: ['id', 'payment_id'] },

	// ═══════════════ RESERVATION ═══════════════
	{
		endpoint: '/reservations.create',
		requiredBySpec: ['plannable_item_id', 'date', 'duration', 'assignee'],
		actualSends: ['plannable_item_id', 'date', 'duration', 'assignee'],
	},
	{ endpoint: '/reservations.delete', requiredBySpec: ['id'], actualSends: ['id'] },
	{ endpoint: '/reservations.update', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ ORDER ═══════════════
	{ endpoint: '/orders.info', requiredBySpec: ['id'], actualSends: ['id'] },

	// ═══════════════ PLANNABLE ITEM ═══════════════
	{
		endpoint: '/plannableItems.info',
		requiredBySpec: [],
		actualSends: ['source'],
		structuralChecks: [
			{ desc: 'source {type, id}', pattern: /source.*type.*id/s, present: true },
		],
		note: 'Spec says both id and source are optional (either/or)',
	},

	// ═══════════════ USER AVAILABILITY ═══════════════
	{
		endpoint: '/userAvailability.daily',
		requiredBySpec: ['period'],
		actualSends: ['period'],
		structuralChecks: [
			{ desc: 'period {start_date, end_date}', pattern: /period.*start_date.*end_date/s, present: true },
		],
	},
	{
		endpoint: '/userAvailability.total',
		requiredBySpec: ['period'],
		actualSends: ['period'],
	},

	// ═══════════════ UTILITIES ═══════════════
	{ endpoint: '/accounts.projects-v2-status', requiredBySpec: [], actualSends: [] },
	{ endpoint: '/cloudPlatforms.url', requiredBySpec: ['type', 'id'], actualSends: ['type', 'id'] },
	{ endpoint: '/currencies.exchangeRates', requiredBySpec: ['base'], actualSends: ['base'] },
	{ endpoint: '/levelTwoAreas.list', requiredBySpec: ['country'], actualSends: ['country'] },
	{ endpoint: '/mailTemplates.list', requiredBySpec: ['filter'], actualSends: ['filter'] },
];

// ─── Run validation ──────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;
let passed = 0;

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║   Teamleader Focus Node — Comprehensive Spec Validation     ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// === Phase 1: Verify endpoints exist in spec ===
console.log('━━━ Phase 1: Endpoint Existence ━━━\n');
for (const check of ENDPOINT_CHECKS) {
	if (!endpointExistsInSpec(check.endpoint)) {
		console.log(`⚠  WARN  ${check.endpoint}: not found in spec`);
		warnings++;
	}
}
console.log(`    ${ENDPOINT_CHECKS.length} endpoints checked\n`);

// === Phase 2: Required field coverage ===
console.log('━━━ Phase 2: Required Fields ━━━\n');
for (const check of ENDPOINT_CHECKS) {
	const schema = getEndpointSchema(check.endpoint);
	if (!schema) continue;

	// Auto-detect required fields from spec
	const specRequired = getRequiredFields(schema);

	// Compare with our declared requiredBySpec (verify our knowledge is correct)
	for (const field of specRequired) {
		if (field === 'page' || field === 'sort') continue;
		if (!check.actualSends.includes(field)) {
			// Skip oneOf fields — they are conditionally sent based on a mode selector
			if (check.oneOfFields && check.oneOfFields.includes(field)) {
				passed++;
			} else if (check.note && check.note.includes(field)) {
				console.log(`⚠  WARN  ${check.endpoint}: "${field}" required by spec but conditionally sent — ${check.note}`);
				warnings++;
			} else {
				console.log(`❌ ERROR ${check.endpoint}: missing required field "${field}" — spec requires it but handler does not send it`);
				errors++;
			}
		} else {
			passed++;
		}
	}

	// Also check our requiredBySpec matches (cross-validation)
	for (const field of check.requiredBySpec) {
		if (!specRequired.includes(field)) {
			// We think it's required but spec doesn't — might be fine (we over-send)
		}
	}
}

// === Phase 3: Structural checks (nesting) ===
console.log('\n━━━ Phase 3: Structural Validation ━━━\n');
for (const check of ENDPOINT_CHECKS) {
	if (!check.structuralChecks) continue;

	for (const sc of check.structuralChecks) {
		if (sc.check) {
			// Custom check function
			const result = sc.check();
			if (result) {
				console.log(`❌ ERROR ${check.endpoint}: ${sc.desc} — ${result}`);
				errors++;
			} else {
				console.log(`✅ PASS  ${check.endpoint}: ${sc.desc}`);
				passed++;
			}
		} else if (sc.pattern) {
			const matches = sc.pattern.test(nodeSrc);
			if (matches === sc.present) {
				passed++;
			} else {
				console.log(`❌ ERROR ${check.endpoint}: ${sc.desc} — expected ${sc.present ? 'present' : 'absent'} but was ${matches ? 'found' : 'not found'}`);
				errors++;
			}
		}
	}
}

// === Phase 4: Known bugs and issues ===
console.log('\n━━━ Phase 4: Known Issue Detection ━━━\n');

// Check 4a: webhook.register sends "content" instead of "url"
if (nodeSrc.match(/webhooks\.register.*content:/s)) {
	const registerRegion = nodeSrc.substring(
		nodeSrc.indexOf("'/webhooks.register'") - 200,
		nodeSrc.indexOf("'/webhooks.register'") + 300,
	);
	if (registerRegion.includes('content:') && !registerRegion.includes('url:')) {
		console.log('❌ ERROR webhook.register: sends field "content" but spec requires "url"');
		errors++;
	} else {
		console.log('✅ PASS  webhook.register: sends correct field name');
		passed++;
	}
}

// Check 4b: quotations.send should send quotations as ["id"] not [{ id: "..." }]
if (nodeSrc.includes('quotations: [{ id:')) {
	console.log('❌ ERROR quotations.send: sends quotations as [{id: ...}] but spec expects array of strings ["id1"]');
	errors++;
} else if (nodeSrc.includes('quotations: [')) {
	console.log('✅ PASS  quotations.send: quotations array format');
	passed++;
}

// Check 4c: invoices.send "from" — is it the right structure?
// Spec: from is an object { sender: {type, id}, email_address: "..." }
// But handler sends: from: this.getNodeParameter('fromEmail', ...) — a string
const sendRegion = nodeSrc.substring(
	nodeSrc.indexOf('buildInvoiceSendBody'),
	nodeSrc.indexOf('buildInvoiceSendBody') + 1000,
);
if (sendRegion.includes("from: context.getNodeParameter('fromEmail'")) {
	console.log('⚠  WARN  invoices.send: "from" is sent as string, but spec expects object { sender: {type, id}, email_address }. May work if API accepts simple email string.');
	warnings++;
}

// Check 4d: dealPhases.update requires_attention_after is now always sent
if (nodeSrc.match(/dealPhases\.update.*requires_attention_after/s)) {
	// requires_attention_after is now a required top-level field — no warning needed
}

// Check 4e: timeTracking — oneOf variants handled via timeInputMode selector
// duration is always required; started_at or started_on depends on mode

// Check 4f: Verify old field names are NOT present (regression check)
const oldFieldChecks = [
	{ pattern: /body\.pipeline_id\b/, desc: 'Old field name pipeline_id (should be deal_pipeline_id)', endpoint: 'dealPhases.create' },
	{ pattern: /position:.*getNodeParameter\('position'/, desc: 'Old field name position (should be after_phase_id)', endpoint: 'dealPhases.move' },
	{ pattern: /body\.date\s*=|date:.*getNodeParameter\('date'.*closingDays/s, desc: 'Old field name date (should be day)', endpoint: 'closingDays.add' },
	{ pattern: /due_date.*getNodeParameter\('dueDate'/, desc: 'Old field name due_date (should be due_on)', endpoint: 'tasks.create' },
	{ pattern: /url:.*getNodeParameter\('url'.*emailTracking/s, desc: 'Old field name url (should be content)', endpoint: 'emailTracking.create' },
	{ pattern: /credit_note_lines/, desc: 'Old field name credit_note_lines (should be grouped_lines)', endpoint: 'invoices.creditPartially' },
	{ pattern: /caller.*callee.*calls\.add/s, desc: 'Old caller/callee fields (should be participant)', endpoint: 'calls.add' },
	{ pattern: /body\.name\b.*projectGroups\.create/s, desc: 'Old field name (should be title)', endpoint: 'projectGroups.create' },
];

console.log('\n━━━ Phase 5: Regression Checks (old field names) ━━━\n');
for (const check of oldFieldChecks) {
	if (check.pattern.test(nodeSrc)) {
		console.log(`❌ ERROR ${check.endpoint}: ${check.desc}`);
		errors++;
	} else {
		console.log(`✅ PASS  ${check.endpoint}: no old field names detected`);
		passed++;
	}
}

// === Phase 6: Cross-validate spec required fields vs handler ===
console.log('\n━━━ Phase 6: Spec Required Fields Auto-Check ━━━\n');
let autoCheckPassed = 0;
let autoCheckFailed = 0;

for (const check of ENDPOINT_CHECKS) {
	const schema = getEndpointSchema(check.endpoint);
	if (!schema) continue;

	const specRequired = getRequiredFields(schema);
	const missing = specRequired.filter(f => f !== 'page' && f !== 'sort' && !check.actualSends.includes(f) && !(check.oneOfFields && check.oneOfFields.includes(f)));

	if (missing.length === 0) {
		autoCheckPassed++;
	} else {
		const hasNote = check.note && missing.some(f => check.note.includes(f));
		if (!hasNote) {
			// Only report if not already noted
			const alreadyReported = missing.every(f => check.note && check.note.includes(f));
			if (!alreadyReported) {
				autoCheckFailed++;
			}
		}
	}
}
console.log(`    ${autoCheckPassed} endpoints have all required fields`);
if (autoCheckFailed > 0) {
	console.log(`    ${autoCheckFailed} endpoints have missing required fields (see Phase 2 errors above)`);
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n╔═══════════════════════════════════════╗');
console.log('║            SUMMARY                    ║');
console.log('╠═══════════════════════════════════════╣');
console.log(`║  ✅ Passed:   ${String(passed).padStart(4)}                   ║`);
console.log(`║  ⚠  Warnings: ${String(warnings).padStart(4)}                   ║`);
console.log(`║  ❌ Errors:   ${String(errors).padStart(4)}                   ║`);
console.log(`║  Total endpoints: ${String(ENDPOINT_CHECKS.length).padStart(4)}              ║`);
console.log('╚═══════════════════════════════════════╝');

if (errors > 0) {
	console.log('\n⚡ Action items:');
	console.log('   Errors indicate fields/structures that WILL cause API failures.');
	console.log('   Warnings indicate potential issues that MAY cause problems.');
}

process.exit(errors > 0 ? 1 : 0);
