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
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
		description: 'The ID of the related deal (customer is derived from the deal)',
	},
	{
		displayName: 'Grouped Lines (JSON)',
		name: 'groupedLines',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['quotation'], operation: ['create'] } },
		description: 'Array of line item groups in JSON format. Optional for text-only quotations. Example: [{"section":{"title":"Section 1"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"tax":"excluding"},"tax_rate_id":"tax-rate-uuid"}]}]',
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name/title of the quotation',
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
				displayName: 'Text (Markdown)',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Markdown text for the quotation',
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
			{
				displayName: 'Discounts',
				name: 'discounts',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Discount',
				default: {},
				options: [
					{
						displayName: 'Discount',
						name: 'discount',
						values: [
							{
								displayName: 'Value (%)',
								name: 'value',
								type: 'number',
								typeOptions: { minValue: 0, maxValue: 100, numberPrecision: 2 },
								default: 0,
								description: 'Discount percentage (0-100)',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Description of the discount',
							},
						],
					},
				],
			},
			{
				displayName: 'Expiry Date',
				name: 'expiry_date',
				type: 'dateTime',
				default: '',
				description: 'Date when the quotation expires',
			},
			{
				displayName: 'Expiry Action',
				name: 'expiry_action',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Lock', value: 'lock' },
				],
				default: 'none',
				description: 'What happens after the quotation expires',
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
		description: 'JSON array of recipient objects. Each can have a customer reference or an email address. Example: [{"customer":{"type":"contact","id":"abc-123"},"email_address":"name@example.com"}]',
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
		type: 'options',
		options: [
			{ name: 'Dutch (NL)', value: 'nl' },
			{ name: 'Dutch (BE)', value: 'nl-BE' },
			{ name: 'English', value: 'en' },
			{ name: 'French', value: 'fr' },
			{ name: 'German', value: 'de' },
			{ name: 'Spanish', value: 'es' },
			{ name: 'Italian', value: 'it' },
			{ name: 'Portuguese', value: 'pt' },
		],
		required: true,
		default: 'nl',
		displayOptions: { show: { resource: ['quotation'], operation: ['send'] } },
	},
	{
		displayName: 'Additional Send Fields',
		name: 'sendAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['quotation'], operation: ['send'] } },
		options: [
			{
				displayName: 'From Sender Type',
				name: 'from_sender_type',
				type: 'options',
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Department', value: 'department' },
				],
				default: 'user',
				description: 'Type of the sender',
			},
			{
				displayName: 'From Sender ID',
				name: 'from_sender_id',
				type: 'string',
				default: '',
				description: 'ID of the sender (user or department)',
			},
			{
				displayName: 'From Email Address',
				name: 'from_email_address',
				type: 'string',
				default: '',
				description: 'Email address to send from',
			},
			{
				displayName: 'CC',
				name: 'cc',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add CC Recipient',
				default: {},
				options: [
					{
						displayName: 'Recipient',
						name: 'recipient',
						values: [
							{
								displayName: 'Email Address',
								name: 'email_address',
								type: 'string',
								default: '',
								description: 'Email address of the CC recipient',
							},
							{
								displayName: 'Customer Type',
								name: 'customer_type',
								type: 'options',
								options: [
									{ name: 'None', value: '' },
									{ name: 'Contact', value: 'contact' },
									{ name: 'Company', value: 'company' },
								],
								default: '',
								description: 'Optional: link recipient to a customer',
							},
							{
								displayName: 'Customer ID',
								name: 'customer_id',
								type: 'string',
								default: '',
								description: 'Optional: ID of the linked customer',
							},
						],
					},
				],
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add BCC Recipient',
				default: {},
				options: [
					{
						displayName: 'Recipient',
						name: 'recipient',
						values: [
							{
								displayName: 'Email Address',
								name: 'email_address',
								type: 'string',
								default: '',
								description: 'Email address of the BCC recipient',
							},
							{
								displayName: 'Customer Type',
								name: 'customer_type',
								type: 'options',
								options: [
									{ name: 'None', value: '' },
									{ name: 'Contact', value: 'contact' },
									{ name: 'Company', value: 'company' },
								],
								default: '',
								description: 'Optional: link recipient to a customer',
							},
							{
								displayName: 'Customer ID',
								name: 'customer_id',
								type: 'string',
								default: '',
								description: 'Optional: ID of the linked customer',
							},
						],
					},
				],
			},
			{
				displayName: 'Attachments (JSON)',
				name: 'attachments',
				type: 'json',
				default: '[]',
				description: 'JSON array of attachment objects with content_type, name, and base64-encoded body. Example: [{"content_type":"application/pdf","name":"file.pdf","body":"base64..."}]',
			},
		],
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
		default: 100,
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name/title of the quotation',
			},
			{
				displayName: 'Grouped Lines (JSON)',
				name: 'grouped_lines',
				type: 'json',
				default: '[]',
				description: 'Array of line item groups in JSON format. Example: [{"section":{"title":"Section 1"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"tax":"excluding"},"tax_rate_id":"tax-rate-uuid"}]}]',
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
				displayName: 'Text (Markdown)',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Markdown text for the quotation',
			},
			{
				displayName: 'Currency Code',
				name: 'currency_code',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Currency Exchange Rate',
				name: 'currency_exchange_rate',
				type: 'number',
				typeOptions: { numberPrecision: 6 },
				default: 1,
			},
			{
				displayName: 'Discounts',
				name: 'discounts',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Discount',
				default: {},
				options: [
					{
						displayName: 'Discount',
						name: 'discount',
						values: [
							{
								displayName: 'Value (%)',
								name: 'value',
								type: 'number',
								typeOptions: { minValue: 0, maxValue: 100, numberPrecision: 2 },
								default: 0,
								description: 'Discount percentage (0-100)',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Description of the discount',
							},
						],
					},
				],
			},
			{
				displayName: 'Expiry Date',
				name: 'expiry_date',
				type: 'dateTime',
				default: '',
				description: 'Date when the quotation expires',
			},
			{
				displayName: 'Expiry Action',
				name: 'expiry_action',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Lock', value: 'lock' },
				],
				default: 'none',
				description: 'What happens after the quotation expires',
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
