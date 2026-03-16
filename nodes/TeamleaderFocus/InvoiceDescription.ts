import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['invoice'] } },
		options: [
			{ name: 'Book', value: 'book', action: 'Book an invoice' },
			{ name: 'Copy', value: 'copy', action: 'Copy an invoice' },
			{ name: 'Credit', value: 'credit', action: 'Credit an invoice' },
			{
				name: 'Credit Partially',
				value: 'creditPartially',
				action: 'Partially credit an invoice',
			},
			{ name: 'Download', value: 'download', action: 'Download an invoice' },
			{ name: 'Draft', value: 'draft', action: 'Draft an invoice' },
			{ name: 'Get', value: 'get', action: 'Get an invoice' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many invoices' },
			{
				name: 'Register Payment',
				value: 'registerPayment',
				action: 'Register a payment for an invoice',
			},
			{
				name: 'Remove Payments',
				value: 'removePayments',
				action: 'Remove payments from an invoice',
			},
			{ name: 'Delete', value: 'delete', action: 'Delete an invoice' },
		{ name: 'Send', value: 'send', action: 'Send an invoice' },
		{ name: 'Send via Peppol', value: 'sendViaPeppol', action: 'Send an invoice via Peppol' },
			{ name: 'Update', value: 'update', action: 'Update a draft invoice' },
			{
				name: 'Update Booked',
				value: 'updateBooked',
				action: 'Update a booked invoice',
			},
		],
		default: 'getMany',
	},
];

