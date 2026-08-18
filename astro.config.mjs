import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { pagefind } from 'vite-plugin-pagefind';
import {
	transformerCompactLineOptions,
	transformerNotationDiff,
	transformerNotationHighlight,
} from '@shikijs/transformers';
import { readBlogPosts } from './scripts/blog-metadata.mjs';

const isDevCommand = process.env.npm_lifecycle_event === 'dev';
const site = 'https://zixianchen.com';

const blogLastModified = new Map(
	readBlogPosts()
		.filter((post) => post.published && post.listed)
		.map((post) => [`${site}/blog/${post.slug}`, post.dateUpdated || post.date]),
);

export default defineConfig({
	site,
	output: 'static',
	trailingSlash: 'never',
	publicDir: './static',

	build: {
		format: 'file',
	},

	server: {
		port: 6173,
	},

	markdown: {
		shikiConfig: {
			theme: 'rose-pine-moon',
			transformers: [
				transformerNotationHighlight({ matchAlgorithm: 'v3' }),
				transformerNotationDiff({ matchAlgorithm: 'v3' }),
				transformerCompactLineOptions(),
			],
		},
	},

	vite: {
		plugins: [
			...(isDevCommand
				? [
						pagefind({
							outputDirectory: 'dist',
							assetsDirectory: 'static',
							bundleDirectory: 'pagefind',
							buildScript: 'build',
							developStrategy: 'eager',
						}),
					]
				: []),
			tailwindcss(),
		],
	},

	integrations: [
		sitemap({
			filter(page) {
				const pathname = new URL(page).pathname;
				return !pathname.startsWith('/blog/') || blogLastModified.has(page);
			},
			serialize(item) {
				const lastmod = blogLastModified.get(item.url);
				return lastmod ? { ...item, lastmod } : item;
			},
			namespaces: {
				news: false,
				xhtml: false,
				image: false,
				video: false,
			},
		}),
	],
});
