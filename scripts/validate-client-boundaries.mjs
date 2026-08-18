import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const sourceRoot = resolve('src');

function routeFile(route) {
	return join(dist, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`);
}

function islandCount(route) {
	const html = readFileSync(routeFile(route), 'utf8');
	return (html.match(/<astro-island\b/g) ?? []).length;
}

function requireIslandCount(route, expected) {
	const actual = islandCount(route);
	if (actual !== expected) throw new Error(`${route} has ${actual} Astro islands; expected ${expected}`);
}

for (const route of [
	'/',
	'/blog',
	'/contact',
	'/projects/apptitude',
	'/projects/btonomics',
	'/projects/cubby',
	'/projects/lingo',
]) {
	requireIslandCount(route, 0);
}

const articleFiles = readdirSync(join(dist, 'blog'))
	.filter((name) => name.endsWith('.html'))
	.filter((name) => !['index.html', 'unlisted.html'].includes(name));

if (articleFiles.length === 0) throw new Error('No generated article files found for client-boundary validation.');
for (const articleFile of articleFiles) {
	const html = readFileSync(join(dist, 'blog', articleFile), 'utf8');
	const count = (html.match(/<astro-island\b/g) ?? []).length;
	if (count !== 0) {
		throw new Error(`/blog/${articleFile.replace(/\.html$/, '')} unexpectedly hydrates ${count} islands.`);
	}
}

const svelteSources = [];
function collectSvelteSources(directory) {
	for (const entry of readdirSync(directory)) {
		const fullPath = join(directory, entry);
		if (statSync(fullPath).isDirectory()) collectSvelteSources(fullPath);
		else if (entry.endsWith('.svelte') || entry.endsWith('.svelte.ts') || entry.endsWith('.svelte.js')) {
			svelteSources.push(fullPath);
		}
	}
}
collectSvelteSources(sourceRoot);
if (svelteSources.length > 0) {
	throw new Error(`Svelte source remains in the Astro site:\n${svelteSources.join('\n')}`);
}

const packageJson = readFileSync(resolve('package.json'), 'utf8');
for (const dependency of ['svelte', '@astrojs/svelte', '@sveltejs/vite-plugin-svelte']) {
	if (packageJson.includes(`\"${dependency}\"`)) throw new Error(`Unexpected Svelte dependency remains: ${dependency}`);
}

for (const route of ['/', '/blog', '/blog/so-you-want-bigger-job']) {
	const html = readFileSync(routeFile(route), 'utf8');
	if (html.includes('client.svelte')) throw new Error(`${route} still references the Svelte client runtime.`);
}

console.log(
	`Client-boundary validation passed: key routes and ${articleFiles.length} articles hydrate zero framework islands; no Svelte source or runtime dependencies remain.`,
);
