import type { INodeProperties } from 'n8n-workflow';

export const projectLineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['projectLine'] } },
		options: [
			{ name: 'Add to Group', value: 'addToGroup', action: 'Add project line to group' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many project lines' },
			{ name: 'Remove from Group', value: 'removeFromGroup', action: 'Remove project line from group' },
		],
		default: 'getMany',
	},
];

export const projectLineFields: INodeProperties[] = [
	// ----------------------------------
	//         projectLine: getMany
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectLine'], operation: ['getMany'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['projectLine'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['projectLine'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['projectLine'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Types',
				name: 'types',
				type: 'string',
				default: '',
				description: 'Comma-separated list of line types (e.g. task,material)',
			},
		],
	},

	// ----------------------------------
	//         projectLine: addToGroup
	// ----------------------------------
	{
		displayName: 'Line ID',
		name: 'lineId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectLine'], operation: ['addToGroup'] } },
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectLine'], operation: ['addToGroup'] } },
	},

	// ----------------------------------
	//         projectLine: removeFromGroup
	// ----------------------------------
	{
		displayName: 'Line ID',
		name: 'lineId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectLine'], operation: ['removeFromGroup'] } },
	},
];
