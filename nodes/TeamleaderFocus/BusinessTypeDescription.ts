import type { INodeProperties } from 'n8n-workflow';

export const businessTypeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['businessType'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many business types for a country',
			},
		],
		default: 'getMany',
	},
];

export const businessTypeFields: INodeProperties[] = [
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		required: true,
		default: 'BE',
		displayOptions: { show: { resource: ['businessType'], operation: ['getMany'] } },
		description: 'The country code (e.g. BE, NL, DE) — business types are per-country',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['businessType'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['businessType'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
