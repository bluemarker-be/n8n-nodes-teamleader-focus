import type { INodeProperties } from 'n8n-workflow';

export const mailTemplateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['mailTemplate'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many mail templates',
			},
		],
		default: 'getMany',
	},
];

export const mailTemplateFields: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Credit Note', value: 'credit_note' },
			{ name: 'Invoice', value: 'invoice' },
			{ name: 'Quotation', value: 'quotation' },
			{ name: 'Work Order', value: 'work_order' },
		],
		required: true,
		default: 'invoice',
		displayOptions: { show: { resource: ['mailTemplate'], operation: ['getMany'] } },
		description: 'The type of mail templates to retrieve',
	},
	{
		displayName: 'Department Name or ID',
		name: 'departmentId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		default: '',
		displayOptions: { show: { resource: ['mailTemplate'], operation: ['getMany'] } },
		description: 'Filter by department. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
