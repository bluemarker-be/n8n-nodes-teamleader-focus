import type { INodeProperties } from 'n8n-workflow';

export const dealPhaseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dealPhase'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a deal phase' },
			{ name: 'Delete', value: 'delete', action: 'Delete a deal phase' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many deal phases' },
			{ name: 'Move', value: 'move', action: 'Move a deal phase' },
			{ name: 'Update', value: 'update', action: 'Update a deal phase' },
		],
		default: 'getMany',
	},
];

export const dealPhaseFields: INodeProperties[] = [
	{
		displayName: 'Pipeline Name or ID',
		name: 'pipelineId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDealPipelines' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dealPhase'], operation: ['create', 'getMany'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dealPhase'], operation: ['create'] } },
	},
	{
		displayName: 'Requires Attention After (Amount)',
		name: 'requiresAttentionAfterAmount',
		type: 'number',
		required: true,
		default: 14,
		displayOptions: { show: { resource: ['dealPhase'], operation: ['create'] } },
		description: 'Number of days/working days after which the deal requires attention',
	},
	{
		displayName: 'Requires Attention After (Unit)',
		name: 'requiresAttentionAfterUnit',
		type: 'options',
		options: [
			{ name: 'Calendar Days', value: 'calendar_days' },
			{ name: 'Working Days', value: 'working_days' },
		],
		required: true,
		default: 'calendar_days',
		displayOptions: { show: { resource: ['dealPhase'], operation: ['create'] } },
	},
	{
		displayName: 'Phase ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['dealPhase'], operation: ['delete', 'move', 'update'] },
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['dealPhase'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['dealPhase'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['dealPhase'], operation: ['update'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Requires Attention After (Amount)',
				name: 'requires_attention_after_amount',
				type: 'number',
				default: 0,
				description: 'Number of days/working days after which the deal requires attention',
			},
			{
				displayName: 'Requires Attention After (Unit)',
				name: 'requires_attention_after_unit',
				type: 'options',
				options: [
					{ name: 'Calendar Days', value: 'calendar_days' },
					{ name: 'Working Days', value: 'working_days' },
				],
				default: 'calendar_days',
			},
		],
	},
	{
		displayName: 'After Phase ID',
		name: 'afterPhaseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dealPhase'], operation: ['move'] } },
		description: 'The ID of the phase after which to place this phase. Leave empty to move to the first position.',
	},
];
