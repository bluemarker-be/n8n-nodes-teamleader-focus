import type { INodeProperties } from 'n8n-workflow';

export const dealOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['deal'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a deal' },
			{ name: 'Delete', value: 'delete', action: 'Delete a deal' },
			{ name: 'Get', value: 'get', action: 'Get a deal' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many deals' },
			{ name: 'Lose', value: 'lose', action: 'Mark a deal as lost' },
			{ name: 'Move', value: 'move', action: 'Move a deal to a phase' },
			{ name: 'Update', value: 'update', action: 'Update a deal' },
			{ name: 'Win', value: 'win', action: 'Mark a deal as won' },
		],
		default: 'getMany',
	},
];

export const dealFields: INodeProperties[] = [
	// ----------------------------------
	//         deal: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
	},
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
		displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
		description: 'The ID of the contact or company',
	},
	{
		displayName: 'Contact Person ID',
		name: 'contactPersonId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['deal'], operation: ['create'], customerType: ['company'] } },
		description: 'The ID of the contact person at the company',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
		options: [
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Source Name or ID',
				name: 'source_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDealSources' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Department Name or ID',
				name: 'department_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDepartments' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Second Responsible User Name or ID',
				name: 'second_responsible_user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Optional second responsible user. Requires the "second deal responsible" feature to be enabled on your Teamleader account (contact support.focus@teamleader.eu). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Phase Name or ID',
				name: 'phase_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDealPhases' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Estimated Value Amount',
				name: 'estimated_value_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				description: 'The estimated monetary value of the deal. May be negative (e.g. when linked to a negative quotation).',
			},
			{
				displayName: 'Estimated Value Currency',
				name: 'estimated_value_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Currency for the estimated value. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Estimated Probability',
				name: 'estimated_probability',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Estimated Closing Date',
				name: 'estimated_closing_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Currency Code',
				name: 'currency_code',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Deal currency code. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Currency Exchange Rate',
				name: 'currency_exchange_rate',
				type: 'number',
				typeOptions: { numberPrecision: 6 },
				default: 1,
				description: 'Exchange rate for the deal currency (default 1.0)',
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
		displayOptions: { show: { resource: ['deal'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getDealCustomFields' },
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
	//         deal: get / update / move / win / lose
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['deal'],
				operation: ['get', 'delete', 'update', 'move', 'win', 'lose'],
			},
		},
	},

	// ----------------------------------
	//         deal: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['deal'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: { show: { resource: ['deal'], operation: ['getMany'], returnAll: [false] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['deal'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phase Name or ID',
				name: 'phase_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDealPhases' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Second Responsible User Name or ID',
				name: 'second_responsible_user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Optional second responsible user. Requires the "second deal responsible" feature to be enabled on your Teamleader account (contact support.focus@teamleader.eu). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Won', value: 'won' },
					{ name: 'Lost', value: 'lost' },
				],
				default: [],
			},
			{
				displayName: 'Estimated Closing Date',
				name: 'estimated_closing_date',
				type: 'dateTime',
				default: '',
				description: 'Filter on exact estimated closing date',
			},
			{
				displayName: 'Estimated Closing Date From',
				name: 'estimated_closing_date_from',
				type: 'dateTime',
				default: '',
				description: 'Filter on estimated closing date (inclusive, from)',
			},
			{
				displayName: 'Estimated Closing Date Until',
				name: 'estimated_closing_date_until',
				type: 'dateTime',
				default: '',
				description: 'Filter on estimated closing date (inclusive, until)',
			},
			{
				displayName: 'Created Before',
				name: 'created_before',
				type: 'dateTime',
				default: '',
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
		displayOptions: { show: { resource: ['deal'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Weighted Value', value: 'weighted_value' },
				],
				default: 'created_at',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
			},
		],
	},

	// ----------------------------------
	//         deal: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['deal'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Customer Type',
				name: 'customer_type',
				type: 'options',
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Company', value: 'company' },
				],
				default: 'contact',
				description: 'Type of the customer to change the deal to',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'ID of the customer to change the deal to',
			},
			{
				displayName: 'Contact Person ID',
				name: 'contact_person_id',
				type: 'string',
				default: '',
				description: 'The ID of the contact person at the company',
			},
			{
				displayName: 'Source Name or ID',
				name: 'source_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDealSources' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Second Responsible User Name or ID',
				name: 'second_responsible_user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Optional second responsible user. Requires the "second deal responsible" feature to be enabled on your Teamleader account (contact support.focus@teamleader.eu). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Estimated Value Amount',
				name: 'estimated_value_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				description: 'The estimated monetary value of the deal. May be negative (e.g. when linked to a negative quotation).',
			},
			{
				displayName: 'Estimated Value Currency',
				name: 'estimated_value_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Currency for the estimated value. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Estimated Probability',
				name: 'estimated_probability',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Estimated Closing Date',
				name: 'estimated_closing_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Currency Code',
				name: 'currency_code',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Deal currency code. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Currency Exchange Rate',
				name: 'currency_exchange_rate',
				type: 'number',
				typeOptions: { numberPrecision: 6 },
				default: 1,
				description: 'Exchange rate for the deal currency (default 1.0)',
			},
			{
				displayName: 'Department Name or ID',
				name: 'department_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDepartments' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		displayOptions: { show: { resource: ['deal'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getDealCustomFields' },
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
	//         deal: move
	// ----------------------------------
	{
		displayName: 'Phase Name or ID',
		name: 'phaseId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDealPhases' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['deal'], operation: ['move'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	// ----------------------------------
	//         deal: lose
	// ----------------------------------
	{
		displayName: 'Reason Name or ID',
		name: 'reasonId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getLostReasons' },
		default: '',
		displayOptions: { show: { resource: ['deal'], operation: ['lose'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Extra Info',
		name: 'extraInfo',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['deal'], operation: ['lose'] } },
	},
];
