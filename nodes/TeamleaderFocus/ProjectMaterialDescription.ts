import type { INodeProperties } from 'n8n-workflow';

export const projectMaterialOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['projectMaterial'] } },
		options: [
			{ name: 'Assign', value: 'assign', action: 'Assign user or team to project material' },
			{ name: 'Create', value: 'create', action: 'Create a project material' },
			{ name: 'Delete', value: 'delete', action: 'Delete a project material' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a project material' },
			{ name: 'Get', value: 'get', action: 'Get a project material' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many project materials' },
			{ name: 'Unassign', value: 'unassign', action: 'Unassign user or team from project material' },
			{ name: 'Update', value: 'update', action: 'Update a project material' },
		],
		default: 'getMany',
	},
];

export const projectMaterialFields: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['projectMaterial'], operation: ['create', 'getMany'] },
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['create'] } },
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 1,
			},
			{
				displayName: 'Unit Price Amount',
				name: 'unit_price_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
		],
	},
	{
		displayName: 'Material ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['projectMaterial'],
				operation: ['get', 'delete', 'duplicate', 'update', 'assign', 'unassign'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['projectMaterial'], operation: ['getMany'], returnAll: [false] },
		},
	},
	// ----------------------------------
	//         projectMaterial: assign / unassign
	// ----------------------------------
	{
		displayName: 'Assignee Type',
		name: 'assigneeType',
		type: 'options',
		options: [
			{ name: 'User', value: 'user' },
			{ name: 'Team', value: 'team' },
		],
		required: true,
		default: 'user',
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['assign', 'unassign'] } },
	},
	{
		displayName: 'Assignee ID',
		name: 'assigneeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['assign', 'unassign'] } },
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['projectMaterial'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 1,
			},
		],
	},
];
