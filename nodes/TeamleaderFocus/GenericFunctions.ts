import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.focus.teamleader.eu';

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
	'due_date',
	'day',
	'date',
	'on',
	'started_on',
	'starts_after',
	'ends_before',
]);

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
		} else if (value && typeof value === 'object' && !Array.isArray(value)) {
			sanitizeDateFields(value as IDataObject);
		}
	}
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

	try {
		return (await this.helpers.requestOAuth2.call(
			this,
			'teamleaderFocusOAuth2Api',
			options,
		)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function teamleaderApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	body: IDataObject = {},
	pageSize = 20,
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
		// Try to parse JSON values (for arrays, objects)
		try {
			const parsed = JSON.parse(cf.fieldValue);
			if (typeof parsed === 'object') {
				value = parsed;
			}
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
			filter[key] = value;
		}
	}
	return filter;
}
