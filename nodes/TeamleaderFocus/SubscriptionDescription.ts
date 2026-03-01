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
		displayName: 'Starts On',
		name: 'startsOn',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'The start date of the subscription (YYYY-MM-DD)',
	},
	{
		displayName: 'Billing Cycle (JSON)',
		name: 'billingCycle',
		type: 'json',
		required: true,
		default: '{"periodicity":"monthly","days_in_advance":0}',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Billing cycle object, e.g. {"periodicity":"monthly","days_in_advance":0}. Periodicity: monthly, quarterly, yearly.',
	},
	{
		displayName: 'Grouped Lines (JSON)',
		name: 'groupedLines',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Array of line item groups in JSON format',
	},
	{
		displayName: 'Payment Term (JSON)',
		name: 'paymentTerm',
		type: 'json',
		required: true,
		default: '{"type":"after_invoice_date","days":30}',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Payment term object, e.g. {"type":"after_invoice_date","days":30}',
	},
	{
		displayName: 'Invoice Generation (JSON)',
		name: 'invoiceGeneration',
		type: 'json',
		required: true,
		default: '{"action":"draft"}',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Invoice generation config, e.g. {"action":"draft"} or {"action":"book"}',
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
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'The ID of the related project',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Ends On',
				name: 'ends_on',
				type: 'dateTime',
				default: '',
				description: 'The end date of the subscription (YYYY-MM-DD)',
			},
			{
				displayName: 'Document Template Name or ID',
				name: 'document_template_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDocumentTemplates' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Billing Cycle (JSON)',
				name: 'billing_cycle',
				type: 'json',
				default: '',
				description: 'Billing cycle object, e.g. {"periodicity":"monthly","days_in_advance":0}',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Payment Term (JSON)',
				name: 'payment_term',
				type: 'json',
				default: '',
				description: 'Payment term object, e.g. {"type":"after_invoice_date","days":30}',
			},
			{
				displayName: 'Grouped Lines (JSON)',
				name: 'grouped_lines',
				type: 'json',
				default: '',
				description: 'Array of line item groups in JSON format',
			},
			{
				displayName: 'Ends On',
				name: 'ends_on',
				type: 'dateTime',
				default: '',
			},
		],
	},
];
