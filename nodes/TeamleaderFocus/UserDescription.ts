import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a user' },
			{ name: 'Get Current', value: 'getCurrent', action: 'Get current user' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many users' },
			{
				name: 'Get Week Schedule (Deprecated)',
				value: 'getWeekSchedule',
				action: 'Get week schedule (deprecated)',
			},
			{ name: 'List Days Off', value: 'listDaysOff', action: 'List days off for user' },
			{ name: 'List Schedules', value: 'listSchedules', action: 'List schedules for users' },
		],
		default: 'getCurrent',
	},
];

export const userFields: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['user'], operation: ['get', 'getWeekSchedule', 'listDaysOff'] },
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['user'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['user'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['listDaysOff'] } },
		options: [
			{
				displayName: 'Starts After',
				name: 'starts_after',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Ends Before',
				name: 'ends_before',
				type: 'dateTime',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         user: listSchedules
	// ----------------------------------
	{
		displayName: 'User Names or IDs',
		name: 'userIds',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: [],
		displayOptions: { show: { resource: ['user'], operation: ['listSchedules'] } },
		description:
			'The users whose working schedules to return. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'From',
		name: 'from',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['listSchedules'] } },
		description: 'Start of the date range (inclusive)',
	},
	{
		displayName: 'Until',
		name: 'until',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['listSchedules'] } },
		description: 'End of the date range (inclusive). Must be on or after From, and the range may span at most 7 days.',
	},
];
