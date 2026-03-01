import type { INodeProperties } from 'n8n-workflow';

export const meetingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['meeting'] } },
		options: [
			{ name: 'Complete', value: 'complete', action: 'Complete a meeting' },
			{ name: 'Create Report', value: 'createReport', action: 'Create a meeting report' },
			{ name: 'Delete', value: 'delete', action: 'Delete a meeting' },
			{ name: 'Get', value: 'get', action: 'Get a meeting' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many meetings' },
			{ name: 'Schedule', value: 'schedule', action: 'Schedule a meeting' },
			{ name: 'Update', value: 'update', action: 'Update a meeting' },
		],
		default: 'getMany',
	},
];

export const meetingFields: INodeProperties[] = [
	// ----------------------------------
	//         meeting: schedule
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['schedule'] } },
		description: 'Title of the meeting',
	},
	{
		displayName: 'Starts At',
		name: 'starts_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['schedule'] } },
		description: 'Start date and time of the meeting',
	},
	{
		displayName: 'Ends At',
		name: 'ends_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['schedule'] } },
		description: 'End date and time of the meeting',
	},
	{
		displayName: 'Attendees',
		name: 'attendees',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Attendee',
		required: true,
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['schedule'] } },
		description: 'At least one user attendee is required',
		options: [
			{
				displayName: 'Attendee',
				name: 'attendee',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'User', value: 'user' },
							{ name: 'Contact', value: 'contact' },
						],
						default: 'user',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the user or contact',
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['schedule'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
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
				description: 'Type of the related customer',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'ID of the related customer',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'The ID of the related deal',
			},
			{
				displayName: 'Milestone ID',
				name: 'milestone_id',
				type: 'string',
				default: '',
				description: 'The ID of the related milestone',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Work Type Name or ID',
				name: 'work_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getWorkTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Work Order ID',
				name: 'work_order_id',
				type: 'string',
				default: '',
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
		displayOptions: { show: { resource: ['meeting'], operation: ['schedule'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getMeetingCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         meeting: get / update / complete / delete / createReport
	// ----------------------------------
	{
		displayName: 'Meeting ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['get', 'update', 'complete', 'delete', 'createReport'],
			},
		},
		description: 'The ID of the meeting',
	},

	// ----------------------------------
	//         meeting: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['meeting'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['meeting'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         meeting: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Starts At',
				name: 'starts_at',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Ends At',
				name: 'ends_at',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Attendees',
				name: 'attendees',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Attendee',
				default: {},
				options: [
					{
						displayName: 'Attendee',
						name: 'attendee',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'User', value: 'user' },
									{ name: 'Contact', value: 'contact' },
								],
								default: 'user',
							},
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'The ID of the user or contact',
							},
						],
					},
				],
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Work Type Name or ID',
				name: 'work_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getWorkTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				description: 'Type of the related customer',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'ID of the related customer',
			},
			{
				displayName: 'Milestone ID',
				name: 'milestone_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
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
		displayOptions: { show: { resource: ['meeting'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getMeetingCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         meeting: createReport
	// ----------------------------------
	{
		displayName: 'Attach To Type',
		name: 'attachToType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
			{ name: 'Deal', value: 'deal' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['meeting'], operation: ['createReport'] } },
		description: 'Type of the entity to attach the report to',
	},
	{
		displayName: 'Attach To ID',
		name: 'attachToId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['createReport'] } },
		description: 'ID of the entity to attach the report to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['meeting'], operation: ['createReport'] } },
		options: [
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
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
		displayOptions: { show: { resource: ['meeting'], operation: ['createReport'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getMeetingCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
];
