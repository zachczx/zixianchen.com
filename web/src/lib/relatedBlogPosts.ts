export interface RelatedBlogPostSummary {
	title: string;
	description: string;
	published: boolean;
	listed?: boolean;
}

const relatedBlogPostGroups = [
	[
		'adding-backblaze-b2-bucket-to-coolify',
		'coolify-docker-compose-build-failures-alpinelinux-cdn-temporary-error',
		'gpt-4-6-sol-fix-coolify-deployments-oracle-cloud',
		'oracle-cloud-infrastructure-oci-resize-extend-boot-volume-size',
	],
	[
		'coolify-postgres-18-pgdata-restart',
		'finally-connecting-docker-compose-app-postgres-db-coolify',
		'using-postgres-coolify-internal-database-url',
	],
	['pocketbase-setup-first-time-superuser-creation', 'using-resend-com-smtp-saas-provider-pocketbase-emails'],
	[
		'wireless-sgx-not-working-linux-mint-connected-no-internet',
		'wireless-sgx-stuck-scanning-sim-swap-pixel-reset-network-settings',
	],
	['feeling-some-ai-coding-fomo', 'how-ai-changed-the-way-i-write'],
	['making-pagefind-work-sveltekit', 'migrating-sveltekit-static-site-adapter-static-cloudflare-pages-workers'],
] as const;

const relatedSlugsByPost = new Map<string, readonly string[]>();

for (const group of relatedBlogPostGroups) {
	for (const slug of group) {
		if (relatedSlugsByPost.has(slug)) {
			throw new Error(`Blog post "${slug}" appears in more than one related-post group`);
		}

		relatedSlugsByPost.set(
			slug,
			group.filter((relatedSlug) => relatedSlug !== slug),
		);
	}
}

export function validateRelatedBlogPosts(posts: Readonly<Record<string, RelatedBlogPostSummary | undefined>>): void {
	for (const group of relatedBlogPostGroups) {
		for (const slug of group) {
			if (!Object.hasOwn(posts, slug)) {
				throw new Error(`Related-post group references missing post "${slug}"`);
			}
		}
	}
}

export function resolveRelatedBlogPosts(
	postSlug: string,
	posts: Readonly<Record<string, RelatedBlogPostSummary | undefined>>,
) {
	return (relatedSlugsByPost.get(postSlug) ?? [])
		.map((slug) => ({ slug, post: posts[slug] }))
		.filter((item): item is { slug: string; post: RelatedBlogPostSummary } =>
			Boolean(item.post?.published && item.post.listed !== false),
		)
		.map(({ slug, post }) => ({ slug, title: post.title, description: post.description }));
}
