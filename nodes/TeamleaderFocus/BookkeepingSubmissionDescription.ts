import type { INodeProperties } from 'n8n-workflow';

export const bookkeepingSubmissionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bookkeepingSubmission'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', action: 'Get many bookkeeping submissions' },
		],
		default: 'getMany',
	},
];

export const bookkeepingSubmissionFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['bookkeepingSubmission'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['bookkeepingSubmission'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['bookkeepingSubmission'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Subject Type',
				name: 'subject_type',
				type: 'options',
				options: [
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Credit Note', value: 'creditNote' },
					{ name: 'Incoming Invoice', value: 'incomingInvoice' },
					{ name: 'Incoming Credit Note', value: 'incomingCreditNote' },
					{ name: 'Receipt', value: 'receipt' },
				],
				default: 'invoice',
			},
			{
				displayName: 'Subject ID',
				name: 'subject_id',
				type: 'string',
				default: '',
			},
		],
	},
];
