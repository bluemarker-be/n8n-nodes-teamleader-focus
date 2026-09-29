import type { INodeProperties } from 'n8n-workflow';

export const paymentTermOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['paymentTerm'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many payment terms' },
		],
		default: 'getMany',
	},
];

export const paymentTermFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['paymentTerm'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['paymentTerm'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
