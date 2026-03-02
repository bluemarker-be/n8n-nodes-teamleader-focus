import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get Projects V2 Status',
				value: 'getProjectsV2Status',
				action: 'Get the projects v2 migration status of the account',
			},
		],
		default: 'getProjectsV2Status',
	},
];

export const accountFields: INodeProperties[] = [];
