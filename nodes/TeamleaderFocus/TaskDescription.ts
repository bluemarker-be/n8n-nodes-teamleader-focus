import type { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['task'] } },
		options: [
			{ name: 'Complete', value: 'complete', action: 'Complete a task' },
			{ name: 'Create', value: 'create', action: 'Create a task' },
			{ name: 'Delete', value: 'delete', action: 'Delete a task' },
			{ name: 'Get', value: 'get', action: 'Get a task' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many tasks' },
			{ name: 'Reopen', value: 'reopen', action: 'Reopen a task' },
			{ name: 'Schedule', value: 'schedule', action: 'Schedule a task' },
			{ name: 'Update', value: 'update', action: 'Update a task' },
		],
		default: 'getMany',
	},
];

export const taskFields: INodeProperties[] = [
	// ----------------------------------
	//         task: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
	},
	{
		displayName: 'Due On',
		name: 'dueOn',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		description: 'The due date for the task (YYYY-MM-DD)',
	},
	{
		displayName: 'Work Type Name or ID',
		name: 'workTypeId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWorkTypes' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Assignee Name or ID',
				name: 'assignee_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
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
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Estimated Duration (Value)',
				name: 'estimated_duration_value',
				type: 'number',
				default: 0,
				description: 'Numeric value for estimated duration',
			},
			{
				displayName: 'Estimated Duration (Unit)',
				name: 'estimated_duration_unit',
				type: 'options',
				options: [
					{ name: 'Hours', value: 'hours' },
					{ name: 'Minutes', value: 'minutes' },
				],
				default: 'hours',
			},
			{
				displayName: 'Milestone ID',
				name: 'milestone_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticket_id',
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
		displayOptions: { show: { resource: ['task'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getTaskCustomFields' },
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
	//         task: get / delete / update / complete / reopen
	// ----------------------------------
	{
		displayName: 'Task ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get', 'delete', 'update', 'complete', 'reopen', 'schedule'],
			},
		},
	},

	// ----------------------------------
	//         task: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['task'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['task'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Completed', value: 'completed' },
				],
				default: 'open',
			},
			{
				displayName: 'Assignee Name or ID',
				name: 'assignee_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Due Before',
				name: 'due_before',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Due After',
				name: 'due_after',
				type: 'dateTime',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         task: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
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
				displayName: 'Due On',
				name: 'due_on',
				type: 'dateTime',
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
				displayName: 'Assignee Name or ID',
				name: 'assignee_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Estimated Duration (Value)',
				name: 'estimated_duration_value',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Estimated Duration (Unit)',
				name: 'estimated_duration_unit',
				type: 'options',
				options: [
					{ name: 'Hours', value: 'hours' },
					{ name: 'Minutes', value: 'minutes' },
				],
				default: 'hours',
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
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Milestone ID',
				name: 'milestone_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticket_id',
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
		displayOptions: { show: { resource: ['task'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getTaskCustomFields' },
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
	//         task: schedule
	// ----------------------------------
	{
		displayName: 'Starts At',
		name: 'startsAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['schedule'] } },
		description: 'Start date and time for the scheduled task',
	},
	{
		displayName: 'Ends At',
		name: 'endsAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['task'], operation: ['schedule'] } },
		description: 'End date and time for the scheduled task',
	},
];
