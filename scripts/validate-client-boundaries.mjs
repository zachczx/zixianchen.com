import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');

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

requireIslandCount('/', 0);
requireIslandCount('/blog', 0);
requireIslandCount('/contact', 0);
requireIslandCount('/projects/apptitude', 0);
requireIslandCount('/projects/btonomics', 0);
requireIslandCount('/projects/cubby', 0);
requireIslandCount('/projects/lingo', 0);

const articleFiles = readdirSync(join(dist, 'blog'))
	.filter((name) => name.endsWith('.html'))
	.filter((name) => !['index.html', 'unlisted.html'].includes(name));

if (articleFiles.length === 0) throw new Error('No generated article files found for client-boundary validation.');
for (const articleFile of articleFiles) {
	const html = readFileSync(join(dist, 'blog', articleFile), 'utf8');
	const count = (html.match(/<astro-island\b/g) ?? []).length;
	if (count !== 0)
		throw new Error(`/blog/${articleFile.replace(/\.html$/, '')} unexpectedly hydrates ${count} islands.`);
}

console.log(`Client-boundary validation passed: key routes and ${articleFiles.length} articles hydrate zero framework islands.`);
