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
				displayName: 'Requires Attention After Days',
				name: 'requires_attention_after_days',
				type: 'number',
				default: 0,
			},
		],
	},
	{
		displayName: 'Position',
		name: 'position',
		type: 'number',
		required: true,
		default: 1,
		displayOptions: { show: { resource: ['dealPhase'], operation: ['move'] } },
		description: 'The new position for the phase (1-based)',
	},
];
