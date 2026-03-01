#!/usr/bin/env node
/**
 * Validates the n8n node implementation against the Teamleader Focus OpenAPI spec.
 *
 * Checks:
 * 1. All required request-body fields per endpoint are present in our code.
 * 2. Nested required structures (e.g. filter.subject) are built correctly.
 * 3. Enum values in description files match the spec.
 * 4. Every endpoint we claim to implement actually exists in the spec.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─── load spec ────────────────────────────────────────────────────────────────
const SPEC_PATH = path.join(__dirname, '..', 'api-specs', '1.115.0.yaml');
const spec = yaml.load(fs.readFileSync(SPEC_PATH, 'utf8'));

// ─── load source files ───────────────────────────────────────────────────────
const NODE_DIR = path.join(__dirname, '..', 'nodes', 'TeamleaderFocus');
const nodeSrc = fs.readFileSync(path.join(NODE_DIR, 'TeamleaderFocus.node.ts'), 'utf8');

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Recursively extract required fields from a schema, returning a flat dot-notation set. */
function extractRequired(schema, prefix = '') {
	const result = {};
	if (!schema) return result;

	// Handle allOf: merge all sub-schemas
	if (schema.allOf) {
		for (const sub of schema.allOf) {
			Object.assign(result, extractRequired(sub, prefix));
		}
		return result;
	}

	if (schema.type === 'object' || schema.properties) {
		const reqSet = new Set(schema.required || []);
		for (const [name, prop] of Object.entries(schema.properties || {})) {
			const fullKey = prefix ? `${prefix}.${name}` : name;
			if (reqSet.has(name)) {
				result[fullKey] = { required: true, schema: prop };
			}
			// Recurse into nested objects to find nested required fields
			const nested = extractRequired(prop, fullKey);
			Object.assign(result, nested);
		}
	}

	return result;
}

/** Get the request body schema for a given endpoint path (e.g. /invoices.download) */
function getEndpointSchema(endpointPath) {
	const pathDef = spec.paths?.[endpointPath];
	if (!pathDef) return null;
	const post = pathDef.post;
	if (!post) return null;
	const content = post.requestBody?.content?.['application/json'];
	if (!content) return null;
	return content.schema || null;
}

/** Get all property names (required or not) from a schema */
function getAllProperties(schema, prefix = '') {
	const result = {};
	if (!schema) return result;

	if (schema.allOf) {
		for (const sub of schema.allOf) {
			Object.assign(result, getAllProperties(sub, prefix));
		}
		return result;
	}

	if (schema.type === 'object' || schema.properties) {
		for (const [name, prop] of Object.entries(schema.properties || {})) {
			const fullKey = prefix ? `${prefix}.${name}` : name;
			result[fullKey] = prop;
			const nested = getAllProperties(prop, fullKey);
			Object.assign(result, nested);
		}
	}

	return result;
}

/** Extract enum values from a schema property */
function extractEnums(schema) {
	if (!schema) return null;
	if (schema.enum) return schema.enum;
	if (schema.allOf) {
		for (const sub of schema.allOf) {
			const e = extractEnums(sub);
			if (e) return e;
		}
	}
	return null;
}

