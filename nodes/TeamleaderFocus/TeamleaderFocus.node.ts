import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	teamleaderApiRequest,
	teamleaderApiRequestAllItems,
	mapCustomFields,
	buildFilter,
} from './GenericFunctions';

// CRM
import { contactOperations, contactFields } from './ContactDescription';
import { companyOperations, companyFields } from './CompanyDescription';
import { customFieldOperations, customFieldFields } from './CustomFieldDescription';

// Sales & Deals
import { dealOperations, dealFields } from './DealDescription';
import { dealPipelineOperations, dealPipelineFields } from './DealPipelineDescription';
import { dealPhaseOperations, dealPhaseFields } from './DealPhaseDescription';
import { quotationOperations, quotationFields } from './QuotationDescription';

// Financial
import { invoiceOperations, invoiceFields } from './InvoiceDescription';
import { creditNoteOperations, creditNoteFields } from './CreditNoteDescription';
import { subscriptionOperations, subscriptionFields } from './SubscriptionDescription';
import {
	incomingInvoiceOperations,
	incomingInvoiceFields,
} from './IncomingInvoiceDescription';
import {
	incomingCreditNoteOperations,
	incomingCreditNoteFields,
} from './IncomingCreditNoteDescription';

// Activities & Time
import { eventOperations, eventFields } from './EventDescription';
import { meetingOperations, meetingFields } from './MeetingDescription';
import { callOperations, callFields } from './CallDescription';
import { timeTrackingOperations, timeTrackingFields } from './TimeTrackingDescription';
import { timerOperations, timerFields } from './TimerDescription';
import { noteOperations, noteFields } from './NoteDescription';
import { taskOperations, taskFields } from './TaskDescription';

// Projects (v2)
import { projectOperations, projectFields } from './ProjectDescription';
import { projectGroupOperations, projectGroupFields } from './ProjectGroupDescription';
import { projectTaskOperations, projectTaskFields } from './ProjectTaskDescription';
import {
	projectMaterialOperations,
	projectMaterialFields,
} from './ProjectMaterialDescription';
import { externalPartyOperations, externalPartyFields } from './ExternalPartyDescription';
import { projectLineOperations, projectLineFields } from './ProjectLineDescription';

// Products & Support
import { productOperations, productFields } from './ProductDescription';
import { ticketOperations, ticketFields } from './TicketDescription';

// HR, Settings & Files
import { userOperations, userFields } from './UserDescription';
import { departmentOperations, departmentFields } from './DepartmentDescription';
import { teamOperations, teamFields } from './TeamDescription';
import { fileOperations, fileFields } from './FileDescription';
import { dayOffOperations, dayOffFields } from './DayOffDescription';
import { closingDayOperations, closingDayFields } from './ClosingDayDescription';
import { emailTrackingOperations, emailTrackingFields } from './EmailTrackingDescription';
import { webhookOperations, webhookFields } from './WebhookDescription';

// New resources
import { receiptOperations, receiptFields } from './ReceiptDescription';
import { reservationOperations, reservationFields } from './ReservationDescription';
import { orderOperations, orderFields } from './OrderDescription';
import { plannableItemOperations, plannableItemFields } from './PlannableItemDescription';
import { userAvailabilityOperations, userAvailabilityFields } from './UserAvailabilityDescription';
import { expenseOperations, expenseFields } from './ExpenseDescription';
import { bookkeepingSubmissionOperations, bookkeepingSubmissionFields } from './BookkeepingSubmissionDescription';

export class TeamleaderFocus implements INodeType {
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
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Bookkeeping Submission', value: 'bookkeepingSubmission' },
					{ name: 'Call', value: 'call' },
					{ name: 'Closing Day', value: 'closingDay' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Credit Note', value: 'creditNote' },
					{ name: 'Custom Field', value: 'customField' },
					{ name: 'Day Off', value: 'dayOff' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Deal Phase', value: 'dealPhase' },
					{ name: 'Deal Pipeline', value: 'dealPipeline' },
					{ name: 'Department', value: 'department' },
					{ name: 'Email Tracking', value: 'emailTracking' },
					{ name: 'Event', value: 'event' },
					{ name: 'Expense', value: 'expense' },
					{ name: 'External Party', value: 'externalParty' },
					{ name: 'File', value: 'file' },
					{ name: 'Incoming Credit Note', value: 'incomingCreditNote' },
					{ name: 'Incoming Invoice', value: 'incomingInvoice' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Meeting', value: 'meeting' },
					{ name: 'Note', value: 'note' },
					{ name: 'Order', value: 'order' },
					{ name: 'Plannable Item', value: 'plannableItem' },
					{ name: 'Product', value: 'product' },
					{ name: 'Project', value: 'project' },
					{ name: 'Project Group', value: 'projectGroup' },
					{ name: 'Project Line', value: 'projectLine' },
					{ name: 'Project Material', value: 'projectMaterial' },
					{ name: 'Project Task', value: 'projectTask' },
					{ name: 'Quotation', value: 'quotation' },
					{ name: 'Receipt', value: 'receipt' },
					{ name: 'Reservation', value: 'reservation' },
					{ name: 'Subscription', value: 'subscription' },
					{ name: 'Task', value: 'task' },
					{ name: 'Team', value: 'team' },
					{ name: 'Ticket', value: 'ticket' },
					{ name: 'Time Tracking', value: 'timeTracking' },
					{ name: 'Timer', value: 'timer' },
					{ name: 'User', value: 'user' },
					{ name: 'User Availability', value: 'userAvailability' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'contact',
			},
			// CRM
			...contactOperations,
			...contactFields,
			...companyOperations,
			...companyFields,
			...customFieldOperations,
			...customFieldFields,
			// Sales & Deals
			...dealOperations,
			...dealFields,
			...dealPipelineOperations,
			...dealPipelineFields,
			...dealPhaseOperations,
			...dealPhaseFields,
			...quotationOperations,
			...quotationFields,
			// Financial
			...invoiceOperations,
			...invoiceFields,
			...creditNoteOperations,
			...creditNoteFields,
			...subscriptionOperations,
			...subscriptionFields,
			...incomingInvoiceOperations,
			...incomingInvoiceFields,
			...incomingCreditNoteOperations,
			...incomingCreditNoteFields,
			// Activities & Time
			...eventOperations,
			...eventFields,
			...meetingOperations,
			...meetingFields,
			...callOperations,
			...callFields,
			...timeTrackingOperations,
			...timeTrackingFields,
			...timerOperations,
			...timerFields,
			...noteOperations,
			...noteFields,
			...taskOperations,
			...taskFields,
			// Projects (v2)
			...projectOperations,
			...projectFields,
			...projectGroupOperations,
			...projectGroupFields,
			...projectTaskOperations,
			...projectTaskFields,
			...projectMaterialOperations,
			...projectMaterialFields,
			...externalPartyOperations,
			...externalPartyFields,
			...projectLineOperations,
			...projectLineFields,
			// Products & Support
			...productOperations,
			...productFields,
			...ticketOperations,
			...ticketFields,
			// HR, Settings & Files
			...userOperations,
			...userFields,
			...departmentOperations,
			...departmentFields,
			...teamOperations,
			...teamFields,
			...fileOperations,
			...fileFields,
			...dayOffOperations,
			...dayOffFields,
			...closingDayOperations,
			...closingDayFields,
			...emailTrackingOperations,
			...emailTrackingFields,
			...webhookOperations,
			...webhookFields,
			// New resources
			...receiptOperations,
			...receiptFields,
			...reservationOperations,
			...reservationFields,
			...orderOperations,
			...orderFields,
			...plannableItemOperations,
			...plannableItemFields,
			...userAvailabilityOperations,
			...userAvailabilityFields,
			...expenseOperations,
			...expenseFields,
			...bookkeepingSubmissionOperations,
			...bookkeepingSubmissionFields,
		],
	};

	methods = {
		loadOptions: {
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/users.list');
				return data.map((u) => ({
					name: `${(u.first_name as string) || ''} ${(u.last_name as string) || ''}`.trim(),
					value: u.id as string,
				}));
			},

			async getDepartments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/departments.list');
				return data.map((d) => ({
					name: d.name as string,
					value: d.id as string,
				}));
			},

			async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/teams.list');
				return data.map((t) => ({
					name: t.name as string,
					value: t.id as string,
				}));
			},

