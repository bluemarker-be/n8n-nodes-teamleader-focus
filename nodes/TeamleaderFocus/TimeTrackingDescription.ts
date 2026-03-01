import type { INodeProperties } from 'n8n-workflow';

export const timeTrackingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timeTracking'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add a time tracking entry' },
			{ name: 'Delete', value: 'delete', action: 'Delete a time tracking entry' },
			{ name: 'Get', value: 'get', action: 'Get a time tracking entry' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many time tracking entries' },
			{ name: 'Resume', value: 'resume', action: 'Resume a time tracking entry' },
			{ name: 'Update', value: 'update', action: 'Update a time tracking entry' },
		],
		default: 'getMany',
	},
];

export const timeTrackingFields: INodeProperties[] = [
	// ----------------------------------
	//         timeTracking: add
	// ----------------------------------
	{
		displayName: 'Work Type Name or ID',
		name: 'work_type_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWorkTypes' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeTracking'], operation: ['add'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Started At',
		name: 'started_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeTracking'], operation: ['add'] } },
		description: 'Date and time when the work started',
	},
	{
		displayName: 'Duration (Seconds)',
		name: 'duration',
		type: 'number',
		typeOptions: { minValue: 1 },
		required: true,
		default: 3600,
		displayOptions: { show: { resource: ['timeTracking'], operation: ['add'] } },
		description: 'Duration of the time tracking entry in seconds',
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Deal', value: 'deal' },
			{ name: 'Milestone', value: 'milestone' },
			{ name: 'Project', value: 'project' },
			{ name: 'Ticket', value: 'ticket' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['timeTracking'], operation: ['add'] } },
		description: 'Type of the subject to track time on',
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['timeTracking'], operation: ['add'] } },
		description: 'ID of the subject to track time on',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['timeTracking'], operation: ['add'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'User Name or ID',
				name: 'user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Invoiceable',
				name: 'invoiceable',
				type: 'boolean',
				default: true,
				description: 'Whether the time tracking entry is invoiceable',
			},
		],
	},

	// ----------------------------------
	//         timeTracking: get / update / delete
	// ----------------------------------
	{
		displayName: 'Time Tracking ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['get', 'update', 'delete', 'resume'] },
		},
		description: 'The ID of the time tracking entry',
	},

	// ----------------------------------
	//         timeTracking: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['timeTracking'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['timeTracking'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'User Name or ID',
				name: 'user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Started After',
				name: 'started_after',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Started Before',
				name: 'started_before',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Subject Type',
				name: 'subject_type',
				type: 'options',
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Milestone', value: 'milestone' },
					{ name: 'Project', value: 'project' },
					{ name: 'Ticket', value: 'ticket' },
				],
				default: 'contact',
			},
			{
				displayName: 'Subject ID',
				name: 'subject_id',
				type: 'string',
				default: '',
				description: 'ID of the subject to filter by',
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: { show: { resource: ['timeTracking'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				type: 'options',
				options: [
					{ name: 'Started At', value: 'started_at' },
				],
				default: 'started_at',
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
	//         timeTracking: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['timeTracking'], operation: ['update'] } },
		options: [
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
				displayName: 'Started At',
				name: 'started_at',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Duration (Seconds)',
				name: 'duration',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 3600,
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'User Name or ID',
				name: 'user_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Invoiceable',
				name: 'invoiceable',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Subject Type',
				name: 'subject_type',
				type: 'options',
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Milestone', value: 'milestone' },
					{ name: 'Project', value: 'project' },
					{ name: 'Ticket', value: 'ticket' },
				],
				default: 'contact',
			},
			{
				displayName: 'Subject ID',
				name: 'subject_id',
				type: 'string',
				default: '',
			},
		],
	},
];
