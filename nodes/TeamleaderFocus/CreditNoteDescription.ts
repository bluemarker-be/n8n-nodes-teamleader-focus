import type { INodeProperties } from 'n8n-workflow';

export const creditNoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['creditNote'] } },
		options: [
			{ name: 'Download', value: 'download', action: 'Download a credit note' },
			{ name: 'Get', value: 'get', action: 'Get a credit note' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many credit notes' },
			{ name: 'Send via Peppol', value: 'sendViaPeppol', action: 'Send a credit note via Peppol' },
		],
		default: 'getMany',
	},
];

export const creditNoteFields: INodeProperties[] = [
	// ----------------------------------
	//         creditNote: get / download
	// ----------------------------------
	{
		displayName: 'Credit Note ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['get', 'download', 'sendViaPeppol'],
			},
		},
	},

	// ----------------------------------
	//         creditNote: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['creditNote'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['creditNote'], operation: ['getMany'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['creditNote'], operation: ['getMany'] } },
		options: [
			{
				displayName: 'Department Name or ID',
				name: 'department_id',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDepartments' },
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Updated Since',
				name: 'updated_since',
				type: 'dateTime',
				default: '',
				description: 'Only return credit notes updated after this date/time',
			},
			{
				displayName: 'Invoice ID',
				name: 'invoice_id',
				type: 'string',
				default: '',
				description: 'Filter by the related invoice ID',
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				default: '',
				description: 'Filter by the related project ID',
			},
			{
				displayName: 'Credit Note Date After',
				name: 'credit_note_date_after',
				type: 'dateTime',
				default: '',
				description: 'Only return credit notes dated on or after this date (inclusive)',
			},
			{
				displayName: 'Credit Note Date Before',
				name: 'credit_note_date_before',
				type: 'dateTime',
				default: '',
				description: 'Only return credit notes dated before this date (exclusive)',
			},
		],
	},

	// ----------------------------------
	//         creditNote: download
	// ----------------------------------
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [
			{ name: 'PDF', value: 'pdf' },
			{ name: 'UBL (e-FFF)', value: 'ubl/e-fff' },
			{ name: 'UBL (Peppol BIS 3)', value: 'ubl/peppol_bis_3' },
			{ name: 'UBL (XRechnung)', value: 'ubl/xrechnung' },
		],
		required: true,
		default: 'pdf',
		displayOptions: { show: { resource: ['creditNote'], operation: ['download'] } },
	},
	{
		displayName: 'Binary Property (Output)',
		name: 'downloadBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['creditNote'], operation: ['download'] } },
		description: 'Name of the binary property to write the downloaded file to',
	},
];