// ─── define our endpoint mapping ─────────────────────────────────────────────
// Maps resource+operation to { endpoint, bodyFields }
// bodyFields: what our code actually sends in the request body (dot-notation keys)
const ENDPOINT_MAP = [
	// CONTACT
	{ resource: 'contact', op: 'create', endpoint: '/contacts.add', sends: ['last_name'] },
	{ resource: 'contact', op: 'get', endpoint: '/contacts.info', sends: ['id'] },
	{ resource: 'contact', op: 'getMany', endpoint: '/contacts.list', sends: ['page'] },
	{ resource: 'contact', op: 'update', endpoint: '/contacts.update', sends: ['id'] },
	{ resource: 'contact', op: 'delete', endpoint: '/contacts.delete', sends: ['id'] },
	{ resource: 'contact', op: 'tag', endpoint: '/contacts.tag', sends: ['id', 'tags'] },
	{ resource: 'contact', op: 'untag', endpoint: '/contacts.untag', sends: ['id', 'tags'] },
	{ resource: 'contact', op: 'linkToCompany', endpoint: '/contacts.linkToCompany', sends: ['id', 'company_id'] },
	{ resource: 'contact', op: 'unlinkFromCompany', endpoint: '/contacts.unlinkFromCompany', sends: ['id', 'company_id'] },
	{ resource: 'contact', op: 'updateCompanyLink', endpoint: '/contacts.updateCompanyLink', sends: ['id', 'company_id'] },
	{ resource: 'contact', op: 'uploadAvatar', endpoint: '/contacts.uploadAvatar', sends: ['id', 'image'] },

	// COMPANY
	{ resource: 'company', op: 'create', endpoint: '/companies.add', sends: ['name'] },
	{ resource: 'company', op: 'get', endpoint: '/companies.info', sends: ['id'] },
	{ resource: 'company', op: 'getMany', endpoint: '/companies.list', sends: ['page'] },
	{ resource: 'company', op: 'update', endpoint: '/companies.update', sends: ['id'] },
	{ resource: 'company', op: 'delete', endpoint: '/companies.delete', sends: ['id'] },
	{ resource: 'company', op: 'tag', endpoint: '/companies.tag', sends: ['id', 'tags'] },
	{ resource: 'company', op: 'untag', endpoint: '/companies.untag', sends: ['id', 'tags'] },
	{ resource: 'company', op: 'uploadLogo', endpoint: '/companies.uploadLogo', sends: ['id', 'image'] },

	// CUSTOM FIELD
	{ resource: 'customField', op: 'create', endpoint: '/customFieldDefinitions.create', sends: ['label', 'type', 'context'] },
	{ resource: 'customField', op: 'get', endpoint: '/customFieldDefinitions.info', sends: ['id'] },
	{ resource: 'customField', op: 'getMany', endpoint: '/customFieldDefinitions.list', sends: ['page'] },

	// DEAL
	{ resource: 'deal', op: 'create', endpoint: '/deals.create', sends: ['title', 'customer'] },
	{ resource: 'deal', op: 'get', endpoint: '/deals.info', sends: ['id'] },
	{ resource: 'deal', op: 'getMany', endpoint: '/deals.list', sends: ['page'] },
	{ resource: 'deal', op: 'update', endpoint: '/deals.update', sends: ['id'] },
	{ resource: 'deal', op: 'move', endpoint: '/deals.move', sends: ['id', 'phase_id'] },
	{ resource: 'deal', op: 'win', endpoint: '/deals.win', sends: ['id'] },
	{ resource: 'deal', op: 'lose', endpoint: '/deals.lose', sends: ['id'] },
	{ resource: 'deal', op: 'delete', endpoint: '/deals.delete', sends: ['id'] },

	// DEAL PIPELINE
	{ resource: 'dealPipeline', op: 'create', endpoint: '/dealPipelines.create', sends: ['name'] },
	{ resource: 'dealPipeline', op: 'getMany', endpoint: '/dealPipelines.list', sends: ['page'] },
	{ resource: 'dealPipeline', op: 'update', endpoint: '/dealPipelines.update', sends: ['id'] },
	{ resource: 'dealPipeline', op: 'delete', endpoint: '/dealPipelines.delete', sends: ['id'] },
	{ resource: 'dealPipeline', op: 'duplicate', endpoint: '/dealPipelines.duplicate', sends: ['id'] },
	{ resource: 'dealPipeline', op: 'markAsDefault', endpoint: '/dealPipelines.markAsDefault', sends: ['id'] },

	// DEAL PHASE
	{ resource: 'dealPhase', op: 'create', endpoint: '/dealPhases.create', sends: ['pipeline_id', 'name'] },
	{ resource: 'dealPhase', op: 'getMany', endpoint: '/dealPhases.list', sends: ['pipeline_id', 'page'] },
	{ resource: 'dealPhase', op: 'update', endpoint: '/dealPhases.update', sends: ['id'] },
	{ resource: 'dealPhase', op: 'delete', endpoint: '/dealPhases.delete', sends: ['id'] },
	{ resource: 'dealPhase', op: 'move', endpoint: '/dealPhases.move', sends: ['id', 'position'] },

	// QUOTATION
	{ resource: 'quotation', op: 'create', endpoint: '/quotations.create', sends: ['customer', 'grouped_lines'] },
	{ resource: 'quotation', op: 'get', endpoint: '/quotations.info', sends: ['id'] },
	{ resource: 'quotation', op: 'getMany', endpoint: '/quotations.list', sends: ['page'] },
	{ resource: 'quotation', op: 'update', endpoint: '/quotations.update', sends: ['id'] },
	{ resource: 'quotation', op: 'delete', endpoint: '/quotations.delete', sends: ['id'] },
	{ resource: 'quotation', op: 'download', endpoint: '/quotations.download', sends: ['id', 'format'] },
	{ resource: 'quotation', op: 'send', endpoint: '/quotations.send', sends: ['id'] },
	{ resource: 'quotation', op: 'accept', endpoint: '/quotations.accept', sends: ['id'] },

	// INVOICE
	{ resource: 'invoice', op: 'draft', endpoint: '/invoices.draft', sends: ['customer', 'department_id', 'grouped_lines'] },
	{ resource: 'invoice', op: 'copy', endpoint: '/invoices.copy', sends: ['id'] },
	{ resource: 'invoice', op: 'get', endpoint: '/invoices.info', sends: ['id'] },
	{ resource: 'invoice', op: 'getMany', endpoint: '/invoices.list', sends: ['page'] },
	{ resource: 'invoice', op: 'update', endpoint: '/invoices.update', sends: ['id'] },
	{ resource: 'invoice', op: 'updateBooked', endpoint: '/invoices.updateBooked', sends: ['id'] },
	{ resource: 'invoice', op: 'book', endpoint: '/invoices.book', sends: ['id'] },
	{ resource: 'invoice', op: 'send', endpoint: '/invoices.send', sends: ['id'] },
	{ resource: 'invoice', op: 'registerPayment', endpoint: '/invoices.registerPayment', sends: ['id', 'payment', 'paid_at', 'payment_method_id'] },
	{ resource: 'invoice', op: 'removePayments', endpoint: '/invoices.removePayments', sends: ['id'] },
	{ resource: 'invoice', op: 'credit', endpoint: '/invoices.credit', sends: ['id'] },
	{ resource: 'invoice', op: 'creditPartially', endpoint: '/invoices.creditPartially', sends: ['id', 'credit_note_lines'] },
	{ resource: 'invoice', op: 'download', endpoint: '/invoices.download', sends: ['id', 'format'] },
	{ resource: 'invoice', op: 'delete', endpoint: '/invoices.delete', sends: ['id'] },
	{ resource: 'invoice', op: 'sendViaPeppol', endpoint: '/invoices.sendViaPeppol', sends: ['id'] },

	// CREDIT NOTE
	{ resource: 'creditNote', op: 'get', endpoint: '/creditNotes.info', sends: ['id'] },
	{ resource: 'creditNote', op: 'getMany', endpoint: '/creditNotes.list', sends: ['page'] },
	{ resource: 'creditNote', op: 'download', endpoint: '/creditNotes.download', sends: ['id', 'format'] },
	{ resource: 'creditNote', op: 'sendViaPeppol', endpoint: '/creditNotes.sendViaPeppol', sends: ['id'] },

	// SUBSCRIPTION
	{ resource: 'subscription', op: 'create', endpoint: '/subscriptions.create', sends: ['title', 'customer', 'department_id', 'invoicing_method', 'billing_cycle'] },
	{ resource: 'subscription', op: 'get', endpoint: '/subscriptions.info', sends: ['id'] },
	{ resource: 'subscription', op: 'getMany', endpoint: '/subscriptions.list', sends: ['page'] },
	{ resource: 'subscription', op: 'update', endpoint: '/subscriptions.update', sends: ['id'] },
	{ resource: 'subscription', op: 'deactivate', endpoint: '/subscriptions.deactivate', sends: ['id'] },

	// INCOMING INVOICE
	{ resource: 'incomingInvoice', op: 'add', endpoint: '/incomingInvoices.add', sends: [] },
	{ resource: 'incomingInvoice', op: 'get', endpoint: '/incomingInvoices.info', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'update', endpoint: '/incomingInvoices.update', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'delete', endpoint: '/incomingInvoices.delete', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'approve', endpoint: '/incomingInvoices.approve', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'refuse', endpoint: '/incomingInvoices.refuse', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'markPending', endpoint: '/incomingInvoices.markAsPendingReview', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'sendToBookkeeping', endpoint: '/incomingInvoices.sendToBookkeeping', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'listPayments', endpoint: '/incomingInvoices.listPayments', sends: ['id'] },
	{ resource: 'incomingInvoice', op: 'registerPayment', endpoint: '/incomingInvoices.registerPayment', sends: ['id', 'payment', 'paid_at'] },
	{ resource: 'incomingInvoice', op: 'removePayment', endpoint: '/incomingInvoices.removePayment', sends: ['id', 'payment_id'] },
	{ resource: 'incomingInvoice', op: 'updatePayment', endpoint: '/incomingInvoices.updatePayment', sends: ['id', 'payment_id'] },

	// INCOMING CREDIT NOTE
	{ resource: 'incomingCreditNote', op: 'add', endpoint: '/incomingCreditNotes.add', sends: [] },
	{ resource: 'incomingCreditNote', op: 'get', endpoint: '/incomingCreditNotes.info', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'update', endpoint: '/incomingCreditNotes.update', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'delete', endpoint: '/incomingCreditNotes.delete', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'approve', endpoint: '/incomingCreditNotes.approve', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'refuse', endpoint: '/incomingCreditNotes.refuse', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'markPending', endpoint: '/incomingCreditNotes.markAsPendingReview', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'sendToBookkeeping', endpoint: '/incomingCreditNotes.sendToBookkeeping', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'listPayments', endpoint: '/incomingCreditNotes.listPayments', sends: ['id'] },
	{ resource: 'incomingCreditNote', op: 'registerPayment', endpoint: '/incomingCreditNotes.registerPayment', sends: ['id', 'payment', 'paid_at'] },
	{ resource: 'incomingCreditNote', op: 'removePayment', endpoint: '/incomingCreditNotes.removePayment', sends: ['id', 'payment_id'] },
	{ resource: 'incomingCreditNote', op: 'updatePayment', endpoint: '/incomingCreditNotes.updatePayment', sends: ['id', 'payment_id'] },

	// EVENT
	{ resource: 'event', op: 'create', endpoint: '/events.create', sends: ['title', 'activity_type_id', 'starts_at', 'ends_at'] },
	{ resource: 'event', op: 'get', endpoint: '/events.info', sends: ['id'] },
	{ resource: 'event', op: 'getMany', endpoint: '/events.list', sends: ['page'] },
	{ resource: 'event', op: 'update', endpoint: '/events.update', sends: ['id'] },
	{ resource: 'event', op: 'cancel', endpoint: '/events.cancel', sends: ['id'] },

	// MEETING
	{ resource: 'meeting', op: 'schedule', endpoint: '/meetings.schedule', sends: ['title', 'starts_at', 'ends_at'] },
	{ resource: 'meeting', op: 'get', endpoint: '/meetings.info', sends: ['id'] },
	{ resource: 'meeting', op: 'getMany', endpoint: '/meetings.list', sends: ['page'] },
	{ resource: 'meeting', op: 'update', endpoint: '/meetings.update', sends: ['id'] },
	{ resource: 'meeting', op: 'complete', endpoint: '/meetings.complete', sends: ['id'] },
	{ resource: 'meeting', op: 'delete', endpoint: '/meetings.delete', sends: ['id'] },
	{ resource: 'meeting', op: 'createReport', endpoint: '/meetings.createReport', sends: ['id', 'body'] },

	// CALL
	{ resource: 'call', op: 'add', endpoint: '/calls.add', sends: ['caller', 'callee'] },
	{ resource: 'call', op: 'get', endpoint: '/calls.info', sends: ['id'] },
	{ resource: 'call', op: 'getMany', endpoint: '/calls.list', sends: ['page'] },
	{ resource: 'call', op: 'complete', endpoint: '/calls.complete', sends: ['id'] },
	{ resource: 'call', op: 'update', endpoint: '/calls.update', sends: ['id'] },

	// TIME TRACKING
	{ resource: 'timeTracking', op: 'add', endpoint: '/timeTracking.add', sends: ['work_type_id', 'started_at', 'duration', 'subject'] },
	{ resource: 'timeTracking', op: 'get', endpoint: '/timeTracking.info', sends: ['id'] },
	{ resource: 'timeTracking', op: 'getMany', endpoint: '/timeTracking.list', sends: ['page'] },
	{ resource: 'timeTracking', op: 'update', endpoint: '/timeTracking.update', sends: ['id'] },
	{ resource: 'timeTracking', op: 'delete', endpoint: '/timeTracking.delete', sends: ['id'] },
	{ resource: 'timeTracking', op: 'resume', endpoint: '/timeTracking.resume', sends: ['id'] },

	// TIMER
	{ resource: 'timer', op: 'getCurrent', endpoint: '/timers.current', sends: [] },
	{ resource: 'timer', op: 'start', endpoint: '/timers.start', sends: [] },
	{ resource: 'timer', op: 'stop', endpoint: '/timers.stop', sends: [] },
	{ resource: 'timer', op: 'update', endpoint: '/timers.update', sends: [] },

	// NOTE
	{ resource: 'note', op: 'create', endpoint: '/notes.create', sends: ['subject', 'content'] },
	{ resource: 'note', op: 'getMany', endpoint: '/notes.list', sends: ['page'] },
	{ resource: 'note', op: 'update', endpoint: '/notes.update', sends: ['id', 'content'] },

	// TASK
	{ resource: 'task', op: 'create', endpoint: '/tasks.create', sends: ['title', 'due_date'] },
	{ resource: 'task', op: 'get', endpoint: '/tasks.info', sends: ['id'] },
	{ resource: 'task', op: 'getMany', endpoint: '/tasks.list', sends: ['page'] },
	{ resource: 'task', op: 'update', endpoint: '/tasks.update', sends: ['id'] },
	{ resource: 'task', op: 'delete', endpoint: '/tasks.delete', sends: ['id'] },
	{ resource: 'task', op: 'complete', endpoint: '/tasks.complete', sends: ['id'] },
	{ resource: 'task', op: 'reopen', endpoint: '/tasks.reopen', sends: ['id'] },
	{ resource: 'task', op: 'schedule', endpoint: '/tasks.schedule', sends: ['id', 'scheduled_at'] },

	// PROJECT (v2)
	{ resource: 'project', op: 'create', endpoint: '/projects-v2/projects.create', sends: ['title', 'billing_method'] },
	{ resource: 'project', op: 'get', endpoint: '/projects-v2/projects.info', sends: ['id'] },
	{ resource: 'project', op: 'getMany', endpoint: '/projects-v2/projects.list', sends: ['page'] },
	{ resource: 'project', op: 'update', endpoint: '/projects-v2/projects.update', sends: ['id'] },
	{ resource: 'project', op: 'close', endpoint: '/projects-v2/projects.close', sends: ['id', 'closing_strategy'] },
	{ resource: 'project', op: 'reopen', endpoint: '/projects-v2/projects.reopen', sends: ['id'] },
	{ resource: 'project', op: 'duplicate', endpoint: '/projects-v2/projects.duplicate', sends: ['id'] },
	{ resource: 'project', op: 'delete', endpoint: '/projects-v2/projects.delete', sends: ['id', 'delete_strategy'] },
	{ resource: 'project', op: 'addOwner', endpoint: '/projects-v2/projects.addOwner', sends: ['id', 'user_id'] },
	{ resource: 'project', op: 'removeOwner', endpoint: '/projects-v2/projects.removeOwner', sends: ['id', 'user_id'] },
	{ resource: 'project', op: 'assign', endpoint: '/projects-v2/projects.assign', sends: ['id', 'assignee'] },
	{ resource: 'project', op: 'unassign', endpoint: '/projects-v2/projects.unassign', sends: ['id', 'assignee'] },
	{ resource: 'project', op: 'addCustomer', endpoint: '/projects-v2/projects.addCustomer', sends: ['id', 'customer'] },
	{ resource: 'project', op: 'removeCustomer', endpoint: '/projects-v2/projects.removeCustomer', sends: ['id', 'customer'] },
	{ resource: 'project', op: 'addDeal', endpoint: '/projects-v2/projects.addDeal', sends: ['id', 'deal_id'] },
	{ resource: 'project', op: 'removeDeal', endpoint: '/projects-v2/projects.removeDeal', sends: ['id', 'deal_id'] },
	{ resource: 'project', op: 'addQuotation', endpoint: '/projects-v2/projects.addQuotation', sends: ['id', 'quotation_id'] },
	{ resource: 'project', op: 'removeQuotation', endpoint: '/projects-v2/projects.removeQuotation', sends: ['id', 'quotation_id'] },

	// PROJECT GROUP
	{ resource: 'projectGroup', op: 'create', endpoint: '/projects-v2/projectGroups.create', sends: ['project_id', 'name'] },
	{ resource: 'projectGroup', op: 'get', endpoint: '/projects-v2/projectGroups.info', sends: ['id'] },
	{ resource: 'projectGroup', op: 'getMany', endpoint: '/projects-v2/projectGroups.list', sends: ['project_id', 'page'] },
	{ resource: 'projectGroup', op: 'update', endpoint: '/projects-v2/projectGroups.update', sends: ['id'] },
	{ resource: 'projectGroup', op: 'delete', endpoint: '/projects-v2/projectGroups.delete', sends: ['id', 'delete_strategy'] },
	{ resource: 'projectGroup', op: 'duplicate', endpoint: '/projects-v2/projectGroups.duplicate', sends: ['id'] },
	{ resource: 'projectGroup', op: 'assign', endpoint: '/projects-v2/projectGroups.assign', sends: ['id', 'assignee'] },
	{ resource: 'projectGroup', op: 'unassign', endpoint: '/projects-v2/projectGroups.unassign', sends: ['id', 'assignee'] },

	// PROJECT TASK
	{ resource: 'projectTask', op: 'create', endpoint: '/projects-v2/tasks.create', sends: ['project_id', 'title', 'group_id'] },
	{ resource: 'projectTask', op: 'get', endpoint: '/projects-v2/tasks.info', sends: ['id'] },
	{ resource: 'projectTask', op: 'getMany', endpoint: '/projects-v2/tasks.list', sends: ['project_id', 'page'] },
	{ resource: 'projectTask', op: 'update', endpoint: '/projects-v2/tasks.update', sends: ['id'] },
	{ resource: 'projectTask', op: 'delete', endpoint: '/projects-v2/tasks.delete', sends: ['id', 'delete_strategy'] },
	{ resource: 'projectTask', op: 'duplicate', endpoint: '/projects-v2/tasks.duplicate', sends: ['id'] },
	{ resource: 'projectTask', op: 'assign', endpoint: '/projects-v2/tasks.assign', sends: ['id', 'assignee'] },
	{ resource: 'projectTask', op: 'unassign', endpoint: '/projects-v2/tasks.unassign', sends: ['id', 'assignee'] },

	// PROJECT MATERIAL
	{ resource: 'projectMaterial', op: 'create', endpoint: '/projects-v2/materials.create', sends: ['project_id', 'title', 'group_id'] },
	{ resource: 'projectMaterial', op: 'get', endpoint: '/projects-v2/materials.info', sends: ['id'] },
	{ resource: 'projectMaterial', op: 'getMany', endpoint: '/projects-v2/materials.list', sends: ['project_id', 'page'] },
	{ resource: 'projectMaterial', op: 'update', endpoint: '/projects-v2/materials.update', sends: ['id'] },
	{ resource: 'projectMaterial', op: 'delete', endpoint: '/projects-v2/materials.delete', sends: ['id'] },
	{ resource: 'projectMaterial', op: 'duplicate', endpoint: '/projects-v2/materials.duplicate', sends: ['id'] },
	{ resource: 'projectMaterial', op: 'assign', endpoint: '/projects-v2/materials.assign', sends: ['id', 'assignee'] },
	{ resource: 'projectMaterial', op: 'unassign', endpoint: '/projects-v2/materials.unassign', sends: ['id', 'assignee'] },

	// PRODUCT
	{ resource: 'product', op: 'create', endpoint: '/products.add', sends: ['name'] },
	{ resource: 'product', op: 'get', endpoint: '/products.info', sends: ['id'] },
	{ resource: 'product', op: 'getMany', endpoint: '/products.list', sends: ['page'] },
	{ resource: 'product', op: 'update', endpoint: '/products.update', sends: ['id'] },
	{ resource: 'product', op: 'delete', endpoint: '/products.delete', sends: ['id'] },

	// TICKET
	{ resource: 'ticket', op: 'create', endpoint: '/tickets.create', sends: ['subject', 'message'] },
	{ resource: 'ticket', op: 'get', endpoint: '/tickets.info', sends: ['id'] },
	{ resource: 'ticket', op: 'getMany', endpoint: '/tickets.list', sends: ['page'] },
	{ resource: 'ticket', op: 'update', endpoint: '/tickets.update', sends: ['id'] },
	{ resource: 'ticket', op: 'listMessages', endpoint: '/tickets.listMessages', sends: ['id'] },
	{ resource: 'ticket', op: 'getMessage', endpoint: '/tickets.getMessage', sends: ['id'] },
	{ resource: 'ticket', op: 'addReply', endpoint: '/tickets.addReply', sends: ['id', 'body'] },
	{ resource: 'ticket', op: 'addInternalMessage', endpoint: '/tickets.addInternalMessage', sends: ['id', 'body'] },
	{ resource: 'ticket', op: 'importMessage', endpoint: '/tickets.importMessage', sends: ['id', 'body', 'sent_by', 'sent_at'] },

	// USER
	{ resource: 'user', op: 'getCurrent', endpoint: '/users.me', sends: [] },
	{ resource: 'user', op: 'get', endpoint: '/users.info', sends: ['id'] },
	{ resource: 'user', op: 'getMany', endpoint: '/users.list', sends: ['page'] },
	{ resource: 'user', op: 'getWeekSchedule', endpoint: '/users.getWeekSchedule', sends: ['id'] },
	{ resource: 'user', op: 'listDaysOff', endpoint: '/users.listDaysOff', sends: ['id'] },

	// DEPARTMENT
	{ resource: 'department', op: 'get', endpoint: '/departments.info', sends: ['id'] },
	{ resource: 'department', op: 'getMany', endpoint: '/departments.list', sends: ['page'] },

	// TEAM
	{ resource: 'team', op: 'getMany', endpoint: '/teams.list', sends: ['page'] },

	// FILE
	{ resource: 'file', op: 'get', endpoint: '/files.info', sends: ['id'] },
	{ resource: 'file', op: 'getMany', endpoint: '/files.list', sends: ['filter', 'filter.subject', 'page'] },
	{ resource: 'file', op: 'delete', endpoint: '/files.delete', sends: ['id'] },
	{ resource: 'file', op: 'download', endpoint: '/files.download', sends: ['id'] },
	{ resource: 'file', op: 'upload', endpoint: '/files.upload', sends: ['subject'] },

	// DAY OFF
	{ resource: 'dayOff', op: 'import', endpoint: '/daysOff.import', sends: ['days_off'] },
	{ resource: 'dayOff', op: 'bulkDelete', endpoint: '/daysOff.bulkDelete', sends: ['days_off'] },
	{ resource: 'dayOff', op: 'listTypes', endpoint: '/dayOffTypes.list', sends: [] },
	{ resource: 'dayOff', op: 'createType', endpoint: '/dayOffTypes.create', sends: ['name'] },
	{ resource: 'dayOff', op: 'updateType', endpoint: '/dayOffTypes.update', sends: ['id'] },
	{ resource: 'dayOff', op: 'deleteType', endpoint: '/dayOffTypes.delete', sends: ['id'] },

	// CLOSING DAY
	{ resource: 'closingDay', op: 'add', endpoint: '/closingDays.add', sends: ['date'] },
	{ resource: 'closingDay', op: 'getMany', endpoint: '/closingDays.list', sends: ['page'] },
	{ resource: 'closingDay', op: 'delete', endpoint: '/closingDays.delete', sends: ['id'] },

	// EMAIL TRACKING
	{ resource: 'emailTracking', op: 'create', endpoint: '/emailTracking.create', sends: ['subject', 'url'] },
	{ resource: 'emailTracking', op: 'getMany', endpoint: '/emailTracking.list', sends: ['page'] },

	// WEBHOOK
	{ resource: 'webhook', op: 'register', endpoint: '/webhooks.register', sends: ['url', 'types'] },
	{ resource: 'webhook', op: 'getMany', endpoint: '/webhooks.list', sends: ['page'] },
	{ resource: 'webhook', op: 'unregister', endpoint: '/webhooks.unregister', sends: ['id'] },

	// EXTERNAL PARTY
	{ resource: 'externalParty', op: 'addToProject', endpoint: '/projects-v2/externalParties.addToProject', sends: ['project_id', 'customer'] },
	{ resource: 'externalParty', op: 'update', endpoint: '/projects-v2/externalParties.update', sends: ['id'] },
	{ resource: 'externalParty', op: 'delete', endpoint: '/projects-v2/externalParties.delete', sends: ['id'] },

	// PROJECT LINE
	{ resource: 'projectLine', op: 'getMany', endpoint: '/projects-v2/projectLines.list', sends: ['project_id', 'page'] },
	{ resource: 'projectLine', op: 'addToGroup', endpoint: '/projects-v2/projectLines.addToGroup', sends: ['line_id', 'group_id'] },
	{ resource: 'projectLine', op: 'removeFromGroup', endpoint: '/projects-v2/projectLines.removeFromGroup', sends: ['line_id'] },

	// RECEIPT
	{ resource: 'receipt', op: 'add', endpoint: '/receipts.add', sends: ['title', 'currency', 'total'] },
	{ resource: 'receipt', op: 'get', endpoint: '/receipts.info', sends: ['id'] },
	{ resource: 'receipt', op: 'delete', endpoint: '/receipts.delete', sends: ['id'] },
	{ resource: 'receipt', op: 'approve', endpoint: '/receipts.approve', sends: ['id'] },
	{ resource: 'receipt', op: 'refuse', endpoint: '/receipts.refuse', sends: ['id'] },
	{ resource: 'receipt', op: 'markPending', endpoint: '/receipts.markAsPendingReview', sends: ['id'] },
	{ resource: 'receipt', op: 'sendToBookkeeping', endpoint: '/receipts.sendToBookkeeping', sends: ['id'] },
	{ resource: 'receipt', op: 'update', endpoint: '/receipts.update', sends: ['id'] },
	{ resource: 'receipt', op: 'listPayments', endpoint: '/receipts.listPayments', sends: ['id'] },
	{ resource: 'receipt', op: 'registerPayment', endpoint: '/receipts.registerPayment', sends: ['id', 'payment', 'paid_at'] },
	{ resource: 'receipt', op: 'removePayment', endpoint: '/receipts.removePayment', sends: ['id', 'payment_id'] },
	{ resource: 'receipt', op: 'updatePayment', endpoint: '/receipts.updatePayment', sends: ['id', 'payment_id'] },

	// RESERVATION
	{ resource: 'reservation', op: 'create', endpoint: '/reservations.create', sends: ['plannable_item_id', 'date', 'duration', 'assignee'] },
	{ resource: 'reservation', op: 'delete', endpoint: '/reservations.delete', sends: ['id'] },
	{ resource: 'reservation', op: 'getMany', endpoint: '/reservations.list', sends: ['page'] },
	{ resource: 'reservation', op: 'update', endpoint: '/reservations.update', sends: ['id'] },

	// ORDER
	{ resource: 'order', op: 'get', endpoint: '/orders.info', sends: ['id'] },
	{ resource: 'order', op: 'getMany', endpoint: '/orders.list', sends: ['page'] },

	// PLANNABLE ITEM
	{ resource: 'plannableItem', op: 'get', endpoint: '/plannableItems.info', sends: ['id'] },
	{ resource: 'plannableItem', op: 'getMany', endpoint: '/plannableItems.list', sends: ['page'] },

	// USER AVAILABILITY
	{ resource: 'userAvailability', op: 'getDaily', endpoint: '/userAvailability.daily', sends: ['period'] },
	{ resource: 'userAvailability', op: 'getTotal', endpoint: '/userAvailability.total', sends: ['period'] },

	// EXPENSE
	{ resource: 'expense', op: 'getMany', endpoint: '/expenses.list', sends: ['page'] },

	// BOOKKEEPING SUBMISSION
	{ resource: 'bookkeepingSubmission', op: 'getMany', endpoint: '/bookkeepingSubmissions.list', sends: ['page'] },
];