			async getDealPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/dealPipelines.list');
				return data.map((p) => ({
					name: p.name as string,
					value: p.id as string,
				}));
			},

			async getDealPhases(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/dealPhases.list');
				return data.map((p) => ({
					name: p.name as string,
					value: p.id as string,
				}));
			},

			async getDealSources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/dealSources.list');
				return data.map((s) => ({
					name: s.name as string,
					value: s.id as string,
				}));
			},

			async getLostReasons(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/lostReasons.list');
				return data.map((r) => ({
					name: r.name as string,
					value: r.id as string,
				}));
			},

			async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/tags.list');
				return data.map((t) => ({
					name: t.tag as string,
					value: t.tag as string,
				}));
			},

			async getBusinessTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/businessTypes.list');
				return data.map((b) => ({
					name: b.name as string,
					value: b.id as string,
				}));
			},

			async getTicketStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/ticketStatus.list');
				return data.map((s) => ({
					name: s.name as string,
					value: s.id as string,
				}));
			},

			async getWorkTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/workTypes.list');
				return data.map((w) => ({
					name: w.name as string,
					value: w.id as string,
				}));
			},

			async getActivityTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/activityTypes.list');
				return data.map((a) => ({
					name: a.name as string,
					value: a.id as string,
				}));
			},

			async getCallOutcomes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/callOutcomes.list');
				return data.map((c) => ({
					name: c.name as string,
					value: c.id as string,
				}));
			},

			async getTaxRates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/taxRates.list');
				return data.map((t) => ({
					name: `${t.description as string} (${t.rate as string}%)`,
					value: t.id as string,
				}));
			},

			async getPaymentTerms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const data = await teamleaderApiRequestAllItems.call(this, '/paymentTerms.list');
					return data.map((pt) => ({
						name: pt.name as string,
						value: pt.type as string,
					}));
				} catch {
					return [
						{ name: 'Cash', value: 'cash' },
						{ name: 'End of Month', value: 'end_of_month' },
						{ name: 'After Invoice Date', value: 'after_invoice_date' },
					];
				}
			},

			async getPaymentMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/paymentMethods.list');
				return data.map((p) => ({
					name: p.name as string,
					value: p.id as string,
				}));
			},

			async getProductCategories(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(
					this,
					'/productCategories.list',
				);
				return data.map((c) => ({
					name: c.name as string,
					value: c.id as string,
				}));
			},

			async getDocumentTemplates(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(
					this,
					'/documentTemplates.list',
				);
				return data.map((d) => ({
					name: d.name as string,
					value: d.id as string,
				}));
			},

			async getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return [
					{ name: 'EUR - Euro', value: 'EUR' },
					{ name: 'GBP - British Pound', value: 'GBP' },
					{ name: 'USD - US Dollar', value: 'USD' },
					{ name: 'AUD - Australian Dollar', value: 'AUD' },
					{ name: 'CAD - Canadian Dollar', value: 'CAD' },
					{ name: 'CHF - Swiss Franc', value: 'CHF' },
					{ name: 'CNY - Chinese Yuan', value: 'CNY' },
					{ name: 'CZK - Czech Koruna', value: 'CZK' },
					{ name: 'DKK - Danish Krone', value: 'DKK' },
					{ name: 'HUF - Hungarian Forint', value: 'HUF' },
					{ name: 'INR - Indian Rupee', value: 'INR' },
					{ name: 'JPY - Japanese Yen', value: 'JPY' },
					{ name: 'MAD - Moroccan Dirham', value: 'MAD' },
					{ name: 'NOK - Norwegian Krone', value: 'NOK' },
					{ name: 'PLN - Polish Zloty', value: 'PLN' },
					{ name: 'RON - Romanian Leu', value: 'RON' },
					{ name: 'RUB - Russian Ruble', value: 'RUB' },
					{ name: 'SEK - Swedish Krona', value: 'SEK' },
					{ name: 'TRY - Turkish Lira', value: 'TRY' },
					{ name: 'ZAR - South African Rand', value: 'ZAR' },
				];
			},

			// Custom fields per context
			async getContactCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'contact');
			},
			async getCompanyCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'company');
			},
			async getDealCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				// API uses "sale" not "deal" as context (spec deviation)
				return loadCustomFields.call(this, 'sale');
			},
			async getInvoiceCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'invoice');
			},
			async getProjectCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'project');
			},
			async getTicketCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'ticket');
			},
			async getTaskCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'todo');
			},

			async getPriceLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/priceLists.list');
				return data.map((pl) => ({
					name: pl.name as string,
					value: pl.id as string,
				}));
			},

			async getUnitsOfMeasure(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/unitsOfMeasure.list');
				return data.map((u) => ({
					name: u.name as string,
					value: u.id as string,
				}));
			},

			async getWithholdingTaxRates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/withholdingTaxRates.list');
				return data.map((w) => ({
					name: `${(w.description as string) || (w.name as string)} (${w.rate as string}%)`,
					value: w.id as string,
				}));
			},

			async getCommercialDiscounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await teamleaderApiRequestAllItems.call(this, '/commercialDiscounts.list');
				return data.map((d) => ({
					name: d.description as string,
					value: d.id as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] | undefined;

				// ==============================
				//         CONTACT
				// ==============================
				if (resource === 'contact') {
					if (operation === 'create') {
						const body: IDataObject = {
							last_name: this.getNodeParameter('lastName', i) as string,
						};
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						Object.assign(body, processContactCompanyFields(additionalFields));
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.add',
							body,
						);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.info',
							{ id },
						);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/contacts.list');
					} else if (operation === 'update') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
						};
						const updateFields = this.getNodeParameter(
							'updateFields',
							i,
						) as IDataObject;
						Object.assign(body, processContactCompanyFields(updateFields));
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.update',
							body,
						);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.delete',
							{ id },
						);
					} else if (operation === 'tag') {
						const id = this.getNodeParameter('id', i) as string;
						const tags = this.getNodeParameter('tags', i) as string[];
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.tag',
							{ id, tags },
						);
					} else if (operation === 'untag') {
						const id = this.getNodeParameter('id', i) as string;
						const tags = this.getNodeParameter('tags', i) as string[];
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.untag',
							{ id, tags },
						);
					} else if (operation === 'linkToCompany') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							company_id: this.getNodeParameter('companyId', i) as string,
						};
						const position = this.getNodeParameter('position', i, '') as string;
						if (position) body.position = position;
						const dm = this.getNodeParameter('decisionMaker', i, false) as boolean;
						if (dm) body.decision_maker = dm;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.linkToCompany',
							body,
						);
					} else if (operation === 'unlinkFromCompany') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.unlinkFromCompany',
							{
								id: this.getNodeParameter('id', i) as string,
								company_id: this.getNodeParameter('companyId', i) as string,
							},
						);
					} else if (operation === 'updateCompanyLink') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							company_id: this.getNodeParameter('companyId', i) as string,
						};
						const position = this.getNodeParameter('position', i, '') as string;
						if (position) body.position = position;
						const dm = this.getNodeParameter('decisionMaker', i, false) as boolean;
						body.decision_maker = dm;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.updateCompanyLink',
							body,
						);
					} else if (operation === 'uploadAvatar') {
						const id = this.getNodeParameter('id', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/contacts.uploadAvatar', { id, image: image || null });
					}
				}

				// ==============================
				//         COMPANY
				// ==============================
				else if (resource === 'company') {
					if (operation === 'create') {
						const body: IDataObject = {
							name: this.getNodeParameter('name', i) as string,
						};
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						Object.assign(body, processContactCompanyFields(additionalFields));
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.add',
							body,
						);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.info',
							{ id },
						);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/companies.list');
					} else if (operation === 'update') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
						};
						const updateFields = this.getNodeParameter(
							'updateFields',
							i,
						) as IDataObject;
						Object.assign(body, processContactCompanyFields(updateFields));
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.update',
							body,
						);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.delete',
							{ id },
						);
					} else if (operation === 'tag') {
						const id = this.getNodeParameter('id', i) as string;
						const tags = this.getNodeParameter('tags', i) as string[];
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.tag',
							{ id, tags },
						);
					} else if (operation === 'untag') {
						const id = this.getNodeParameter('id', i) as string;
						const tags = this.getNodeParameter('tags', i) as string[];
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.untag',
							{ id, tags },
						);
					} else if (operation === 'uploadLogo') {
						const id = this.getNodeParameter('id', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/companies.uploadLogo', { id, image: image || null });
					}
				}

				// ==============================
				//         CUSTOM FIELD
				// ==============================
				else if (resource === 'customField') {
					if (operation === 'create') {
						const body: IDataObject = {
							label: this.getNodeParameter('label', i) as string,
							type: this.getNodeParameter('fieldType', i) as string,
							context: this.getNodeParameter('context', i) as string,
						};
						const config = this.getNodeParameter('configuration', i, '{}') as string;
						if (config && config !== '{}') {
							body.configuration = JSON.parse(config);
						}
						responseData = await teamleaderApiRequest.call(this, 'POST', '/customFieldDefinitions.create', body);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/customFieldDefinitions.info',
							{ id },
						);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(
							this,
							i,
							'/customFieldDefinitions.list',
						);
					}
				}

				// ==============================
				//         DEAL
				// ==============================
				else if (resource === 'deal') {
					if (operation === 'create') {
						const customerType = this.getNodeParameter(
							'customerType',
							i,
						) as string;
						const customerId = this.getNodeParameter('customerId', i) as string;
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							customer: { type: customerType, id: customerId },
						};
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.create',
							body,
						);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.info',
							{ id },
						);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/deals.list');
					} else if (operation === 'update') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
						};
						const updateFields = this.getNodeParameter(
							'updateFields',
							i,
						) as IDataObject;
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.update',
							body,
						);
					} else if (operation === 'move') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.move',
							{
								id: this.getNodeParameter('id', i) as string,
								phase_id: this.getNodeParameter('phaseId', i) as string,
							},
						);
					} else if (operation === 'win') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.win',
							{
								id: this.getNodeParameter('id', i) as string,
							},
						);
					} else if (operation === 'lose') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
						};
						const reasonId = this.getNodeParameter('reasonId', i, '') as string;
						if (reasonId) body.reason_id = reasonId;
						const extraInfo = this.getNodeParameter('extraInfo', i, '') as string;
						if (extraInfo) body.extra_info = extraInfo;
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.lose',
							body,
						);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.delete',
							{ id: this.getNodeParameter('id', i) as string },
						);
					}
				}

				// ==============================
				//         DEAL PIPELINE
				// ==============================
				else if (resource === 'dealPipeline') {
					if (operation === 'create') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.create',
							{ name: this.getNodeParameter('name', i) as string },
						);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(
							this,
							i,
							'/dealPipelines.list',
						);
					} else if (operation === 'update') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
						};
						const updateFields = this.getNodeParameter(
							'updateFields',
							i,
						) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.update',
							body,
						);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.delete',
							{ id: this.getNodeParameter('id', i) as string },
						);
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.duplicate',
							{ id: this.getNodeParameter('id', i) as string },
						);
					} else if (operation === 'markAsDefault') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.markAsDefault',
							{ id: this.getNodeParameter('id', i) as string },
						);
					}
				}

				// ==============================
				//         DEAL PHASE
				// ==============================
				else if (resource === 'dealPhase') {
					if (operation === 'create') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPhases.create',
							{
								pipeline_id: this.getNodeParameter('pipelineId', i) as string,
								name: this.getNodeParameter('name', i) as string,
							},
						);
					} else if (operation === 'getMany') {
						const body: IDataObject = {
							pipeline_id: this.getNodeParameter('pipelineId', i) as string,
						};
						responseData = await handleGetMany.call(
							this,
							i,
							'/dealPhases.list',
							body,
						);
					} else if (operation === 'update') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
						};
						const updateFields = this.getNodeParameter(
							'updateFields',
							i,
						) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPhases.update',
							body,
						);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPhases.delete',
							{ id: this.getNodeParameter('id', i) as string },
						);
					} else if (operation === 'move') {
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPhases.move',
							{
								id: this.getNodeParameter('id', i) as string,
								position: this.getNodeParameter('position', i) as number,
							},
						);
					}
				}

				// ==============================
				//         QUOTATION
				// ==============================
				else if (resource === 'quotation') {
					if (operation === 'download') {
						const result = await handleDocumentDownload.call(this, i, '/quotations.download', 'quotation');
						returnData.push(result);
						continue;
					}
					responseData = await handleResourceOperation.call(this, i, 'quotation', operation, {
						create: { endpoint: '/quotations.create', requiredFields: ['customerType', 'customerId', 'groupedLines'], buildBody: buildQuotationBody },
						get: { endpoint: '/quotations.info', idField: 'id' },
						getMany: { endpoint: '/quotations.list' },
						update: { endpoint: '/quotations.update', idField: 'id', hasUpdateFields: true },
						delete: { endpoint: '/quotations.delete', idField: 'id' },
						send: { endpoint: '/quotations.send', idField: 'id' },
						accept: { endpoint: '/quotations.accept', idField: 'id' },
					});
				}

				// ==============================
				//         INVOICE
				// ==============================
				else if (resource === 'invoice') {
					if (operation === 'download') {
						const result = await handleDocumentDownload.call(this, i, '/invoices.download', 'invoice');
						returnData.push(result);
						continue;
					}
					responseData = await handleResourceOperation.call(this, i, 'invoice', operation, {
						draft: { endpoint: '/invoices.draft', requiredFields: ['customerType', 'customerId', 'departmentId', 'groupedLines'], buildBody: buildInvoiceBody },
						copy: { endpoint: '/invoices.copy', idField: 'id' },
						get: { endpoint: '/invoices.info', idField: 'id' },
						getMany: { endpoint: '/invoices.list' },
						update: { endpoint: '/invoices.update', idField: 'id', hasUpdateFields: true },
						updateBooked: { endpoint: '/invoices.updateBooked', idField: 'id', hasUpdateFields: true },
						book: { endpoint: '/invoices.book', idField: 'id' },
						send: { endpoint: '/invoices.send', idField: 'id' },
						registerPayment: { endpoint: '/invoices.registerPayment', buildBody: buildInvoicePaymentBody },
						removePayments: { endpoint: '/invoices.removePayments', idField: 'id' },
						credit: { endpoint: '/invoices.credit', idField: 'id' },
						creditPartially: { endpoint: '/invoices.creditPartially', buildBody: buildInvoiceCreditPartiallyBody },
						delete: { endpoint: '/invoices.delete', idField: 'id' },
						sendViaPeppol: { endpoint: '/invoices.sendViaPeppol', idField: 'id' },
					});
				}

				// ==============================
				//         CREDIT NOTE
				// ==============================
				else if (resource === 'creditNote') {
					if (operation === 'get') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/creditNotes.info', { id });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/creditNotes.list');
					} else if (operation === 'download') {
						const result = await handleDocumentDownload.call(this, i, '/creditNotes.download', 'creditNote');
						returnData.push(result);
						continue;
					} else if (operation === 'sendViaPeppol') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/creditNotes.sendViaPeppol', { id });
					}
				}

				// ==============================
				//         SUBSCRIPTION
				// ==============================
				else if (resource === 'subscription') {
					if (operation === 'create') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							customer: {
								type: this.getNodeParameter('customerType', i) as string,
								id: this.getNodeParameter('customerId', i) as string,
							},
							department_id: this.getNodeParameter('departmentId', i) as string,
							invoicing_method: this.getNodeParameter('invoicingMethod', i) as string,
							billing_cycle: this.getNodeParameter('billingCycle', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/subscriptions.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/subscriptions.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/subscriptions.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/subscriptions.update', body);
					} else if (operation === 'deactivate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/subscriptions.deactivate', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         INCOMING INVOICE
				// ==============================
				else if (resource === 'incomingInvoice') {
					if (operation === 'listPayments') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingInvoices.listPayments', { id });
					} else if (operation === 'registerPayment') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							payment: {
								amount: this.getNodeParameter('amount', i) as number,
								currency: this.getNodeParameter('currency', i) as string,
							},
							paid_at: this.getNodeParameter('paidAt', i) as string,
						};
						const extra = this.getNodeParameter('paymentAdditionalFields', i, {}) as IDataObject;
						assignDefined(body, extra);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingInvoices.registerPayment', body);
					} else if (operation === 'removePayment') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingInvoices.removePayment', {
							id: this.getNodeParameter('id', i) as string,
							payment_id: this.getNodeParameter('paymentId', i) as string,
						});
					} else if (operation === 'updatePayment') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							payment_id: this.getNodeParameter('paymentId', i) as string,
						};
						const fields = this.getNodeParameter('paymentUpdateFields', i, {}) as IDataObject;
						if (fields.amount || fields.currency) {
							body.payment = {} as IDataObject;
							if (fields.amount) (body.payment as IDataObject).amount = fields.amount;
							if (fields.currency) (body.payment as IDataObject).currency = fields.currency;
							delete fields.amount;
							delete fields.currency;
						}
						assignDefined(body, fields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingInvoices.updatePayment', body);
					} else {
						responseData = await handleSimpleCrud.call(this, i, operation, {
							add: '/incomingInvoices.add',
							get: '/incomingInvoices.info',
							update: '/incomingInvoices.update',
							delete: '/incomingInvoices.delete',
							approve: '/incomingInvoices.approve',
							refuse: '/incomingInvoices.refuse',
							markPending: '/incomingInvoices.markAsPendingReview',
							sendToBookkeeping: '/incomingInvoices.sendToBookkeeping',
						});
					}
				}

				// ==============================
				//         INCOMING CREDIT NOTE
				// ==============================
				else if (resource === 'incomingCreditNote') {
					if (operation === 'listPayments') {
						const id = this.getNodeParameter('id', i) as string;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingCreditNotes.listPayments', { id });
					} else if (operation === 'registerPayment') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							payment: {
								amount: this.getNodeParameter('amount', i) as number,
								currency: this.getNodeParameter('currency', i) as string,
							},
							paid_at: this.getNodeParameter('paidAt', i) as string,
						};
						const extra = this.getNodeParameter('paymentAdditionalFields', i, {}) as IDataObject;
						assignDefined(body, extra);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingCreditNotes.registerPayment', body);
					} else if (operation === 'removePayment') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingCreditNotes.removePayment', {
							id: this.getNodeParameter('id', i) as string,
							payment_id: this.getNodeParameter('paymentId', i) as string,
						});
					} else if (operation === 'updatePayment') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							payment_id: this.getNodeParameter('paymentId', i) as string,
						};
						const fields = this.getNodeParameter('paymentUpdateFields', i, {}) as IDataObject;
						if (fields.amount || fields.currency) {
							body.payment = {} as IDataObject;
							if (fields.amount) (body.payment as IDataObject).amount = fields.amount;
							if (fields.currency) (body.payment as IDataObject).currency = fields.currency;
							delete fields.amount;
							delete fields.currency;
						}
						assignDefined(body, fields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingCreditNotes.updatePayment', body);
					} else {
						responseData = await handleSimpleCrud.call(this, i, operation, {
							add: '/incomingCreditNotes.add',
							get: '/incomingCreditNotes.info',
							update: '/incomingCreditNotes.update',
							delete: '/incomingCreditNotes.delete',
							approve: '/incomingCreditNotes.approve',
							refuse: '/incomingCreditNotes.refuse',
							markPending: '/incomingCreditNotes.markAsPendingReview',
							sendToBookkeeping: '/incomingCreditNotes.sendToBookkeeping',
						});
					}
				}

				// ==============================
				//         EVENT
				// ==============================
				else if (resource === 'event') {
					if (operation === 'create') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							activity_type_id: this.getNodeParameter('activity_type_id', i) as string,
							starts_at: this.getNodeParameter('starts_at', i) as string,
							ends_at: this.getNodeParameter('ends_at', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/events.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/events.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/events.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/events.update', body);
					} else if (operation === 'cancel') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/events.cancel', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         MEETING
				// ==============================
				else if (resource === 'meeting') {
					if (operation === 'schedule') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							starts_at: this.getNodeParameter('starts_at', i) as string,
							ends_at: this.getNodeParameter('ends_at', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.schedule', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/meetings.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.update', body);
					} else if (operation === 'complete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.complete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'createReport') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.createReport', {
							id: this.getNodeParameter('id', i) as string,
							body: this.getNodeParameter('reportBody', i) as string,
						});
					}
				}

				// ==============================
				//         CALL
				// ==============================
				else if (resource === 'call') {
					if (operation === 'add') {
						const body: IDataObject = {
							caller: {
								type: this.getNodeParameter('callerType', i) as string,
								id: this.getNodeParameter('callerId', i) as string,
							},
							callee: {
								type: this.getNodeParameter('calleeType', i) as string,
								id: this.getNodeParameter('calleeId', i) as string,
							},
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.add', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/calls.list');
					} else if (operation === 'complete') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const outcomeId = this.getNodeParameter('outcome_id', i, '') as string;
						if (outcomeId) body.outcome_id = outcomeId;
						const summary = this.getNodeParameter('summary', i, '') as string;
						if (summary) body.summary = summary;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.complete', body);
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.update', body);
					}
				}

				// ==============================
				//         TIME TRACKING
				// ==============================
				else if (resource === 'timeTracking') {
					if (operation === 'add') {
						const body: IDataObject = {
							work_type_id: this.getNodeParameter('work_type_id', i) as string,
							started_at: this.getNodeParameter('started_at', i) as string,
							duration: this.getNodeParameter('duration', i) as number,
							subject: {
								type: this.getNodeParameter('subjectType', i) as string,
								id: this.getNodeParameter('subjectId', i) as string,
							},
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.add', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/timeTracking.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'resume') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.resume', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         TIMER
				// ==============================
				else if (resource === 'timer') {
					if (operation === 'getCurrent') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timers.current');
					} else if (operation === 'start') {
						const body: IDataObject = {};
						const workTypeId = this.getNodeParameter('work_type_id', i, '') as string;
						if (workTypeId) body.work_type_id = workTypeId;
						const subjectType = this.getNodeParameter('subjectType', i, '') as string;
						if (subjectType) {
							body.subject = {
								type: subjectType,
								id: this.getNodeParameter('subjectId', i) as string,
							};
						}
						const description = this.getNodeParameter('description', i, '') as string;
						if (description) body.description = description;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timers.start', body);
					} else if (operation === 'stop') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timers.stop');
					} else if (operation === 'update') {
						const body: IDataObject = {};
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timers.update', body);
					}
				}

				// ==============================
				//         NOTE
				// ==============================
				else if (resource === 'note') {
					if (operation === 'create') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/notes.create', {
							subject: {
								type: this.getNodeParameter('subjectType', i) as string,
								id: this.getNodeParameter('subjectId', i) as string,
							},
							content: this.getNodeParameter('content', i) as string,
						});
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/notes.list');
					} else if (operation === 'update') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/notes.update', {
							id: this.getNodeParameter('id', i) as string,
							content: this.getNodeParameter('content', i) as string,
						});
					}
				}

				// ==============================
				//         TASK (todos)
				// ==============================
				else if (resource === 'task') {
					if (operation === 'create') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							due_date: this.getNodeParameter('dueDate', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.customer_type && additionalFields.customer_id) {
							body.customer = {
								type: additionalFields.customer_type,
								id: additionalFields.customer_id,
							};
							delete additionalFields.customer_type;
							delete additionalFields.customer_id;
						}
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/tasks.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'complete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.complete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'reopen') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.reopen', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'schedule') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tasks.schedule', {
							id: this.getNodeParameter('id', i) as string,
							scheduled_at: this.getNodeParameter('scheduledAt', i) as string,
						});
					}
				}

				// ==============================
				//         PROJECT (v2)
				// ==============================
				else if (resource === 'project') {
					if (operation === 'create') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							billing_method: this.getNodeParameter('billingMethod', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/projects.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.update', body);
					} else if (operation === 'close') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.close', {
							id: this.getNodeParameter('id', i) as string,
							closing_strategy: this.getNodeParameter('closingStrategy', i) as string,
						});
					} else if (operation === 'reopen') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.reopen', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.duplicate', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.delete', {
							id: this.getNodeParameter('id', i) as string,
							delete_strategy: this.getNodeParameter('deleteStrategy', i) as string,
						});
					} else if (operation === 'addOwner') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.addOwner', {
							id: this.getNodeParameter('id', i) as string,
							user_id: this.getNodeParameter('userId', i) as string,
						});
					} else if (operation === 'removeOwner') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.removeOwner', {
							id: this.getNodeParameter('id', i) as string,
							user_id: this.getNodeParameter('userId', i) as string,
						});
					} else if (operation === 'assign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.assign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					} else if (operation === 'unassign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.unassign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					} else if (operation === 'addCustomer') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.addCustomer', {
							id: this.getNodeParameter('id', i) as string,
							customer: {
								type: this.getNodeParameter('customerType', i) as string,
								id: this.getNodeParameter('customerId', i) as string,
							},
						});
					} else if (operation === 'removeCustomer') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.removeCustomer', {
							id: this.getNodeParameter('id', i) as string,
							customer: {
								type: this.getNodeParameter('customerType', i) as string,
								id: this.getNodeParameter('customerId', i) as string,
							},
						});
					} else if (operation === 'addDeal') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.addDeal', {
							id: this.getNodeParameter('id', i) as string,
							deal_id: this.getNodeParameter('dealId', i) as string,
						});
					} else if (operation === 'removeDeal') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.removeDeal', {
							id: this.getNodeParameter('id', i) as string,
							deal_id: this.getNodeParameter('dealId', i) as string,
						});
					} else if (operation === 'addQuotation') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.addQuotation', {
							id: this.getNodeParameter('id', i) as string,
							quotation_id: this.getNodeParameter('quotationId', i) as string,
						});
					} else if (operation === 'removeQuotation') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.removeQuotation', {
							id: this.getNodeParameter('id', i) as string,
							quotation_id: this.getNodeParameter('quotationId', i) as string,
						});
					}
				}

				// ==============================
				//         PROJECT GROUP
				// ==============================
				else if (resource === 'projectGroup') {
					if (operation === 'create') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.create', {
							project_id: this.getNodeParameter('projectId', i) as string,
							name: this.getNodeParameter('name', i) as string,
						});
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/projectGroups.list', {
							project_id: this.getNodeParameter('projectId', i) as string,
						});
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.delete', {
							id: this.getNodeParameter('id', i) as string,
							delete_strategy: this.getNodeParameter('deleteStrategy', i) as string,
						});
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.duplicate', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'assign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.assign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					} else if (operation === 'unassign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.unassign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					}
				}

				// ==============================
				//         PROJECT TASK
				// ==============================
				else if (resource === 'projectTask') {
					if (operation === 'create') {
						const body: IDataObject = {
							project_id: this.getNodeParameter('projectId', i) as string,
							title: this.getNodeParameter('title', i) as string,
							group_id: this.getNodeParameter('groupId', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/tasks.list', {
							project_id: this.getNodeParameter('projectId', i) as string,
						});
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.delete', {
							id: this.getNodeParameter('id', i) as string,
							delete_strategy: this.getNodeParameter('deleteStrategy', i) as string,
						});
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.duplicate', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'assign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.assign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					} else if (operation === 'unassign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.unassign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					}
				}

				// ==============================
				//         PROJECT MATERIAL
				// ==============================
				else if (resource === 'projectMaterial') {
					if (operation === 'create') {
						const body: IDataObject = {
							project_id: this.getNodeParameter('projectId', i) as string,
							title: this.getNodeParameter('title', i) as string,
							group_id: this.getNodeParameter('groupId', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/materials.list', {
							project_id: this.getNodeParameter('projectId', i) as string,
						});
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.duplicate', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'assign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.assign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					} else if (operation === 'unassign') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.unassign', {
							id: this.getNodeParameter('id', i) as string,
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					}
				}

				// ==============================
				//         PRODUCT
				// ==============================
				else if (resource === 'product') {
					if (operation === 'create') {
						const body: IDataObject = { name: this.getNodeParameter('name', i) as string };
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/products.add', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/products.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/products.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/products.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/products.delete', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         TICKET
				// ==============================
				else if (resource === 'ticket') {
					if (operation === 'create') {
						const body: IDataObject = {
							subject: this.getNodeParameter('subject', i) as string,
							message: this.getNodeParameter('message', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.customer_type && additionalFields.customer_id) {
							body.customer = { type: additionalFields.customer_type, id: additionalFields.customer_id };
							delete additionalFields.customer_type;
							delete additionalFields.customer_id;
						}
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/tickets.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.update', body);
					} else if (operation === 'listMessages') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.listMessages', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMessage') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.getMessage', { id: this.getNodeParameter('messageId', i) as string });
					} else if (operation === 'addReply') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.addReply', {
							id: this.getNodeParameter('id', i) as string,
							body: this.getNodeParameter('body', i) as string,
						});
					} else if (operation === 'addInternalMessage') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.addInternalMessage', {
							id: this.getNodeParameter('id', i) as string,
							body: this.getNodeParameter('body', i) as string,
						});
					} else if (operation === 'importMessage') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/tickets.importMessage', {
							id: this.getNodeParameter('id', i) as string,
							body: this.getNodeParameter('importMessageBody', i) as string,
							sent_by: {
								type: this.getNodeParameter('sentByType', i) as string,
								id: this.getNodeParameter('sentById', i) as string,
							},
							sent_at: this.getNodeParameter('sentAt', i) as string,
						});
					}
				}

				// ==============================
				//         USER
				// ==============================
				else if (resource === 'user') {
					if (operation === 'getCurrent') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/users.me');
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/users.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/users.list');
					} else if (operation === 'getWeekSchedule') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/users.getWeekSchedule', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'listDaysOff') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						if (Object.keys(filters).length) body.filter = buildFilter(filters);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/users.listDaysOff', body);
					}
				}

				// ==============================
				//         DEPARTMENT
				// ==============================
				else if (resource === 'department') {
					if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/departments.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/departments.list');
					}
				}

				// ==============================
				//         TEAM
				// ==============================
				else if (resource === 'team') {
					if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/teams.list');
					}
				}

				// ==============================
				//         FILE
				// ==============================
				else if (resource === 'file') {
					if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/files.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/files.list', {
							filter: {
								subject: {
									type: this.getNodeParameter('subjectType', i) as string,
									id: this.getNodeParameter('subjectId', i) as string,
								},
							},
						});
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/files.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'download') {
						const id = this.getNodeParameter('id', i) as string;
						const binaryPropertyName = this.getNodeParameter('downloadBinaryPropertyName', i) as string;

						// Step 1: Get file metadata for name and mime type
						const fileInfo = await teamleaderApiRequest.call(this, 'POST', '/files.info', { id });
						const fileData = fileInfo.data as IDataObject;
						const fileName = (fileData.name as string) || 'file';
						const mimeType = (fileData.mime_type as string) || 'application/octet-stream';

						// Step 2: Get presigned download URL
						const downloadResponse = await teamleaderApiRequest.call(this, 'POST', '/files.download', { id });
						const downloadUrl = ((downloadResponse.data as IDataObject).location as string);

						// Step 3: Download the actual file from S3
						const fileBuffer = await this.helpers.httpRequest({
							method: 'GET',
							url: downloadUrl,
							encoding: 'arraybuffer',
						});

						// Step 4: Create binary data output
						const binary = await this.helpers.prepareBinaryData(
							Buffer.from(fileBuffer as ArrayBuffer),
							fileName,
							mimeType,
						);

						returnData.push({
							json: fileData,
							binary: { [binaryPropertyName]: binary },
							pairedItem: { item: i },
						});
						continue;
					} else if (operation === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const fileNameOverride = this.getNodeParameter('fileName', i, '') as string;

						// Step 1: Get binary data from input
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						const actualFileName = fileNameOverride || binaryData.fileName || 'file';

						// Step 2: Get presigned upload URL from Teamleader
						const uploadResponse = await teamleaderApiRequest.call(this, 'POST', '/files.upload', {
							name: actualFileName,
							subject: {
								type: this.getNodeParameter('subjectType', i) as string,
								id: this.getNodeParameter('subjectId', i) as string,
							},
						});
						const uploadUrl = ((uploadResponse.data as IDataObject).location as string);

						// Step 3: Upload binary to presigned URL
						await this.helpers.httpRequest({
							method: 'POST',
							url: uploadUrl,
							body: buffer,
							headers: {
								'Content-Type': binaryData.mimeType || 'application/octet-stream',
							},
						});

						responseData = uploadResponse;
					}
				}

				// ==============================
				//         DAY OFF
				// ==============================
				else if (resource === 'dayOff') {
					if (operation === 'import') {
						const daysOff = JSON.parse(this.getNodeParameter('daysOff', i) as string);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/daysOff.import', { days_off: daysOff });
					} else if (operation === 'bulkDelete') {
						const daysOff = JSON.parse(this.getNodeParameter('daysOff', i) as string);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/daysOff.bulkDelete', { days_off: daysOff });
					} else if (operation === 'listTypes') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/dayOffTypes.list');
					} else if (operation === 'createType') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/dayOffTypes.create', { name: this.getNodeParameter('name', i) as string });
					} else if (operation === 'updateType') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/dayOffTypes.update', body);
					} else if (operation === 'deleteType') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/dayOffTypes.delete', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         CLOSING DAY
				// ==============================
				else if (resource === 'closingDay') {
					if (operation === 'add') {
						const body: IDataObject = {
							date: this.getNodeParameter('date', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/closingDays.add', body);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/closingDays.list');
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/closingDays.delete', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         EMAIL TRACKING
				// ==============================
				else if (resource === 'emailTracking') {
					if (operation === 'create') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/emailTracking.create', {
							subject: {
								type: this.getNodeParameter('subjectType', i) as string,
								id: this.getNodeParameter('subjectId', i) as string,
							},
							url: this.getNodeParameter('url', i) as string,
						});
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/emailTracking.list');
					}
				}

				// ==============================
				//         WEBHOOK (management)
				// ==============================
				else if (resource === 'webhook') {
					if (operation === 'register') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/webhooks.register', {
							url: this.getNodeParameter('url', i) as string,
							types: this.getNodeParameter('types', i) as string[],
						});
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/webhooks.list');
					} else if (operation === 'unregister') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/webhooks.unregister', {
							id: this.getNodeParameter('id', i) as string,
						});
					}
				}

				// ==============================
				//         EXTERNAL PARTY
				// ==============================
				else if (resource === 'externalParty') {
					if (operation === 'addToProject') {
						const body: IDataObject = {
							project_id: this.getNodeParameter('projectId', i) as string,
							customer: {
								type: this.getNodeParameter('customerType', i) as string,
								id: this.getNodeParameter('customerId', i) as string,
							},
						};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/externalParties.addToProject', body);
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						if (updateFields.customer_type && updateFields.customer_id) {
							body.customer = { type: updateFields.customer_type, id: updateFields.customer_id };
							delete updateFields.customer_type;
							delete updateFields.customer_id;
						}
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/externalParties.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/externalParties.delete', { id: this.getNodeParameter('id', i) as string });
					}
				}

				// ==============================
				//         PROJECT LINE
				// ==============================
				else if (resource === 'projectLine') {
					if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/projectLines.list', {
							project_id: this.getNodeParameter('projectId', i) as string,
						});
					} else if (operation === 'addToGroup') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectLines.addToGroup', {
							line_id: this.getNodeParameter('lineId', i) as string,
							group_id: this.getNodeParameter('groupId', i) as string,
						});
					} else if (operation === 'removeFromGroup') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectLines.removeFromGroup', {
							line_id: this.getNodeParameter('lineId', i) as string,
						});
					}
				}

				// ==============================
				//         RECEIPT
				// ==============================
				else if (resource === 'receipt') {
					if (operation === 'add') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							currency: { code: this.getNodeParameter('currencyCode', i) as string },
						};
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						// Handle total_amount → nested total.tax_inclusive.amount
						if (additionalFields.total_amount !== undefined && additionalFields.total_amount !== '') {
							body.total = { tax_inclusive: { amount: additionalFields.total_amount } };
							delete additionalFields.total_amount;
						}
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.add', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'approve') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.approve', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'refuse') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.refuse', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'markPending') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.markAsPendingReview', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'sendToBookkeeping') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.sendToBookkeeping', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.update', body);
					} else if (operation === 'listPayments') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.listPayments', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'registerPayment') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							payment: {
								amount: this.getNodeParameter('amount', i) as number,
								currency: this.getNodeParameter('currency', i) as string,
							},
							paid_at: this.getNodeParameter('paidAt', i) as string,
						};
						const extra = this.getNodeParameter('paymentAdditionalFields', i, {}) as IDataObject;
						assignDefined(body, extra);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.registerPayment', body);
					} else if (operation === 'removePayment') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.removePayment', {
							id: this.getNodeParameter('id', i) as string,
							payment_id: this.getNodeParameter('paymentId', i) as string,
						});
					} else if (operation === 'updatePayment') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							payment_id: this.getNodeParameter('paymentId', i) as string,
						};
						const fields = this.getNodeParameter('paymentUpdateFields', i, {}) as IDataObject;
						if (fields.amount || fields.currency) {
							body.payment = {} as IDataObject;
							if (fields.amount) (body.payment as IDataObject).amount = fields.amount;
							if (fields.currency) (body.payment as IDataObject).currency = fields.currency;
							delete fields.amount;
							delete fields.currency;
						}
						assignDefined(body, fields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/receipts.updatePayment', body);
					}
				}

				// ==============================
				//         RESERVATION
				// ==============================
				else if (resource === 'reservation') {
					if (operation === 'create') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/reservations.create', {
							plannable_item_id: this.getNodeParameter('plannableItemId', i) as string,
							date: this.getNodeParameter('date', i) as string,
							duration: { value: this.getNodeParameter('durationValue', i) as number, unit: 'minutes' },
							assignee: {
								type: this.getNodeParameter('assigneeType', i) as string,
								id: this.getNodeParameter('assigneeId', i) as string,
							},
						});
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/reservations.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/reservations.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
						if (updateFields.duration_value) {
							body.duration = { value: updateFields.duration_value, unit: 'minutes' };
							delete updateFields.duration_value;
						}
						if (updateFields.assignee_type && updateFields.assignee_id) {
							body.assignee = { type: updateFields.assignee_type, id: updateFields.assignee_id };
							delete updateFields.assignee_type;
							delete updateFields.assignee_id;
						}
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/reservations.update', body);
					}
				}

				// ==============================
				//         ORDER
				// ==============================
				else if (resource === 'order') {
					if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/orders.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/orders.list');
					}
				}

				// ==============================
				//         PLANNABLE ITEM
				// ==============================
				else if (resource === 'plannableItem') {
					if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/plannableItems.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/plannableItems.list');
					}
				}

				// ==============================
				//         USER AVAILABILITY
				// ==============================
				else if (resource === 'userAvailability') {
					const body: IDataObject = {
						period: {
							start_date: this.getNodeParameter('startDate', i) as string,
							end_date: this.getNodeParameter('endDate', i) as string,
						},
					};
					const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
					if (filters.assignees) {
						body.filter = {
							assignees: (filters.assignees as string).split(',').map((id) => ({ type: 'user', id: id.trim() })),
						};
					}
					if (operation === 'getDaily') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/userAvailability.daily', body);
					} else if (operation === 'getTotal') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/userAvailability.total', body);
					}
				}

				// ==============================
				//         EXPENSE
				// ==============================
				else if (resource === 'expense') {
					if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/expenses.list');
					}
				}

				// ==============================
				//         BOOKKEEPING SUBMISSION
				// ==============================
				else if (resource === 'bookkeepingSubmission') {
					if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/bookkeepingSubmissions.list');
					}
				}

				// Build output
				if (responseData !== undefined) {
					if (Array.isArray(responseData)) {
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					} else {
						const data = (responseData.data as IDataObject) ?? responseData;
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(data),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// ============================================================
//                    HELPER FUNCTIONS
// ============================================================

async function loadCustomFields(
	this: ILoadOptionsFunctions,
	context: string,
): Promise<INodePropertyOptions[]> {
	const data = await teamleaderApiRequestAllItems.call(
		this,
		'/customFieldDefinitions.list',
		{ filter: { context } },
	);
	return data.map((cf) => ({
		name: cf.label as string,
		value: cf.id as string,
	}));
}

function addCustomFieldsToBody(
	this: IExecuteFunctions,
	body: IDataObject,
	itemIndex: number,
	isUpdate = false,
): void {
	const customFieldsData = this.getNodeParameter('customFields', itemIndex, {}) as IDataObject;
	const fields = (customFieldsData.field as Array<{ fieldId: string; fieldValue: string }>) ?? [];
	if (fields.length > 0) {
		body.custom_fields = mapCustomFields(fields);
		if (isUpdate) {
			body.custom_fields_update_strategy = 'partial';
		}
	}
}

async function handleGetMany(
	this: IExecuteFunctions,
	itemIndex: number,
	endpoint: string,
	extraBody: IDataObject = {},
): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
	const body: IDataObject = { ...extraBody };

	// Add filters
	try {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		if (Object.keys(filters).length > 0) {
			const filter = buildFilter(filters);
			// Handle comma-separated IDs
			if (filter.ids && typeof filter.ids === 'string') {
				filter.ids = (filter.ids as string).split(',').map((id) => id.trim());
			}
			body.filter = filter;
		}
	} catch {
		// No filters parameter for this resource
	}

	// Add sort
	try {
		const sort = this.getNodeParameter('sort', itemIndex, {}) as IDataObject;
		if (sort.field) {
			body.sort = [{ field: sort.field, order: sort.order || 'asc' }];
		}
	} catch {
		// No sort parameter for this resource
	}

	if (returnAll) {
		return teamleaderApiRequestAllItems.call(this, endpoint, body);
	}

	const limit = this.getNodeParameter('limit', itemIndex) as number;
	body.page = { size: limit, number: 1 };
	const response = await teamleaderApiRequest.call(this, 'POST', endpoint, body);
	return (response.data as IDataObject[]) ?? [];
}

function processContactCompanyFields(fields: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(fields)) {
		if (value === '' || value === undefined || value === null) continue;

		if (key === 'email') {
			result.emails = [{ type: 'primary', email: value }];
		} else if (key === 'telephone') {
			result.telephones = [{ type: 'phone', number: value }];
		} else if (key === 'addressLine1' || key === 'postalCode' || key === 'city' || key === 'country') {
			if (!result._address) result._address = {};
			const addressMap: Record<string, string> = {
				addressLine1: 'line_1',
				postalCode: 'postal_code',
				city: 'city',
				country: 'country',
			};
			(result._address as IDataObject)[addressMap[key]] = value;
		} else {
			result[key] = value;
		}
	}

	if (result._address) {
		result.addresses = [{ type: 'primary', address: result._address }];
		delete result._address;
	}

	return result;
}

