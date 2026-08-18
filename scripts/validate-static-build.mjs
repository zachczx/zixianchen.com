import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const postsDirectory = resolve('src/routes/blog/posts');

function requireFile(relativePath) {
	const fullPath = join(dist, relativePath);
	if (!existsSync(fullPath)) throw new Error(`Missing generated file: ${relativePath}`);
	return fullPath;
}

function generatedHtmlForRoute(route) {
	if (route === '/') return 'index.html';
	return `${route.replace(/^\//, '')}.html`;
}

function readFrontmatter(filePath) {
	const source = readFileSync(filePath, 'utf8');
	const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
	if (!match) return {};
	const frontmatter = match[1];
	const get = (key) => {
		const field = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
		return field?.[1]?.trim().replace(/^['"]|['"]$/g, '');
	};
	return {
		slug: get('slug'),
		published: get('published') === 'true',
	};
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
for (const file of ['404.html', 'rss.xml', 'sitemap.xml', '_redirects', 'pagefind/pagefind.js']) requireFile(file);

const publishedSlugs = readdirSync(postsDirectory)
	.filter((name) => name.endsWith('.md'))
	.map((name) => readFrontmatter(join(postsDirectory, name)))
	.filter((post) => post.published)
	.map((post) => post.slug)
	.filter(Boolean);

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
	'/projects/btonomics-wordpress /projects/btonomics 307',
	'/projects/rankamate /#projects 307',
]) {
	if (!redirects.includes(redirect)) throw new Error(`Missing redirect: ${redirect}`);
}

const sitemap = readFileSync(requireFile('sitemap.xml'), 'utf8');
for (const slug of publishedSlugs) {
	if (!sitemap.includes(`https://zixianchen.com/blog/${slug}`)) throw new Error(`Sitemap is missing published post: ${slug}`);
}
if (sitemap.includes('https://zixianchen.com/projects/rankamate')) throw new Error('Redirect-only route leaked into sitemap.');
if (sitemap.includes('https://zixianchen.com/projects/btonomics-wordpress')) {
	throw new Error('Redirect-only route leaked into sitemap.');
}

console.log(`Static build validation passed: ${canonicalRoutes.length} canonical routes, ${publishedSlugs.length} published posts.`);
