import type { INodeProperties } from 'n8n-workflow';

export const levelTwoAreaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['levelTwoArea'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get provinces/states for a country',
			},
		],
		default: 'getMany',
	},
];

export const levelTwoAreaFields: INodeProperties[] = [
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		required: true,
		default: 'BE',
		displayOptions: { show: { resource: ['levelTwoArea'], operation: ['getMany'] } },
		description: 'The country code (e.g. BE, NL, DE)',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['levelTwoArea'], operation: ['getMany'] } },
		description: 'Language for the area names (e.g. nl, fr, en). If not provided, the primary language of the country is used.',
	},
];
