import type { INodeProperties } from 'n8n-workflow';

export const receiptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['receipt'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add a receipt' },
			{ name: 'Approve', value: 'approve', action: 'Approve a receipt' },
			{ name: 'Delete', value: 'delete', action: 'Delete a receipt' },
			{ name: 'Get', value: 'get', action: 'Get a receipt' },
			{ name: 'List Payments', value: 'listPayments', action: 'List payments for a receipt' },
			{ name: 'Mark Pending', value: 'markPending', action: 'Mark receipt as pending' },
			{ name: 'Refuse', value: 'refuse', action: 'Refuse a receipt' },
			{ name: 'Register Payment', value: 'registerPayment', action: 'Register payment for a receipt' },
			{ name: 'Remove Payment', value: 'removePayment', action: 'Remove payment from a receipt' },
			{ name: 'Send to Bookkeeping', value: 'sendToBookkeeping', action: 'Send receipt to bookkeeping' },
			{ name: 'Update', value: 'update', action: 'Update a receipt' },
			{ name: 'Update Payment', value: 'updatePayment', action: 'Update payment for a receipt' },
		],
		default: 'get',
	},
];

export const receiptFields: INodeProperties[] = [
	// ----------------------------------
	//         receipt: add
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['receipt'], operation: ['add'] } },
	},
	{
		displayName: 'Currency',
		name: 'currencyCode',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['receipt'], operation: ['add'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['receipt'], operation: ['add'] } },
		options: [
			{
				displayName: 'Supplier ID',
				name: 'supplier_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Document Number',
				name: 'document_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Receipt Date',
				name: 'receipt_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Total Amount',
				name: 'total_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
			},
			{
				displayName: 'Company Entity ID',
				name: 'company_entity_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'File ID',
				name: 'file_id',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         receipt: shared ID
	// ----------------------------------
	{
		displayName: 'Receipt ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['receipt'],
				operation: [
					'get',
					'delete',
					'approve',
					'refuse',
					'markPending',
					'sendToBookkeeping',
					'update',
					'listPayments',
					'registerPayment',
					'removePayment',
					'updatePayment',
				],
			},
		},
	},

	// ----------------------------------
	//         receipt: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['receipt'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Supplier ID',
				name: 'supplier_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Document Number',
				name: 'document_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Receipt Date',
				name: 'receipt_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Total Tax Inclusive Amount',
				name: 'total_tax_inclusive_amount',
				type: 'number',
				typeOptions: { numberPrecision: 2 },
				default: 0,
				description: 'Total amount including tax',
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
			{
				displayName: 'Company Entity ID',
				name: 'company_entity_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'File ID',
				name: 'file_id',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         receipt: registerPayment
	// ----------------------------------
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: { numberPrecision: 2 },
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['receipt'], operation: ['registerPayment'] } },
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['receipt'], operation: ['registerPayment'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Paid At',
		name: 'paidAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['receipt'], operation: ['registerPayment'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'paymentAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['receipt'], operation: ['registerPayment'] } },
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
	//         receipt: removePayment
	// ----------------------------------
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['receipt'], operation: ['removePayment'] } },
	},

	// ----------------------------------
	//         receipt: updatePayment
	// ----------------------------------
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['receipt'], operation: ['updatePayment'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'paymentUpdateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['receipt'], operation: ['updatePayment'] } },
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
];
