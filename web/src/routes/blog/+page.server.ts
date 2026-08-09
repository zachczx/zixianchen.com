import type { PageServerLoad } from './$types';

const paths = import.meta.glob<BlogPostMetadata>('./posts/*.md', {
	eager: true,
	import: 'metadata',
});

export const load: PageServerLoad = async () => {
	const posts = Object.values(paths)
		.filter((post) => post.published && post.listed !== false)
		.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

	return { posts };
};
