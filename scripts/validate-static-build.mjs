import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readBlogPosts } from './blog-metadata.mjs';

const dist = resolve('dist');

function requireFile(relativePath) {
	const fullPath = join(dist, relativePath);
	if (!existsSync(fullPath)) throw new Error(`Missing generated file: ${relativePath}`);
	return fullPath;
}

function generatedHtmlForRoute(route) {
	if (route === '/') return 'index.html';
	return `${route.replace(/^\//, '')}.html`;
}

const canonicalRoutes = [
	'/',
	'/blog',
	'/contact',
	'/projects/apptitude',
	'/projects/btonomics',
	'/projects/cubby',
	'/projects/lingo',
];

for (const route of canonicalRoutes) requireFile(generatedHtmlForRoute(route));
for (const file of [
	'404.html',
	'rss.xml',
	'sitemap-index.xml',
	'sitemap-0.xml',
	'_redirects',
	'pagefind/pagefind.js',
]) {
	requireFile(file);
}

const posts = readBlogPosts();
const publishedPosts = posts.filter((post) => post.published && post.slug);
const listedPublishedPosts = publishedPosts.filter((post) => post.listed);
const publishedSlugs = publishedPosts.map((post) => post.slug);

if (publishedSlugs.length === 0) throw new Error('No published blog posts were discovered.');
for (const slug of publishedSlugs) requireFile(`blog/${slug}.html`);

for (const route of canonicalRoutes) {
	const html = readFileSync(requireFile(generatedHtmlForRoute(route)), 'utf8');
	const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
	if (!canonical) throw new Error(`Missing canonical URL for ${route}`);
	const expected = route === '/' ? 'https://zixianchen.com/' : `https://zixianchen.com${route}`;
	if (canonical !== expected) throw new Error(`Unexpected canonical for ${route}: ${canonical}; expected ${expected}`);
}

const sampleArticle = `/blog/${publishedSlugs[0]}`;
const sampleArticleHtml = readFileSync(requireFile(generatedHtmlForRoute(sampleArticle)), 'utf8');
const sampleCanonical = sampleArticleHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
if (sampleCanonical !== `https://zixianchen.com${sampleArticle}`) {
	throw new Error(`Unexpected article canonical: ${sampleCanonical}`);
}

const redirects = readFileSync(requireFile('_redirects'), 'utf8');
for (const redirect of [
	'/sitemap.xml /sitemap-index.xml 301',
	'/projects/btonomics-wordpress /projects/btonomics 307',
	'/projects/rankamate /#projects 307',
]) {
	if (!redirects.includes(redirect)) throw new Error(`Missing redirect: ${redirect}`);
}

const sitemapIndex = readFileSync(requireFile('sitemap-index.xml'), 'utf8');
if (!sitemapIndex.includes('https://zixianchen.com/sitemap-0.xml')) {
	throw new Error('Sitemap index is missing the generated sitemap.');
}

const sitemap = readFileSync(requireFile('sitemap-0.xml'), 'utf8');
for (const post of listedPublishedPosts) {
	const url = `https://zixianchen.com/blog/${post.slug}`;
	const entry = sitemap.match(new RegExp(`<url>\\s*<loc>${url}</loc>[\\s\\S]*?</url>`))?.[0];
	if (!entry) {
		throw new Error(`Sitemap is missing listed published post: ${post.slug}`);
	}
	const expectedLastModified = new Date(`${post.dateUpdated || post.date}T00:00:00.000Z`).toISOString();
	if (!entry.includes(`<lastmod>${expectedLastModified}</lastmod>`)) {
		throw new Error(`Sitemap has an unexpected lastmod for ${post.slug}; expected ${expectedLastModified}`);
	}
}
if (sitemap.includes('https://zixianchen.com/blog/unlisted')) {
	throw new Error('Unlisted blog index leaked into sitemap.');
}
for (const post of publishedPosts.filter((post) => !post.listed)) {
	if (sitemap.includes(`https://zixianchen.com/blog/${post.slug}`)) {
		throw new Error(`Unlisted post leaked into sitemap: ${post.slug}`);
	}
}
if (sitemap.includes('https://zixianchen.com/projects/rankamate'))
	throw new Error('Redirect-only route leaked into sitemap.');
if (sitemap.includes('https://zixianchen.com/projects/btonomics-wordpress')) {
	throw new Error('Redirect-only route leaked into sitemap.');
}

console.log(
	`Static build validation passed: ${canonicalRoutes.length} canonical routes, ${publishedSlugs.length} published posts, ${listedPublishedPosts.length} listed in sitemap.`,
);
