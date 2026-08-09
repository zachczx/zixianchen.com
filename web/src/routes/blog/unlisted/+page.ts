import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const paths = import.meta.glob('../posts/*.md', { eager: true });
	const posts: BlogPostMetadata[] = [];

	for (const path in paths) {
		const file = paths[path];
		if (file && typeof file === 'object' && 'metadata' in file) {
			posts.push(file.metadata as BlogPostMetadata);
		}
	}

	return {
		posts: posts
			.filter((post) => post.published && post.listed === false)
			.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()),
	};
};
