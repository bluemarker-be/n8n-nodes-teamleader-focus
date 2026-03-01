import type { INodeProperties } from 'n8n-workflow';

export const externalPartyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['externalParty'] } },
		options: [
			{ name: 'Add to Project', value: 'addToProject', action: 'Add external party to project' },
			{ name: 'Delete', value: 'delete', action: 'Delete an external party' },
			{ name: 'Update', value: 'update', action: 'Update an external party' },
		],
		default: 'addToProject',
	},
];

export const externalPartyFields: INodeProperties[] = [
	// ----------------------------------
	//         externalParty: addToProject
	// ----------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['externalParty'], operation: ['addToProject'] } },
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
		default: 'company',
		displayOptions: { show: { resource: ['externalParty'], operation: ['addToProject'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['externalParty'], operation: ['addToProject'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['externalParty'], operation: ['addToProject'] } },
		options: [
			{
				displayName: 'Function',
				name: 'function',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Sub-Function',
				name: 'sub_function',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         externalParty: update / delete
	// ----------------------------------
	{
		displayName: 'External Party ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['externalParty'],
				operation: ['update', 'delete'],
			},
		},
	},

	// ----------------------------------
	//         externalParty: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['externalParty'], operation: ['update'] } },
		options: [
			{
				displayName: 'Customer Type',
				name: 'customer_type',
				type: 'options',
				options: [
					{ name: 'Contact', value: 'contact' },
					{ name: 'Company', value: 'company' },
				],
				default: 'company',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Function',
				name: 'function',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Sub-Function',
				name: 'sub_function',
				type: 'string',
				default: '',
			},
		],
	},
];
