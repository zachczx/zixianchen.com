import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	let posts: BlogPostMetadata[] = [];
	const paths = import.meta.glob('./blog/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		if (file && typeof file === 'object' && 'metadata' in file) {
			posts.push(file.metadata as BlogPostMetadata);
		}
	}

	posts = posts
		.filter((post) => post.published && post.listed !== false)
		.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
		.slice(0, 3);

	return { posts };
};