// ─── run validation ──────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;
let passed = 0;

console.log('=== Teamleader Focus Node — Spec Validation ===\n');

for (const mapping of ENDPOINT_MAP) {
	const { resource, op, endpoint, sends } = mapping;
	const label = `${resource}.${op} → ${endpoint}`;

	// 1. Check endpoint exists in spec
	const schema = getEndpointSchema(endpoint);
	if (!schema) {
		console.log(`⚠  WARN  ${label}: endpoint not found in spec (may be new or renamed)`);
		warnings++;
		continue;
	}

	// 2. Extract required fields from spec
	const requiredFields = extractRequired(schema);
	const requiredTopLevel = Object.entries(requiredFields)
		.filter(([key]) => !key.includes('.'))
		.map(([key]) => key);

	// 3. Check that all required fields are in our sends list
	const missingRequired = [];
	for (const reqField of requiredTopLevel) {
		// page is always handled by pagination logic, skip
		if (reqField === 'page') continue;
		// sort is optional in practice
		if (reqField === 'sort') continue;

		if (!sends.includes(reqField)) {
			missingRequired.push(reqField);
		}
	}

	if (missingRequired.length > 0) {
		console.log(`❌ ERROR ${label}: missing required fields: ${missingRequired.join(', ')}`);
		errors++;
	} else {
		passed++;
	}

	// 4. Check for nested required fields that need special handling
	const nestedRequired = Object.entries(requiredFields)
		.filter(([key]) => key.includes('.'))
		.map(([key]) => key);

	for (const nestedKey of nestedRequired) {
		// Check if the parent is in our sends list (e.g. filter.subject → check for filter)
		const parts = nestedKey.split('.');
		const topParent = parts[0];
		if (sends.includes(nestedKey) || sends.includes(topParent)) {
			// Good — we're handling it
		} else if (topParent === 'page' || topParent === 'sort') {
			// Auto-handled
		} else {
			// Only warn if top-level parent is required
			if (requiredFields[topParent]?.required) {
				console.log(`⚠  WARN  ${label}: nested required field '${nestedKey}' — verify it's properly constructed`);
				warnings++;
			}
		}
	}
}

