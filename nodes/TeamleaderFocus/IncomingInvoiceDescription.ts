import type { INodeProperties } from 'n8n-workflow';

export const incomingInvoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['incomingInvoice'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add an incoming invoice' },
			{ name: 'Approve', value: 'approve', action: 'Approve an incoming invoice' },
			{ name: 'Delete', value: 'delete', action: 'Delete an incoming invoice' },
			{ name: 'Get', value: 'get', action: 'Get an incoming invoice' },
			{ name: 'List Payments', value: 'listPayments', action: 'List payments for incoming invoice' },
			{ name: 'Mark Pending', value: 'markPending', action: 'Mark incoming invoice as pending' },
			{ name: 'Refuse', value: 'refuse', action: 'Refuse an incoming invoice' },
			{ name: 'Register Payment', value: 'registerPayment', action: 'Register payment for incoming invoice' },
			{ name: 'Remove Payment', value: 'removePayment', action: 'Remove payment from incoming invoice' },
			{
				name: 'Send to Bookkeeping',
				value: 'sendToBookkeeping',
				action: 'Send incoming invoice to bookkeeping',
			},
			{ name: 'Update', value: 'update', action: 'Update an incoming invoice' },
			{ name: 'Update Payment', value: 'updatePayment', action: 'Update payment for incoming invoice' },
		],
		default: 'get',
	},
];

export const incomingInvoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         add
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['add'] } },
		description: 'Title of the incoming invoice',
	},
	{
		displayName: 'Department Name or ID',
		name: 'departmentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['add'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Currency Code',
		name: 'currencyCode',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['add'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['add'] } },
		options: [
			{
				displayName: 'Supplier Type',
				name: 'supplier_type',
				type: 'options',
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Company', value: 'company' },
				],
				default: 'company',
			},
			{
				displayName: 'Supplier ID',
				name: 'supplier_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Invoice Number',
				name: 'invoice_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Invoice Date',
				name: 'invoice_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Total Tax Exclusive',
				name: 'total_tax_exclusive',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				description: 'Total amount excluding tax',
			},
			{
				displayName: 'Total Tax Inclusive',
				name: 'total_tax_inclusive',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				description: 'Total amount including tax',
			},
		],
	},

	// ----------------------------------
	//         shared ID
	// ----------------------------------
	{
		displayName: 'Incoming Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['incomingInvoice'],
				operation: [
					'get',
					'update',
					'delete',
					'approve',
					'refuse',
					'markPending',
					'sendToBookkeeping',
					'listPayments',
					'registerPayment',
					'removePayment',
					'updatePayment',
				],
			},
		},
	},

	// ----------------------------------
	//         registerPayment
	// ----------------------------------
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: { numberPrecision: 2 },
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['registerPayment'] } },
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['registerPayment'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Paid At',
		name: 'paidAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['registerPayment'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'paymentAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['registerPayment'] } },
		options: [
			{
				displayName: 'Payment Method Name or ID',
				name: 'payment_method_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getPaymentMethods' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         removePayment
	// ----------------------------------
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['removePayment'] } },
	},

	// ----------------------------------
	//         updatePayment
	// ----------------------------------
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['updatePayment'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'paymentUpdateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['updatePayment'] } },
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Paid At',
				name: 'paid_at',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Payment Method Name or ID',
				name: 'payment_method_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getPaymentMethods' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingInvoice'], operation: ['update'] } },
		options: [
			{
				displayName: 'Invoice Number',
				name: 'invoice_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Invoice Date',
				name: 'invoice_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Total Tax Exclusive',
				name: 'total_tax_exclusive',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Total Tax Inclusive',
				name: 'total_tax_inclusive',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Currency Code',
				name: 'currency_code',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCurrencies' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},
];
