import type { INodeProperties } from 'n8n-workflow';

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ticket'] } },
		options: [
			{ name: 'Add Internal Message', value: 'addInternalMessage', action: 'Add internal message to ticket' },
			{ name: 'Add Reply', value: 'addReply', action: 'Add reply to ticket' },
			{ name: 'Create', value: 'create', action: 'Create a ticket' },
			{ name: 'Get', value: 'get', action: 'Get a ticket' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many tickets' },
			{ name: 'Get Message', value: 'getMessage', action: 'Get a ticket message' },
			{ name: 'Import Message', value: 'importMessage', action: 'Import a message into a ticket' },
			{ name: 'List Messages', value: 'listMessages', action: 'List ticket messages' },
			{ name: 'Update', value: 'update', action: 'Update a ticket' },
		],
		default: 'getMany',
	},
];

export const ticketFields: INodeProperties[] = [
	// ----------------------------------
	//         ticket: create
	// ----------------------------------
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['create'] } },
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
		default: 'contact',
		displayOptions: { show: { resource: ['ticket'], operation: ['create'] } },
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['create'] } },
	},
	{
		displayName: 'Ticket Status Name or ID',
		name: 'ticketStatusId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTicketStatuses' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['create'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['ticket'], operation: ['create'] } },
		options: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 6 },
				default: '',
			},
			{
				displayName: 'Assignee Name or ID',
				name: 'assignee_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'Link this ticket to a nextgen project. Mutually exclusive with milestone_id (legacy projects).',
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
		displayOptions: { show: { resource: ['ticket'], operation: ['create'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getTicketCustomFields' },
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
	//         ticket: get / update / listMessages / addReply / addInternalMessage
	// ----------------------------------
	{
		displayName: 'Ticket ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['get', 'update', 'listMessages', 'addReply', 'addInternalMessage', 'importMessage'],
			},
		},
	},

	// ----------------------------------
	//         ticket: getMessage
	// ----------------------------------
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['getMessage'] } },
	},

	// ----------------------------------
	//         ticket: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['ticket'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['ticket'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['ticket'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Project IDs',
				name: 'project_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to filter on',
			},
			{
				displayName: 'Assignee User Names or IDs',
				name: 'assignee_ids',
				type: 'multiOptions',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: [],
				description:
					'Filter by one or more assignee user IDs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Include a null entry (via expression) to also match unassigned tickets.',
			},
		],
	},

	// ----------------------------------
	//         ticket: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['ticket'], operation: ['update'] } },
		options: [
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Ticket Status Name or ID',
				name: 'ticket_status_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getTicketStatuses' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Assignee Name or ID',
				name: 'assignee_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getUsers' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'Link this ticket to a nextgen project. Mutually exclusive with milestone_id (legacy projects).',
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
		displayOptions: { show: { resource: ['ticket'], operation: ['update'] } },
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getTicketCustomFields' },
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
	//         ticket: importMessage
	// ----------------------------------
	{
		displayName: 'Message Body (HTML)',
		name: 'importMessageBody',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['importMessage'] } },
		description: 'The HTML body of the message to import',
	},
	{
		displayName: 'Sent By Type',
		name: 'sentByType',
		type: 'options',
		options: [
			{ name: 'Contact', value: 'contact' },
			{ name: 'Company', value: 'company' },
			{ name: 'User', value: 'user' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['ticket'], operation: ['importMessage'] } },
	},
	{
		displayName: 'Sent By ID',
		name: 'sentById',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['importMessage'] } },
	},
	{
		displayName: 'Sent At',
		name: 'sentAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ticket'], operation: ['importMessage'] } },
	},

	// ----------------------------------
	//         ticket: addReply / addInternalMessage
	// ----------------------------------
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['ticket'], operation: ['addReply', 'addInternalMessage'] },
		},
	},
];
