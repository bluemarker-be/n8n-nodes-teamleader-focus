import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['contact'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a contact' },
			{ name: 'Delete', value: 'delete', action: 'Delete a contact' },
			{ name: 'Get', value: 'get', action: 'Get a contact' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many contacts' },
			{ name: 'Link to Company', value: 'linkToCompany', action: 'Link contact to company' },
			{ name: 'Tag', value: 'tag', action: 'Tag a contact' },
			{
				name: 'Unlink from Company',
				value: 'unlinkFromCompany',
				action: 'Unlink contact from company',
			},
			{ name: 'Untag', value: 'untag', action: 'Untag a contact' },
			{ name: 'Update', value: 'update', action: 'Update a contact' },
			{
				name: 'Update Company Link',
				value: 'updateCompanyLink',
				action: 'Update contact company link',
			},
			{ name: 'Upload Avatar', value: 'uploadAvatar', action: 'Upload a contact avatar' },
		],
		default: 'getMany',
	},
];

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         contact: create
	// ----------------------------------
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
		description: 'Last name of the contact',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
		options: [
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Salutation',
				name: 'salutation',
				type: 'options',
				options: [
					{ name: 'Mr', value: 'MR' },
					{ name: 'Mrs', value: 'MRS' },
					{ name: 'Ms', value: 'MS' },
					{ name: 'Dr', value: 'DR' },
				],
				default: 'MR',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Primary email address',
			},
			{
				displayName: 'Telephone',
				name: 'telephone',
				type: 'string',
				default: '',
				description: 'Primary phone number',
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
					{ name: 'Danish', value: 'da' },
					{ name: 'Finnish', value: 'fi' },
					{ name: 'Swedish', value: 'sv' },
					{ name: 'Norwegian', value: 'nb' },
					{ name: 'Turkish', value: 'tr' },
				],
				default: 'nl',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [
					{ name: 'Male', value: 'male' },
					{ name: 'Female', value: 'female' },
					{ name: 'Unknown', value: 'unknown' },
				],
				default: 'male',
			},
			{
				displayName: 'Birthdate',
				name: 'birthdate',
				type: 'dateTime',
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
				displayName: 'National Identification Number',
				name: 'national_identification_number',
				type: 'string',
				default: '',
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
				description: 'ISO 3166-1 alpha-2 country code (e.g. BE, NL, FR)',
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
		displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getContactCustomFields' },
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
	//         contact: get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'delete', 'update', 'tag', 'untag', 'linkToCompany', 'unlinkFromCompany', 'updateCompanyLink', 'uploadAvatar'],
			},
		},
		description: 'The ID of the contact',
	},

	// ----------------------------------
	//         contact: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['contact'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: { show: { resource: ['contact'], operation: ['getMany'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				default: '',
				description: 'Filter by company ID',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of contact IDs',
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
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
				description: 'Search term for name, email, telephone',
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
		displayOptions: { show: { resource: ['contact'], operation: ['getMany'] } },
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
	//         contact: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
		options: [
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Salutation',
				name: 'salutation',
				type: 'options',
				options: [
					{ name: 'Mr', value: 'MR' },
					{ name: 'Mrs', value: 'MRS' },
					{ name: 'Ms', value: 'MS' },
					{ name: 'Dr', value: 'DR' },
				],
				default: 'MR',
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
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [
					{ name: 'Male', value: 'male' },
					{ name: 'Female', value: 'female' },
					{ name: 'Unknown', value: 'unknown' },
				],
				default: 'male',
			},
			{
				displayName: 'Birthdate',
				name: 'birthdate',
				type: 'dateTime',
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
				displayName: 'National Identification Number',
				name: 'national_identification_number',
				type: 'string',
				default: '',
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
				description: 'ISO 3166-1 alpha-2 country code (e.g. BE, NL, FR)',
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
		displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getContactCustomFields' },
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
	//         contact: tag / untag
	// ----------------------------------
	{
		displayName: 'Tag Names or IDs',
		name: 'tags',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getTags' },
		required: true,
		default: [],
		displayOptions: { show: { resource: ['contact'], operation: ['tag', 'untag'] } },
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	// ----------------------------------
	//         contact: uploadAvatar
	// ----------------------------------
	{
		displayName: 'Image (Base64 Data URI)',
		name: 'image',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['contact'], operation: ['uploadAvatar'] } },
		description: 'Base64 data URI string (e.g. data:image/png;base64,...) or null to remove the avatar',
	},

	// ----------------------------------
	//         contact: linkToCompany / unlinkFromCompany / updateCompanyLink
	// ----------------------------------
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['linkToCompany', 'unlinkFromCompany', 'updateCompanyLink'],
			},
		},
		description: 'The ID of the company',
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['contact'], operation: ['linkToCompany', 'updateCompanyLink'] },
		},
		description: 'The position/role within the company',
	},
	{
		displayName: 'Decision Maker',
		name: 'decisionMaker',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['contact'], operation: ['linkToCompany', 'updateCompanyLink'] },
		},
	},
];
