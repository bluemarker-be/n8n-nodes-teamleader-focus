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
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Credit Note', value: 'creditNote' },
			{ name: 'Deal', value: 'deal' },
			{ name: 'Invoice', value: 'invoice' },
			{ name: 'Nextgen Project', value: 'nextgenProject' },
			{ name: 'Ticket', value: 'ticket' },
			{ name: 'Temporary (Upload only)', value: 'temporary' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['file'], operation: ['getMany', 'upload'] } },
		description: 'Type of subject the file is linked to. "Temporary" is only valid on Upload and does not require a Subject ID (creates an unlinked file that expires after 24 hours).',
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['file'], operation: ['getMany', 'upload'] },
			hide: { subjectType: ['temporary'] },
		},
		description: 'Required for all subject types except Temporary',
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
