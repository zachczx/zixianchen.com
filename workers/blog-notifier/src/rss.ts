export interface RssPost {
	category?: string;
	description: string;
	guid: string;
	title: string;
	url: string;
}

const xmlEntities: Record<string, string> = {
	amp: '&',
	apos: "'",
	gt: '>',
	lt: '<',
	quot: '"',
};

function decodeXml(value: string): string {
	return value.replace(/&(amp|apos|gt|lt|quot);/g, (_, entity: string) => xmlEntities[entity] ?? _);
}

function readTag(item: string, tag: string): string | undefined {
	const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`));
	return match?.[1] ? decodeXml(match[1].trim()) : undefined;
}

export function parseRss(xml: string): RssPost[] {
	const posts: RssPost[] = [];

	for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
		const item = match[1];
		const guid = readTag(item, 'guid');
		const title = readTag(item, 'title');
		const url = readTag(item, 'link');

		if (!guid || !title || !url) continue;

		posts.push({
			category: readTag(item, 'category'),
			description: readTag(item, 'description') ?? '',
			guid,
			title,
			url,
		});
	}

	return posts;
}
