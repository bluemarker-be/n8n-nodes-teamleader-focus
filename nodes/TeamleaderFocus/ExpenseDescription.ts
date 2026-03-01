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
		default: 20,
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
				type: 'string',
				default: '',
				description: 'Comma-separated list of source types',
			},
			{
				displayName: 'Review Statuses',
				name: 'review_statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list (e.g. pending_review,approved,refused)',
			},
			{
				displayName: 'Bookkeeping Statuses',
				name: 'bookkeeping_statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list of bookkeeping statuses',
			},
			{
				displayName: 'Payment Statuses',
				name: 'payment_statuses',
				type: 'string',
				default: '',
				description: 'Comma-separated list of payment statuses',
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
