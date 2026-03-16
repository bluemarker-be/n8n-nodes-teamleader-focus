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
		displayName: 'Billing Cycle Unit',
		name: 'billingCycleUnit',
		type: 'options',
		options: [
			{ name: 'Week', value: 'week' },
			{ name: 'Month', value: 'month' },
			{ name: 'Year', value: 'year' },
		],
		required: true,
		default: 'month',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'The unit of the billing cycle',
	},
	{
		displayName: 'Billing Cycle Period',
		name: 'billingCyclePeriod',
		type: 'number',
		typeOptions: { minValue: 1 },
		required: true,
		default: 1,
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'The number of units per billing cycle (e.g. 1 month, 3 months)',
	},
	{
		displayName: 'Billing Cycle Days in Advance',
		name: 'billingCycleDaysInAdvance',
		type: 'options',
		options: [
			{ name: '0 Days', value: 0 },
			{ name: '7 Days', value: 7 },
			{ name: '14 Days', value: 14 },
			{ name: '21 Days', value: 21 },
			{ name: '28 Days', value: 28 },
		],
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'How many days before the billing period the invoice is generated',
	},
	{
		displayName: 'Grouped Lines (JSON)',
		name: 'groupedLines',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Array of line item groups in JSON format. Example: [{"section":{"title":"Section 1"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"currency":"EUR"},"tax":{"rate":0.21}}]}]',
	},
	{
		displayName: 'Payment Term Type',
		name: 'paymentTermType',
		type: 'options',
		options: [
			{ name: 'Cash', value: 'cash' },
			{ name: 'End of Month', value: 'end_of_month' },
			{ name: 'After Invoice Date', value: 'after_invoice_date' },
		],
		required: true,
		default: 'after_invoice_date',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
	},
	{
		displayName: 'Payment Term Days',
		name: 'paymentTermDays',
		type: 'number',
		typeOptions: { minValue: 0 },
		required: true,
		default: 30,
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Number of days for the payment term',
	},
	{
		displayName: 'Invoice Generation Action',
		name: 'invoiceGenerationAction',
		type: 'options',
		options: [
			{ name: 'Draft', value: 'draft' },
			{ name: 'Book', value: 'book' },
			{ name: 'Book and Send', value: 'book_and_send' },
		],
		required: true,
		default: 'draft',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'What to do when the invoice is generated',
	},
	{
		displayName: 'Invoice Generation Payment Method',
		name: 'invoiceGenerationPaymentMethod',
		type: 'options',
		options: [
			{ name: 'None', value: '' },
			{ name: 'Direct Debit', value: 'direct_debit' },
		],
		default: '',
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		description: 'Payment method for the generated invoice',
	},
	{
		displayName: 'Invoice Generation Sending Methods',
		name: 'invoiceGenerationSendingMethods',
		type: 'multiOptions',
		options: [
			{ name: 'Email', value: 'email' },
			{ name: 'Peppol', value: 'peppol' },
			{ name: 'Postal Service', value: 'postal_service' },
		],
		default: ['email'],
		displayOptions: { show: { resource: ['subscription'], operation: ['create'], invoiceGenerationAction: ['book_and_send'] } },
		description: 'Sending methods when action is "Book and Send"',
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
			{
				displayName: 'For Attention Of (Name)',
				name: 'for_attention_of_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'For Attention Of (Contact ID)',
				name: 'for_attention_of_contact_id',
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
		displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getSubscriptionCustomFields' },
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
		default: 100,
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
				type: 'multiOptions',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Deactivated', value: 'deactivated' },
				],
				default: [],
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
				displayName: 'Billing Cycle Unit',
				name: 'billing_cycle_unit',
				type: 'options',
				options: [
					{ name: 'Week', value: 'week' },
					{ name: 'Month', value: 'month' },
					{ name: 'Year', value: 'year' },
				],
				default: 'month',
				description: 'The unit of the billing cycle',
			},
			{
				displayName: 'Billing Cycle Period',
				name: 'billing_cycle_period',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				description: 'The number of units per billing cycle',
			},
			{
				displayName: 'Billing Cycle Days in Advance',
				name: 'billing_cycle_days_in_advance',
				type: 'options',
				options: [
					{ name: '0 Days', value: 0 },
					{ name: '7 Days', value: 7 },
					{ name: '14 Days', value: 14 },
					{ name: '21 Days', value: 21 },
					{ name: '28 Days', value: 28 },
				],
				default: 0,
				description: 'How many days before the billing period the invoice is generated',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Payment Term Type',
				name: 'payment_term_type',
				type: 'options',
				options: [
					{ name: 'Cash', value: 'cash' },
					{ name: 'End of Month', value: 'end_of_month' },
					{ name: 'After Invoice Date', value: 'after_invoice_date' },
				],
				default: 'after_invoice_date',
			},
			{
				displayName: 'Payment Term Days',
				name: 'payment_term_days',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 30,
				description: 'Number of days for the payment term',
			},
			{
				displayName: 'Grouped Lines (JSON)',
				name: 'grouped_lines',
				type: 'json',
				default: '',
				description: 'Array of line item groups in JSON format. Example: [{"section":{"title":"Section 1"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"currency":"EUR"},"tax":{"rate":0.21}}]}]',
			},
			{
				displayName: 'Ends On',
				name: 'ends_on',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Starts On',
				name: 'starts_on',
				type: 'dateTime',
				default: '',
				description: 'The start date of the subscription (YYYY-MM-DD)',
			},
			{
				displayName: 'Department Name or ID',
				name: 'department_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDepartments' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'The ID of the related project. Leave empty to unlink.',
			},
			{
				displayName: 'Deal ID',
				name: 'deal_id',
				type: 'string',
				default: '',
				description: 'The ID of the related deal. Leave empty to unlink.',
			},
			{
				displayName: 'Invoice Generation Action',
				name: 'invoice_generation_action',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Book', value: 'book' },
					{ name: 'Book and Send', value: 'book_and_send' },
				],
				default: 'draft',
				description: 'What to do when the invoice is generated',
			},
			{
				displayName: 'Invoice Generation Payment Method',
				name: 'invoice_generation_payment_method',
				type: 'options',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Direct Debit', value: 'direct_debit' },
				],
				default: '',
				description: 'Payment method for the generated invoice',
			},
			{
				displayName: 'Invoice Generation Sending Methods',
				name: 'invoice_generation_sending_methods',
				type: 'multiOptions',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'Peppol', value: 'peppol' },
					{ name: 'Postal Service', value: 'postal_service' },
				],
				default: [],
				description: 'Sending methods when action is "Book and Send"',
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
			{
				displayName: 'Customer Type',
				name: 'customer_type',
				type: 'options',
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Company', value: 'company' },
				],
				default: 'contact',
				description: 'Type of the invoicee customer',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'ID of the invoicee customer',
			},
			{
				displayName: 'For Attention Of (Name)',
				name: 'for_attention_of_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'For Attention Of (Contact ID)',
				name: 'for_attention_of_contact_id',
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
		displayOptions: { show: { resource: ['subscription'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getSubscriptionCustomFields' },
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
