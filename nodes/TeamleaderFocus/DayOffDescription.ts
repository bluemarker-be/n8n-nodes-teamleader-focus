import type { INodeProperties } from 'n8n-workflow';

export const dayOffOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dayOff'] } },
		options: [
			{ name: 'Bulk Delete', value: 'bulkDelete', action: 'Bulk delete days off' },
			{ name: 'Create Type', value: 'createType', action: 'Create a day off type' },
			{ name: 'Delete Type', value: 'deleteType', action: 'Delete a day off type' },
			{ name: 'Import', value: 'import', action: 'Import days off' },
			{ name: 'List Types', value: 'listTypes', action: 'List day off types' },
			{ name: 'Update Type', value: 'updateType', action: 'Update a day off type' },
		],
		default: 'listTypes',
	},
];

export const dayOffFields: INodeProperties[] = [
	{
		displayName: 'Days Off (JSON)',
		name: 'daysOff',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['dayOff'], operation: ['import', 'bulkDelete'] } },
		description: 'JSON array of day off objects',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['createType'] } },
	},
	{
		displayName: 'Type ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['dayOff'], operation: ['updateType', 'deleteType'] },
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['dayOff'], operation: ['updateType'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
		],
	},
];
