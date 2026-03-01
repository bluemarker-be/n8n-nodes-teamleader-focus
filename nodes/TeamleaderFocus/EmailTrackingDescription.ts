import type { INodeProperties } from 'n8n-workflow';

export const emailTrackingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['emailTracking'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create an email tracking link' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many email tracking links' },
		],
		default: 'getMany',
	},
];

export const emailTrackingFields: INodeProperties[] = [
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['emailTracking'], operation: ['create'] } },
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['emailTracking'], operation: ['create'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['emailTracking'], operation: ['create'] } },
		description: 'The URL to track',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['emailTracking'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['emailTracking'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
