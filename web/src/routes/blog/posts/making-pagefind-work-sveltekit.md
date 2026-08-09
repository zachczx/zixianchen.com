---
title: 'Making Pagefind Work on SvelteKit'
description: 'A current setup for making Pagefind search work in both local development and production on SvelteKit.'
date: '2024-06-27'
date_updated: '2026-08-01'
category: 'Dev'
tags:
  - SvelteKit
  - SvelteJS
  - Pagefind
  - search
published: true
slug: making-pagefind-work-sveltekit
---

I still like [Pagefind](https://pagefind.app/) for the same reason I did when I first wrote this post: it gives a static site proper full-text search without making me run a search server. The setup has also become simpler since 2024, but the old approach was solving some real problems that are still worth understanding.

My original version used `vite-plugin-pagefind`, loaded Pagefind's ready-made UI globally, changed SvelteKit's prerender error handling, and rewrote `.html` result URLs. I no longer need all of those pieces, but I absolutely still need the Vite plugin: search should work during `pnpm dev`, not only after a production build.

The current setup uses Pagefind's CLI to index the production build and `vite-plugin-pagefind` to make the same search bundle available on the local Vite development server.

## 1. Install Pagefind

```sh
pnpm add -D pagefind vite-plugin-pagefind
```

Pagefind runs after SvelteKit has generated the static site. I made that part of the normal build command:

```json
{
	"scripts": {
		"build": "vite build && pagefind --site build"
	}
}
```

The important bit is that `--site` points to the directory produced by `adapter-static`. For this site, that directory is `build`.

## 2. Make search work during development

Pagefind normally indexes the site after SvelteKit has built its static HTML. That means the `/pagefind/pagefind.js` bundle does not exist in a plain `pnpm dev` session.

The production build command alone does not help during everyday development. [`vite-plugin-pagefind`](https://github.com/Hugos68/vite-plugin-pagefind) fills that gap by building the site, generating the index, and exposing the Pagefind bundle through Vite:

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { pagefind } from 'vite-plugin-pagefind';

export default defineConfig({
	plugins: [
		...(process.env.npm_lifecycle_event === 'dev'
			? pagefind({
					outputDirectory: 'build',
					assetsDirectory: 'static',
					buildScript: 'build',
					developStrategy: 'eager',
				})
			: []),
		sveltekit(),
	],
});
```

The `eager` strategy rebuilds and indexes the output when the development server starts. Checking `npm_lifecycle_event` prevents tools such as `svelte-check`, which also load Vite in serve mode, from triggering that expensive build. The plugin is part of this development setup, while the Pagefind CLI remains responsible for the production index.

During development, the plugin copies the generated bundle from `build/pagefind` to `static/pagefind` so Vite can serve it. That directory is generated output, so I keep it out of Git:

```gitignore
# .gitignore
/static/pagefind
```

Git-ignoring the directory was not enough for my ESLint flat config. ESLint still scanned the generated, minified Pagefind JavaScript and reported hundreds of errors from code I do not own. I excluded the directory there too:

```js
// eslint.config.js
export default defineConfig({
	ignores: ['build/**', 'static/pagefind/**', '.svelte-kit/**'],
});
```

If you use a different `assetsDirectory` or `bundleDirectory`, adjust both ignore paths to match. These exclusions only cover generated assets; the application code that imports and renders Pagefind remains linted normally.

## 3. Mark the content to index

Pagefind indexes the whole HTML body by default. I only want public blog posts in the search index, not navigation, footer text, or the rest of the portfolio, so I mark the article body explicitly:

```svelte
<article data-pagefind-body>
	<!-- post content -->
</article>
```

Once Pagefind sees `data-pagefind-body`, pages without that attribute are left out of the index. On this site I only add it when a post is listed, so published-but-unlisted posts remain accessible by URL without appearing in search.

I also expose a little metadata for result rendering and category filtering:

```svelte
<svelte:head>
	<meta data-pagefind-meta="date[content]" content={metadata.date} />
	<meta data-pagefind-meta="category[content]" content={metadata.category} />
	<meta data-pagefind-filter="category[content]" content={metadata.category} />
</svelte:head>
```

Pagefind automatically uses the first `h1` as the result title. Metadata is searchable too, so descriptions and tags can be added the same way.

## 4. Load the search API in the browser

Pagefind writes its browser bundle to `build/pagefind`. That file does not exist while Vite is compiling the Svelte app, so the import must stay dynamic:

```ts
const pagefindPath = '/pagefind/pagefind.js';
const pagefind = await import(/* @vite-ignore */ pagefindPath);

await pagefind.init();
const search = await pagefind.debouncedSearch('sveltekit');

// A newer debounced search can cancel this one.
if (!search) return;

const results = await Promise.all(search.results.map((result) => result.data()));
```

I use the JavaScript API instead of Pagefind's ready-made UI because it lets the search results look like the existing blog list. `debouncedSearch` also avoids running a search on every keystroke.

The returned `excerpt` contains safe, encoded HTML plus `<mark>` elements around matches, so it can be rendered as HTML and styled to fit the site. Other returned fields, such as custom metadata, should still be rendered normally rather than inserted as raw HTML.

## 5. Test the production build too

The Vite plugin makes search work during `pnpm dev`, but the deployed site still uses the index created by the production build. Test that path too:

```sh
pnpm build
pnpm preview
```

Pagefind removes `index.html` from result paths by default, but that is not the same as removing `.html` from flat files such as `my-post.html`. SvelteKit's static adapter can produce those flat paths, depending on the trailing-slash configuration.

Cloudflare's default static-asset handling redirects `/my-post.html` to `/my-post`, but other hosts may behave differently. Inspect the URLs in the generated index. If necessary, normalize a terminal `.html` before rendering the result link:

```ts
const url = result.url.replace(/\.html$/, '');
```

This was not merely an old workaround; whether it is needed depends on the output shape and hosting platform.

## What changed from the original setup?

- `vite-plugin-pagefind` stays because search should work during `pnpm dev`, not just in a production preview.
- Global Pagefind UI imports are unnecessary when using the JavaScript API to build a custom interface.
- Weakening `handleHttpError` is unnecessary because the generated browser bundle is loaded dynamically rather than resolved during the SvelteKit build.
- `.html` normalization is hosting-dependent. Pagefind removes `index.html`, but it does not universally remove the extension from flat HTML files.

That is all the integration needed: the Vite plugin supplies search during local development, SvelteKit writes the production pages, Pagefind indexes them, and Cloudflare deploys the resulting static directory.
