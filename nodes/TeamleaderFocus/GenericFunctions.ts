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

export async function teamleaderApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
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
