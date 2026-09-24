import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	INode,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.focus.teamleader.eu';
const MAX_RETRIES = 3;

/**
 * Fields that the Teamleader API expects as date-only (YYYY-MM-DD),
 * not full ISO 8601 timestamps. n8n's dateTime picker outputs ISO strings,
 * so we strip the time component before sending.
 */
const DATE_ONLY_FIELDS = new Set([
	'estimated_closing_date',
	'estimated_closing_date_from',
	'estimated_closing_date_until',
	'birthdate',
	'invoice_date',
	'invoice_date_after',
	'invoice_date_before',
	'delivery_date',
	'credit_note_date',
	'receipt_date',
	'starts_on',
	'ends_on',
	'start_date',
	'end_date',
	'due_on',
	'due_before',
	'due_after',
	'due_by',
	'due_from',
	'due_date',
	'day',
	'date',
	'on',
	'started_on',
	'starts_after',
	'ends_before',
	'from',
	'until',
]);

/**
 * Fields that the Teamleader API expects as full timestamps with +00:00 offset
 * (not Z). Based on Make Teamleader Pro app formatDateTime() usage.
 */
const TIMESTAMP_FIELDS = new Set([
	'started_at', 'ended_at',
	'started_after', 'started_before', 'ended_after', 'ended_before',
	'starts_at', 'ends_at',
	'starts_before', 'ends_after',
	'due_at',
	'paid_at', 'sent_at',
	'updated_since',
	'created_before',
]);

/**
 * Convert an ISO 8601 datetime string to Teamleader timestamp format
 * (YYYY-MM-DDTHH:MM:SS+00:00). Returns the original value if not a valid date.
 */
