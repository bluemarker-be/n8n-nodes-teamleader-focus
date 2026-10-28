import type { INodeProperties } from 'n8n-workflow';

import { OPERATION_ENDPOINTS, type OperationEndpoint } from './SideloadOptions';

const operationsByKey = new Map<string, OperationEndpoint>(
	OPERATION_ENDPOINTS.map((entry) => [`${entry.resource}/${entry.operation}`, entry]),
);

/** The endpoint (and sideload paths) of a resource/operation, if it makes a single API call. */
export function getOperationEndpoint(
	resource: string,
	operation: string,
): OperationEndpoint | undefined {
	return operationsByKey.get(`${resource}/${operation}`);
}

/**
 * "Sideload Related Objects": one multi-select per operation that has
 * relationships. All share the name `include` (the Teamleader body parameter);
 * their displayOptions are mutually exclusive.
 */
export const sideloadFields: INodeProperties[] = OPERATION_ENDPOINTS.filter(
	(entry) => entry.paths.length > 0,
).map((entry) => ({
	displayName: 'Sideload Related Objects',
	name: 'include',
	type: 'multiOptions',
	options: [...entry.paths].sort().map((path) => ({ name: path, value: path })),
	default: [],
	displayOptions: { show: { resource: [entry.resource], operation: [entry.operation] } },
	description:
		'Related objects to load in the same request. They are returned under <code>included</code>, grouped by type.',
}));

/**
 * Normalize an `include` parameter value to a clean list of paths.
 * Accepts a string array (UI) or a comma-separated string (expression).
 * Returns the paths that are not allowed for this operation in `invalid`.
 */
export function normalizeSideload(
	value: unknown,
	allowed: string[],
): { include: string[]; invalid: string[] } {
	let raw: unknown[];
	if (value === undefined || value === null || value === '') {
		raw = [];
	} else if (Array.isArray(value)) {
		raw = value;
	} else if (typeof value === 'string') {
		raw = value.split(',');
	} else {
		return { include: [], invalid: [String(value)] };
	}

	const include: string[] = [];
	const invalid: string[] = [];
	for (const item of raw) {
		if (typeof item !== 'string') {
			invalid.push(String(item));
			continue;
		}
		const path = item.trim();
		if (!path || include.includes(path)) continue;
		if (allowed.includes(path)) include.push(path);
		else invalid.push(path);
	}
	return { include, invalid };
}
