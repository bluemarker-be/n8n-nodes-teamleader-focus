import type { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['call'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add a call' },
			{ name: 'Complete', value: 'complete', action: 'Complete a call' },
			{ name: 'Get', value: 'get', action: 'Get a call' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many calls' },
			{ name: 'Update', value: 'update', action: 'Update a call' },
		],
		default: 'getMany',
	},
];

export const callFields: INodeProperties[] = [
	// ----------------------------------
	//         call: add
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
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'Type of the participant customer',
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'ID of the participant customer (contact or company)',
	},
	{
		displayName: 'Due At',
		name: 'dueAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'Due date and time of the call',
	},
	{
		displayName: 'Assignee User Name or ID',
		name: 'assigneeUserId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description:
			'The user assigned to the call. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'The ID of the related deal',
			},
		],
	},

	// ----------------------------------
	//         call: get / complete
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['call'], operation: ['get', 'complete', 'update'] },
		},
		description: 'The ID of the call',
	},

	// ----------------------------------
	//         call: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['call'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['call'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         call: complete
	// ----------------------------------
	{
		displayName: 'Call Outcome Name or ID',
		name: 'call_outcome_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCallOutcomes' },
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['complete'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Outcome Summary',
		name: 'outcome_summary',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['complete'] } },
		description: 'Summary of the call outcome',
	},

	// ----------------------------------
	//         call: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['call'], operation: ['update'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Due At',
				name: 'due_at',
				type: 'dateTime',
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
				description: 'Type of the participant customer',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'ID of the participant customer',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'The ID of the related deal',
			},
			{
				displayName: 'Assignee User Name or ID',
				name: 'assignee_user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
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
		displayOptions: { show: { resource: ['call'], operation: ['add', 'update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getCallCustomFields' },
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
];
