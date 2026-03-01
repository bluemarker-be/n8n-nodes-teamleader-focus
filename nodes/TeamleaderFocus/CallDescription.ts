import type { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['call'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add a call' },
			{ name: 'Complete', value: 'complete', action: 'Complete a call' },
			{ name: 'Get', value: 'get', action: 'Get a call' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many calls' },
			{ name: 'Update', value: 'update', action: 'Update a call' },
		],
		default: 'getMany',
	},
];

export const callFields: INodeProperties[] = [
	// ----------------------------------
	//         call: add
	// ----------------------------------
	{
		displayName: 'Caller Type',
		name: 'callerType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
			{ name: 'User', value: 'user' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'Type of the caller',
	},
	{
		displayName: 'Caller ID',
		name: 'callerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'ID of the caller',
	},
	{
		displayName: 'Callee Type',
		name: 'calleeType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
			{ name: 'User', value: 'user' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'Type of the callee',
	},
	{
		displayName: 'Callee ID',
		name: 'calleeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		description: 'ID of the callee',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['call'], operation: ['add'] } },
		options: [
			{
				displayName: 'Outcome Name or ID',
				name: 'outcome_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCallOutcomes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Started At',
				name: 'started_at',
				type: 'dateTime',
				default: '',
				description: 'Date and time when the call started',
			},
			{
				displayName: 'Duration (Seconds)',
				name: 'duration',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Duration of the call in seconds',
			},
		],
	},

	// ----------------------------------
	//         call: get / complete
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['call'], operation: ['get', 'complete', 'update'] },
		},
		description: 'The ID of the call',
	},

	// ----------------------------------
	//         call: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['call'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['call'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         call: complete
	// ----------------------------------
	{
		displayName: 'Outcome Name or ID',
		name: 'outcome_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getCallOutcomes' },
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['complete'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Summary',
		name: 'summary',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: { show: { resource: ['call'], operation: ['complete'] } },
		description: 'Summary of the call',
	},

	// ----------------------------------
	//         call: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['call'], operation: ['update'] } },
		options: [
			{
				displayName: 'Outcome Name or ID',
				name: 'outcome_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getCallOutcomes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
		],
	},
];
