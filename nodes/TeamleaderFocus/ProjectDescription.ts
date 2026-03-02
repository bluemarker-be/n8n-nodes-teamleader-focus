import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['project'] } },
		options: [
			{ name: 'Add Customer', value: 'addCustomer', action: 'Add customer to project' },
			{ name: 'Add Deal', value: 'addDeal', action: 'Add deal to project' },
			{ name: 'Add Owner', value: 'addOwner', action: 'Add owner to project' },
			{ name: 'Add Quotation', value: 'addQuotation', action: 'Add quotation to project' },
			{ name: 'Assign', value: 'assign', action: 'Assign user or team to project' },
			{ name: 'Close', value: 'close', action: 'Close a project' },
			{ name: 'Create', value: 'create', action: 'Create a project' },
			{ name: 'Delete', value: 'delete', action: 'Delete a project' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a project' },
			{ name: 'Get', value: 'get', action: 'Get a project' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many projects' },
			{ name: 'Remove Customer', value: 'removeCustomer', action: 'Remove customer from project' },
			{ name: 'Remove Deal', value: 'removeDeal', action: 'Remove deal from project' },
			{ name: 'Remove Owner', value: 'removeOwner', action: 'Remove owner from project' },
			{ name: 'Remove Quotation', value: 'removeQuotation', action: 'Remove quotation from project' },
			{ name: 'Reopen', value: 'reopen', action: 'Reopen a project' },
			{ name: 'Unassign', value: 'unassign', action: 'Unassign user or team from project' },
			{ name: 'Update', value: 'update', action: 'Update a project' },
		],
		default: 'getMany',
	},
];

