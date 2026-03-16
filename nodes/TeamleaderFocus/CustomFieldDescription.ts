import type { INodeProperties } from 'n8n-workflow';

export const customFieldOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customField'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a custom field definition' },
			{ name: 'Get', value: 'get', action: 'Get a custom field definition' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many custom field definitions' },
		],
		default: 'getMany',
	},
];

export const customFieldFields: INodeProperties[] = [
	// ----------------------------------
	//         customField: create
	// ----------------------------------
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
		description: 'The label for the custom field',
	},
	{
		displayName: 'Type',
		name: 'fieldType',
		type: 'options',
		options: [
			{ name: 'Auto Increment', value: 'auto_increment' },
			{ name: 'Boolean', value: 'boolean' },
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Date', value: 'date' },
			{ name: 'Email', value: 'email' },
			{ name: 'Integer', value: 'integer' },
			{ name: 'Money', value: 'money' },
			{ name: 'Multi-Line', value: 'multi_line' },
			{ name: 'Multi-Select', value: 'multi_select' },
			{ name: 'Number', value: 'number' },
			{ name: 'Product', value: 'product' },
			{ name: 'Single Line', value: 'single_line' },
			{ name: 'Single Select', value: 'single_select' },
			{ name: 'Telephone', value: 'telephone' },
			{ name: 'URL', value: 'url' },
			{ name: 'User', value: 'user' },
		],
		required: true,
		default: 'single_line',
		displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
	},
	{
		displayName: 'Context',
		name: 'context',
		type: 'options',
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Deal (Sale)', value: 'sale' },
			{ name: 'Invoice', value: 'invoice' },
			{ name: 'Milestone', value: 'milestone' },
			{ name: 'Product', value: 'product' },
			{ name: 'Project', value: 'project' },
			{ name: 'Subscription', value: 'subscription' },
			{ name: 'Ticket', value: 'ticket' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
	},
	{
		displayName: 'Configuration (JSON)',
		name: 'configuration',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['customField'], operation: ['create'] } },
		description: 'Optional configuration in JSON format. Varies per field type. For "select" type: {"options":[{"value":"option1"},{"value":"option2"}]}. For "number" type: {"minimum":0,"maximum":100}.',
	},

	// ----------------------------------
	//         customField: get
	// ----------------------------------
	{
		displayName: 'Custom Field ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['customField'], operation: ['get'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['customField'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['customField'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['customField'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Context',
				name: 'context',
				type: 'options',
				options: [
					{ name: 'Callback', value: 'callback' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal (Sale)', value: 'sale' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Meeting', value: 'meeting' },
					{ name: 'Meeting Report', value: 'meeting_report' },
					{ name: 'Project', value: 'project' },
					{ name: 'Task (Todo)', value: 'todo' },
					{ name: 'Ticket', value: 'ticket' },
				],
				default: 'contact',
				description: 'Filter custom fields by the resource type they belong to',
			},
		],
	},
];
