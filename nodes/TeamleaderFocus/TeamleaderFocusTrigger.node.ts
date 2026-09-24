import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { teamleaderApiRequest } from './GenericFunctions';

export class TeamleaderFocusTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teamleader Focus Trigger',
		name: 'teamleaderFocusTrigger',
		icon: 'file:../../icons/teamleader-focus.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Teamleader Focus events occur',
		defaults: {
			name: 'Teamleader Focus Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'teamleaderFocusOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					// Account
					{ name: 'Account Deactivated', value: 'account.deactivated' },
					// Call
					{ name: 'Call Added', value: 'call.added' },
					{ name: 'Call Completed', value: 'call.completed' },
					{ name: 'Call Deleted', value: 'call.deleted' },
					{ name: 'Call Updated', value: 'call.updated' },
					// Company
					{ name: 'Company Added', value: 'company.added' },
					{ name: 'Company Deactivated', value: 'company.deactivated' },
					{ name: 'Company Deleted', value: 'company.deleted' },
					{ name: 'Company Updated', value: 'company.updated' },
					// Contact
					{ name: 'Contact Added', value: 'contact.added' },
					{ name: 'Contact Deactivated', value: 'contact.deactivated' },
					{ name: 'Contact Deleted', value: 'contact.deleted' },
					{
						name: 'Contact Linked to Company',
						value: 'contact.linkedToCompany',
					},
					{
						name: 'Contact Unlinked from Company',
						value: 'contact.unlinkedFromCompany',
					},
					{ name: 'Contact Updated', value: 'contact.updated' },
					// Credit Note
					{ name: 'Credit Note Booked', value: 'creditNote.booked' },
					{
						name: 'Credit Note Peppol Submission Failed',
						value: 'creditNote.peppolSubmissionFailed',
					},
					{
						name: 'Credit Note Peppol Submission Succeeded',
						value: 'creditNote.peppolSubmissionSucceeded',
					},
					// Deal
					{ name: 'Deal Created', value: 'deal.created' },
					{ name: 'Deal Deleted', value: 'deal.deleted' },
					{ name: 'Deal Lost', value: 'deal.lost' },
					{ name: 'Deal Moved', value: 'deal.moved' },
					{ name: 'Deal Updated', value: 'deal.updated' },
					{ name: 'Deal Won', value: 'deal.won' },
					// Event
					{ name: 'Event Created', value: 'event.created' },
					{ name: 'Event Deleted', value: 'event.deleted' },
					{ name: 'Event Updated', value: 'event.updated' },
					// Invoice
					{ name: 'Invoice Booked', value: 'invoice.booked' },
					{ name: 'Invoice Deleted', value: 'invoice.deleted' },
					{ name: 'Invoice Drafted', value: 'invoice.drafted' },
					{
						name: 'Invoice Payment Registered',
						value: 'invoice.paymentRegistered',
					},
					{
						name: 'Invoice Payment Removed',
						value: 'invoice.paymentRemoved',
					},
					{
						name: 'Invoice Peppol Submission Failed',
						value: 'invoice.peppolSubmissionFailed',
					},
					{
						name: 'Invoice Peppol Submission Succeeded',
						value: 'invoice.peppolSubmissionSucceeded',
					},
					{ name: 'Invoice Sent', value: 'invoice.sent' },
					{ name: 'Invoice Updated', value: 'invoice.updated' },
					// Meeting
					{ name: 'Meeting Created', value: 'meeting.created' },
					{ name: 'Meeting Deleted', value: 'meeting.deleted' },
					{ name: 'Meeting Updated', value: 'meeting.updated' },
					// Milestone
					{ name: 'Milestone Created', value: 'milestone.created' },
					{ name: 'Milestone Updated', value: 'milestone.updated' },
					// Note
					{ name: 'Note Added', value: 'note.added' },
					{ name: 'Note Deleted', value: 'note.deleted' },
					// Project
					{ name: 'Project Closed', value: 'project.closed' },
					{ name: 'Project Created', value: 'project.created' },
					{ name: 'Project Deleted', value: 'project.deleted' },
					{ name: 'Project Updated', value: 'project.updated' },
					// Subscription
					{ name: 'Subscription Added', value: 'subscription.added' },
					{
						name: 'Subscription Deactivated',
						value: 'subscription.deactivated',
					},
					{ name: 'Subscription Updated', value: 'subscription.updated' },
					// Task
					{ name: 'Task Completed', value: 'task.completed' },
					{ name: 'Task Created', value: 'task.created' },
					{ name: 'Task Deleted', value: 'task.deleted' },
					{ name: 'Task Updated', value: 'task.updated' },
					// Ticket
					{ name: 'Ticket Created', value: 'ticket.created' },
					{ name: 'Ticket Updated', value: 'ticket.updated' },
					// Time Tracking
					{ name: 'Time Tracking Added', value: 'timeTracking.added' },
					{ name: 'Time Tracking Deleted', value: 'timeTracking.deleted' },
					{ name: 'Time Tracking Updated', value: 'timeTracking.updated' },
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const response = await teamleaderApiRequest.call(
					this,
					'POST',
					'/webhooks.list',
				);
				const webhooks = (response.data as IDataObject[]) ?? [];
				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl) {
						// Store url and types for unregister
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookUrl = webhook.url as string;
						webhookData.webhookTypes = webhook.types as string[];
						// Check if the registered types match the configured events
						const registeredTypes = (webhook.types as string[]) ?? [];
						const typesMatch =
							events.length === registeredTypes.length &&
							events.every((e) => registeredTypes.includes(e));
						if (!typesMatch) {
							// Types changed — unregister old webhook so create() re-registers
							try {
								await teamleaderApiRequest.call(
									this,
									'POST',
									'/webhooks.unregister',
									{
										url: webhook.url as string,
										types: webhook.types as string[],
									},
								);
							} catch {
								// ignore unregister errors
							}
							return false;
						}
						return true;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];

				await teamleaderApiRequest.call(
					this,
					'POST',
					'/webhooks.register',
					{
						url: webhookUrl,
						types: events,
					},
				);

				// Store url and types for unregister (API returns 204, no id)
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookUrl = webhookUrl;
				webhookData.webhookTypes = events;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = webhookData.webhookUrl as string;
				const webhookTypes = webhookData.webhookTypes as string[];
				if (webhookUrl && webhookTypes) {
					try {
						await teamleaderApiRequest.call(
							this,
							'POST',
							'/webhooks.unregister',
							{
								url: webhookUrl,
								types: webhookTypes,
							},
						);
					} catch {
						return false;
					}
				}
				delete webhookData.webhookUrl;
				delete webhookData.webhookTypes;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;
		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
