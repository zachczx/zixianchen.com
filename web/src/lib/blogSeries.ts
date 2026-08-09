export interface BlogSeriesDefinition {
	title: string;
	posts: readonly string[];
}

export const blogSeries = {
	'staff-work': {
		title: 'Staff Work',
		posts: [
			'staff-work-make-it-make-sense-before-it-goes-up',
			'staff-work-small-stuff-is-still-part-of-staff-work',
			'staff-work-is-everyones-problem',
		],
	},
} as const satisfies Record<string, BlogSeriesDefinition>;

export type BlogSeriesId = keyof typeof blogSeries;

export interface BlogPostSummary {
	title: string;
	published: boolean;
}

const blogSeriesByPost = new Map<string, { id: BlogSeriesId; position: number }>();

for (const [id, series] of Object.entries(blogSeries) as [BlogSeriesId, BlogSeriesDefinition][]) {
	series.posts.forEach((slug, position) => {
		const existingMembership = blogSeriesByPost.get(slug);
		if (existingMembership) {
			throw new Error(`Blog post "${slug}" is registered in both "${existingMembership.id}" and "${id}"`);
		}

		blogSeriesByPost.set(slug, { id, position });
	});
}

export function validateBlogSeriesPosts(posts: Readonly<Record<string, BlogPostSummary | undefined>>): void {
	for (const [id, series] of Object.entries(blogSeries) as [BlogSeriesId, BlogSeriesDefinition][]) {
		for (const slug of series.posts) {
			if (!Object.hasOwn(posts, slug)) {
				throw new Error(`Blog series "${id}" references missing post "${slug}"`);
			}
		}
	}
}

export function getBlogSeriesPosition(postSlug: string) {
	const membership = blogSeriesByPost.get(postSlug);
	if (!membership) return undefined;
	const series = blogSeries[membership.id];

	return {
		title: series.title,
		position: membership.position + 1,
		total: series.posts.length,
	};
}

export function resolveBlogSeriesForPost(
	postSlug: string,
	posts: Readonly<Record<string, BlogPostSummary | undefined>>,
) {
	validateBlogSeriesPosts(posts);

	const membership = blogSeriesByPost.get(postSlug);
	if (!membership) return undefined;
	const series = blogSeries[membership.id];
	const seriesPosts = series.posts.map((slug, index) => {
		const post = posts[slug];
		if (!post) throw new Error(`Blog series "${membership.id}" references missing post "${slug}"`);

		return {
			slug,
			title: post.published ? post.title : null,
			published: post.published,
			position: index + 1,
			current: slug === postSlug,
		};
	});

	return {
		id: membership.id,
		title: series.title,
		position: membership.position + 1,
		total: seriesPosts.length,
		posts: seriesPosts,
		previous:
			seriesPosts
				.slice(0, membership.position)
				.reverse()
				.find((post) => post.published) ?? null,
		next: seriesPosts.slice(membership.position + 1).find((post) => post.published) ?? null,
	};
}
