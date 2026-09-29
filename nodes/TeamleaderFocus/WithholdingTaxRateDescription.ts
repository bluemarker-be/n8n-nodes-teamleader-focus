import type { INodeProperties } from 'n8n-workflow';

export const withholdingTaxRateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['withholdingTaxRate'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many withholding tax rates' },
		],
		default: 'getMany',
	},
];

export const withholdingTaxRateFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['withholdingTaxRate'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['withholdingTaxRate'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
