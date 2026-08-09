// /src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import * as sitemap from 'super-sitemap/sveltekit';

export const prerender = true; // optional

interface PostModule {
	metadata: BlogPostMetadata;
	default: string[];
}

export const GET: RequestHandler = async () => {
	const blogPosts: { values: string[]; lastmod: string }[] = [];
	try {
		const posts: Record<string, PostModule> = import.meta.glob('../blog/posts/*.md', { eager: true });
		for (const path in posts) {
			const { date, date_updated, listed, published, slug } = posts[path].metadata;
			if (published && listed !== false) {
				blogPosts.push({
					values: [slug],
					lastmod: date_updated || date,
				});
			}
		}
	} catch {
		throw error(500, 'Could not load data for param values.');
	}

	return await sitemap.response({
		origin: 'https://zixianchen.com',
		excludeRoutePatterns: [/^\/blog\/unlisted$/],
		paramValues: {
			'/blog/[slug]': blogPosts,
		},
	});
};
