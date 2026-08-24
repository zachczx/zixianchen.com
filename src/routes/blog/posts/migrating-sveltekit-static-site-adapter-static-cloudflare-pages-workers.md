---
title: 'Migrating a Static SvelteKit Site from Cloudflare Pages to Workers'
description: 'I moved an adapter-static SvelteKit site from Cloudflare Pages to Workers with a static-assets Wrangler config and three deployment settings.'
date: '2025-09-29'
date_updated: '2026-08-24'
category: 'Dev'
tags:
  - Cloudflare
  - SvelteKit
  - Workers
  - Pages
published: true
slug: 'migrating-sveltekit-static-site-adapter-static-cloudflare-pages-workers'
---

I'm a longtime fan of Cloudflare Pages. It's free, it's fast, and it's easy to get started. In the last year or so I've been reading about Cloudflare Workers, and recently I saw Cloudflare [recommending everyone to start with Workers for new projects](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).

I couldn't find much online about the specific setup for what I used with Cloudflare Pages, which was SvelteKit using adapter-static. It's what I've always used for all my static sites.

After some digging, it turns out all I needed is to:

## The Migration

1. Add a `wrangler.jsonc` to the root of the SvelteKit project. For a purely static site, this is what I'd use now:

```jsonc
// wrangler.jsonc
{
	"$schema": "./node_modules/wrangler/config-schema.json",
	"name": "your-name",
	"compatibility_date": "2026-08-24",
	"assets": {
		"directory": "./build/",
		"not_found_handling": "404-page",
		"html_handling": "drop-trailing-slash",
	},
}
```

`$schema` gives you editor validation. `404-page` tells Workers to use the generated 404 page, while `drop-trailing-slash` makes `/about` canonical rather than `/about/`. I pair that with `export const trailingSlash = 'never'` in the root SvelteKit layout.

2. You'll need to do largely the same configs like connected domain within the Workers project settings (Compute (Workers) > project-name > Settings)

3. I use pnpm, so

```
- Build command: pnpm build
- Deploy command: pnpm exec wrangler deploy
- Root directory: /
```

4. In the settings you'll see that things like "Variables cannot be added to a Worker that only has static assets". (They recently changed their UI. Previously the project name would have a pill tag beside saying "Static")

5. A reminder though, check your builds. For some reason Cloudflare Pages allowed me to do some dynamic routes and import that adapter-static didn't. So I had to switch to vite's import.meta.glob for posts and [exporting an entries func](https://svelte.dev/docs/kit/page-options#entries) to make it work.

All good! Everything's deployed as static assets. When I first tried it using adapter-cloudflare I still ended up invoking page functions for some reason.

## Adding Worker Code Later

If you later need an API route, you can extend the same deployment instead of moving away from static assets:

```jsonc
// wrangler.jsonc
{
	"$schema": "./node_modules/wrangler/config-schema.json",
	"name": "your-name",
	"main": "./worker/index.ts",
	"compatibility_date": "2026-08-24",
	"assets": {
		"directory": "./build/",
		"binding": "ASSETS",
		"not_found_handling": "404-page",
		"html_handling": "drop-trailing-slash",
		"run_worker_first": ["/api/*"],
	},
}
```

Normal pages and files stay asset-first. `/api/*` is forced through the Worker first, and the Worker can fall back to `env.ASSETS.fetch(request)`. Don't add `binding` to the assets-only config; it only makes sense once `main` points to Worker code.

Overall, it was an easy config change. I still very much prefer the Pages UI and settings, which are much more straightforward. Cloudflare Workers' graphs, charts, dashboard are very cluttered imo and not enjoyable to work with.

But Cloudflare services are free, so I'm not complaining. I'd still use this even though I've VPSes for deploying more complex projects.

[See also: Workers Static Assets configuration](https://developers.cloudflare.com/workers/static-assets/binding/)
