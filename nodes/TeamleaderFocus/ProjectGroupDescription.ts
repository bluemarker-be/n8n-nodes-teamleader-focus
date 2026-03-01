import type { INodeProperties } from 'n8n-workflow';

export const projectGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['projectGroup'] } },
		options: [
			{ name: 'Assign', value: 'assign', action: 'Assign user or team to project group' },
			{ name: 'Create', value: 'create', action: 'Create a project group' },
			{ name: 'Delete', value: 'delete', action: 'Delete a project group' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a project group' },
			{ name: 'Get', value: 'get', action: 'Get a project group' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many project groups' },
			{ name: 'Unassign', value: 'unassign', action: 'Unassign user or team from project group' },
			{ name: 'Update', value: 'update', action: 'Update a project group' },
		],
		default: 'getMany',
	},
];

export const projectGroupFields: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['projectGroup'],
				operation: ['create', 'getMany'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectGroup'], operation: ['create'] } },
	},
	{
		displayName: 'Group ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['projectGroup'],
				operation: ['get', 'delete', 'duplicate', 'update', 'assign', 'unassign'],
			},
		},
	},
	{
		displayName: 'Delete Strategy',
		name: 'deleteStrategy',
		type: 'options',
		options: [
			{ name: 'Ungroup Tasks and Materials', value: 'ungroup_tasks_and_materials' },
			{ name: 'Delete Tasks and Materials', value: 'delete_tasks_and_materials' },
			{ name: 'Delete Tasks, Materials and Unbilled Time Trackings', value: 'delete_tasks_materials_and_unbilled_timetrackings' },
		],
		required: true,
		default: 'ungroup_tasks_and_materials',
		displayOptions: { show: { resource: ['projectGroup'], operation: ['delete'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['projectGroup'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['projectGroup'], operation: ['getMany'], returnAll: [false] },
		},
	},
	// ----------------------------------
	//         projectGroup: assign / unassign
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
		displayOptions: { show: { resource: ['projectGroup'], operation: ['assign', 'unassign'] } },
	},
	{
		displayName: 'Assignee ID',
		name: 'assigneeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectGroup'], operation: ['assign', 'unassign'] } },
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['projectGroup'], operation: ['update'] } },
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