function assignDefined(target: IDataObject, source: IDataObject): void {
	for (const [key, value] of Object.entries(source)) {
		if (value !== '' && value !== undefined && value !== null) {
			target[key] = value;
		}
	}
}

// Flexible operation handlers for resources with many operations
async function handleSimpleCrud(
	this: IExecuteFunctions,
	itemIndex: number,
	operation: string,
	endpoints: Record<string, string>,
): Promise<IDataObject> {
	const endpoint = endpoints[operation];
	if (!endpoint) {
		throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
	}

	if (operation === 'add' || operation === 'create') {
		const body: IDataObject = {};
		try {
			const departmentId = this.getNodeParameter('departmentId', itemIndex) as string;
			body.department_id = departmentId;
		} catch {
			// No department parameter
		}
		try {
			const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject;
			if (additionalFields.supplier_type && additionalFields.supplier_id) {
				body.supplier = { type: additionalFields.supplier_type, id: additionalFields.supplier_id };
				delete additionalFields.supplier_type;
				delete additionalFields.supplier_id;
			}
			assignDefined(body, additionalFields);
		} catch {
			// No additional fields
		}
		return teamleaderApiRequest.call(this, 'POST', endpoint, body);
	}

	if (operation === 'update') {
		const body: IDataObject = { id: this.getNodeParameter('id', itemIndex) as string };
		try {
			const updateFields = this.getNodeParameter('updateFields', itemIndex) as IDataObject;
			assignDefined(body, updateFields);
		} catch {
			// No update fields
		}
		return teamleaderApiRequest.call(this, 'POST', endpoint, body);
	}

	// Default: just send ID
	const id = this.getNodeParameter('id', itemIndex) as string;
	return teamleaderApiRequest.call(this, 'POST', endpoint, { id });
}

