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
	// ----------------------------------
	//         dayOff: import
	// ----------------------------------
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['import'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Leave Type Name or ID',
		name: 'leaveTypeId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDayOffTypes' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['import'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Days (JSON)',
		name: 'days',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['dayOff'], operation: ['import'] } },
		description: 'JSON array of day objects, e.g. [{"date":"2024-01-15","hours":8}]',
	},

	// ----------------------------------
	//         dayOff: bulkDelete
	// ----------------------------------
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['bulkDelete'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Day Off IDs (JSON)',
		name: 'dayOffIds',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['dayOff'], operation: ['bulkDelete'] } },
		description: 'JSON array of day off IDs to delete, e.g. ["id1","id2"]',
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
