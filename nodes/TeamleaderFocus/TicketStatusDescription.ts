import type { INodeProperties } from 'n8n-workflow';

export const ticketStatusOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ticketStatus'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many ticket statuses' },
		],
		default: 'getMany',
	},
];

export const ticketStatusFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['ticketStatus'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['ticketStatus'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
