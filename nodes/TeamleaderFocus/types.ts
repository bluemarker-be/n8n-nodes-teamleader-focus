export interface TeamleaderFilter {
	field: string;
	value: string | string[] | boolean;
}

export interface TeamleaderPage {
	size: number;
	number: number;
}

export interface TeamleaderSort {
	field: string;
	order: 'asc' | 'desc';
}

export interface TeamleaderCustomField {
	id: string;
	value: unknown;
}

export interface TeamleaderAddress {
	type: string;
	address?: {
		line_1?: string;
		postal_code?: string;
		city?: string;
		country?: string;
	};
}

export interface TeamleaderTelephone {
	type: string;
	number: string;
}

export interface TeamleaderEmail {
	type: string;
	email: string;
}

export interface TeamleaderGroupedLineItem {
	section?: { title?: string };
	line_items: TeamleaderLineItem[];
}

export interface TeamleaderLineItem {
	quantity: number;
	description?: string;
	extended_description?: string;
	unit_of_measure_id?: string;
	unit_price?: {
		amount: number;
		currency: string;
		tax: string;
	};
	tax_rate_id?: string;
	discount?: {
		value: number;
		type: 'percentage';
	};
	product_id?: string;
}
