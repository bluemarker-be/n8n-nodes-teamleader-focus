import type { INodeProperties } from 'n8n-workflow';

export const companyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['company'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a company' },
			{ name: 'Delete', value: 'delete', action: 'Delete a company' },
			{ name: 'Get', value: 'get', action: 'Get a company' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many companies' },
			{ name: 'Tag', value: 'tag', action: 'Tag a company' },
			{ name: 'Untag', value: 'untag', action: 'Untag a company' },
			{ name: 'Update', value: 'update', action: 'Update a company' },
			{ name: 'Upload Logo', value: 'uploadLogo', action: 'Upload a company logo' },
		],
		default: 'getMany',
	},
];

export const companyFields: INodeProperties[] = [
	// ----------------------------------
	//         company: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['company'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['create'] } },
		options: [
			{
				displayName: 'Business Type Name or ID',
				name: 'business_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getBusinessTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'VAT Number',
				name: 'vat_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: 'Telephone',
				name: 'telephone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'Dutch (NL)', value: 'nl' },
					{ name: 'Dutch (BE)', value: 'nl-BE' },
					{ name: 'English (GB)', value: 'en' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Portuguese', value: 'pt' },
				],
				default: 'nl',
			},
			{
				displayName: 'Responsible User Name or ID',
				name: 'responsible_user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'IBAN',
				name: 'iban',
				type: 'string',
				default: '',
			},
			{
				displayName: 'BIC',
				name: 'bic',
				type: 'string',
				default: '',
			},
			{
				displayName: 'National Identification Number',
				name: 'national_identification_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Preferred Currency',
				name: 'preferred_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Price List Name or ID',
				name: 'price_list_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getPriceLists' },
				default: '',
				description:
					'Link the company to a price list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Remarks',
				name: 'remarks',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getTags' },
				default: [],
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Marketing Mails Consent',
				name: 'marketing_mails_consent',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Address Line 1',
				name: 'addressLine1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'ISO 3166-1 alpha-2 country code',
			},
		],
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getCompanyCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description:
							'Value for the custom field. For single_select: use the option ID (see Field Name description). For multi_select: use an expression returning a JSON array of option IDs. For other types: enter the value directly.',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         company: get / delete / update / tag / untag
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get', 'delete', 'update', 'tag', 'untag', 'uploadLogo'],
			},
		},
	},

	// ----------------------------------
	//         company: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['company'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['company'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of company IDs',
			},
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: 'VAT Number',
				name: 'vat_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Deactivated', value: 'deactivated' },
				],
				default: 'active',
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getTags' },
				default: [],
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Updated Since',
				name: 'updated_since',
				type: 'dateTime',
				default: '',
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				type: 'options',
				options: [
					{ name: 'Added At', value: 'added_at' },
					{ name: 'Name', value: 'name' },
					{ name: 'Updated At', value: 'updated_at' },
				],
				default: 'name',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'asc',
			},
		],
	},

	// ----------------------------------
	//         company: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Business Type Name or ID',
				name: 'business_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getBusinessTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'VAT Number',
				name: 'vat_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: 'Telephone',
				name: 'telephone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'Dutch (NL)', value: 'nl' },
					{ name: 'Dutch (BE)', value: 'nl-BE' },
					{ name: 'English (GB)', value: 'en' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Spanish', value: 'es' },
				],
				default: 'nl',
			},
			{
				displayName: 'Responsible User Name or ID',
				name: 'responsible_user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Remarks',
				name: 'remarks',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getTags' },
				default: [],
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'National Identification Number',
				name: 'national_identification_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IBAN',
				name: 'iban',
				type: 'string',
				default: '',
			},
			{
				displayName: 'BIC',
				name: 'bic',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Marketing Mails Consent',
				name: 'marketing_mails_consent',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Preferred Currency',
				name: 'preferred_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Price List Name or ID',
				name: 'price_list_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getPriceLists' },
				default: '',
				description:
					'Link the company to a price list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: { show: { resource: ['company'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getCompanyCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description:
							'Value for the custom field. For single_select: use the option ID (see Field Name description). For multi_select: use an expression returning a JSON array of option IDs. For other types: enter the value directly.',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         company: uploadLogo
	// ----------------------------------
	{
		displayName: 'Image (Base64 Data URI)',
		name: 'image',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['company'], operation: ['uploadLogo'] } },
		description: 'Base64 data URI string (e.g. data:image/png;base64,...) or null to remove the logo',
	},

	// ----------------------------------
	//         company: tag / untag
	// ----------------------------------
	{
		displayName: 'Tag Names or IDs',
		name: 'tags',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getTags' },
		required: true,
		default: [],
		displayOptions: { show: { resource: ['company'], operation: ['tag', 'untag'] } },
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];
