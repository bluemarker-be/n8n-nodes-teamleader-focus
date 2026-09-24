import type { INodeProperties } from 'n8n-workflow';

export const fileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['file'] } },
		options: [
			{ name: 'Delete', value: 'delete', action: 'Delete a file' },
			{ name: 'Download', value: 'download', action: 'Download a file' },
			{ name: 'Get', value: 'get', action: 'Get a file' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many files' },
			{ name: 'Upload', value: 'upload', action: 'Upload a file' },
		],
		default: 'getMany',
	},
];

export const fileFields: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['file'], operation: ['get', 'delete', 'download'] },
		},
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
			{ name: 'Deal', value: 'deal' },
			{ name: 'Project', value: 'project' },
			{ name: 'Ticket', value: 'ticket' },
			{ name: 'Temporary (Upload only)', value: 'temporary' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['file'], operation: ['getMany', 'upload'] } },
		description: 'Use "Temporary" only with Upload — creates a file not linked to any subject. Subject ID is ignored for temporary uploads.',
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['file'], operation: ['getMany', 'upload'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['file'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['file'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['file'], operation: ['upload'] } },
		description: 'Name of the binary property containing the file to upload',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['file'], operation: ['upload'] } },
		description: 'Override the file name (optional)',
	},
	{
		displayName: 'Binary Property (Output)',
		name: 'downloadBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['file'], operation: ['download'] } },
		description: 'Name of the binary property to write the downloaded file to',
	},
];
