export const CATEGORY_OPTIONS = [
	{ key: 'work', label: 'Work' },
	{ key: 'systems', label: 'Systems' },
	{ key: 'dev', label: 'Dev' },
	{ key: 'life', label: 'Life' },
] as const;

export type CategoryKey = (typeof CATEGORY_OPTIONS)[number]['key'];
export type PreferenceKey = 'all' | CategoryKey;

export interface PreferenceUpdate {
	changed: boolean;
	message?: string;
	value: string;
}

function isCategoryKey(value: string): value is CategoryKey {
	return CATEGORY_OPTIONS.some(({ key }) => key === value);
}

export function parsePreferences(value: string): 'all' | Set<CategoryKey> {
	if (!value || value === 'all') return 'all';

	const selected = new Set(
		value
			.split(',')
			.map((entry) => entry.trim().toLowerCase())
			.filter(isCategoryKey),
	);

	return selected.size > 0 ? selected : 'all';
}

function serializePreferences(selected: Set<CategoryKey>): string {
	return CATEGORY_OPTIONS.filter(({ key }) => selected.has(key))
		.map(({ key }) => key)
		.join(',');
}

export function togglePreference(currentValue: string, key: PreferenceKey): PreferenceUpdate {
	const current = parsePreferences(currentValue);

	if (key === 'all') {
		return { changed: current !== 'all', value: 'all' };
	}

	const selected = current === 'all' ? new Set<CategoryKey>() : new Set(current);
	if (selected.has(key)) {
		if (selected.size === 1) {
			return {
				changed: false,
				message: 'Choose at least one category, or use /stop.',
				value: currentValue,
			};
		}
		selected.delete(key);
	} else {
		selected.add(key);
	}

	return { changed: true, value: serializePreferences(selected) };
}

export function shouldNotify(preferences: string, category?: string): boolean {
	const selected = parsePreferences(preferences);
	if (selected === 'all') return true;

	const key = category?.trim().toLowerCase();
	return Boolean(key && isCategoryKey(key) && selected.has(key));
}

export function parsePreferenceCallback(data: string): PreferenceKey | undefined {
	if (!data.startsWith('prefs:')) return undefined;
	const key = data.slice('prefs:'.length).toLowerCase();
	if (key === 'all') return 'all';
	return isCategoryKey(key) ? key : undefined;
}
