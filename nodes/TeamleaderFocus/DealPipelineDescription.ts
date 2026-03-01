import type { INodeProperties } from 'n8n-workflow';

export const dealPipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dealPipeline'] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a deal pipeline' },
			{ name: 'Delete', value: 'delete', action: 'Delete a deal pipeline' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a deal pipeline' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many deal pipelines' },
			{
				name: 'Mark as Default',
				value: 'markAsDefault',
				action: 'Mark a deal pipeline as default',
			},
			{ name: 'Update', value: 'update', action: 'Update a deal pipeline' },
		],
		default: 'getMany',
	},
];

export const dealPipelineFields: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dealPipeline'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'Pipeline ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dealPipeline'],
				operation: ['delete', 'duplicate', 'markAsDefault', 'update'],
			},
		},
	},
	{
		displayName: 'Migrate Phases (JSON)',
		name: 'migratePhases',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['dealPipeline'], operation: ['delete'] } },
		description: 'JSON array mapping old phase IDs to new pipeline phase IDs. Required when the pipeline has deals. Example: [{"from_phase_id":"abc-123","to_phase_id":"def-456"}]',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['dealPipeline'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: { resource: ['dealPipeline'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
