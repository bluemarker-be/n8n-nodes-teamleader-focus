import type { INodeProperties } from 'n8n-workflow';

export const noteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['note'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a note' },
			{ name: 'Delete', value: 'delete', action: 'Delete a note' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many notes' },
			{ name: 'Update', value: 'update', action: 'Update a note' },
		],
		default: 'getMany',
	},
];

export const noteFields: INodeProperties[] = [
	// ----------------------------------
	//         note: create
	// ----------------------------------
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Deal', value: 'deal' },
			{ name: 'Meeting', value: 'meeting' },
			{ name: 'Project', value: 'project' },
			{ name: 'Ticket', value: 'ticket' },
		],
		required: true,
		default: 'contact',
		displayOptions: { show: { resource: ['note'], operation: ['create'] } },
		description: 'Type of the subject to attach the note to',
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['note'], operation: ['create'] } },
		description: 'ID of the subject to attach the note to',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['note'], operation: ['create'] } },
		description: 'Content of the note',
	},

	// ----------------------------------
	//         note: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['note'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['note'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['note'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Subject Type',
				name: 'subject_type',
				type: 'options',
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Meeting', value: 'meeting' },
					{ name: 'Project', value: 'project' },
					{ name: 'Ticket', value: 'ticket' },
				],
				default: 'contact',
				description: 'Filter by subject type',
			},
			{
				displayName: 'Subject ID',
				name: 'subject_id',
				type: 'string',
				default: '',
				description: 'Filter by subject ID',
			},
		],
	},

	// ----------------------------------
	//         note: update
	// ----------------------------------
	{
		displayName: 'Note ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['note'], operation: ['update', 'delete'] } },
		description: 'The ID of the note',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['note'], operation: ['update'] } },
		description: 'Updated content of the note',
	},
];