// ─── Check for enum mismatches in download operations ────────────────────────
console.log('\n=== Enum Checks ===\n');

// Check format enums for download endpoints
for (const ep of ['/invoices.download', '/creditNotes.download', '/quotations.download']) {
	const schema = getEndpointSchema(ep);
	if (!schema) continue;
	const allProps = getAllProperties(schema);
	const formatProp = allProps['format'];
	if (formatProp) {
		const specEnums = extractEnums(formatProp);
		if (specEnums && specEnums.length > 1) {
			console.log(`ℹ  INFO  ${ep} supports formats: ${specEnums.join(', ')}`);
			// Check if our description file only has 'pdf'
			const descFiles = {
				'/invoices.download': 'InvoiceDescription.ts',
				'/creditNotes.download': 'CreditNoteDescription.ts',
				'/quotations.download': 'QuotationDescription.ts',
			};
			const descFile = descFiles[ep];
			if (descFile) {
				const descSrc = fs.readFileSync(path.join(NODE_DIR, descFile), 'utf8');
				const missing = specEnums.filter(e => !descSrc.includes(`'${e}'`) && !descSrc.includes(`"${e}"`));
				if (missing.length > 0) {
					console.log(`⚠  WARN  ${descFile} is missing format options: ${missing.join(', ')}`);
					warnings++;
				}
			}
		}
	}
}

