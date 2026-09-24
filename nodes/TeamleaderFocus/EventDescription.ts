import type { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['event'] } },
		options: [
			{ name: 'Cancel', value: 'cancel', action: 'Cancel an event' },
			{ name: 'Create', value: 'create', action: 'Create an event' },
			{ name: 'Get', value: 'get', action: 'Get an event' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many events' },
			{ name: 'Update', value: 'update', action: 'Update an event' },
		],
		default: 'getMany',
	},
];

export const eventFields: INodeProperties[] = [
	// ----------------------------------
	//         event: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['event'], operation: ['create'] } },
		description: 'Title of the event',
	},
	{
		displayName: 'Activity Type Name or ID',
		name: 'activity_type_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getActivityTypes' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['event'], operation: ['create'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Starts At',
		name: 'starts_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['event'], operation: ['create'] } },
		description: 'Start date and time of the event',
	},
	{
		displayName: 'Ends At',
		name: 'ends_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['event'], operation: ['create'] } },
		description: 'End date and time of the event',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['event'], operation: ['create'] } },
		options: [
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
				displayName: 'Links',
				name: 'links',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Link',
				default: {},
				options: [
					{
						displayName: 'Link',
						name: 'link',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Contact', value: 'contact' },
									{ name: 'Company', value: 'company' },
									{ name: 'Deal', value: 'deal' },
								],
								default: 'contact',
							},
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'The ID of the linked entity',
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
		],
	},

	// ----------------------------------
	//         event: get / update / cancel
	// ----------------------------------
	{
		displayName: 'Event ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['event'], operation: ['get', 'update', 'cancel'] },
		},
		description: 'The ID of the event',
	},

	// ----------------------------------
	//         event: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['event'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['event'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['event'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Activity Type Name or ID',
				name: 'activity_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getActivityTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Attendee',
				name: 'attendee',
				type: 'fixedCollection',
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
									{ name: 'Contact', value: 'contact' },
								],
								default: 'contact',
							},
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'The ID of the contact',
							},
						],
					},
				],
				description: 'Filter by attendee',
			},
			{
				displayName: 'Done',
				name: 'done',
				type: 'boolean',
				default: false,
				description: 'Whether to filter on done status',
			},
			{
				displayName: 'Ends After',
				name: 'ends_after',
				type: 'dateTime',
				default: '',
				description: 'Start of the period for which to return events',
			},
			{
				displayName: 'Link',
				name: 'link',
				type: 'fixedCollection',
				placeholder: 'Add Link',
				default: {},
				options: [
					{
						displayName: 'Link',
						name: 'link',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Contact', value: 'contact' },
									{ name: 'Company', value: 'company' },
									{ name: 'Deal', value: 'deal' },
								],
								default: 'contact',
							},
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'The ID of the linked entity',
							},
						],
					},
				],
				description: 'Filter by linked entity',
			},
			{
				displayName: 'Starts Before',
				name: 'starts_before',
				type: 'dateTime',
				default: '',
				description: 'End of the period for which to return events',
			},
			{
				displayName: 'Task ID',
				name: 'task_id',
				type: 'string',
				default: '',
				description: 'Filter events by task ID',
			},
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
				description: 'Search for a term in title or description',
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
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: { show: { resource: ['event'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				type: 'options',
				options: [
					{ name: 'Starts At', value: 'starts_at' },
				],
				default: 'starts_at',
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
	//         event: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['event'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Activity Type Name or ID',
				name: 'activity_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getActivityTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Links',
				name: 'links',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Link',
				default: {},
				options: [
					{
						displayName: 'Link',
						name: 'link',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'Contact', value: 'contact' },
									{ name: 'Company', value: 'company' },
									{ name: 'Deal', value: 'deal' },
								],
								default: 'contact',
							},
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'The ID of the linked entity',
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
		],
	},
];
