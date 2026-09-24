import type { INodeProperties } from 'n8n-workflow';

export const dealSourceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dealSource'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many deal sources' },
		],
		default: 'getMany',
	},
];

export const dealSourceFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['dealSource'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['dealSource'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['dealSource'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
				description: 'Search in the deal source name',
			},
		],
	},
];