interface OperationConfig {
	endpoint: string;
	idField?: string;
	requiredFields?: string[];
	hasUpdateFields?: boolean;
	buildBody?: (context: IExecuteFunctions, itemIndex: number) => IDataObject;
}

async function handleResourceOperation(
	this: IExecuteFunctions,
	itemIndex: number,
	_resource: string,
	operation: string,
	operations: Record<string, OperationConfig>,
): Promise<IDataObject | IDataObject[]> {
	const config = operations[operation];
	if (!config) {
		throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
	}

	if (operation === 'getMany') {
		return handleGetMany.call(this, itemIndex, config.endpoint);
	}

	if (config.buildBody) {
		const body = config.buildBody(this, itemIndex);
		return teamleaderApiRequest.call(this, 'POST', config.endpoint, body);
	}

	if (config.idField) {
		const body: IDataObject = {
			id: this.getNodeParameter(config.idField, itemIndex) as string,
		};
		if (config.hasUpdateFields) {
			try {
				const updateFields = this.getNodeParameter('updateFields', itemIndex) as IDataObject;
				assignDefined(body, updateFields);
			} catch {
				// No update fields
			}
		}
		return teamleaderApiRequest.call(this, 'POST', config.endpoint, body);
	}

	return teamleaderApiRequest.call(this, 'POST', config.endpoint);
}

function buildQuotationBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = {
		customer: {
			type: context.getNodeParameter('customerType', itemIndex) as string,
			id: context.getNodeParameter('customerId', itemIndex) as string,
		},
		grouped_lines: JSON.parse(context.getNodeParameter('groupedLines', itemIndex) as string),
	};
	try {
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex) as IDataObject;
		assignDefined(body, additionalFields);
	} catch {
		// No additional fields
	}
	return body;
}

function buildInvoiceBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = {
		customer: {
			type: context.getNodeParameter('customerType', itemIndex) as string,
			id: context.getNodeParameter('customerId', itemIndex) as string,
		},
		department_id: context.getNodeParameter('departmentId', itemIndex) as string,
		grouped_lines: JSON.parse(context.getNodeParameter('groupedLines', itemIndex) as string),
	};
	try {
		const paymentTermType = context.getNodeParameter('paymentTermType', itemIndex) as string;
		const paymentTermDays = context.getNodeParameter('paymentTermDays', itemIndex) as number;
		body.payment_term = { type: paymentTermType, days: paymentTermDays };
	} catch {
		// No payment term
	}
	try {
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex) as IDataObject;
		assignDefined(body, additionalFields);
	} catch {
		// No additional fields
	}
	return body;
}

/**
 * Handle document download (invoices, credit notes, quotations).
 * Gets presigned URL from Teamleader, fetches the actual file, returns as binary.
 */
