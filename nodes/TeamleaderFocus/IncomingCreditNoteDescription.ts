import type { INodeProperties } from 'n8n-workflow';

export const incomingCreditNoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['incomingCreditNote'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add an incoming credit note' },
			{ name: 'Approve', value: 'approve', action: 'Approve an incoming credit note' },
			{ name: 'Delete', value: 'delete', action: 'Delete an incoming credit note' },
			{ name: 'Get', value: 'get', action: 'Get an incoming credit note' },
			{ name: 'List Payments', value: 'listPayments', action: 'List payments for incoming credit note' },
			{
				name: 'Mark Pending',
				value: 'markPending',
				action: 'Mark incoming credit note as pending',
			},
			{ name: 'Refuse', value: 'refuse', action: 'Refuse an incoming credit note' },
			{ name: 'Register Payment', value: 'registerPayment', action: 'Register payment for incoming credit note' },
			{ name: 'Remove Payment', value: 'removePayment', action: 'Remove payment from incoming credit note' },
			{
				name: 'Send to Bookkeeping',
				value: 'sendToBookkeeping',
				action: 'Send incoming credit note to bookkeeping',
			},
			{ name: 'Update', value: 'update', action: 'Update an incoming credit note' },
			{ name: 'Update Payment', value: 'updatePayment', action: 'Update payment for incoming credit note' },
		],
		default: 'get',
	},
];

export const incomingCreditNoteFields: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['add'] } },
		description: 'Title of the incoming credit note',
	},
	{
		displayName: 'Currency Code',
		name: 'currencyCode',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['add'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['add'] } },
		options: [
			{
				displayName: 'Supplier ID',
				name: 'supplier_id',
				type: 'string',
				default: '',
				description: 'ID of the supplier (company)',
			},
			{
				displayName: 'Document Number',
				name: 'document_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Invoice Date',
				name: 'invoice_date',
				type: 'dateTime',
				default: '',
				description: 'Date of the credit note',
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
			{
				displayName: 'Payment Reference',
				name: 'payment_reference',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IBAN Number',
				name: 'iban_number',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Incoming Credit Note ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['incomingCreditNote'],
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
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['registerPayment'] } },
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['registerPayment'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Paid At',
		name: 'paidAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['registerPayment'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'paymentAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['registerPayment'] } },
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
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['removePayment'] } },
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
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['updatePayment'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'paymentUpdateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['updatePayment'] } },
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
		displayOptions: { show: { resource: ['incomingCreditNote'], operation: ['update'] } },
		options: [
			{
				displayName: 'Title',
				name: 'title',
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
				displayName: 'Invoice Date',
				name: 'invoice_date',
				type: 'dateTime',
				default: '',
				description: 'Date of the credit note',
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
			{
				displayName: 'Payment Reference',
				name: 'payment_reference',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IBAN Number',
				name: 'iban_number',
				type: 'string',
				default: '',
			},
		],
	},
];
