# Migrate zixianchen.com from SvelteKit to Astro

## Objective

Migrate `zachczx/svelte-zixianchen` from SvelteKit to the current stable Astro 6 release.

The migration should make the site a better fit for its actual architecture: a mostly static portfolio/blog with a small number of interactive features.

The primary goals are:

- preserve the existing site, URLs, design and behaviour;
- reduce JavaScript shipped to browsers, especially on content pages;
- keep the site fully statically generated;
- continue deploying through Cloudflare Workers Static Assets;
- retain Pagefind;
- use Astro islands or small vanilla browser scripts only where interactivity genuinely requires them.

This is a framework migration, **not a redesign or product refactor**.

## Non-goals

Do not:

- redesign pages or change the information architecture;
- rewrite copy or blog content;
- change project URLs or blog slugs;
- introduce SSR;
- introduce a Worker runtime;
- add `@astrojs/cloudflare` unless a concrete requirement is discovered that makes static generation impossible;
- add a Worker `main` entry point;
- turn the site into an SPA;
- add Astro `<ClientRouter />` merely to reproduce the current SvelteKit navigation behaviour;
- convert every Svelte component to Astro merely for consistency;
- retain large hydrated Svelte wrappers merely because they are easy to port;
- upgrade unrelated dependencies;
- refactor CSS, DaisyUI tokens, Tailwind classes or visual structure unless required for compatibility;
- rewrite historical blog posts that mention Svelte or SvelteKit in their historical context.

Keep the migration mechanical wherever possible.

---

## 0. Capability gate

Before modifying implementation code, confirm that the environment has:

1. A writable local checkout.
2. Permission to create and use a dedicated Git worktree.
3. Node and pnpm compatible with the repository and current stable Astro 6.
4. Outbound network access required to install new packages.
5. Permission to run the repository's complete validation suite.
6. A browser-capable test environment suitable for validating the rendered site at desktop and mobile sizes.
7. Access to the connected GitHub app and/or authenticated `gh` for push and draft-PR operations.

If any required capability is missing, stop without modifying implementation files and report the missing capability precisely.

Do not perform untested remote-only edits.

---

## 1. Repository safety and branch workflow

Read and follow:

- `AGENTS.md`
- `PRODUCT.md`
- any other repository-local agent instructions

This plan already lives on branch:

`feat/astro-migration`

The branch was created from `main` specifically for this migration. Do **not** create a second migration branch.

Before implementation:

1. Fetch the latest remote state.
2. Record the current `main` commit and the current `feat/astro-migration` commit.
3. Check whether `main` has moved since this branch was created.
4. If needed, update this branch cleanly from latest `main` before implementation.
5. Check `git status --short --untracked-files=all`.
6. Do not overwrite or absorb unrelated dirty work.
7. Use a dedicated worktree for `feat/astro-migration` if the current checkout is occupied by other work.

Do not base the migration on draft PR #22.

PR #22 is conceptually superseded by this migration. Reproduce the useful Cloudflare intent in the final Astro configuration where appropriate, but do not close or modify PR #22 unless explicitly asked.

Keep this plan file in the migration branch and update it only if implementation discoveries materially change the agreed architecture.

---

## 2. Establish the SvelteKit baseline first

Do not start converting files until the existing application has been built and its behaviour recorded.

Run the current required checks and production build.