async function handleDocumentDownload(
	this: IExecuteFunctions,
	itemIndex: number,
	endpoint: string,
	resourceName: string,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('id', itemIndex) as string;
	const format = this.getNodeParameter('format', itemIndex, 'pdf') as string;
	const binaryPropertyName = this.getNodeParameter('downloadBinaryPropertyName', itemIndex, 'data') as string;

	// Step 1: Get presigned download URL
	const response = await teamleaderApiRequest.call(this, 'POST', endpoint, { id, format });
	const data = response.data as IDataObject;
	const downloadUrl = data.location as string;

	// Step 2: Download the actual file
	const fileBuffer = await this.helpers.httpRequest({
		method: 'GET',
		url: downloadUrl,
		encoding: 'arraybuffer',
	});

	// Step 3: Determine file extension and mime type from format
	let mimeType = 'application/pdf';
	let extension = 'pdf';
	if (format.startsWith('ubl')) {
		mimeType = 'application/xml';
		extension = 'xml';
	}
	const fileName = `${resourceName}-${id}.${extension}`;

	// Step 4: Create binary data
	const binary = await this.helpers.prepareBinaryData(
		Buffer.from(fileBuffer as ArrayBuffer),
		fileName,
		mimeType,
	);

	return {
		json: { id, format, location: downloadUrl },
		binary: { [binaryPropertyName]: binary },
		pairedItem: { item: itemIndex },
	};
}

function buildInvoicePaymentBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	return {
		id: context.getNodeParameter('id', itemIndex) as string,
		payment: {
			amount: context.getNodeParameter('amount', itemIndex) as number,
			currency: context.getNodeParameter('currency', itemIndex) as string,
		},
		paid_at: context.getNodeParameter('paidAt', itemIndex) as string,
		payment_method_id: context.getNodeParameter('paymentMethodId', itemIndex) as string,
	};
}

function buildInvoiceCreditPartiallyBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	return {
		id: context.getNodeParameter('id', itemIndex) as string,
		credit_note_lines: JSON.parse(context.getNodeParameter('creditNoteLines', itemIndex) as string),
	};
}
