import type { INodeProperties } from 'n8n-workflow';

export const expenseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['expense'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many expenses' },
		],
		default: 'getMany',
	},
];

export const expenseFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['expense'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['expense'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['expense'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Term',
				name: 'term',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Source Types',
				name: 'source_types',
				type: 'multiOptions',
				options: [
					{ name: 'Incoming Invoice', value: 'incomingInvoice' },
					{ name: 'Incoming Credit Note', value: 'incomingCreditNote' },
					{ name: 'Receipt', value: 'receipt' },
				],
				default: [],
				description: 'Filter by one or more source types',
			},
			{
				displayName: 'Review Statuses',
				name: 'review_statuses',
				type: 'multiOptions',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Approved', value: 'approved' },
					{ name: 'Refused', value: 'refused' },
				],
				default: [],
				description: 'Filter by one or more review statuses',
			},
			{
				displayName: 'Bookkeeping Statuses',
				name: 'bookkeeping_statuses',
				type: 'multiOptions',
				options: [
					{ name: 'Sent', value: 'sent' },
					{ name: 'Not Sent', value: 'not_sent' },
				],
				default: [],
				description: 'Filter by one or more bookkeeping statuses',
			},
			{
				displayName: 'Payment Statuses',
				name: 'payment_statuses',
				type: 'multiOptions',
				options: [
					{ name: 'Unknown', value: 'unknown' },
					{ name: 'Paid', value: 'paid' },
					{ name: 'Partially Paid', value: 'partially_paid' },
					{ name: 'Credited', value: 'credited' },
					{ name: 'Not Paid', value: 'not_paid' },
				],
				default: [],
				description: 'Filter by one or more payment statuses',
			},
			{
				displayName: 'Department Names or IDs',
				name: 'department_ids',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getDepartments' },
				default: [],
				description:
					'Filter by one or more departments. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Supplier Type',
				name: 'supplier_type',
				type: 'options',
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Company', value: 'company' },
				],
				default: 'company',
				description: 'Type of the supplier — combined with Supplier ID to filter by a specific supplier',
			},
			{
				displayName: 'Supplier ID',
				name: 'supplier_id',
				type: 'string',
				default: '',
				description: 'ID of the supplier (contact or company). Must be combined with Supplier Type.',
			},
			{
				displayName: 'Paid At — Operator',
				name: 'paid_at_operator',
				type: 'options',
				options: [
					{ name: 'Is Empty', value: 'is_empty' },
					{ name: 'Equals', value: 'equals' },
					{ name: 'Before', value: 'before' },
					{ name: 'After', value: 'after' },
					{ name: 'Between', value: 'between' },
				],
				default: 'equals',
				description: 'Comparison operator for the paid_at filter. Combine with Value (for equals/before/after) or Start + End (for between).',
			},
			{
				displayName: 'Paid At — Value',
				name: 'paid_at_value',
				type: 'dateTime',
				default: '',
				description: 'Required when operator is Equals, Before, or After',
			},
			{
				displayName: 'Paid At — Start',
				name: 'paid_at_start',
				type: 'dateTime',
				default: '',
				description: 'Required when operator is Between (start of range)',
			},
			{
				displayName: 'Paid At — End',
				name: 'paid_at_end',
				type: 'dateTime',
				default: '',
				description: 'Required when operator is Between (end of range)',
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: { show: { resource: ['expense'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				type: 'options',
				options: [
					{ name: 'Document Date', value: 'document_date' },
					{ name: 'Due Date', value: 'due_date' },
					{ name: 'Supplier Name', value: 'supplier_name' },
				],
				default: 'document_date',
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
];
