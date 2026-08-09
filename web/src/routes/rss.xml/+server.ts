import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

const origin = 'https://zixianchen.com';
const feedUrl = `${origin}/rss.xml`;
const xmlEntities: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	"'": '&apos;',
	'"': '&quot;',
};

interface PostModule {
	metadata: BlogPostMetadata;
}

function escapeXml(value: string): string {
	return value.replace(/[<>&'"]/g, (character) => xmlEntities[character] ?? character);
}

export const GET: RequestHandler = () => {
	const posts: Record<string, PostModule> = import.meta.glob('../blog/posts/*.md', { eager: true });
	const publishedPosts = Object.values(posts)
		.map(({ metadata }) => metadata)
		.filter(({ published, listed }) => published && listed !== false)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const items = publishedPosts
		.map((post) => {
			const postUrl = `${origin}/blog/${post.slug}`;
			const category = post.category ? `\n\t\t\t<category>${escapeXml(post.category)}</category>` : '';

			return `\t\t<item>
\t\t\t<title>${escapeXml(post.title)}</title>
\t\t\t<link>${postUrl}</link>
\t\t\t<guid isPermaLink="true">${postUrl}</guid>
\t\t\t<pubDate>${new Date(post.date).toUTCString()}</pubDate>
\t\t\t<description>${escapeXml(post.description)}</description>${category}
\t\t</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>Zixian Chen - Blog</title>
\t\t<link>${origin}/blog</link>
\t\t<description>Blog posts by Zixian Chen.</description>
\t\t<language>en</language>
\t\t<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
\t</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
		},
	});
};
