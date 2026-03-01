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
		default: 20,
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
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Booked', value: 'booked' },
					{ name: 'Draft', value: 'draft' },
				],
				default: 'booked',
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
