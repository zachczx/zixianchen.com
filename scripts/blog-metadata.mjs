import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const blogPostsDirectory = new URL('../src/routes/blog/posts/', import.meta.url);

function readString(data, field, fileName) {
	const value = data[field];
	if (value === undefined || value === null) return '';
	if (typeof value !== 'string') throw new TypeError(`${field} must be a string in ${fileName}`);
	return value;
}

export function readBlogPosts() {
	return readdirSync(blogPostsDirectory)
		.filter((fileName) => fileName.endsWith('.md'))
		.map((fileName) => {
			const source = readFileSync(new URL(fileName, blogPostsDirectory), 'utf8');
			const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
			if (frontmatter === undefined) throw new Error(`Missing frontmatter in ${fileName}`);

			const data = parse(frontmatter);
			if (!data || typeof data !== 'object' || Array.isArray(data)) {
				throw new TypeError(`Frontmatter must be a YAML object in ${fileName}`);
			}

			return {
				slug: readString(data, 'slug', fileName),
				date: readString(data, 'date', fileName),
				dateUpdated: readString(data, 'date_updated', fileName),
				published: data.published === true,
				listed: data.listed !== false,
			};
		});
}
