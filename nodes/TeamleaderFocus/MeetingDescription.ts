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
				displayName: 'Attendees (JSON)',
				name: 'attendees',
				type: 'json',
				default: '[]',
				description: 'JSON array of attendee objects, e.g. [{"type":"contact","id":"..."}]',
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
				displayName: 'Starts After',
				name: 'starts_after',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Starts Before',
				name: 'starts_before',
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
				displayName: 'Attendees (JSON)',
				name: 'attendees',
				type: 'json',
				default: '[]',
				description: 'JSON array of attendee objects, e.g. [{"type":"contact","id":"..."}]',
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
	//         meeting: createReport
	// ----------------------------------
	{
		displayName: 'Report Body',
		name: 'reportBody',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['meeting'], operation: ['createReport'] } },
		description: 'The content of the meeting report',
	},
];
