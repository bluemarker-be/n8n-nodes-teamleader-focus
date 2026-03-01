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
			{
				displayName: 'Unit Price Currency',
				name: 'unit_price_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'After ID',
				name: 'after_id',
				type: 'string',
				default: '',
				description: 'ID of the material after which to insert this one',
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
				displayName: 'Quantity Estimated',
				name: 'quantity_estimated',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Unit Cost Amount',
				name: 'unit_cost_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Unit Cost Currency',
				name: 'unit_cost_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				default: '',
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
				displayName: 'Unit Price Amount',
				name: 'unit_price_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Unit Price Currency',
				name: 'unit_price_currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				default: '',
			},
		],
	},
];
