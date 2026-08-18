import { getCollection } from 'astro:content';

const origin = 'https://zixianchen.com';
const staticRoutes = [
	'/',
	'/blog',
	'/contact',
	'/projects/apptitude',
	'/projects/btonomics',
	'/projects/btonomics-wordpress',
	'/projects/cubby',
	'/projects/lingo',
	'/projects/rankamate',
];

export async function GET() {
	const posts = (await getCollection('blog', ({ data }) => data.published && data.listed !== false))
		.map(({ data }) => data)
		.sort((a, b) => a.slug.localeCompare(b.slug));

	const staticEntries = staticRoutes
		.map((route) => `\t<url><loc>${origin}${route}</loc></url>`)
		.join('\n');
	const blogEntries = posts
		.map(
			(post) =>
				`\t<url><loc>${origin}/blog/${post.slug}</loc><lastmod>${post.date_updated || post.date}</lastmod></url>`,
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