function toTimestamp(value: string): string {
	const date = new Date(value);
	if (isNaN(date.getTime())) return value;
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}+00:00`;
}

/**
 * Convert an ISO 8601 datetime string to date-only (YYYY-MM-DD).
 * If the value is already date-only or not a valid date string, returns as-is.
 */
function toDateOnly(value: string): string {
	const match = value.match(/^\d{4}-\d{2}-\d{2}/);
	return match ? match[0] : value;
}

/**
 * Recursively walk through a request body and convert any date-only fields
 * from ISO 8601 timestamps to YYYY-MM-DD format.
 */
function sanitizeDateFields(obj: IDataObject): void {
	for (const [key, value] of Object.entries(obj)) {
		if (DATE_ONLY_FIELDS.has(key) && typeof value === 'string') {
			obj[key] = toDateOnly(value);
		} else if (TIMESTAMP_FIELDS.has(key) && typeof value === 'string') {
			obj[key] = toTimestamp(value);
		} else if (value && typeof value === 'object' && !Array.isArray(value)) {
			sanitizeDateFields(value as IDataObject);
		} else if (Array.isArray(value)) {
			for (const item of value) {
				if (item && typeof item === 'object' && !Array.isArray(item)) {
					sanitizeDateFields(item as IDataObject);
				}
			}
		}
	}
}

/**
 * Parse Teamleader API error response into a readable NodeApiError.
 * Teamleader returns: { errors: [{ code, title, status, meta: { field } }] }
 */
function formatTeamleaderError(node: INode, error: unknown, requestBody?: IDataObject): NodeApiError {
	const err = error as Record<string, unknown>;
	let body: unknown = err.error ?? (err.response as Record<string, unknown>)?.body;

	if (typeof body === 'string') {
		try { body = JSON.parse(body); } catch { /* keep as string */ }
	}

	const parsed = body as Record<string, unknown> | undefined;
	const errors = parsed?.errors as Array<Record<string, unknown>> | undefined;

	// Include the outgoing request body in the error description for debugging
	const requestInfo = requestBody && Object.keys(requestBody).length > 0
		? `\n\nRequest body sent:\n${JSON.stringify(requestBody, null, 2)}`
		: '';

	if (errors?.length) {
		const details = errors.map((e) => {
			const field = (e.meta as Record<string, unknown>)?.field;
			const fieldStr = field ? ` (field: ${field})` : '';
			return `${(e.title as string) || 'Unknown error'}${fieldStr}`;
		});
		return new NodeApiError(node, err as JsonObject, {
			message: details.join('; '),
			description: requestInfo || undefined,
			httpCode: String(err.statusCode ?? (errors[0]?.status as number) ?? ''),
		});
	}

	return new NodeApiError(node, err as JsonObject, {
		description: requestInfo || undefined,
	});
}

export async function teamleaderApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	// Convert date-only fields from ISO timestamps to YYYY-MM-DD
	sanitizeDateFields(body);

	const options: IRequestOptions = {
		method,
		body,
		uri: `${BASE_URL}${endpoint}`,
		json: true,
	};

	// Don't send empty body on GET-like requests
	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			const result = await this.helpers.requestOAuth2.call(
				this,
				'teamleaderFocusOAuth2Api',
				options,
			);
			// 204 No Content returns undefined/empty string — normalise to empty object
			if (!result) return {} as IDataObject;
			return result as IDataObject;
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const err = error as any;
			const statusCode = err.statusCode ?? err.response?.statusCode;

			// Rate limiting (429): Teamleader allows 200 req/min (sliding window).
			// Use x-ratelimit-reset header to wait until the oldest request expires,
			// fallback to exponential backoff if header is unavailable.
			if (statusCode === 429 && attempt < MAX_RETRIES) {
				let waitMs = (attempt + 1) * 5 * 1000; // fallback: 5s, 10s, 15s
				const resetHeader = err.response?.headers?.['x-ratelimit-reset'];
				if (resetHeader) {
					const resetMs = new Date(resetHeader as string).getTime() - Date.now();
					if (resetMs > 0 && resetMs < 65_000) {
						waitMs = resetMs + 500;
					}
				}
				await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
				continue;
			}

			// Single-use refresh token race condition (401): retry once after short delay
			if (statusCode === 401 && attempt === 0) {
				await new Promise<void>((resolve) => setTimeout(resolve, 1000));
				continue;
			}

			throw formatTeamleaderError(this.getNode(), error, body);
		}
	}

	// Unreachable, but TypeScript requires it
	throw new NodeApiError(this.getNode(), {} as JsonObject, { message: 'Max retries exceeded' });
}

/**
 * Mapping of endpoints to their available `includes` values.
 * These are automatically added to requests to always return full data.
 */
const ENDPOINT_INCLUDES: Record<string, string> = {
	'/contacts.list': 'custom_fields,price_list',
	'/contacts.info': 'custom_fields,price_list',
	'/companies.list': 'custom_fields,price_list',
	'/companies.info': 'related_companies,related_contacts,custom_fields',
	'/deals.list': 'custom_fields,second_responsible_user',
	'/deals.info': 'custom_fields,second_responsible_user',
	'/invoices.list': 'late_fees',
	'/invoices.info': 'late_fees',
	'/meetings.list': 'tracked_time,estimated_time',
	'/meetings.info': 'tracked_time,estimated_time',
	'/products.info': 'suppliers',
	'/projects-v2/projects.list': 'legacy_project,custom_fields',
	'/projects-v2/projects.info': 'legacy_project',
	'/timeTracking.list': 'materials,relates_to',
	'/timeTracking.info': 'materials,relates_to',
	'/orders.list': 'custom_fields',
	'/orders.info': 'custom_fields',
	'/users.info': 'external_rate',
};

/**
 * Add `includes` parameter to the request body if the endpoint supports it.
 */
export function addIncludes(endpoint: string, body: IDataObject): void {
	const includes = ENDPOINT_INCLUDES[endpoint];
	if (includes) {
		body.includes = includes;
	}
}

export async function teamleaderApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	body: IDataObject = {},
	pageSize = 100,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let pageNumber = 1;
	let response: IDataObject;

	do {
		body.page = { size: pageSize, number: pageNumber };
		response = await teamleaderApiRequest.call(this, 'POST', endpoint, body);
		const data = response.data as IDataObject[] | undefined;
		if (data) {
			returnData.push(...data);
		}
		pageNumber++;
	} while ((response.data as IDataObject[] | undefined)?.length === pageSize);

	return returnData;
}

/**
 * Transform custom fields from the n8n UI format to the API format.
 * Input:  [{ fieldId: 'uuid', fieldValue: 'val' }]
 * Output: [{ id: 'uuid', value: 'val' }]
 */
export function mapCustomFields(
	customFields: Array<{ fieldId: string; fieldValue: string }>,
): Array<{ id: string; value: unknown }> {
	return customFields.map((cf) => {
		let value: unknown = cf.fieldValue;
		// Try to parse JSON values (booleans, numbers, arrays, objects)
		try {
			value = JSON.parse(cf.fieldValue);
		} catch {
			// keep as string
		}
		return { id: cf.fieldId, value };
	});
}

/**
 * Build filter array for .list endpoints from n8n UI parameters.
 */
export function buildFilter(
	filterValues: IDataObject,
): IDataObject {
	const filter: IDataObject = {};
	for (const [key, value] of Object.entries(filterValues)) {
		if (value !== undefined && value !== '' && value !== null) {
			// Skip empty arrays (from multiOptions with no selection)
			if (Array.isArray(value) && value.length === 0) {
				continue;
			}
			filter[key] = value;
		}
	}
	return filter;
}
