import type { INodeProperties } from 'n8n-workflow';

export const dayOffOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dayOff'] } },
		options: [
			{ name: 'Bulk Delete', value: 'bulkDelete', action: 'Bulk delete days off' },
			{ name: 'Create Type', value: 'createType', action: 'Create a day off type' },
			{ name: 'Delete Type', value: 'deleteType', action: 'Delete a day off type' },
			{ name: 'Import', value: 'import', action: 'Import days off' },
			{ name: 'List Types', value: 'listTypes', action: 'List day off types' },
			{ name: 'Update Type', value: 'updateType', action: 'Update a day off type' },
		],
		default: 'listTypes',
	},
];

export const dayOffFields: INodeProperties[] = [
	// ----------------------------------
	//         dayOff: import
	// ----------------------------------
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['import'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Leave Type Name or ID',
		name: 'leaveTypeId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDayOffTypes' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['import'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Days',
		name: 'days',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Day',
		required: true,
		default: {},
		displayOptions: { show: { resource: ['dayOff'], operation: ['import'] } },
		description: 'Days off to import',
		options: [
			{
				displayName: 'Day',
				name: 'day',
				values: [
					{
						displayName: 'Starts At',
						name: 'starts_at',
						type: 'dateTime',
						default: '',
						description: 'Start date and time of the day off',
					},
					{
						displayName: 'Ends At',
						name: 'ends_at',
						type: 'dateTime',
						default: '',
						description: 'End date and time of the day off',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         dayOff: bulkDelete
	// ----------------------------------
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['bulkDelete'] } },
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Day Off IDs (JSON)',
		name: 'dayOffIds',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: { show: { resource: ['dayOff'], operation: ['bulkDelete'] } },
		description: 'JSON array of day off IDs to delete. Example: ["550e8400-e29b-41d4-a716-446655440000","6ba7b810-9dad-11d1-80b4-00c04fd430c8"]',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dayOff'], operation: ['createType'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['dayOff'], operation: ['createType'] } },
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'options',
				options: [
					{ name: 'Teal', value: '#00B2B2' },
					{ name: 'Dark Teal', value: '#008A8C' },
					{ name: 'Brown', value: '#992600' },
					{ name: 'Orange', value: '#ED9E00' },
					{ name: 'Pink', value: '#D157D3' },
					{ name: 'Purple', value: '#A400B2' },
					{ name: 'Blue', value: '#0071F2' },
					{ name: 'Dark Blue', value: '#004DA6' },
					{ name: 'Grey Blue', value: '#64788F' },
					{ name: 'Silver', value: '#C0C0C4' },
					{ name: 'Grey', value: '#82828C' },
					{ name: 'Black', value: '#1A1C20' },
				],
				default: '#00B2B2',
			},
			{
				displayName: 'Date Validity From',
				name: 'date_validity_from',
				type: 'dateTime',
				default: '',
				description: 'Start of validity period (YYYY-MM-DD)',
			},
			{
				displayName: 'Date Validity Until',
				name: 'date_validity_until',
				type: 'dateTime',
				default: '',
				description: 'End of validity period (YYYY-MM-DD)',
			},
		],
	},
	{
		displayName: 'Type ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['dayOff'], operation: ['updateType', 'deleteType'] },
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['dayOff'], operation: ['updateType'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'options',
				options: [
					{ name: 'Teal', value: '#00B2B2' },
					{ name: 'Dark Teal', value: '#008A8C' },
					{ name: 'Brown', value: '#992600' },
					{ name: 'Orange', value: '#ED9E00' },
					{ name: 'Pink', value: '#D157D3' },
					{ name: 'Purple', value: '#A400B2' },
					{ name: 'Blue', value: '#0071F2' },
					{ name: 'Dark Blue', value: '#004DA6' },
					{ name: 'Grey Blue', value: '#64788F' },
					{ name: 'Silver', value: '#C0C0C4' },
					{ name: 'Grey', value: '#82828C' },
					{ name: 'Black', value: '#1A1C20' },
				],
				default: '#00B2B2',
			},
			{
				displayName: 'Date Validity From',
				name: 'date_validity_from',
				type: 'dateTime',
				default: '',
				description: 'Start of validity period (YYYY-MM-DD)',
			},
			{
				displayName: 'Date Validity Until',
				name: 'date_validity_until',
				type: 'dateTime',
				default: '',
				description: 'End of validity period (YYYY-MM-DD)',
			},
		],
	},
];
