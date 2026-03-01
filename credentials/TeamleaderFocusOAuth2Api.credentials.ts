import type {
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TeamleaderFocusOAuth2Api implements ICredentialType {
	name = 'teamleaderFocusOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Teamleader Focus OAuth2 API';
	documentationUrl = 'https://developer.teamleader.eu/';
	icon: Icon = { light: 'file:../icons/teamleader-focus.svg', dark: 'file:../icons/teamleader-focus.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://focus.teamleader.eu/oauth2/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://focus.teamleader.eu/oauth2/access_token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default:
				'companies contacts deals departments events invoices products projects quotations subscriptions tickets todos users',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: 'https://api.focus.teamleader.eu',
			url: '/users.me',
		},
	};
}
