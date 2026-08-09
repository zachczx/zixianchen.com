import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';

const posts = import.meta.glob<Component>('../posts/*.md', {
	import: 'default',
});

export const load: PageLoad = async ({ data, params }) => {
	const loadPost = posts[`../posts/${params.slug}.md`];
	if (!loadPost) error(404, 'post not found!');

	return { ...data, content: await loadPost() };
};
