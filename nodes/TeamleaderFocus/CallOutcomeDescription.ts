import type { INodeProperties } from 'n8n-workflow';

export const callOutcomeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['callOutcome'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many call outcomes' },
		],
		default: 'getMany',
	},
];

export const callOutcomeFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['callOutcome'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['callOutcome'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
