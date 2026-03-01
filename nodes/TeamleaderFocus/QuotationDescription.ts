import type { INodeProperties } from 'n8n-workflow';

export const quotationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['quotation'] } },
		options: [
			{ name: 'Accept', value: 'accept', action: 'Accept a quotation' },
			{ name: 'Create', value: 'create', action: 'Create a quotation' },
			{ name: 'Delete', value: 'delete', action: 'Delete a quotation' },
			{ name: 'Download', value: 'download', action: 'Download a quotation' },
			{ name: 'Get', value: 'get', action: 'Get a quotation' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many quotations' },
			{ name: 'Send', value: 'send', action: 'Send a quotation' },
			{ name: 'Update', value: 'update', action: 'Update a quotation' },
		],
		default: 'getMany',
	},
];

export const quotationFields: INodeProperties[] = [
	// ----------------------------------
	//         quotation: create
	// ----------------------------------
	{
		displayName: 'Customer Type',
		name: 'customerType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
		description: 'The ID of the contact or company',
	},
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
		description: 'The ID of the related deal',
	},
	{
		displayName: 'Grouped Lines (JSON)',
		name: 'groupedLines',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
		description: 'Array of line item groups in JSON format. Each group contains a line_items array.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
		options: [
			{
				displayName: 'Document Template Name or ID',
				name: 'document_template_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDocumentTemplates' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Currency Code',
				name: 'currency_code',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Quotation currency code. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Currency Exchange Rate',
				name: 'currency_exchange_rate',
				type: 'number',
				typeOptions: { numberPrecision: 6 },
				default: 1,
				description: 'Exchange rate for the quotation currency (default 1.0)',
			},
		],
	},

	// ----------------------------------
	//         quotation: get / update / delete / send / accept
	// ----------------------------------
	{
		displayName: 'Quotation ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['quotation'],
				operation: ['get', 'update', 'delete', 'download', 'send', 'accept'],
			},
		},
	},

	// ----------------------------------
	//         quotation: send
	// ----------------------------------
	{
		displayName: 'Recipients (To)',
		name: 'recipientsTo',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['quotation'], operation: ['send'] } },
		description: 'JSON array of recipient objects, e.g. [{"customer":{"type":"contact","id":"..."}}] or [{"email":"..."}]',
	},
	{
		displayName: 'Subject',
		name: 'emailSubject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['quotation'], operation: ['send'] } },
	},
	{
		displayName: 'Content',
		name: 'emailContent',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['quotation'], operation: ['send'] } },
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		required: true,
		default: 'nl',
		displayOptions: { show: { resource: ['quotation'], operation: ['send'] } },
		description: 'Language code, e.g. "nl", "en", "fr"',
	},

	// ----------------------------------
	//         quotation: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['quotation'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['quotation'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['quotation'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'Filter quotations by deal ID',
			},
		],
	},

	// ----------------------------------
	//         quotation: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['quotation'], operation: ['update'] } },
		options: [
			{
				displayName: 'Grouped Lines (JSON)',
				name: 'grouped_lines',
				type: 'json',
				default: '[]',
				description: 'Array of line item groups in JSON format',
			},
			{
				displayName: 'Document Template Name or ID',
				name: 'document_template_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDocumentTemplates' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
		],
	},

	// ----------------------------------
	//         quotation: download
	// ----------------------------------
	{
		displayName: 'Binary Property (Output)',
		name: 'downloadBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['quotation'], operation: ['download'] } },
		description: 'Name of the binary property to write the downloaded file to',
	},
];
