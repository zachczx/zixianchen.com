import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { resolveBlogSeriesForPost, validateBlogSeriesPosts } from '$lib/blogSeries';
import { resolveRelatedBlogPosts, validateRelatedBlogPosts } from '$lib/relatedBlogPosts';

const postsMetadata = import.meta.glob<BlogPostMetadata>('../posts/*.md', {
	eager: true,
	import: 'metadata',
});
const postsRaw = import.meta.glob<string>('../posts/*.md', {
	query: '?raw',
	import: 'default',
});

function indexPostMetadata(posts: Record<string, BlogPostMetadata>) {
	return Object.fromEntries(
		Object.entries(posts).map(([path, metadata]) => [
			path.split('/').pop()?.replace(/\.md$/, '') ?? path,
			{
				title: metadata.title,
				description: metadata.description,
				published: metadata.published,
				listed: metadata.listed,
			},
		]),
	);
}

function extractHeadings(content: string): { text: string; slug: string; level: number }[] {
	const cleanContent = content.replace(/^---[\s\S]*?---/, '');
	const headingRegex = /^(#{2,3})\s+(.+)$/gm;
	const headings: { text: string; slug: string; level: number }[] = [];
	let match;
	while ((match = headingRegex.exec(cleanContent)) !== null) {
		const level = match[1].length;
		const text = match[2].replace(/[`*_~[\]]/g, '').trim();
		const slug = text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
		headings.push({ text, slug, level });
	}
	return headings;
}

function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const cleanContent = content.replace(/^---[\s\S]*?---/, '');
	const words = cleanContent.trim().split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const postPath = `../posts/${slug}.md`;
	const metadata = postsMetadata[postPath];
	const loadRawPost = postsRaw[postPath];

	if (!metadata || !loadRawPost || !metadata.published) error(404, 'post not found!');

	const rawContent = await loadRawPost();
	const postMetadata = indexPostMetadata(postsMetadata);

	return {
		metadata,
		readingTime: calculateReadingTime(rawContent),
		headings: extractHeadings(rawContent),
		series: resolveBlogSeriesForPost(slug, postMetadata),
		relatedPosts: resolveRelatedBlogPosts(slug, postMetadata),
	};
};

export const entries: EntryGenerator = () => {
	const postMetadata = indexPostMetadata(postsMetadata);
	validateBlogSeriesPosts(postMetadata);
	validateRelatedBlogPosts(postMetadata);

	return Object.keys(postsMetadata)
		.filter((path) => postsMetadata[path].published)
		.map((path) => {
			const slug = path.split('/').pop()?.replace('.md', '');
			return slug ? { slug } : undefined;
		})
		.filter((item): item is { slug: string } => item !== undefined);
};
