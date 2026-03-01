import type { INodeTypeDescription } from 'n8n-workflow';

export class TeamleaderFocus {
	description: INodeTypeDescription = {
		displayName: 'Teamleader Focus',
		name: 'teamleaderFocus',
		icon: 'file:../../icons/teamleader-focus.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Teamleader Focus API',
		defaults: {
			name: 'Teamleader Focus',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'teamleaderFocusOAuth2Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.focus.teamleader.eu',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get Current User',
						value: 'getCurrentUser',
						description: 'Get the currently authenticated user',
						action: 'Get current user',
						routing: {
							request: {
								method: 'POST',
								url: '/users.me',
							},
						},
					},
				],
				default: 'getCurrentUser',
			},
		],
	};
}
