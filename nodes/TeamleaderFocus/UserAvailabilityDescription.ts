import type { INodeProperties } from 'n8n-workflow';

export const userAvailabilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['userAvailability'] } },
		options: [
			{ name: 'Get Daily', value: 'getDaily', action: 'Get daily user availability' },
			{ name: 'Get Total', value: 'getTotal', action: 'Get total user availability' },
		],
		default: 'getDaily',
	},
];

export const userAvailabilityFields: INodeProperties[] = [
	// ----------------------------------
	//         userAvailability: shared fields
	// ----------------------------------
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['userAvailability'], operation: ['getDaily', 'getTotal'] } },
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['userAvailability'], operation: ['getDaily', 'getTotal'] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['userAvailability'], operation: ['getDaily', 'getTotal'] } },
		options: [
			{
				displayName: 'Assignee IDs',
				name: 'assignees',
				type: 'string',
				default: '',
				description: 'Comma-separated list of user IDs to filter by',
			},
		],
	},
];
