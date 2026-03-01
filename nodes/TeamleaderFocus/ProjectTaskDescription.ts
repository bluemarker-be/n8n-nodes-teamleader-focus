import type { INodeProperties } from 'n8n-workflow';

export const projectTaskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['projectTask'] } },
		options: [
			{ name: 'Assign', value: 'assign', action: 'Assign user or team to project task' },
			{ name: 'Create', value: 'create', action: 'Create a project task' },
			{ name: 'Delete', value: 'delete', action: 'Delete a project task' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a project task' },
			{ name: 'Get', value: 'get', action: 'Get a project task' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many project tasks' },
			{ name: 'Unassign', value: 'unassign', action: 'Unassign user or team from project task' },
			{ name: 'Update', value: 'update', action: 'Update a project task' },
		],
		default: 'getMany',
	},
];

export const projectTaskFields: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['projectTask'], operation: ['create', 'getMany'] },
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectTask'], operation: ['create'] } },
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectTask'], operation: ['create'] } },
		description: 'The project group to add this task to',
	},
	{
		displayName: 'Delete Strategy',
		name: 'deleteStrategy',
		type: 'options',
		options: [
			{ name: 'Unlink Time Tracking', value: 'unlink_time_tracking' },
			{ name: 'Delete Time Tracking', value: 'delete_time_tracking' },
		],
		required: true,
		default: 'unlink_time_tracking',
		displayOptions: { show: { resource: ['projectTask'], operation: ['delete'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['projectTask'], operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Work Type Name or ID',
				name: 'work_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getWorkTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Estimated Duration (seconds)',
				name: 'estimated_duration',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
			},
		],
	},
	{
		displayName: 'Task ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['projectTask'],
				operation: ['get', 'delete', 'duplicate', 'update', 'assign', 'unassign'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['projectTask'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['projectTask'], operation: ['getMany'], returnAll: [false] },
		},
	},
	// ----------------------------------
	//         projectTask: assign / unassign
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
		displayOptions: { show: { resource: ['projectTask'], operation: ['assign', 'unassign'] } },
	},
	{
		displayName: 'Assignee ID',
		name: 'assigneeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['projectTask'], operation: ['assign', 'unassign'] } },
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['projectTask'], operation: ['update'] } },
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
				displayName: 'Work Type Name or ID',
				name: 'work_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getWorkTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
			},
		],
	},
];
