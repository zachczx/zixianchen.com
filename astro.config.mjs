import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { pagefind } from 'vite-plugin-pagefind';
import {
	transformerCompactLineOptions,
	transformerNotationDiff,
	transformerNotationHighlight,
} from '@shikijs/transformers';

const isDevCommand = process.env.npm_lifecycle_event === 'dev';

export default defineConfig({
	site: 'https://zixianchen.com',
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
});