export const invoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         invoice: draft
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
		default: 'contact',
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
		description: 'The ID of the contact or company',
	},
	{
		displayName: 'Department Name or ID',
		name: 'departmentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
	},
	{
		displayName: 'Payment Term Days',
		name: 'paymentTermDays',
		type: 'number',
		typeOptions: { minValue: 0 },
		required: true,
		default: 30,
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
		description: 'Number of days for the payment term',
	},
	{
		displayName: 'Grouped Lines (JSON)',
		name: 'groupedLines',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
		description: 'Array of line item groups in JSON format. Example: [{"section":{"title":"Section 1"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"currency":"EUR"},"tax":{"rate":0.21}}]}]',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
		options: [
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
				displayName: 'Delivery Date',
				name: 'delivery_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Discounts',
				name: 'discounts',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Discount',
				default: {},
				options: [
					{
						displayName: 'Discount',
						name: 'discount',
						values: [
							{
								displayName: 'Value (%)',
								name: 'value',
								type: 'number',
								typeOptions: { minValue: 0, maxValue: 100, numberPrecision: 2 },
								default: 0,
								description: 'Discount percentage (0-100)',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Description of the discount',
							},
						],
					},
				],
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
				displayName: 'Expected Payment Method',
				name: 'expected_payment_method_method',
				type: 'options',
				options: [
					{ name: 'SEPA Direct Debit', value: 'sepa_direct_debit' },
					{ name: 'Direct Debit', value: 'direct_debit' },
					{ name: 'Credit Card', value: 'credit_card' },
				],
				default: 'sepa_direct_debit',
				description: 'The expected payment method',
			},
			{
				displayName: 'Expected Payment Method Reference',
				name: 'expected_payment_method_reference',
				type: 'string',
				default: '',
				description: 'Reference for the expected payment method (e.g. mandate reference)',
			},
			{
				displayName: 'Invoice Date',
				name: 'invoice_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'The ID of the related project',
			},
			{
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'For Attention Of (Name)',
				name: 'for_attention_of_name',
				type: 'string',
				default: '',
				description: 'Name of the person to address the invoice to (free text)',
			},
			{
				displayName: 'For Attention Of (Contact ID)',
				name: 'for_attention_of_contact_id',
				type: 'string',
				default: '',
				description: 'Contact ID of the person to address the invoice to',
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
		displayOptions: { show: { resource: ['invoice'], operation: ['draft'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getInvoiceCustomFields' },
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
	//         invoice: get / update / updateBooked / book / send / credit / removePayments / registerPayment / creditPartially / download
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: [
					'get',
					'update',
					'updateBooked',
					'book',
					'copy',
					'send',
					'sendViaPeppol',
					'credit',
					'removePayments',
					'registerPayment',
					'creditPartially',
					'download',
					'delete',
				],
			},
		},
	},

	// ----------------------------------
	//         invoice: book
	// ----------------------------------
	{
		displayName: 'Book Date',
		name: 'bookDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['book'] } },
		description: 'The date on which the invoice is booked (YYYY-MM-DD)',
	},

	// ----------------------------------
	//         invoice: send
	// ----------------------------------
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		description: 'The email address to send from',
	},
	{
		displayName: 'Recipients (To)',
		name: 'recipientsTo',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		description: 'JSON array of recipient objects. Each can have a customer reference or an email address. Example: [{"customer":{"type":"contact","id":"abc-123"},"email_address":"name@example.com"}]',
	},
	{
		displayName: 'Subject',
		name: 'emailSubject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
	},
	{
		displayName: 'Body',
		name: 'emailBody',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		description: 'The email body content',
	},
	{
		displayName: 'Additional Send Fields',
		name: 'sendAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		options: [
			{
				displayName: 'CC',
				name: 'cc',
				type: 'json',
				default: '[]',
				description: 'JSON array of CC recipients. Example: [{"email_address":"name@example.com","customer":{"type":"contact","id":"abc-123"}}]',
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'json',
				default: '[]',
				description: 'JSON array of BCC recipients. Example: [{"email_address":"name@example.com"}]',
			},
		],
	},

	// ----------------------------------
	//         invoice: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['invoice'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['invoice'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['getMany'] } },
		options: [
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
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Outstanding', value: 'outstanding' },
					{ name: 'Matched', value: 'matched' },
				],
				default: [],
			},
			{
				displayName: 'Updated Since',
				name: 'updated_since',
				type: 'dateTime',
				default: '',
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				type: 'options',
				options: [
					{ name: 'Invoice Date', value: 'invoice_date' },
					{ name: 'Invoice Number', value: 'invoice_number' },
				],
				default: 'invoice_number',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
			},
		],
	},

	// ----------------------------------
	//         invoice: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
		options: [
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
				displayName: 'Delivery Date',
				name: 'delivery_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Discounts',
				name: 'discounts',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Discount',
				default: {},
				options: [
					{
						displayName: 'Discount',
						name: 'discount',
						values: [
							{
								displayName: 'Value (%)',
								name: 'value',
								type: 'number',
								typeOptions: { minValue: 0, maxValue: 100, numberPrecision: 2 },
								default: 0,
								description: 'Discount percentage (0-100)',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								description: 'Description of the discount',
							},
						],
					},
				],
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
				displayName: 'Grouped Lines (JSON)',
				name: 'grouped_lines',
				type: 'json',
				default: '[]',
				description: 'Array of line item groups in JSON format. Example: [{"section":{"title":"Section 1"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"currency":"EUR"},"tax":{"rate":0.21}}]}]',
			},
			{
				displayName: 'Invoice Date',
				name: 'invoice_date',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Payment Term Days',
				name: 'payment_term_days',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 30,
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
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
				type: 'string',
				default: '',
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
				description: 'Name of the person to address the invoice to (free text)',
			},
			{
				displayName: 'For Attention Of (Contact ID)',
				name: 'for_attention_of_contact_id',
				type: 'string',
				default: '',
				description: 'Contact ID of the person to address the invoice to',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'The ID of the related project',
			},
			{
				displayName: 'Expected Payment Method',
				name: 'expected_payment_method_method',
				type: 'options',
				options: [
					{ name: 'SEPA Direct Debit', value: 'sepa_direct_debit' },
					{ name: 'Direct Debit', value: 'direct_debit' },
					{ name: 'Credit Card', value: 'credit_card' },
				],
				default: 'sepa_direct_debit',
				description: 'The expected payment method',
			},
			{
				displayName: 'Expected Payment Method Reference',
				name: 'expected_payment_method_reference',
				type: 'string',
				default: '',
				description: 'Reference for the expected payment method (e.g. mandate reference)',
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
		displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getInvoiceCustomFields' },
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
	//         invoice: updateBooked
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['updateBooked'] } },
		options: [
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Payment Term Days',
				name: 'payment_term_days',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 30,
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
				displayName: 'Purchase Order Number',
				name: 'purchase_order_number',
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
		displayOptions: { show: { resource: ['invoice'], operation: ['updateBooked'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getInvoiceCustomFields' },
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
	//         invoice: registerPayment
	// ----------------------------------
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		typeOptions: { numberPrecision: 2 },
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['invoice'], operation: ['registerPayment'] } },
		description: 'The amount of the payment',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCurrencies' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['registerPayment'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Paid At',
		name: 'paidAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['registerPayment'] } },
		description: 'The date the payment was made',
	},
	{
		displayName: 'Payment Method ID',
		name: 'paymentMethodId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['registerPayment'] } },
		description: 'The ID of the payment method',
	},

	// ----------------------------------
	//         invoice: credit
	// ----------------------------------
	{
		displayName: 'Credit Note Date',
		name: 'creditNoteDate',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['credit'] } },
		description: 'Date for the credit note (YYYY-MM-DD). Defaults to today if not specified.',
	},

	// ----------------------------------
	//         invoice: creditPartially
	// ----------------------------------
	{
		displayName: 'Grouped Lines (JSON)',
		name: 'groupedLines',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['invoice'], operation: ['creditPartially'] } },
		description: 'Array of line item groups for the credit note in JSON format. Example: [{"section":{"title":"Credit"},"line_items":[{"quantity":1,"description":"Item","unit_price":{"amount":100,"currency":"EUR"},"tax":{"rate":0.21}}]}]',
	},

	// ----------------------------------
	//         invoice: download
	// ----------------------------------
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [
			{ name: 'PDF', value: 'pdf' },
			{ name: 'UBL (e-FFF)', value: 'ubl/e-fff' },
			{ name: 'UBL (Peppol BIS 3)', value: 'ubl/peppol_bis_3' },
		],
		required: true,
		default: 'pdf',
		displayOptions: { show: { resource: ['invoice'], operation: ['download'] } },
	},
	{
		displayName: 'Binary Property (Output)',
		name: 'downloadBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['invoice'], operation: ['download'] } },
		description: 'Name of the binary property to write the downloaded file to',
	},
];
