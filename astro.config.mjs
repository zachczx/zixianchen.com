import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { enhancedImages } from '@sveltejs/enhanced-img';
import svg from '@poppanator/sveltekit-svg';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { pagefind } from 'vite-plugin-pagefind';
import { visualizer } from 'rollup-plugin-visualizer';
import {
	transformerCompactLineOptions,
	transformerNotationDiff,
	transformerNotationHighlight,
} from '@shikijs/transformers';
import rehypeSlug from 'rehype-slug';

const isDevCommand = process.env.npm_lifecycle_event === 'dev';
const navigationShim = fileURLToPath(new URL('./src/lib/sveltekit-navigation-shim.ts', import.meta.url));

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
	integrations: [svelte()],
	markdown: {
		shikiConfig: {
			theme: 'rose-pine-moon',
			transformers: [
				transformerNotationHighlight({ matchAlgorithm: 'v3' }),
				transformerNotationDiff({ matchAlgorithm: 'v3' }),
				transformerCompactLineOptions(),
			],
		},
		rehypePlugins: [rehypeSlug],
	},
	vite: {
		resolve: {
			alias: {
				'$app/navigation': navigationShim,
			},
		},
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
			enhancedImages(),
			tailwindcss(),
			Icons({ compiler: 'svelte' }),
			svg({
				includePaths: ['./static/'],
				svgoOptions: {
					multipass: true,
					plugins: [{ name: 'preset-default' }],
				},
			}),
			...(process.env.ANALYZE === 'true'
				? [
						visualizer({
							emitFile: true,
							filename: 'stats.html',
						}),
					]
				: []),
		],
	},
});
