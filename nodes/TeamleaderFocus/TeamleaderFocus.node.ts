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
	addIncludes,
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

// Utilities
import { accountOperations, accountFields } from './AccountDescription';
import { cloudPlatformOperations, cloudPlatformFields } from './CloudPlatformDescription';
import { currencyOperations, currencyFields } from './CurrencyDescription';
import { levelTwoAreaOperations, levelTwoAreaFields } from './LevelTwoAreaDescription';
import { mailTemplateOperations, mailTemplateFields } from './MailTemplateDescription';

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
					{ name: 'Account', value: 'account' },
					{ name: 'Bookkeeping Submission', value: 'bookkeepingSubmission' },
					{ name: 'Call', value: 'call' },
					{ name: 'Cloud Platform', value: 'cloudPlatform' },
					{ name: 'Closing Day', value: 'closingDay' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Credit Note', value: 'creditNote' },
					{ name: 'Currency', value: 'currency' },
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
					{ name: 'Level Two Area', value: 'levelTwoArea' },
					{ name: 'Mail Template', value: 'mailTemplate' },
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
			// Utilities
			...accountOperations,
			...accountFields,
			...cloudPlatformOperations,
			...cloudPlatformFields,
			...currencyOperations,
			...currencyFields,
			...levelTwoAreaOperations,
			...levelTwoAreaFields,
			...mailTemplateOperations,
			...mailTemplateFields,
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
			async getCallCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'callback');
			},
			async getMeetingCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'meeting');
			},
			async getMeetingReportCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'meeting_report');
			},
			async getProductCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'product');
			},
			async getSubscriptionCustomFields(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				return loadCustomFields.call(this, 'subscription');
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
						const infoBody: IDataObject = { id };
						addIncludes('/contacts.info', infoBody);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/contacts.info',
							infoBody,
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
						const infoBody: IDataObject = { id };
						addIncludes('/companies.info', infoBody);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/companies.info',
							infoBody,
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
						const lead: IDataObject = {
							customer: { type: customerType, id: customerId },
						};
						const contactPersonId = this.getNodeParameter('contactPersonId', i, '') as string;
						if (contactPersonId) lead.contact_person_id = contactPersonId;
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							lead,
						};
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
						) as IDataObject;
						// Nest estimated_value as {amount, currency}
						if (additionalFields.estimated_value_amount !== undefined && additionalFields.estimated_value_amount !== '') {
							body.estimated_value = {
								amount: additionalFields.estimated_value_amount,
								currency: additionalFields.estimated_value_currency || 'EUR',
							};
						}
						delete additionalFields.estimated_value_amount;
						delete additionalFields.estimated_value_currency;
						// Nest currency as {code, exchange_rate}
						if (additionalFields.currency_code) {
							body.currency = {
								code: additionalFields.currency_code,
								exchange_rate: additionalFields.currency_exchange_rate || 1,
							};
						}
						delete additionalFields.currency_code;
						delete additionalFields.currency_exchange_rate;
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
						const infoBody: IDataObject = { id };
						addIncludes('/deals.info', infoBody);
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/deals.info',
							infoBody,
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
						// Nest lead if customer fields are provided
						if (updateFields.customer_type && updateFields.customer_id) {
							const lead: IDataObject = {
								customer: { type: updateFields.customer_type, id: updateFields.customer_id },
							};
							if (updateFields.contact_person_id) {
								lead.contact_person_id = updateFields.contact_person_id;
							}
							body.lead = lead;
						}
						delete updateFields.customer_type;
						delete updateFields.customer_id;
						delete updateFields.contact_person_id;
						// Nest estimated_value as {amount, currency}
						if (updateFields.estimated_value_amount !== undefined && updateFields.estimated_value_amount !== '') {
							body.estimated_value = {
								amount: updateFields.estimated_value_amount,
								currency: updateFields.estimated_value_currency || 'EUR',
							};
						}
						delete updateFields.estimated_value_amount;
						delete updateFields.estimated_value_currency;
						// Nest currency as {code, exchange_rate}
						if (updateFields.currency_code) {
							body.currency = {
								code: updateFields.currency_code,
								exchange_rate: updateFields.currency_exchange_rate || 1,
							};
						}
						delete updateFields.currency_code;
						delete updateFields.currency_exchange_rate;
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
							name: this.getNodeParameter('name', i) as string,
						};
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.update',
							body,
						);
					} else if (operation === 'delete') {
						const deleteBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const migratePhasesRaw = this.getNodeParameter('migratePhases', i, '[]') as string;
						const migratePhases = typeof migratePhasesRaw === 'string' ? JSON.parse(migratePhasesRaw) : migratePhasesRaw;
						if (Array.isArray(migratePhases) && migratePhases.length > 0) {
							deleteBody.migrate_phases = migratePhases;
						}
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPipelines.delete',
							deleteBody,
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
						const phaseBody: IDataObject = {
							deal_pipeline_id: this.getNodeParameter('pipelineId', i) as string,
							name: this.getNodeParameter('name', i) as string,
							requires_attention_after: {
								amount: this.getNodeParameter('requiresAttentionAfterAmount', i) as number,
								unit: this.getNodeParameter('requiresAttentionAfterUnit', i) as string,
							},
						};
						try {
							const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
							assignDefined(phaseBody, additionalFields);
						} catch {
							// No additional fields
						}
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPhases.create',
							phaseBody,
						);
					} else if (operation === 'getMany') {
						const body: IDataObject = {
							filter: {
								deal_pipeline_id: this.getNodeParameter('pipelineId', i) as string,
							},
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
							name: this.getNodeParameter('name', i) as string,
							requires_attention_after: {
								amount: this.getNodeParameter('requiresAttentionAfterAmount', i) as number,
								unit: this.getNodeParameter('requiresAttentionAfterUnit', i) as string,
							},
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
						const moveBody: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							after_phase_id: this.getNodeParameter('afterPhaseId', i) as string,
						};
						responseData = await teamleaderApiRequest.call(
							this,
							'POST',
							'/dealPhases.move',
							moveBody,
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
						create: { endpoint: '/quotations.create', requiredFields: ['dealId'], buildBody: buildQuotationBody },
						get: { endpoint: '/quotations.info', idField: 'id' },
						getMany: { endpoint: '/quotations.list' },
						update: { endpoint: '/quotations.update', buildBody: buildQuotationUpdateBody },
						delete: { endpoint: '/quotations.delete', idField: 'id' },
						send: { endpoint: '/quotations.send', buildBody: buildQuotationSendBody },
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
						update: { endpoint: '/invoices.update', buildBody: buildInvoiceUpdateBody },
						updateBooked: { endpoint: '/invoices.updateBooked', buildBody: buildInvoiceUpdateBookedBody },
						book: { endpoint: '/invoices.book', buildBody: buildInvoiceBookBody },
						send: { endpoint: '/invoices.send', buildBody: buildInvoiceSendBody },
						registerPayment: { endpoint: '/invoices.registerPayment', buildBody: buildInvoicePaymentBody },
						removePayments: { endpoint: '/invoices.removePayments', idField: 'id' },
						credit: { endpoint: '/invoices.credit', buildBody: buildInvoiceCreditBody },
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
						const invoicee: IDataObject = {
							customer: {
								type: this.getNodeParameter('customerType', i) as string,
								id: this.getNodeParameter('customerId', i) as string,
							},
						};
						const billingCycle: IDataObject = {
							unit: this.getNodeParameter('billingCycleUnit', i) as string,
							period: this.getNodeParameter('billingCyclePeriod', i) as number,
							days_in_advance: this.getNodeParameter('billingCycleDaysInAdvance', i) as number,
						};
						const paymentTerm: IDataObject = {
							type: this.getNodeParameter('paymentTermType', i) as string,
							days: this.getNodeParameter('paymentTermDays', i) as number,
						};
						const invoiceGeneration: IDataObject = {
							action: this.getNodeParameter('invoiceGenerationAction', i) as string,
						};
						const invoiceGenPaymentMethod = this.getNodeParameter('invoiceGenerationPaymentMethod', i, '') as string;
						if (invoiceGenPaymentMethod) {
							invoiceGeneration.payment_method = invoiceGenPaymentMethod;
						}
						if (invoiceGeneration.action === 'book_and_send') {
							invoiceGeneration.sending_methods = this.getNodeParameter('invoiceGenerationSendingMethods', i, []) as string[];
						}
						const groupedLinesRaw = this.getNodeParameter('groupedLines', i) as string;
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							invoicee,
							department_id: this.getNodeParameter('departmentId', i) as string,
							starts_on: this.getNodeParameter('startsOn', i) as string,
							billing_cycle: billingCycle,
							grouped_lines: typeof groupedLinesRaw === 'string' ? JSON.parse(groupedLinesRaw) : groupedLinesRaw,
							payment_term: paymentTerm,
							invoice_generation: invoiceGeneration,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						// Handle for_attention_of fields
						if (additionalFields.for_attention_of_name) {
							invoicee.for_attention_of = { name: additionalFields.for_attention_of_name };
							delete additionalFields.for_attention_of_name;
						} else if (additionalFields.for_attention_of_contact_id) {
							invoicee.for_attention_of = { contact_id: additionalFields.for_attention_of_contact_id };
							delete additionalFields.for_attention_of_contact_id;
						}
						delete additionalFields.for_attention_of_name;
						delete additionalFields.for_attention_of_contact_id;
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/subscriptions.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/subscriptions.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/subscriptions.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Nest invoicee if customer or for_attention_of fields provided
						if (updateFields.customer_type || updateFields.for_attention_of_name || updateFields.for_attention_of_contact_id) {
							const invoicee: IDataObject = {};
							if (updateFields.customer_type && updateFields.customer_id) {
								invoicee.customer = { type: updateFields.customer_type, id: updateFields.customer_id };
							}
							if (updateFields.for_attention_of_name) {
								invoicee.for_attention_of = { name: updateFields.for_attention_of_name };
							} else if (updateFields.for_attention_of_contact_id) {
								invoicee.for_attention_of = { contact_id: updateFields.for_attention_of_contact_id };
							}
							body.invoicee = invoicee;
							delete updateFields.customer_type;
							delete updateFields.customer_id;
							delete updateFields.for_attention_of_name;
							delete updateFields.for_attention_of_contact_id;
						}
						// Build billing_cycle from structured fields
						if (updateFields.billing_cycle_unit) {
							body.billing_cycle = {
								unit: updateFields.billing_cycle_unit,
								period: updateFields.billing_cycle_period || 1,
								days_in_advance: updateFields.billing_cycle_days_in_advance ?? 0,
							};
							delete updateFields.billing_cycle_unit;
							delete updateFields.billing_cycle_period;
							delete updateFields.billing_cycle_days_in_advance;
						}
						// Build payment_term from structured fields
						if (updateFields.payment_term_type) {
							body.payment_term = {
								type: updateFields.payment_term_type,
								days: updateFields.payment_term_days ?? 30,
							};
							delete updateFields.payment_term_type;
							delete updateFields.payment_term_days;
						}
						// Parse grouped_lines JSON if provided
						if (updateFields.grouped_lines) {
							body.grouped_lines = typeof updateFields.grouped_lines === 'string'
								? JSON.parse(updateFields.grouped_lines as string) : updateFields.grouped_lines;
							delete updateFields.grouped_lines;
						}
						// Build invoice_generation from structured fields
						if (updateFields.invoice_generation_action) {
							const invoiceGen: IDataObject = {
								action: updateFields.invoice_generation_action,
							};
							if (updateFields.invoice_generation_payment_method) {
								invoiceGen.payment_method = updateFields.invoice_generation_payment_method;
							}
							if (updateFields.invoice_generation_action === 'book_and_send' && updateFields.invoice_generation_sending_methods) {
								invoiceGen.sending_methods = updateFields.invoice_generation_sending_methods;
							}
							body.invoice_generation = invoiceGen;
							delete updateFields.invoice_generation_action;
							delete updateFields.invoice_generation_payment_method;
							delete updateFields.invoice_generation_sending_methods;
						}
						// Nullable fields: send null to unlink
						for (const nullableField of ['project_id', 'deal_id']) {
							if (nullableField in updateFields && updateFields[nullableField] === '') {
								body[nullableField] = null;
								delete updateFields[nullableField];
							}
						}
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
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
					} else if (operation === 'add') {
						const addBody: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							currency: { code: this.getNodeParameter('currencyCode', i) as string },
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.total_tax_exclusive !== undefined || additionalFields.total_tax_inclusive !== undefined) {
							addBody.total = {} as IDataObject;
							if (additionalFields.total_tax_exclusive !== undefined) {
								(addBody.total as IDataObject).tax_exclusive = additionalFields.total_tax_exclusive;
								delete additionalFields.total_tax_exclusive;
							}
							if (additionalFields.total_tax_inclusive !== undefined) {
								(addBody.total as IDataObject).tax_inclusive = additionalFields.total_tax_inclusive;
								delete additionalFields.total_tax_inclusive;
							}
						}
						assignDefined(addBody, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingInvoices.add', addBody);
					} else if (operation === 'update') {
						const updBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						if (updateFields.currency_code) {
							updBody.currency = { code: updateFields.currency_code };
							delete updateFields.currency_code;
						}
						if (updateFields.total_tax_exclusive !== undefined || updateFields.total_tax_inclusive !== undefined) {
							updBody.total = {} as IDataObject;
							if (updateFields.total_tax_exclusive !== undefined) {
								(updBody.total as IDataObject).tax_exclusive = updateFields.total_tax_exclusive;
								delete updateFields.total_tax_exclusive;
							}
							if (updateFields.total_tax_inclusive !== undefined) {
								(updBody.total as IDataObject).tax_inclusive = updateFields.total_tax_inclusive;
								delete updateFields.total_tax_inclusive;
							}
						}
						assignDefined(updBody, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingInvoices.update', updBody);
					} else {
						responseData = await handleSimpleCrud.call(this, i, operation, {
							get: '/incomingInvoices.info',
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
					} else if (operation === 'add') {
						const addBody: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							currency: { code: this.getNodeParameter('currencyCode', i) as string },
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.total_tax_exclusive !== undefined || additionalFields.total_tax_inclusive !== undefined) {
							addBody.total = {} as IDataObject;
							if (additionalFields.total_tax_exclusive !== undefined) {
								(addBody.total as IDataObject).tax_exclusive = additionalFields.total_tax_exclusive;
								delete additionalFields.total_tax_exclusive;
							}
							if (additionalFields.total_tax_inclusive !== undefined) {
								(addBody.total as IDataObject).tax_inclusive = additionalFields.total_tax_inclusive;
								delete additionalFields.total_tax_inclusive;
							}
						}
						assignDefined(addBody, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingCreditNotes.add', addBody);
					} else if (operation === 'update') {
						const updBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						if (updateFields.currency_code) {
							updBody.currency = { code: updateFields.currency_code };
							delete updateFields.currency_code;
						}
						if (updateFields.total_tax_exclusive !== undefined || updateFields.total_tax_inclusive !== undefined) {
							updBody.total = {} as IDataObject;
							if (updateFields.total_tax_exclusive !== undefined) {
								(updBody.total as IDataObject).tax_exclusive = updateFields.total_tax_exclusive;
								delete updateFields.total_tax_exclusive;
							}
							if (updateFields.total_tax_inclusive !== undefined) {
								(updBody.total as IDataObject).tax_inclusive = updateFields.total_tax_inclusive;
								delete updateFields.total_tax_inclusive;
							}
						}
						assignDefined(updBody, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/incomingCreditNotes.update', updBody);
					} else {
						responseData = await handleSimpleCrud.call(this, i, operation, {
							get: '/incomingCreditNotes.info',
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
						// Extract attendees from fixedCollection
						if (additionalFields.attendees) {
							const attendeesData = additionalFields.attendees as IDataObject;
							body.attendees = ((attendeesData?.attendee as IDataObject[]) || []).map((a: IDataObject) => ({ type: a.type, id: a.id }));
							delete additionalFields.attendees;
						}
						// Extract links from fixedCollection
						if (additionalFields.links) {
							const linksData = additionalFields.links as IDataObject;
							body.links = ((linksData?.link as IDataObject[]) || []).map((l: IDataObject) => ({ type: l.type, id: l.id }));
							delete additionalFields.links;
						}
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/events.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/events.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/events.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Extract attendees from fixedCollection
						if (updateFields.attendees) {
							const attendeesData = updateFields.attendees as IDataObject;
							body.attendees = ((attendeesData?.attendee as IDataObject[]) || []).map((a: IDataObject) => ({ type: a.type, id: a.id }));
							delete updateFields.attendees;
						}
						// Extract links from fixedCollection
						if (updateFields.links) {
							const linksData = updateFields.links as IDataObject;
							body.links = ((linksData?.link as IDataObject[]) || []).map((l: IDataObject) => ({ type: l.type, id: l.id }));
							delete updateFields.links;
						}
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
						const attendeesData = this.getNodeParameter('attendees', i) as IDataObject;
						const attendees = ((attendeesData?.attendee as IDataObject[]) || []).map((a: IDataObject) => ({ type: a.type, id: a.id }));
						const body: IDataObject = {
							title: this.getNodeParameter('title', i) as string,
							starts_at: this.getNodeParameter('starts_at', i) as string,
							ends_at: this.getNodeParameter('ends_at', i) as string,
							attendees,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						// Nest customer if provided
						if (additionalFields.customer_type && additionalFields.customer_id) {
							body.customer = { type: additionalFields.customer_type, id: additionalFields.customer_id };
						}
						delete additionalFields.customer_type;
						delete additionalFields.customer_id;
						// Nest location if provided (from fixedCollection)
						const locationParam = this.getNodeParameter('location', i) as IDataObject;
						const locationData = locationParam?.locationData as IDataObject | undefined;
						if (locationData) {
							const location = buildLocationObject(locationData);
							if (location) body.location = location;
						}
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.schedule', body);
					} else if (operation === 'get') {
						const meetingInfoBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						addIncludes('/meetings.info', meetingInfoBody);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.info', meetingInfoBody);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/meetings.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Extract attendees from fixedCollection
						if (updateFields.attendees) {
							const attendeesData = updateFields.attendees as IDataObject;
							body.attendees = ((attendeesData?.attendee as IDataObject[]) || []).map((a: IDataObject) => ({ type: a.type, id: a.id }));
							delete updateFields.attendees;
						}
						// Nest customer
						if (updateFields.customer_type && updateFields.customer_id) {
							body.customer = { type: updateFields.customer_type, id: updateFields.customer_id };
							delete updateFields.customer_type;
							delete updateFields.customer_id;
						}
						// Nest location if provided (from fixedCollection)
						const locationParam = this.getNodeParameter('location', i) as IDataObject;
						const locationData = locationParam?.locationData as IDataObject | undefined;
						if (locationData) {
							const location = buildLocationObject(locationData);
							if (location) body.location = location;
						}
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.update', body);
					} else if (operation === 'complete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.complete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'createReport') {
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							attach_to: {
								type: this.getNodeParameter('attachToType', i) as string,
								id: this.getNodeParameter('attachToId', i) as string,
							},
						};
						try {
							const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
							assignDefined(body, additionalFields);
						} catch {
							// No additional fields
						}
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/meetings.createReport', body);
					}
				}

				// ==============================
				//         CALL
				// ==============================
				else if (resource === 'call') {
					if (operation === 'add') {
						const body: IDataObject = {
							participant: {
								customer: {
									type: this.getNodeParameter('customerType', i) as string,
									id: this.getNodeParameter('customerId', i) as string,
								},
							},
							due_at: this.getNodeParameter('dueAt', i) as string,
							assignee: {
								type: 'user',
								id: this.getNodeParameter('assigneeUserId', i) as string,
							},
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.add', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/calls.list');
					} else if (operation === 'complete') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const outcomeId = this.getNodeParameter('call_outcome_id', i, '') as string;
						if (outcomeId) body.call_outcome_id = outcomeId;
						const summary = this.getNodeParameter('outcome_summary', i, '') as string;
						if (summary) body.outcome_summary = summary;
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.complete', body);
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Nest participant
						if (updateFields.customer_type && updateFields.customer_id) {
							body.participant = { customer: { type: updateFields.customer_type, id: updateFields.customer_id } };
							delete updateFields.customer_type;
							delete updateFields.customer_id;
						}
						// Nest assignee
						if (updateFields.assignee_user_id) {
							body.assignee = { type: 'user', id: updateFields.assignee_user_id };
							delete updateFields.assignee_user_id;
						}
						assignDefined(body, updateFields);
						addCustomFieldsToBody.call(this, body, i, true);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/calls.update', body);
					}
				}

				// ==============================
				//         TIME TRACKING
				// ==============================
				else if (resource === 'timeTracking') {
					if (operation === 'add') {
						const timeInputMode = this.getNodeParameter('timeInputMode', i) as string;
						const body: IDataObject = {
							work_type_id: this.getNodeParameter('work_type_id', i) as string,
							subject: {
								type: this.getNodeParameter('subjectType', i) as string,
								id: this.getNodeParameter('subjectId', i) as string,
							},
						};
						if (timeInputMode === 'startedAtDuration') {
							body.started_at = this.getNodeParameter('started_at', i) as string;
							body.duration = this.getNodeParameter('duration', i) as number;
						} else if (timeInputMode === 'startedAtEndedAt') {
							body.started_at = this.getNodeParameter('started_at', i) as string;
							body.ended_at = this.getNodeParameter('ended_at', i) as string;
						} else if (timeInputMode === 'startedOnDuration') {
							body.started_on = this.getNodeParameter('started_on', i) as string;
							body.duration = this.getNodeParameter('duration', i) as number;
						}
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.add', body);
					} else if (operation === 'get') {
						const ttInfoBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						addIncludes('/timeTracking.info', ttInfoBody);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/timeTracking.info', ttInfoBody);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/timeTracking.list');
					} else if (operation === 'update') {
						const timeInputMode = this.getNodeParameter('timeInputMode', i) as string;
						const body: IDataObject = {
							id: this.getNodeParameter('id', i) as string,
							duration: this.getNodeParameter('duration', i) as number,
						};
						if (timeInputMode === 'startedAt') {
							body.started_at = this.getNodeParameter('started_at', i) as string;
						} else if (timeInputMode === 'startedOn') {
							body.started_on = this.getNodeParameter('started_on', i) as string;
						}
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Nest subject
						if (updateFields.subject_type && updateFields.subject_id) {
							body.subject = { type: updateFields.subject_type, id: updateFields.subject_id };
							delete updateFields.subject_type;
							delete updateFields.subject_id;
						}
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
						// Nest subject
						if (updateFields.subject_type && updateFields.subject_id) {
							body.subject = { type: updateFields.subject_type, id: updateFields.subject_id };
							delete updateFields.subject_type;
							delete updateFields.subject_id;
						}
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
							due_on: this.getNodeParameter('dueOn', i) as string,
							work_type_id: this.getNodeParameter('workTypeId', i) as string,
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
						// Nest assignee
						if (additionalFields.assignee_id) {
							body.assignee = { type: 'user', id: additionalFields.assignee_id };
							delete additionalFields.assignee_id;
						}
						// Nest estimated_duration
						if (additionalFields.estimated_duration_value !== undefined) {
							body.estimated_duration = {
								value: additionalFields.estimated_duration_value,
								unit: additionalFields.estimated_duration_unit || 'hours',
							};
							delete additionalFields.estimated_duration_value;
							delete additionalFields.estimated_duration_unit;
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
						// Nest customer
						if (updateFields.customer_type && updateFields.customer_id) {
							body.customer = { type: updateFields.customer_type, id: updateFields.customer_id };
							delete updateFields.customer_type;
							delete updateFields.customer_id;
						}
						// Nest assignee
						if (updateFields.assignee_id) {
							body.assignee = { type: 'user', id: updateFields.assignee_id };
							delete updateFields.assignee_id;
						}
						// Nest estimated_duration
						if (updateFields.estimated_duration_value !== undefined) {
							body.estimated_duration = {
								value: updateFields.estimated_duration_value,
								unit: updateFields.estimated_duration_unit || 'hours',
							};
							delete updateFields.estimated_duration_value;
							delete updateFields.estimated_duration_unit;
						}
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
							starts_at: this.getNodeParameter('startsAt', i) as string,
							ends_at: this.getNodeParameter('endsAt', i) as string,
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
						// Nest time_budget
						if (additionalFields.time_budget_value !== undefined) {
							body.time_budget = {
								value: additionalFields.time_budget_value,
								unit: additionalFields.time_budget_unit || 'hours',
							};
							delete additionalFields.time_budget_value;
							delete additionalFields.time_budget_unit;
						}
						// owner_ids comes as array from multiOptions
						if (additionalFields.owner_ids) {
							body.owner_ids = additionalFields.owner_ids;
							delete additionalFields.owner_ids;
						}
						nestMoneyFields(additionalFields, body);
						assignDefined(body, additionalFields);
						addCustomFieldsToBody.call(this, body, i);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.create', body);
					} else if (operation === 'get') {
						const projInfoBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						addIncludes('/projects-v2/projects.info', projInfoBody);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.info', projInfoBody);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/projects.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Nest billing_method if provided
						if (updateFields.billing_method_value) {
							body.billing_method = {
								value: updateFields.billing_method_value,
								update_strategy: updateFields.billing_method_update_strategy || 'none',
							};
							delete updateFields.billing_method_value;
							delete updateFields.billing_method_update_strategy;
						}
						// Nest time_budget
						if (updateFields.time_budget_value !== undefined) {
							body.time_budget = {
								value: updateFields.time_budget_value,
								unit: updateFields.time_budget_unit || 'hours',
							};
							delete updateFields.time_budget_value;
							delete updateFields.time_budget_unit;
						}
						nestMoneyFields(updateFields, body);
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
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projects.duplicate', {
							id: this.getNodeParameter('id', i) as string,
							title: this.getNodeParameter('duplicateTitle', i) as string,
						});
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
						const body: IDataObject = {
							project_id: this.getNodeParameter('projectId', i) as string,
							title: this.getNodeParameter('title', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						nestMoneyFields(additionalFields, body);
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.create', body);
					} else if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.info', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/projects-v2/projectGroups.list', {
							project_id: this.getNodeParameter('projectId', i) as string,
						});
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// billing_method for update requires object {value, update_strategy}
						if (updateFields.billing_method_value) {
							body.billing_method = {
								value: updateFields.billing_method_value,
								update_strategy: updateFields.billing_method_update_strategy || 'none',
							};
							delete updateFields.billing_method_value;
							delete updateFields.billing_method_update_strategy;
						}
						nestMoneyFields(updateFields, body);
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.delete', {
							id: this.getNodeParameter('id', i) as string,
							delete_strategy: this.getNodeParameter('deleteStrategy', i) as string,
						});
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/projectGroups.duplicate', { origin_id: this.getNodeParameter('id', i) as string });
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
						};
						const groupId = this.getNodeParameter('groupId', i, '') as string;
						if (groupId) body.group_id = groupId;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						// Nest time_estimated
						if (additionalFields.time_estimated_value !== undefined) {
							body.time_estimated = {
								value: additionalFields.time_estimated_value,
								unit: additionalFields.time_estimated_unit || 'hours',
							};
							delete additionalFields.time_estimated_value;
							delete additionalFields.time_estimated_unit;
						}
						// Extract assignees from fixedCollection
						if (additionalFields.assignees) {
							const assigneesData = additionalFields.assignees as IDataObject;
							body.assignees = ((assigneesData?.assignee as IDataObject[]) || []).map((a: IDataObject) => ({ type: a.type, id: a.id }));
							delete additionalFields.assignees;
						}
						nestMoneyFields(additionalFields, body);
						// Nest custom_rate
						if (additionalFields.custom_rate_amount !== undefined) {
							body.custom_rate = { amount: additionalFields.custom_rate_amount, currency: additionalFields.custom_rate_currency || 'EUR' };
							delete additionalFields.custom_rate_amount;
							delete additionalFields.custom_rate_currency;
						}
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
						// Nest time_estimated
						if (updateFields.time_estimated_value !== undefined) {
							body.time_estimated = {
								value: updateFields.time_estimated_value,
								unit: updateFields.time_estimated_unit || 'hours',
							};
							delete updateFields.time_estimated_value;
							delete updateFields.time_estimated_unit;
						}
						nestMoneyFields(updateFields, body);
						// Nest custom_rate
						if (updateFields.custom_rate_amount !== undefined) {
							body.custom_rate = { amount: updateFields.custom_rate_amount, currency: updateFields.custom_rate_currency || 'EUR' };
							delete updateFields.custom_rate_amount;
							delete updateFields.custom_rate_currency;
						}
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.delete', {
							id: this.getNodeParameter('id', i) as string,
							delete_strategy: this.getNodeParameter('deleteStrategy', i) as string,
						});
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/tasks.duplicate', { origin_id: this.getNodeParameter('id', i) as string });
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
						// Nest unit_price
						if (additionalFields.unit_price_amount !== undefined) {
							const unitPrice: IDataObject = { amount: additionalFields.unit_price_amount };
							if (additionalFields.unit_price_currency) unitPrice.currency = additionalFields.unit_price_currency;
							body.unit_price = unitPrice;
							delete additionalFields.unit_price_amount;
							delete additionalFields.unit_price_currency;
						}
						// Nest unit_cost
						if (additionalFields.unit_cost_amount !== undefined) {
							const unitCost: IDataObject = { amount: additionalFields.unit_cost_amount };
							if (additionalFields.unit_cost_currency) unitCost.currency = additionalFields.unit_cost_currency;
							body.unit_cost = unitCost;
							delete additionalFields.unit_cost_amount;
							delete additionalFields.unit_cost_currency;
						}
						// Extract assignees from fixedCollection
						if (additionalFields.assignees) {
							const assigneesData = additionalFields.assignees as IDataObject;
							body.assignees = ((assigneesData?.assignee as IDataObject[]) || []).map((a: IDataObject) => ({ type: a.type, id: a.id }));
							delete additionalFields.assignees;
						}
						nestMoneyFields(additionalFields, body);
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
						// Nest unit_price
						if (updateFields.unit_price_amount !== undefined) {
							const unitPrice: IDataObject = { amount: updateFields.unit_price_amount };
							if (updateFields.unit_price_currency) unitPrice.currency = updateFields.unit_price_currency;
							body.unit_price = unitPrice;
							delete updateFields.unit_price_amount;
							delete updateFields.unit_price_currency;
						}
						nestMoneyFields(updateFields, body);
						assignDefined(body, updateFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.update', body);
					} else if (operation === 'delete') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.delete', { id: this.getNodeParameter('id', i) as string });
					} else if (operation === 'duplicate') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/projects-v2/materials.duplicate', { origin_id: this.getNodeParameter('id', i) as string });
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
						// Nest selling_price
						if (additionalFields.selling_price_amount !== undefined) {
							const sp: IDataObject = { amount: additionalFields.selling_price_amount };
							if (additionalFields.selling_price_currency) sp.currency = additionalFields.selling_price_currency;
							body.selling_price = sp;
							delete additionalFields.selling_price_amount;
							delete additionalFields.selling_price_currency;
						}
						// Nest purchase_price
						if (additionalFields.purchase_price_amount !== undefined) {
							const pp: IDataObject = { amount: additionalFields.purchase_price_amount };
							if (additionalFields.purchase_price_currency) pp.currency = additionalFields.purchase_price_currency;
							body.purchase_price = pp;
							delete additionalFields.purchase_price_amount;
							delete additionalFields.purchase_price_currency;
						}
						addCustomFieldsToBody.call(this, body, i);
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/products.add', body);
					} else if (operation === 'get') {
						const prodInfoBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						addIncludes('/products.info', prodInfoBody);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/products.info', prodInfoBody);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/products.list');
					} else if (operation === 'update') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Nest selling_price
						if (updateFields.selling_price_amount !== undefined) {
							const sp: IDataObject = { amount: updateFields.selling_price_amount };
							if (updateFields.selling_price_currency) sp.currency = updateFields.selling_price_currency;
							body.selling_price = sp;
							delete updateFields.selling_price_amount;
							delete updateFields.selling_price_currency;
						}
						// Nest purchase_price
						if (updateFields.purchase_price_amount !== undefined) {
							const pp: IDataObject = { amount: updateFields.purchase_price_amount };
							if (updateFields.purchase_price_currency) pp.currency = updateFields.purchase_price_currency;
							body.purchase_price = pp;
							delete updateFields.purchase_price_amount;
							delete updateFields.purchase_price_currency;
						}
						addCustomFieldsToBody.call(this, body, i, true);
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
							customer: {
								type: this.getNodeParameter('customerType', i) as string,
								id: this.getNodeParameter('customerId', i) as string,
							},
							ticket_status_id: this.getNodeParameter('ticketStatusId', i) as string,
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						// Nest assignee
						if (additionalFields.assignee_id) {
							body.assignee = { type: 'user', id: additionalFields.assignee_id };
							delete additionalFields.assignee_id;
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
						// Nest assignee
						if (updateFields.assignee_id) {
							body.assignee = { type: 'user', id: updateFields.assignee_id };
							delete updateFields.assignee_id;
						}
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
						const userInfoBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						addIncludes('/users.info', userInfoBody);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/users.info', userInfoBody);
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
						const listSubjectType = this.getNodeParameter('subjectType', i) as string;
						const listSubject: IDataObject = { type: listSubjectType };
						if (listSubjectType !== 'temporary') {
							listSubject.id = this.getNodeParameter('subjectId', i, '') as string;
						}
						responseData = await handleGetMany.call(this, i, '/files.list', {
							filter: { subject: listSubject },
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
						const uploadSubjectType = this.getNodeParameter('subjectType', i) as string;
						const uploadSubject: IDataObject = { type: uploadSubjectType };
						if (uploadSubjectType !== 'temporary') {
							uploadSubject.id = this.getNodeParameter('subjectId', i, '') as string;
						}
						const uploadResponse = await teamleaderApiRequest.call(this, 'POST', '/files.upload', {
							name: actualFileName,
							subject: uploadSubject,
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
						const daysData = this.getNodeParameter('days', i) as IDataObject;
						const days = ((daysData?.day as IDataObject[]) || []).map((d: IDataObject) => ({ starts_at: d.starts_at, ends_at: d.ends_at }));
						responseData = await teamleaderApiRequest.call(this, 'POST', '/daysOff.import', {
							user_id: this.getNodeParameter('userId', i) as string,
							leave_type_id: this.getNodeParameter('leaveTypeId', i) as string,
							days,
						});
					} else if (operation === 'bulkDelete') {
						const ids = JSON.parse(this.getNodeParameter('dayOffIds', i) as string);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/daysOff.bulkDelete', {
							user_id: this.getNodeParameter('userId', i) as string,
							ids,
						});
					} else if (operation === 'listTypes') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/dayOffTypes.list');
					} else if (operation === 'createType') {
						const body: IDataObject = { name: this.getNodeParameter('name', i) as string };
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						// Nest date_validity
						if (additionalFields.date_validity_from || additionalFields.date_validity_until) {
							body.date_validity = {} as IDataObject;
							if (additionalFields.date_validity_from) (body.date_validity as IDataObject).from = additionalFields.date_validity_from;
							if (additionalFields.date_validity_until) (body.date_validity as IDataObject).until = additionalFields.date_validity_until;
							delete additionalFields.date_validity_from;
							delete additionalFields.date_validity_until;
						}
						assignDefined(body, additionalFields);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/dayOffTypes.create', body);
					} else if (operation === 'updateType') {
						const body: IDataObject = { id: this.getNodeParameter('id', i) as string };
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Nest date_validity
						if (updateFields.date_validity_from || updateFields.date_validity_until) {
							body.date_validity = {} as IDataObject;
							if (updateFields.date_validity_from) (body.date_validity as IDataObject).from = updateFields.date_validity_from;
							if (updateFields.date_validity_until) (body.date_validity as IDataObject).until = updateFields.date_validity_until;
							delete updateFields.date_validity_from;
							delete updateFields.date_validity_until;
						}
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
							day: this.getNodeParameter('day', i) as string,
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
							content: this.getNodeParameter('content', i) as string,
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
							url: this.getNodeParameter('url', i) as string,
							types: this.getNodeParameter('types', i) as string[],
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
						// Nest total
						if (updateFields.total_tax_inclusive_amount !== undefined) {
							body.total = { tax_inclusive: { amount: updateFields.total_tax_inclusive_amount } };
							delete updateFields.total_tax_inclusive_amount;
						}
						// Nest currency
						if (updateFields.currency_code) {
							body.currency = { code: updateFields.currency_code };
							delete updateFields.currency_code;
						}
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
						const orderInfoBody: IDataObject = { id: this.getNodeParameter('id', i) as string };
						addIncludes('/orders.info', orderInfoBody);
						responseData = await teamleaderApiRequest.call(this, 'POST', '/orders.info', orderInfoBody);
					} else if (operation === 'getMany') {
						responseData = await handleGetMany.call(this, i, '/orders.list');
					}
				}

				// ==============================
				//         PLANNABLE ITEM
				// ==============================
				else if (resource === 'plannableItem') {
					if (operation === 'get') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/plannableItems.info', {
							source: {
								type: this.getNodeParameter('sourceType', i) as string,
								id: this.getNodeParameter('sourceId', i) as string,
							},
						});
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

				// ==============================
				//         UTILITIES
				// ==============================
				else if (resource === 'account') {
					if (operation === 'getProjectsV2Status') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/accounts.projects-v2-status');
					}
				}

				else if (resource === 'cloudPlatform') {
					if (operation === 'getUrl') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/cloudPlatforms.url', {
							type: this.getNodeParameter('type', i) as string,
							id: this.getNodeParameter('id', i) as string,
						});
					}
				}

				else if (resource === 'currency') {
					if (operation === 'getExchangeRates') {
						responseData = await teamleaderApiRequest.call(this, 'POST', '/currencies.exchangeRates', {
							base: this.getNodeParameter('base', i) as string,
						});
					}
				}

				else if (resource === 'levelTwoArea') {
					if (operation === 'getMany') {
						const body: IDataObject = {
							country: this.getNodeParameter('country', i) as string,
						};
						const language = this.getNodeParameter('language', i) as string;
						if (language) {
							body.language = language;
						}
						responseData = await teamleaderApiRequest.call(this, 'POST', '/levelTwoAreas.list', body);
					}
				}

				else if (resource === 'mailTemplate') {
					if (operation === 'getMany') {
						const filter: IDataObject = {
							type: this.getNodeParameter('type', i) as string,
						};
						const departmentId = this.getNodeParameter('departmentId', i) as string;
						if (departmentId) {
							filter.department_id = departmentId;
						}
						responseData = await teamleaderApiRequest.call(this, 'POST', '/mailTemplates.list', { filter });
					}
				}

				// Build output
				const prevLength = returnData.length;
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
				// Ensure every input item produces at least one output item
				if (returnData.length === prevLength) {
					returnData.push({ json: {}, pairedItem: { item: i } });
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
	return data.map((cf) => {
		const fieldType = cf.type as string;
		const label = cf.label as string;
		let description = fieldType;

		// For select types, show available options with their IDs
		if (fieldType === 'single_select' || fieldType === 'multi_select') {
			const config = cf.configuration as IDataObject | undefined;
			const options = (config?.options as Array<{ id: string; value: string }>) ?? [];
			if (options.length > 0) {
				const optionList = options.map((o) => `${o.value} (${o.id})`).join('<br>');
				description = `${fieldType}<br>${optionList}`;
			}
		}

		return {
			name: label,
			value: cf.id as string,
			description,
		};
	});
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

	// Add includes (e.g. custom_fields, related data)
	addIncludes(endpoint, body);

	// Add filters
	try {
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		if (Object.keys(filters).length > 0) {
			const filter = buildFilter(filters);
			// Handle comma-separated ID fields
			for (const idField of ['ids', 'project_ids']) {
				if (filter[idField] && typeof filter[idField] === 'string') {
					filter[idField] = (filter[idField] as string).split(',').map((id) => id.trim());
				}
			}
			// Nest subject_type + subject_id into subject: { type, id }
			if (filter.subject_type && filter.subject_id) {
				filter.subject = { type: filter.subject_type, id: filter.subject_id };
				delete filter.subject_type;
				delete filter.subject_id;
			}
			// Nest supplier_type + supplier_id into supplier: { type, id }
			if (filter.supplier_type && filter.supplier_id) {
				filter.supplier = { type: filter.supplier_type, id: filter.supplier_id };
				delete filter.supplier_type;
				delete filter.supplier_id;
			}
			// Build paid_at operator filter: { operator, value?, start?, end? }
			if (filter.paid_at_operator) {
				const toDate = (v: unknown): string | undefined => {
					if (typeof v !== 'string' || !v) return undefined;
					return v.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? v;
				};
				const paidAt: IDataObject = { operator: filter.paid_at_operator };
				const value = toDate(filter.paid_at_value);
				const start = toDate(filter.paid_at_start);
				const end = toDate(filter.paid_at_end);
				if (value) paidAt.value = value;
				if (start) paidAt.start = start;
				if (end) paidAt.end = end;
				filter.paid_at = paidAt;
				delete filter.paid_at_operator;
				delete filter.paid_at_value;
				delete filter.paid_at_start;
				delete filter.paid_at_end;
			}
			// Wrap email filter as { type: 'primary', email: value } for contacts/companies .list
			if (filter.email && typeof filter.email === 'string') {
				filter.email = { type: 'primary', email: filter.email };
			}
			// Unwrap fixedCollection filters (e.g. event attendee, link)
			for (const fcField of ['attendee', 'link']) {
				if (filter[fcField] && typeof filter[fcField] === 'object' && (filter[fcField] as IDataObject)[fcField]) {
					const inner = (filter[fcField] as IDataObject)[fcField];
					filter[fcField] = Array.isArray(inner) ? inner[0] : inner;
				}
			}
			// Split comma-separated ID/type list fields into arrays
			for (const listField of ['plannable_item_ids', 'types']) {
				if (filter[listField] && typeof filter[listField] === 'string') {
					filter[listField] = (filter[listField] as string).split(',').map((v) => v.trim());
				}
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
		} else if (key === 'website') {
			result.websites = [{ type: 'primary', url: value }];
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

/**
 * Extract *_amount and *_currency fields from source, nest them as Money objects
 * {amount, currency} on target, and delete the flat fields from source.
 * Handles: fixed_price, external_budget, internal_budget.
 */
function nestMoneyFields(source: IDataObject, target: IDataObject): void {
	const moneyFields = ['fixed_price', 'external_budget', 'internal_budget'];
	for (const field of moneyFields) {
		if (source[`${field}_amount`] !== undefined && source[`${field}_amount`] !== '') {
			target[field] = {
				amount: source[`${field}_amount`],
				currency: source[`${field}_currency`] || 'EUR',
			};
			delete source[`${field}_amount`];
			delete source[`${field}_currency`];
		}
	}
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
	const body: IDataObject = { id };
	addIncludes(endpoint, body);
	return teamleaderApiRequest.call(this, 'POST', endpoint, body);
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
		addIncludes(config.endpoint, body);
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
		deal_id: context.getNodeParameter('dealId', itemIndex) as string,
	};
	// grouped_lines is optional (spec allows text-only quotations)
	const groupedLinesRaw = context.getNodeParameter('groupedLines', itemIndex, '') as string;
	if (groupedLinesRaw) {
		body.grouped_lines = typeof groupedLinesRaw === 'string' ? JSON.parse(groupedLinesRaw) : groupedLinesRaw;
	}
	try {
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex) as IDataObject;
		// Nest currency as {code, exchange_rate}
		if (additionalFields.currency_code) {
			body.currency = {
				code: additionalFields.currency_code,
				exchange_rate: additionalFields.currency_exchange_rate || 1,
			};
		}
		delete additionalFields.currency_code;
		delete additionalFields.currency_exchange_rate;
		// Extract discounts from fixedCollection
		if (additionalFields.discounts) {
			const discountsData = additionalFields.discounts as IDataObject;
			body.discounts = ((discountsData?.discount as IDataObject[]) || []).map((d: IDataObject) => ({
				type: 'percentage',
				value: d.value,
				description: d.description || '',
			}));
			delete additionalFields.discounts;
		}
		// Build expiry from structured fields
		if (additionalFields.expiry_date) {
			body.expiry = {
				date: additionalFields.expiry_date,
				action_after_expiry: additionalFields.expiry_action || 'none',
			} as IDataObject;
		}
		delete additionalFields.expiry_date;
		delete additionalFields.expiry_action;
		assignDefined(body, additionalFields);
	} catch {
		// No additional fields
	}
	return body;
}

function buildQuotationUpdateBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = { id: context.getNodeParameter('id', itemIndex) as string };
	try {
		const updateFields = context.getNodeParameter('updateFields', itemIndex) as IDataObject;
		// Nest currency as {code, exchange_rate}
		if (updateFields.currency_code) {
			body.currency = {
				code: updateFields.currency_code,
				exchange_rate: updateFields.currency_exchange_rate || 1,
			};
		}
		delete updateFields.currency_code;
		delete updateFields.currency_exchange_rate;
		// Extract discounts from fixedCollection
		if (updateFields.discounts) {
			const discountsData = updateFields.discounts as IDataObject;
			body.discounts = ((discountsData?.discount as IDataObject[]) || []).map((d: IDataObject) => ({
				type: 'percentage',
				value: d.value,
				description: d.description || '',
			}));
			delete updateFields.discounts;
		}
		// Build expiry from structured fields
		if (updateFields.expiry_date) {
			body.expiry = {
				date: updateFields.expiry_date,
				action_after_expiry: updateFields.expiry_action || 'none',
			} as IDataObject;
		}
		delete updateFields.expiry_date;
		delete updateFields.expiry_action;
		// Parse grouped_lines JSON
		if (updateFields.grouped_lines) {
			body.grouped_lines = typeof updateFields.grouped_lines === 'string'
				? JSON.parse(updateFields.grouped_lines as string) : updateFields.grouped_lines;
			delete updateFields.grouped_lines;
		}
		assignDefined(body, updateFields);
	} catch {
		// No update fields
	}
	return body;
}

function buildLocationObject(fields: IDataObject): IDataObject | undefined {
	const locationType = fields.type as string | undefined;
	if (!locationType) return undefined;

	const address: IDataObject = {};
	if (fields.line_1) address.line_1 = fields.line_1;
	if (fields.postal_code) address.postal_code = fields.postal_code;
	if (fields.city) address.city = fields.city;
	if (fields.country) address.country = fields.country;

	const hasAddress = Object.keys(address).length > 0;

	let location: IDataObject;
	switch (locationType) {
		case 'virtual':
			location = { type: 'virtual' };
			break;
		case 'contact':
		case 'company':
			location = { type: locationType };
			if (fields.id) location.id = fields.id;
			if (hasAddress) location.address = address;
			break;
		case 'customLocation':
			location = { type: 'customLocation' };
			if (hasAddress) location.address = address;
			break;
		case 'calendarResource':
			location = { type: 'calendarResource' };
			if (fields.id) location.id = fields.id;
			break;
		default:
			location = { type: locationType };
	}
	return location;
}

function buildInvoiceBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const invoicee: IDataObject = {
		customer: {
			type: context.getNodeParameter('customerType', itemIndex) as string,
			id: context.getNodeParameter('customerId', itemIndex) as string,
		},
	};
	const body: IDataObject = {
		invoicee,
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
		// Handle for_attention_of fields
		if (additionalFields.for_attention_of_name) {
			invoicee.for_attention_of = { name: additionalFields.for_attention_of_name };
			delete additionalFields.for_attention_of_name;
		} else if (additionalFields.for_attention_of_contact_id) {
			invoicee.for_attention_of = { contact_id: additionalFields.for_attention_of_contact_id };
			delete additionalFields.for_attention_of_contact_id;
		}
		delete additionalFields.for_attention_of_name;
		delete additionalFields.for_attention_of_contact_id;
		// Extract discounts from fixedCollection
		if (additionalFields.discounts) {
			const discountsData = additionalFields.discounts as IDataObject;
			body.discounts = ((discountsData?.discount as IDataObject[]) || []).map((d: IDataObject) => ({
				type: 'percentage',
				value: d.value,
				description: d.description || '',
			}));
			delete additionalFields.discounts;
		}
		// Build expected_payment_method from structured fields
		if (additionalFields.expected_payment_method_method) {
			const epm: IDataObject = { method: additionalFields.expected_payment_method_method };
			if (additionalFields.expected_payment_method_reference) {
				epm.reference = additionalFields.expected_payment_method_reference;
			}
			body.expected_payment_method = epm;
		}
		delete additionalFields.expected_payment_method_method;
		delete additionalFields.expected_payment_method_reference;
		// Build delivery_information from flat field
		if (additionalFields.delivery_information_days !== undefined) {
			body.delivery_information = {
				type: 'set_days_after_invoice_date',
				number_of_days_after_invoice_date: additionalFields.delivery_information_days,
			};
			delete additionalFields.delivery_information_days;
		}
		assignDefined(body, additionalFields);
	} catch {
		// No additional fields
	}
	addCustomFieldsToBody.call(context, body, itemIndex);
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

function buildInvoiceBookBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	return {
		id: context.getNodeParameter('id', itemIndex) as string,
		on: context.getNodeParameter('bookDate', itemIndex) as string,
	};
}

function buildInvoiceSendBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const recipientsTo = JSON.parse(context.getNodeParameter('recipientsTo', itemIndex) as string);
	const body: IDataObject = {
		id: context.getNodeParameter('id', itemIndex) as string,
		from: context.getNodeParameter('fromEmail', itemIndex) as string,
		recipients: { to: recipientsTo } as IDataObject,
		content: {
			subject: context.getNodeParameter('emailSubject', itemIndex) as string,
			body: context.getNodeParameter('emailBody', itemIndex) as string,
		},
	};
	try {
		const extra = context.getNodeParameter('sendAdditionalFields', itemIndex, {}) as IDataObject;
		if (extra.cc) {
			(body.recipients as IDataObject).cc = typeof extra.cc === 'string' ? JSON.parse(extra.cc as string) : extra.cc;
		}
		if (extra.bcc) {
			(body.recipients as IDataObject).bcc = typeof extra.bcc === 'string' ? JSON.parse(extra.bcc as string) : extra.bcc;
		}
	} catch {
		// No additional send fields
	}
	return body;
}

function buildQuotationSendBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const recipientsTo = JSON.parse(context.getNodeParameter('recipientsTo', itemIndex) as string);
	const body: IDataObject = {
		quotations: [context.getNodeParameter('id', itemIndex) as string],
		recipients: { to: recipientsTo } as IDataObject,
		subject: context.getNodeParameter('emailSubject', itemIndex) as string,
		content: context.getNodeParameter('emailContent', itemIndex) as string,
		language: context.getNodeParameter('language', itemIndex, 'en') as string,
	};
	try {
		const extra = context.getNodeParameter('sendAdditionalFields', itemIndex, {}) as IDataObject;
		// Build from object from structured fields
		if (extra.from_sender_id) {
			body.from = {
				sender: { type: extra.from_sender_type || 'user', id: extra.from_sender_id },
			} as IDataObject;
			if (extra.from_email_address) {
				(body.from as IDataObject).email_address = extra.from_email_address;
			}
		}
		// Extract cc from fixedCollection
		if (extra.cc) {
			const ccData = extra.cc as IDataObject;
			(body.recipients as IDataObject).cc = ((ccData?.recipient as IDataObject[]) || []).map((r: IDataObject) => {
				const entry: IDataObject = { email_address: r.email_address };
				if (r.customer_type && r.customer_id) {
					entry.customer = { type: r.customer_type, id: r.customer_id };
				}
				return entry;
			});
		}
		// Extract bcc from fixedCollection
		if (extra.bcc) {
			const bccData = extra.bcc as IDataObject;
			(body.recipients as IDataObject).bcc = ((bccData?.recipient as IDataObject[]) || []).map((r: IDataObject) => {
				const entry: IDataObject = { email_address: r.email_address };
				if (r.customer_type && r.customer_id) {
					entry.customer = { type: r.customer_type, id: r.customer_id };
				}
				return entry;
			});
		}
		if (extra.attachments) {
			body.attachments = typeof extra.attachments === 'string' ? JSON.parse(extra.attachments as string) : extra.attachments;
		}
	} catch {
		// No additional send fields
	}
	return body;
}

function buildInvoiceUpdateBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = { id: context.getNodeParameter('id', itemIndex) as string };
	try {
		const updateFields = context.getNodeParameter('updateFields', itemIndex) as IDataObject;
		// Nest payment_term
		if (updateFields.payment_term_type || updateFields.payment_term_days !== undefined) {
			body.payment_term = {} as IDataObject;
			if (updateFields.payment_term_type) (body.payment_term as IDataObject).type = updateFields.payment_term_type;
			if (updateFields.payment_term_days !== undefined) (body.payment_term as IDataObject).days = updateFields.payment_term_days;
			delete updateFields.payment_term_type;
			delete updateFields.payment_term_days;
		}
		// Nest invoicee if customer or for_attention_of fields provided
		if (updateFields.customer_type || updateFields.for_attention_of_name || updateFields.for_attention_of_contact_id) {
			const invoicee: IDataObject = {};
			if (updateFields.customer_type && updateFields.customer_id) {
				invoicee.customer = { type: updateFields.customer_type, id: updateFields.customer_id };
			}
			if (updateFields.for_attention_of_name) {
				invoicee.for_attention_of = { name: updateFields.for_attention_of_name };
			} else if (updateFields.for_attention_of_contact_id) {
				invoicee.for_attention_of = { contact_id: updateFields.for_attention_of_contact_id };
			}
			body.invoicee = invoicee;
			delete updateFields.customer_type;
			delete updateFields.customer_id;
			delete updateFields.for_attention_of_name;
			delete updateFields.for_attention_of_contact_id;
		}
		// Parse grouped_lines JSON
		if (updateFields.grouped_lines) {
			body.grouped_lines = typeof updateFields.grouped_lines === 'string'
				? JSON.parse(updateFields.grouped_lines as string) : updateFields.grouped_lines;
			delete updateFields.grouped_lines;
		}
		// Extract discounts from fixedCollection
		if (updateFields.discounts) {
			const discountsData = updateFields.discounts as IDataObject;
			body.discounts = ((discountsData?.discount as IDataObject[]) || []).map((d: IDataObject) => ({
				type: 'percentage',
				value: d.value,
				description: d.description || '',
			}));
			delete updateFields.discounts;
		}
		// Build expected_payment_method from structured fields
		if (updateFields.expected_payment_method_method) {
			const epm: IDataObject = { method: updateFields.expected_payment_method_method };
			if (updateFields.expected_payment_method_reference) {
				epm.reference = updateFields.expected_payment_method_reference;
			}
			body.expected_payment_method = epm;
		}
		delete updateFields.expected_payment_method_method;
		delete updateFields.expected_payment_method_reference;
		assignDefined(body, updateFields);
	} catch {
		// No update fields
	}
	addCustomFieldsToBody.call(context, body, itemIndex, true);
	return body;
}

function buildInvoiceUpdateBookedBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = { id: context.getNodeParameter('id', itemIndex) as string };
	try {
		const updateFields = context.getNodeParameter('updateFields', itemIndex) as IDataObject;
		// Nest payment_term
		if (updateFields.payment_term_type || updateFields.payment_term_days !== undefined) {
			body.payment_term = {} as IDataObject;
			if (updateFields.payment_term_type) (body.payment_term as IDataObject).type = updateFields.payment_term_type;
			if (updateFields.payment_term_days !== undefined) (body.payment_term as IDataObject).days = updateFields.payment_term_days;
			delete updateFields.payment_term_type;
			delete updateFields.payment_term_days;
		}
		// Build delivery_information from flat field
		if (updateFields.delivery_information_days !== undefined) {
			body.delivery_information = {
				type: 'set_days_after_invoice_date',
				number_of_days_after_invoice_date: updateFields.delivery_information_days,
			};
			delete updateFields.delivery_information_days;
		}
		assignDefined(body, updateFields);
	} catch {
		// No update fields
	}
	addCustomFieldsToBody.call(context, body, itemIndex, true);
	return body;
}


function buildInvoiceCreditBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = { id: context.getNodeParameter('id', itemIndex) as string };
	const creditNoteDate = context.getNodeParameter('credit_note_date', itemIndex, '') as string;
	if (creditNoteDate) body.credit_note_date = creditNoteDate;
	return body;
}

function buildInvoiceCreditPartiallyBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	return {
		id: context.getNodeParameter('id', itemIndex) as string,
		grouped_lines: JSON.parse(context.getNodeParameter('groupedLines', itemIndex) as string),
	};
}