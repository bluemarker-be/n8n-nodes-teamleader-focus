import type { INodeProperties } from 'n8n-workflow';

export const cloudPlatformOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cloudPlatform'] } },
		options: [
			{
				name: 'Get URL',
				value: 'getUrl',
				action: 'Get a cloud platform URL for a document',
			},
		],
		default: 'getUrl',
	},
];

export const cloudPlatformFields: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Invoice', value: 'invoice' },
			{ name: 'Quotation', value: 'quotation' },
			{ name: 'Ticket', value: 'ticket' },
		],
		required: true,
		default: 'invoice',
		displayOptions: { show: { resource: ['cloudPlatform'], operation: ['getUrl'] } },
		description: 'The type of document to get the cloud platform URL for',
	},
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['cloudPlatform'], operation: ['getUrl'] } },
		description: 'The ID of the document',
	},
];
