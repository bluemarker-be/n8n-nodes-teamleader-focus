import type { INodeProperties } from 'n8n-workflow';

export const reservationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['reservation'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a reservation' },
			{ name: 'Delete', value: 'delete', action: 'Delete a reservation' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many reservations' },
			{ name: 'Update', value: 'update', action: 'Update a reservation' },
		],
		default: 'getMany',
	},
];

export const reservationFields: INodeProperties[] = [
	// ----------------------------------
	//         reservation: create
	// ----------------------------------
	{
		displayName: 'Plannable Item ID',
		name: 'plannableItemId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['reservation'], operation: ['create'] } },
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['reservation'], operation: ['create'] } },
		description: 'Date in YYYY-MM-DD format',
	},
	{
		displayName: 'Duration (Minutes)',
		name: 'durationValue',
		type: 'number',
		required: true,
		default: 60,
		displayOptions: { show: { resource: ['reservation'], operation: ['create'] } },
	},
	{
		displayName: 'Assignee Type',
		name: 'assigneeType',
		type: 'options',
		options: [
			{ name: 'User', value: 'user' },
			{ name: 'Team', value: 'team' },
		],
		required: true,
		default: 'user',
		displayOptions: { show: { resource: ['reservation'], operation: ['create'] } },
	},
	{
		displayName: 'Assignee ID',
		name: 'assigneeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['reservation'], operation: ['create'] } },
	},

	// ----------------------------------
	//         reservation: delete / update
	// ----------------------------------
	{
		displayName: 'Reservation ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['reservation'], operation: ['delete', 'update'] },
		},
	},

	// ----------------------------------
	//         reservation: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['reservation'], operation: ['update'] } },
		options: [
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Duration (Minutes)',
				name: 'duration_value',
				type: 'number',
				default: 60,
			},
			{
				displayName: 'Assignee Type',
				name: 'assignee_type',
				type: 'options',
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Team', value: 'team' },
				],
				default: 'user',
			},
			{
				displayName: 'Assignee ID',
				name: 'assignee_id',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         reservation: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['reservation'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['reservation'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['reservation'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Plannable Item IDs',
				name: 'plannable_item_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of plannable item IDs',
			},
			{
				displayName: 'Project IDs',
				name: 'project_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs',
			},
			{
				displayName: 'Work Type IDs',
				name: 'work_type_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of work type IDs',
			},
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
				description: 'Search term (matches reservation title)',
			},
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
];