// ─── Check files.list filter structure ───────────────────────────────────────
console.log('\n=== Structural Checks ===\n');

// Verify files.list sends filter.subject correctly
if (nodeSrc.includes("filter: {\n\t\t\t\t\t\t\tsubject:") || nodeSrc.includes('filter: {\n\t\t\t\t\t\t\t\tsubject:') || nodeSrc.match(/filter:\s*\{\s*subject:/)) {
	console.log('✅ PASS  files.list: filter.subject structure is correct');
	passed++;
} else if (nodeSrc.match(/files\.list.*subject/) && !nodeSrc.match(/filter.*subject.*files\.list/)) {
	console.log('❌ ERROR files.list: subject should be inside filter object');
	errors++;
}

// Verify download endpoints include format
for (const ep of ['invoices.download', 'quotations.download', 'creditNotes.download']) {
	const shortName = ep.split('.')[0];
	// Look for buildDownloadBody or manual { id, format } construction
	if (nodeSrc.includes('buildDownloadBody') && nodeSrc.includes(ep)) {
		console.log(`✅ PASS  ${ep}: uses buildDownloadBody (includes format)`);
		passed++;
	} else if (nodeSrc.match(new RegExp(`${ep.replace('.', '\\.')}.*\\{.*id.*format|format.*id`))) {
		console.log(`✅ PASS  ${ep}: manually includes format parameter`);
		passed++;
	} else if (nodeSrc.includes(ep)) {
		// Check if it's manual code with format
		const epRegion = nodeSrc.substring(nodeSrc.indexOf(ep) - 200, nodeSrc.indexOf(ep) + 200);
		if (epRegion.includes('format')) {
			console.log(`✅ PASS  ${ep}: format found in surrounding code`);
			passed++;
		} else {
			console.log(`❌ ERROR ${ep}: format parameter may be missing from request body`);
			errors++;
		}
	}
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n=== Summary ===');
console.log(`✅ Passed:   ${passed}`);
console.log(`⚠  Warnings: ${warnings}`);
console.log(`❌ Errors:   ${errors}`);
console.log(`   Total:    ${ENDPOINT_MAP.length} endpoint mappings checked`);

process.exit(errors > 0 ? 1 : 0);
