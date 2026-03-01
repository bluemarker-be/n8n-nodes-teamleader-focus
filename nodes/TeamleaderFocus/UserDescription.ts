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
			{ name: 'Get Week Schedule', value: 'getWeekSchedule', action: 'Get week schedule' },
			{ name: 'List Days Off', value: 'listDaysOff', action: 'List days off for user' },
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
		default: 20,
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
		],
	},
];
