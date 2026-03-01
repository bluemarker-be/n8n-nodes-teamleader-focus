import type { INodeProperties } from 'n8n-workflow';

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['subscription'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a subscription' },
			{ name: 'Deactivate', value: 'deactivate', action: 'Deactivate a subscription' },
			{ name: 'Get', value: 'get', action: 'Get a subscription' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many subscriptions' },
			{ name: 'Update', value: 'update', action: 'Update a subscription' },
		],
		default: 'getMany',
	},
];

export const subscriptionFields: INodeProperties[] = [
	// ----------------------------------
	//         subscription: create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
	},
	{
		displayName: 'Customer Type',
		name: 'customerType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'The ID of the contact or company',
	},
	{
		displayName: 'Department Name or ID',
		name: 'departmentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Invoicing Method',
		name: 'invoicingMethod',
		type: 'options',
		options: [
			{ name: 'Advance', value: 'advance' },
			{ name: 'Arrears', value: 'arrears' },
		],
		required: true,
		default: 'advance',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Whether to invoice in advance or in arrears',
	},
	{
		displayName: 'Billing Cycle',
		name: 'billingCycle',
		type: 'options',
		options: [
			{ name: 'Monthly', value: 'monthly' },
			{ name: 'Quarterly', value: 'quarterly' },
			{ name: 'Yearly', value: 'yearly' },
		],
		required: true,
		default: 'monthly',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		options: [
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'The ID of the related deal',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Starts On',
				name: 'starts_on',
				type: 'dateTime',
				default: '',
				description: 'The start date of the subscription',
			},
		],
	},

	// ----------------------------------
	//         subscription: get / update / deactivate
	// ----------------------------------
	{
		displayName: 'Subscription ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['get', 'update', 'deactivate'],
			},
		},
	},

	// ----------------------------------
	//         subscription: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['subscription'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['subscription'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['subscription'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Deactivated', value: 'deactivated' },
				],
				default: 'active',
			},
		],
	},

	// ----------------------------------
	//         subscription: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['subscription'], operation: ['update'] } },
		options: [
			{
				displayName: 'Billing Cycle',
				name: 'billing_cycle',
				type: 'options',
				options: [
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
					{ name: 'Yearly', value: 'yearly' },
				],
				default: 'monthly',
			},
			{
				displayName: 'Invoicing Method',
				name: 'invoicing_method',
				type: 'options',
				options: [
					{ name: 'Advance', value: 'advance' },
					{ name: 'Arrears', value: 'arrears' },
				],
				default: 'advance',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
		],
	},
];
