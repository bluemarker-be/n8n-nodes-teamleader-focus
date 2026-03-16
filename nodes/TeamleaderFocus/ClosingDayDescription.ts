import type { INodeProperties } from 'n8n-workflow';

export const closingDayOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['closingDay'] } },
		options: [
			{ name: 'Add', value: 'add', action: 'Add a closing day' },
			{ name: 'Delete', value: 'delete', action: 'Delete a closing day' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many closing days' },
		],
		default: 'getMany',
	},
];

export const closingDayFields: INodeProperties[] = [
	{
		displayName: 'Day',
		name: 'day',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['closingDay'], operation: ['add'] } },
		description: 'The date for the closing day (YYYY-MM-DD)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['closingDay'], operation: ['add'] } },
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Half Day',
				name: 'half_day',
				type: 'boolean',
				default: false,
			},
		],
	},
	{
		displayName: 'Closing Day ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['closingDay'], operation: ['delete'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['closingDay'], operation: ['getMany'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 100,
		displayOptions: {
			show: { resource: ['closingDay'], operation: ['getMany'], returnAll: [false] },
		},
	},
];
