import type { INodeProperties } from 'n8n-workflow';

export const currencyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['currency'] } },
		options: [
			{
				name: 'Get Exchange Rates',
				value: 'getExchangeRates',
				action: 'Get exchange rates for a currency',
			},
		],
		default: 'getExchangeRates',
	},
];

export const currencyFields: INodeProperties[] = [
	{
		displayName: 'Base Currency',
		name: 'base',
		type: 'string',
		required: true,
		default: 'EUR',
		displayOptions: { show: { resource: ['currency'], operation: ['getExchangeRates'] } },
		description: 'The base currency code (e.g. EUR, USD, GBP)',
	},
];
