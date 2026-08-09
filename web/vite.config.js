import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import svg from '@poppanator/sveltekit-svg';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { pagefind } from 'vite-plugin-pagefind';

export default defineConfig({
	plugins: [
		...(process.env.npm_lifecycle_event === 'dev'
			? pagefind({
					outputDirectory: 'build',
					assetsDirectory: 'static',
					bundleDirectory: 'pagefind',
					buildScript: 'build',
					developStrategy: 'eager',
				})
			: []),
		enhancedImages(),
		sveltekit(),
		tailwindcss(),
		Icons({ compiler: 'svelte' }),
		svg({
			includePaths: ['./static/'],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
					},
				],
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
	server: {
		port: 6173,
		strictPort: false,
	},
});
