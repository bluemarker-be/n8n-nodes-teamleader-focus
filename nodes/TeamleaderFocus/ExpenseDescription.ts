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
					{ name: 'Paid', value: 'paid' },
					{ name: 'Unpaid', value: 'unpaid' },
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
					{ name: 'Created At', value: 'created_at' },
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
