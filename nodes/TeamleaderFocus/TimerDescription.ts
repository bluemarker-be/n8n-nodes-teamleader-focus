import type { INodeProperties } from 'n8n-workflow';

export const timerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timer'] } },
		options: [
			{ name: 'Get Current', value: 'getCurrent', action: 'Get the current running timer' },
			{ name: 'Start', value: 'start', action: 'Start a timer' },
			{ name: 'Stop', value: 'stop', action: 'Stop the running timer' },
			{ name: 'Update', value: 'update', action: 'Update the running timer' },
		],
		default: 'getCurrent',
	},
];

export const timerFields: INodeProperties[] = [
	// ----------------------------------
	//         timer: start
	// ----------------------------------
	{
		displayName: 'Work Type Name or ID',
		name: 'work_type_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getWorkTypes' },
		default: '',
		displayOptions: { show: { resource: ['timer'], operation: ['start'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Subject Type',
		name: 'subjectType',
		type: 'options',
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Deal', value: 'deal' },
			{ name: 'Milestone', value: 'milestone' },
			{ name: 'Project', value: 'project' },
			{ name: 'Ticket', value: 'ticket' },
		],
		default: 'contact',
		displayOptions: { show: { resource: ['timer'], operation: ['start'] } },
		description: 'Type of the subject to track time on',
	},
	{
		displayName: 'Subject ID',
		name: 'subjectId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['timer'], operation: ['start'] } },
		description: 'ID of the subject to track time on',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: { show: { resource: ['timer'], operation: ['start'] } },
		description: 'Description of the work being done',
	},

	// ----------------------------------
	//         timer: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['timer'], operation: ['update'] } },
		options: [
			{
				displayName: 'Work Type Name or ID',
				name: 'work_type_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getWorkTypes' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
		],
	},
];
