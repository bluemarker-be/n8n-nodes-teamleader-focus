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
		default: '',
		displayOptions: { show: { resource: ['projectTask'], operation: ['create'] } },
		description: 'The project group to add this task to (optional)',
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
				displayName: 'Time Estimated (Value)',
				name: 'time_estimated_value',
				type: 'number',
				default: 0,
				description: 'Numeric value for the time estimate',
			},
			{
				displayName: 'Time Estimated (Unit)',
				name: 'time_estimated_unit',
				type: 'options',
				options: [
					{ name: 'Hours', value: 'hours' },
					{ name: 'Minutes', value: 'minutes' },
				],
				default: 'hours',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Start date of the task (YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'End date of the task (YYYY-MM-DD)',
			},
			{
				displayName: 'Billing Method',
				name: 'billing_method',
				type: 'options',
				options: [
					{ name: 'Time & Materials', value: 'time_and_materials' },
					{ name: 'Fixed Price', value: 'fixed_price' },
					{ name: 'Non-Billable', value: 'non_billable' },
				],
				default: 'time_and_materials',
			},
			{
				displayName: 'Fixed Price Amount',
				name: 'fixed_price_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Fixed Price Currency',
				name: 'fixed_price_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'External Budget Amount',
				name: 'external_budget_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'External Budget Currency',
				name: 'external_budget_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Internal Budget Amount',
				name: 'internal_budget_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Internal Budget Currency',
				name: 'internal_budget_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Assignees',
				name: 'assignees',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Assignee',
				default: {},
				options: [
					{
						displayName: 'Assignee',
						name: 'assignee',
						values: [
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{ name: 'User', value: 'user' },
								],
								default: 'user',
							},
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
								description: 'The ID of the user',
							},
						],
					},
				],
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
		default: 100,
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
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Start date of the task (YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'End date of the task (YYYY-MM-DD)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'To Do', value: 'to_do' },
					{ name: 'In Progress', value: 'in_progress' },
					{ name: 'On Hold', value: 'on_hold' },
					{ name: 'Done', value: 'done' },
				],
				default: 'to_do',
			},
			{
				displayName: 'Time Estimated (Value)',
				name: 'time_estimated_value',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Time Estimated (Unit)',
				name: 'time_estimated_unit',
				type: 'options',
				options: [
					{ name: 'Hours', value: 'hours' },
					{ name: 'Minutes', value: 'minutes' },
				],
				default: 'hours',
			},
			{
				displayName: 'Fixed Price Amount',
				name: 'fixed_price_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Fixed Price Currency',
				name: 'fixed_price_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'External Budget Amount',
				name: 'external_budget_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'External Budget Currency',
				name: 'external_budget_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Internal Budget Amount',
				name: 'internal_budget_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Internal Budget Currency',
				name: 'internal_budget_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},
];