At minimum:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm build
```

Record:

- whether each command succeeds;
- the complete list of generated public routes;
- generated HTML structure for representative routes;
- the build output directory;
- the amount of JavaScript generated overall;
- the JavaScript referenced by representative initial page loads;
- current CSS output size;
- Pagefind index size;
- build duration if straightforward to capture.

Measure at least:

```text
/
/blog
/blog/<representative-post>
/contact
at least two /projects/... pages
/rss.xml
/sitemap.xml
a missing route / 404
```

Do not fabricate measurements.

### Route inventory

Build an authoritative route inventory from:

- the SvelteKit route tree;
- sitemap output;
- RSS output where relevant;
- generated build files.

The Astro site must preserve every public route unless an existing route is demonstrably dead or internal. If such a route is found, report it rather than silently deleting it.

### Visual baseline

Capture representative screenshots at approximately:

- 390px width;
- 768px width;
- 1440px width.

Cover:

- home;
- blog index;
- a representative blog article;
- contact;
- representative project pages.

These screenshots are for regression comparison, not redesign inspiration.

---

## 3. Audit all SvelteKit-specific behaviour

Before choosing what becomes Astro, Svelte islands or plain scripts, inventory every use of:

```text
$app/*
onMount
$state
$derived
$effect
event handlers
browser globals
localStorage
canvas
dynamic imports
fetch()
View Transition APIs
```

Also audit:

- `svelte.config.*`;
- Vite config;
- Mdsvex configuration;
- Pagefind integration;
- sitemap generation;
- RSS generation;
- SEO/canonical metadata;
- Open Graph metadata and generated OG assets;
- image processing;
- syntax highlighting;
- heading IDs / anchors;
- analytics;
- third-party scripts;
- robots.txt;
- favicons;
- static assets;
- fonts;
- custom error handling.

Classify each current component as one of:

```text
A. Pure rendering -> Astro component
B. Tiny browser behaviour -> Astro + plain script
C. Genuine interactive island -> retain Svelte initially
D. Build-time/data logic -> TypeScript module / Astro content layer
```

Do not assume that "currently a Svelte component" means "should remain a Svelte component."

---

## 4. Target architecture

The desired architecture is approximately:

```text
Astro
├─ pages and routing
├─ layouts
├─ SEO/head
├─ blog content
├─ static project pages
├─ RSS
├─ sitemap
└─ 404

Small browser scripts
├─ theme persistence
├─ active-section tracking
├─ simple navigation behaviour
└─ contact-form enhancement where appropriate

Optional Svelte islands
├─ genuinely complex interactive components only
└─ hydrated only on pages that use them

Pagefind
└─ loaded only when blog search is actually needed

Cloudflare Workers Static Assets
└─ serves ./dist directly
```

There should be **no server-side Astro runtime in production**.

---

## 5. Astro foundation

Use the current stable Astro 6 release and current supported APIs.

Prefer explicit manual configuration over running generators that rewrite the repository broadly.

Create an Astro configuration appropriate for a static site.

Requirements:

```text
output: static
site: production site URL
trailingSlash: never
```

Evaluate `build.format: 'file'` because it aligns naturally with slashless generated routes. Verify the generated output rather than assuming it behaves as intended.

The final behaviour must be:

```text
/foo      -> canonical
/foo/     -> redirect to /foo
/foo.html -> redirect to /foo where Cloudflare HTML handling applies
```

Development and production routing should agree as closely as possible.

Do not install an Astro Cloudflare SSR adapter for a static site.

---

## 6. Cloudflare Workers Static Assets

Keep the existing deployment model: static assets served by Workers Static Assets.

Final Wrangler configuration should be explicit and minimal, approximately:

```jsonc
{
	"$schema": "./node_modules/wrangler/config-schema.json",
	"name": "zixianchen",
	"compatibility_date": "<current tested date>",
	"assets": {
		"directory": "./dist/",
		"not_found_handling": "404-page",
		"html_handling": "drop-trailing-slash",
	},
}
```

Use the current tested compatibility date when implementing, not a stale copied value.

Do not add:

```text
main
assets.binding
run_worker_first
nodejs_compat
Astro Cloudflare adapter
server output
```

unless there is a demonstrated technical requirement. If one appears, stop and explain it before changing the architecture.

The site should remain deployable as static files only.

---

## 7. Migrate the global shell

Replace the SvelteKit root layout with Astro layouts/components.

Preserve:

- global CSS;
- fonts;
- theme tokens;
- Tailwind;
- DaisyUI;
- RSS `<link>`;
- metadata;
- accessibility behaviour;
- current page structure.

### View transitions

The current root layout contains SvelteKit navigation code for View Transitions.

Do not recreate that using Astro's client-side router by default.

Prefer browser-native cross-document View Transitions and existing `view-transition-name` semantics so navigation remains normal multi-page navigation.

Preserve reduced-motion behaviour.

Only use `<ClientRouter />` if native transitions are proven unable to preserve an important existing interaction. If so, document the concrete reason and measure its client-side cost.

---

## 8. Navigation

The current navigation should not become a globally hydrated Svelte application.

Migrate the mostly-static parts of navigation to Astro.

Derive route-active state from the current URL during rendering where possible.

For homepage section highlighting, use the smallest sensible browser script, e.g. scroll/IntersectionObserver logic, rather than hydrating the whole navigation tree.

Preserve:

- desktop navigation;
- mobile navigation;
- active-page state;
- active homepage-section state;
- ARIA semantics;
- anchor behaviour;
- keyboard interaction;
- current visuals.

---

## 9. Homepage

Port the homepage markup to Astro without redesigning it.

Preserve:

- all sections;
- current project rendering;
- job history;
- recent blog posts;
- responsive layout;
- images;
- icons;
- animation behaviour.

Do not hydrate the entire homepage.

Identify interactive leaf components.

The animated code canvas is a legitimate interactive candidate. It may either:

- remain a small Svelte island initially; or
- be converted to a focused vanilla TypeScript/Astro component if the rewrite is straightforward and clearly reduces shipped code.

Choose based on measured complexity and output size, not ideological purity.

Homepage section tracking should not require a Svelte page wrapper.

---

## 10. Blog content migration

Use Astro 6's current Content Layer APIs.

Define the collection in:

```text
src/content.config.ts
```

Use a build-time `glob()` loader and a schema that matches the existing frontmatter.

Do not use removed/legacy content-collection APIs.

### Preserve blog content exactly

Do not rewrite Markdown bodies.

Do not normalize formatting across every article.

Do not mass-edit frontmatter merely to make it prettier.

Audit existing posts for Mdsvex/Svelte-specific constructs before choosing the migration method.

If the current Markdown files can be consumed from their existing directory using the Content Layer loader, prefer that initially to avoid a giant move-only diff.

If moving them to a conventional Astro content directory materially improves the design, a purely mechanical move is acceptable, but:

- preserve filenames;
- preserve slugs;
- preserve Git history as far as practical;
- do not mix moves with content edits.

### Preserve Markdown rendering behaviour

The current site has deliberate Markdown processing.

Preserve or consciously reproduce:

- syntax highlighting;
- current code theme;
- notation highlighting;
- notation diff rendering;
- compact code-line behaviour;
- heading IDs;
- anchor targets;
- typographic/smart punctuation behaviour;
- fenced `text` blocks;
- existing prose CSS;
- tables;
- blockquotes;
- images;
- raw HTML behaviour where currently supported.

Compare representative generated article HTML before and after migration.

Choose representative articles that exercise:

- code fences;
- headings;
- images;
- lists;
- tables if present;
- blockquotes;
- inline code;
- special syntax-highlighting annotations.

---

## 11. Blog article routes

Implement static blog routes with Astro `getStaticPaths()` / Content Layer APIs.

Every existing slug must generate the same public URL:

```text
/blog/<slug>
```

No trailing slash.

Article pages should be one of the strongest JS-reduction wins.

Target:

**ordinary blog article pages should ship zero framework hydration JavaScript unless that individual article genuinely contains an interactive island.**

Analytics or other existing deliberately included scripts should be accounted for separately rather than confused with framework hydration.

Preserve:

- title;
- description;
- canonical URL;
- OG metadata;
- dates;
- categories;
- tags;
- series navigation;
- related posts;
- structured metadata;
- heading anchors;
- Pagefind indexing metadata.

---

## 12. Blog layout and theme toggle

The current blog shell uses Svelte state mainly for theme persistence and toggling.

Do not keep a hydrated Svelte layout just for this.

Implement the theme with a minimal script.

Requirements:

- preserve the saved `blog-theme` value;
- avoid a light/dark flash where reasonably possible;
- preserve existing default behaviour;
- preserve the toggle;
- preserve accessibility labels;
- preserve current visual styling.

This script should not require the Svelte runtime.

---

## 13. Blog index and Pagefind

Preserve the current blog index behaviour:

- full list;
- category filters;
- URL query state;
- search query;
- Pagefind search;
- loading state;
- empty state;
- errors;
- result metadata;
- category filtering;
- clear-search behaviour;
- browser navigation semantics.

Pagefind should continue indexing the final static site.

Change the build target from:

```text
build
```

to:

```text
dist
```

as appropriate.

Do not replace Pagefind with a server search API.

### JavaScript strategy

The blog search is a reasonable candidate for an interactive island.

Either:

1. retain it as a focused Svelte island; or
2. convert it to a focused browser script if that is simpler after the Astro migration.

Do not hydrate the entire blog page merely to support search.

Continue lazily loading Pagefind rather than forcing the whole search index onto initial page load.

---

## 14. Contact page

Preserve the existing Web3Forms behaviour and user feedback.

Do not add a Worker/API route.

This can likely be implemented as Astro markup plus a small browser script.

Preserve:

- native HTML validation;
- submitting state;
- success state;
- error state;
- button disabling;
- accessible live-region messaging;
- existing endpoint behaviour;
- current disclosure text.

Do not expose any new secrets.

Do not change the existing data-handling model as part of this migration.

---

## 15. Project pages and galleries

Port project pages mechanically.

Preserve:

- current URLs;
- screenshots;
- enhanced/optimized images;
- galleries;
- project metadata;
- tech-stack displays;
- responsive layouts;
- animations/interactions.

Use Astro's asset/image pipeline for non-interactive image rendering where appropriate.

Keep a Svelte island only when a gallery or interaction actually requires client state.

Avoid hydrating an entire project page.

---

## 16. Icons

Preserve the current visual icon set.

Choose an Astro-compatible build-time icon approach that does not unnecessarily ship an icon runtime.

Do not change icons as part of the migration unless the current package cannot reasonably be used.

Avoid introducing a large runtime icon library.

---

## 17. SEO, RSS, sitemap and 404

Preserve all externally observable SEO behaviour.

Validate:

- `<title>`;
- descriptions;
- canonical URLs;
- Open Graph metadata;
- social images;
- RSS feed;
- sitemap;
- robots.txt;
- 404 page;
- favicon and manifest resources;
- slashless URLs.

Use Astro's official RSS/sitemap tooling where it simplifies the implementation without changing output semantics.

Do not accidentally index duplicate trailing-slash URLs.

Ensure sitemap and RSS URLs are slashless.

Search the repository for existing SEO helpers and ensure every capability has an Astro equivalent before deleting them.

---

## 18. Generated OG images and build-time assets

Audit all current generated assets, including anything under paths such as:

```text
static/blog/og/
```

Determine:

- what creates them;
- when they are generated;
- what pages reference them;
- whether they are committed or generated;
- whether the Astro build changes those paths.

Preserve URLs exactly.

Do not silently remove OG-image generation.

---

## 19. Static assets

Astro conventionally uses `public/`, while the existing repository uses SvelteKit's `static/`.

Migrate static assets carefully.

Preserve every public URL.

A file currently served as:

```text
/favicon.ico
/robots.txt
/whatever.svg
```

must still be served from exactly the same public URL after the migration.

Do not reorganize public URLs merely to match Astro directory conventions.

---

## 20. Tailwind and DaisyUI

Preserve the current design system.

Use the current supported Astro/Vite integration for the existing Tailwind version.

Do not:

- reset or replace DaisyUI themes;
- translate utility classes unnecessarily;
- change breakpoints;
- rename CSS variables;
- alter primary/accent colours;
- change typography;
- "clean up" intentional unusual CSS during the framework migration.

Any visual differences should be treated as regressions unless unavoidable.

---

## 21. Dependency cleanup

Once the Astro implementation works, remove dependencies that are no longer required.

Audit before deleting.

Likely migration candidates include SvelteKit-specific packages, Mdsvex-specific packages, SvelteKit image tooling and obsolete Vite integrations.

Retain `svelte` and `@astrojs/svelte` only if genuine Svelte islands remain.

Do not retain Svelte merely because deleting it would require converting one trivial toggle.

Conversely, do not rewrite a complex working component solely to achieve a "zero Svelte dependencies" badge.

After cleanup:

```bash
pnpm install --frozen-lockfile
```

must succeed from a clean checkout.

---

## 22. Package scripts

Provide clear equivalents for the existing workflow.

At minimum:

```text
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm lint
pnpm format
```

`pnpm build` must produce the complete deployable site **including Pagefind**, unless there is a strong repository-specific reason to keep indexing as an explicit separate CI step.

Prefer one authoritative production-build command over slightly different local and CI build paths.

---

## 23. CI

Update GitHub Actions to validate Astro rather than SvelteKit.

The resulting CI should cover at least:

```text
pnpm install --frozen-lockfile
Astro/TypeScript checks
formatting
linting
production Astro build
Pagefind indexing
route/output validation
```

Do not weaken CI merely to make the migration pass.

If Astro-specific linting or formatting support is required, add only the appropriate focused tooling.

---

## 24. Add migration-specific regression validation

The migration is large enough that "build succeeds" is insufficient.

Add a lightweight automated validation for important generated output.

At minimum verify that the production build contains working equivalents for:

```text
/
/blog
/contact
/rss.xml
/sitemap.xml
/404.html
all expected blog slugs
all expected project routes
```

Also validate that:

- no expected page disappeared;
- sitemap URLs are valid;
- blog-post count matches the pre-migration baseline;
- Pagefind indexes the expected content;
- canonical routes do not end in `/`.

Prefer a small maintainable script/test over a giant snapshot of generated HTML.

---

## 25. JavaScript budget

This migration is partly justified by reducing browser-side JavaScript, so measure it.

Compare the original SvelteKit baseline against the final Astro build.

Report, for representative routes:

```text
route
before JS
after JS
delta
reason for remaining JS
```

At minimum:

```text
/
/blog
/blog/<representative-post>
/contact
/projects/<representative-project>
```

Acceptance expectations:

### Blog article

There should be no Svelte/Astro hydration runtime on an ordinary article with no interactive content.

### Static project page

There should be no framework hydration unless that page contains an intentional interactive island.

### Homepage

Only scripts needed for actual homepage interaction/animation should ship.

### Blog index

Search/filter/theme-related JavaScript is acceptable, but it should be scoped to the feature rather than hydrating the entire application.

### Contact

Only the form enhancement and genuinely global scripts should be required.

If the migration unexpectedly ships equal or more JavaScript on most static routes, investigate before considering the work complete.

---

## 26. Visual and behavioural comparison

After implementation, rerun the same screenshot set captured from the SvelteKit baseline.

Compare:

- layout;
- spacing;
- typography;
- colours;
- image dimensions;
- navigation;
- responsive behaviour;
- blog prose;
- code blocks;
- project galleries;
- footer;
- 404.

Also manually test:

```text
homepage anchor navigation
desktop navigation
mobile navigation
blog theme persistence
blog category filters
Pagefind search
query-string restoration
back/forward navigation
contact form states
CodeCanvas
image galleries
RSS
sitemap
404
reduced-motion behaviour
```

Fix migration regressions rather than documenting them as acceptable differences.

---

## 27. Browser/network validation

Use browser devtools or equivalent to inspect representative production-preview pages.

Check:

- console errors;
- failed requests;
- hydration warnings;
- duplicate scripts;
- unexpected Svelte runtime;
- initial JavaScript requests;
- image failures;
- layout shifts introduced by the migration;
- broken Pagefind imports;
- incorrect MIME types;
- trailing-slash redirects.

Verify `/foo/` resolves to `/foo`.

Verify internal links themselves use the canonical slashless form instead of relying on redirects.

---

## 28. Search for stale SvelteKit references

Before completion, search the entire repository for:

```text
SvelteKit
@sveltejs
$app/
mdsvex
adapter-static
.svelte-kit
build/
vite-plugin-svelte
enhanced:img
```

Classify every remaining occurrence.

Delete or update implementation/config references that are now obsolete.

Do **not** rewrite historical blog posts whose subject is SvelteKit or which accurately describe what the project used at that time.

Update current repository documentation and current-stack descriptions where they have become factually stale.

---

## 29. Full validation

From the migration worktree, run the complete final suite.

At minimum:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm build
```

Then perform the route, Pagefind, browser, JS-budget and visual checks described above.

Also validate the static Cloudflare configuration using the installed Wrangler tooling where possible.

Do not deploy production merely to test the migration.

Do not claim completion if required validation cannot run.

---

## 30. Tech-lead review before publishing

Before opening the PR, review the entire diff as if reviewing someone else's migration.

Specifically look for:

- unnecessary rewrites;
- Svelte components hydrated too high in the tree;
- global JS that could be local;
- accidental SPA behaviour;
- Cloudflare adapter/Worker code that should not exist;
- stale SvelteKit dependencies;
- duplicated SEO logic;
- broken route generation;
- changed blog slugs;
- Markdown rendering differences;
- Pagefind regressions;
- static asset path changes;
- missing OG images;
- trailing-slash inconsistencies;
- visual regressions;
- accessibility regressions;
- unrelated formatting churn.

Simplify anything that looks like framework migration ceremony without user value.

---

## 31. Git and PR workflow

Only after the complete local validation passes:

1. Review `git status`.
2. Review the complete diff.
3. Ensure only migration-related files are included.
4. Commit using repository conventions.
5. Push `feat/astro-migration`.
6. Open a **draft PR** against latest `main`.

Suggested PR title:

```text
feat: migrate portfolio to Astro
```

The PR body must include:

### Summary

What changed architecturally.

### What did not change

Explicitly call out preserved:

```text
routes
content
design
Pagefind
static deployment
Cloudflare Workers Static Assets
```

### JavaScript impact

Before/after measurements for representative routes.

### Migration details

Which components remain Svelte islands and why.

### Cloudflare

Confirm:

```text
static Astro output
dist/
no Worker main
no SSR adapter
drop-trailing-slash
404-page
```

### Validation

List every command and browser/regression check actually run.

### Known limitations

Only real unresolved issues, if any.

Do not mark the PR ready for review automatically.

---

## Definition of done

The migration is complete only when all of the following are true:

- Astro 6 is the site framework.
- Production output is fully static.
- Workers Static Assets serves `dist/`.
- No Cloudflare SSR adapter is present.
- No Worker runtime is present.
- All existing public routes still work.
- Blog slugs are unchanged.
- URLs remain slashless.
- `/foo/` redirects to `/foo`.
- Sitemap and RSS remain correct.
- Pagefind works.
- Blog metadata and SEO remain correct.
- Markdown/code rendering is equivalent.
- Existing visual design is preserved.
- Interactive behaviour is preserved.
- Ordinary blog articles do not ship framework hydration JS.
- Svelte is limited to justified islands, if it remains at all.
- Initial JS is measurably reduced on the content-heavy routes.
- CI passes.
- Production build succeeds from a clean dependency install.
- Browser regression checks pass.
- The complete diff contains no unrelated redesign/refactor work.
- A draft PR is opened with before/after measurements and validation evidence.

If any acceptance criterion cannot be achieved, do not silently weaken it. Explain the blocker and the best available alternative in the PR.
