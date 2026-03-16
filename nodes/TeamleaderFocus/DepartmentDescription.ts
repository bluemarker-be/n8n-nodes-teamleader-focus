import type { INodeProperties } from 'n8n-workflow';

export const departmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['department'] } },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a department' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many departments' },
		],
		default: 'getMany',
	},
];

export const departmentFields: INodeProperties[] = [
	{
		displayName: 'Department ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['department'], operation: ['get'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['department'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['department'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