export const projectFields: INodeProperties[] = [
	// ----------------------------------
	//         project: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['create'] } },
	},
	{
		displayName: 'Billing Method',
		name: 'billingMethod',
		type: 'options',
		options: [
			{ name: 'Time & Materials', value: 'time_and_materials' },
			{ name: 'Fixed Price', value: 'fixed_price' },
			{ name: 'Non-Billable', value: 'non_billable' },
		],
		required: true,
		default: 'time_and_materials',
		displayOptions: { show: { resource: ['project'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
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
				displayName: 'Color',
				name: 'color',
				type: 'options',
				options: [
					{ name: 'Teal', value: '#00B2B2' },
					{ name: 'Dark Teal', value: '#008A8C' },
					{ name: 'Brown', value: '#992600' },
					{ name: 'Orange', value: '#ED9E00' },
					{ name: 'Pink', value: '#D157D3' },
					{ name: 'Purple', value: '#A400B2' },
					{ name: 'Blue', value: '#0071F2' },
					{ name: 'Dark Blue', value: '#004DA6' },
					{ name: 'Grey Blue', value: '#64788F' },
					{ name: 'Silver', value: '#C0C0C4' },
					{ name: 'Grey', value: '#82828C' },
					{ name: 'Black', value: '#1A1C20' },
				],
				default: '#00B2B2',
			},
			{
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Owner Names or IDs',
				name: 'owner_ids',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: [],
				description: 'Users to set as project owners. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Time Budget (Value)',
				name: 'time_budget_value',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Time Budget (Unit)',
				name: 'time_budget_unit',
				type: 'options',
				options: [
					{ name: 'Hours', value: 'hours' },
					{ name: 'Minutes', value: 'minutes' },
				],
				default: 'hours',
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
				displayName: 'Company Entity ID',
				name: 'company_entity_id',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getProjectCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description:
							'Value for the custom field. For single_select: use the option ID (see Field Name description). For multi_select: use an expression returning a JSON array of option IDs. For other types: enter the value directly.',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         project: get / update / delete / close / reopen / duplicate + relationship ops
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'update', 'delete', 'close', 'reopen', 'duplicate', 'addOwner', 'removeOwner', 'assign', 'unassign', 'addCustomer', 'removeCustomer', 'addDeal', 'removeDeal', 'addQuotation', 'removeQuotation'],
			},
		},
	},

	// ----------------------------------
	//         project: duplicate
	// ----------------------------------
	{
		displayName: 'Duplicate Title',
		name: 'duplicateTitle',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['duplicate'] } },
		description: 'Title for the duplicated project',
	},

	// ----------------------------------
	//         project: close
	// ----------------------------------
	{
		displayName: 'Closing Strategy',
		name: 'closingStrategy',
		type: 'options',
		options: [
			{ name: 'Mark Tasks and Materials as Done', value: 'mark_tasks_and_materials_as_done' },
			{ name: 'None', value: 'none' },
		],
		required: true,
		default: 'mark_tasks_and_materials_as_done',
		displayOptions: { show: { resource: ['project'], operation: ['close'] } },
	},

	// ----------------------------------
	//         project: delete
	// ----------------------------------
	{
		displayName: 'Delete Strategy',
		name: 'deleteStrategy',
		type: 'options',
		options: [
			{ name: 'Unlink Tasks and Time Trackings', value: 'unlink_tasks_and_time_trackings' },
			{ name: 'Delete Tasks and Time Trackings', value: 'delete_tasks_and_time_trackings' },
			{ name: 'Delete Tasks, Unlink Time Trackings', value: 'delete_tasks_unlink_time_trackings' },
		],
		required: true,
		default: 'unlink_tasks_and_time_trackings',
		displayOptions: { show: { resource: ['project'], operation: ['delete'] } },
	},

	// ----------------------------------
	//         project: addOwner / removeOwner
	// ----------------------------------
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['addOwner', 'removeOwner'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	// ----------------------------------
	//         project: assign / unassign
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
		displayOptions: { show: { resource: ['project'], operation: ['assign', 'unassign'] } },
	},
	{
		displayName: 'Assignee ID',
		name: 'assigneeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['assign', 'unassign'] } },
	},

	// ----------------------------------
	//         project: addCustomer / removeCustomer
	// ----------------------------------
	{
		displayName: 'Customer Type',
		name: 'customerType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
		],
		required: true,
		default: 'company',
		displayOptions: { show: { resource: ['project'], operation: ['addCustomer', 'removeCustomer'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['addCustomer', 'removeCustomer'] } },
	},

	// ----------------------------------
	//         project: addDeal / removeDeal
	// ----------------------------------
	{
		displayName: 'Deal ID',
		name: 'dealId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['addDeal', 'removeDeal'] } },
	},

	// ----------------------------------
	//         project: addQuotation / removeQuotation
	// ----------------------------------
	{
		displayName: 'Quotation ID',
		name: 'quotationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['addQuotation', 'removeQuotation'] } },
	},

	// ----------------------------------
	//         project: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['project'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['project'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Closed', value: 'closed' },
				],
				default: 'active',
			},
		],
	},

	// ----------------------------------
	//         project: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['update'] } },
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
				displayName: 'Billing Method',
				name: 'billing_method_value',
				type: 'options',
				options: [
					{ name: 'Time & Materials', value: 'time_and_materials' },
					{ name: 'Fixed Price', value: 'fixed_price' },
					{ name: 'Non-Billable', value: 'non_billable' },
				],
				default: 'time_and_materials',
			},
			{
				displayName: 'Billing Method Update Strategy',
				name: 'billing_method_update_strategy',
				type: 'options',
				options: [
					{ name: 'None (Project Only)', value: 'none' },
					{ name: 'Cascade (Apply to Tasks/Materials)', value: 'cascade' },
				],
				default: 'none',
				description: 'How to apply the billing method change to existing tasks and materials',
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
				displayName: 'Color',
				name: 'color',
				type: 'options',
				options: [
					{ name: 'Teal', value: '#00B2B2' },
					{ name: 'Dark Teal', value: '#008A8C' },
					{ name: 'Brown', value: '#992600' },
					{ name: 'Orange', value: '#ED9E00' },
					{ name: 'Pink', value: '#D157D3' },
					{ name: 'Purple', value: '#A400B2' },
					{ name: 'Blue', value: '#0071F2' },
					{ name: 'Dark Blue', value: '#004DA6' },
					{ name: 'Grey Blue', value: '#64788F' },
					{ name: 'Silver', value: '#C0C0C4' },
					{ name: 'Grey', value: '#82828C' },
					{ name: 'Black', value: '#1A1C20' },
				],
				default: '#00B2B2',
			},
			{
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Time Budget (Value)',
				name: 'time_budget_value',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Time Budget (Unit)',
				name: 'time_budget_unit',
				type: 'options',
				options: [
					{ name: 'Hours', value: 'hours' },
					{ name: 'Minutes', value: 'minutes' },
				],
				default: 'hours',
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
				displayName: 'Company Entity ID',
				name: 'company_entity_id',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getProjectCustomFields' },
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description:
							'Value for the custom field. For single_select: use the option ID (see Field Name description). For multi_select: use an expression returning a JSON array of option IDs. For other types: enter the value directly.',
					},
				],
			},
		],
	},
];
