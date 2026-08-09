import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { codeToHtml } from 'shiki';
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerCompactLineOptions,
} from '@shikijs/transformers';
import rehypeSlug from 'rehype-slug';
import type { Config } from '@sveltejs/kit';
import type { PreprocessorGroup } from 'svelte/compiler';
import type { MdsvexOptions } from 'mdsvex';

const mdsvexOptions: MdsvexOptions = {
	extensions: ['.md'],
	smartypants: true,
	rehypePlugins: [rehypeSlug],
	highlight: {
		highlighter: async (code: string, lang: string | null | undefined): Promise<string> => {
			let html;
			if (lang === 'text') {
				html = escapeSvelte(
					await codeToHtml(code, {
						lang: 'text',
						theme: 'rose-pine-moon',
						transformers: [
							transformerNotationHighlight({ matchAlgorithm: 'v3' }),
							transformerNotationDiff({ matchAlgorithm: 'v3' }),
							transformerCompactLineOptions(),
						],
					}),
				);
			} else {
				html = escapeSvelte(
					await codeToHtml(code, {
						lang: 'js',
						theme: 'rose-pine-moon',
						transformers: [
							transformerNotationHighlight({ matchAlgorithm: 'v3' }),
							transformerNotationDiff({ matchAlgorithm: 'v3' }),
							transformerCompactLineOptions(),
						],
					}),
				);
			}
			return `{@html \`${html}\` }`;
		},
	},
};

const config: Config = {
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true,
		}),
	},
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)] as PreprocessorGroup[],
};

export default config;
