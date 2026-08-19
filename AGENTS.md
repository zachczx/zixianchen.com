# Repository Guidelines

## Project Structure & Module Organization

This is a statically rendered Astro personal website with a narrow Cloudflare Worker runtime for the contact form. Public routes live in `src/pages`; shared layouts and components live in `src/layouts` and `src/components`. Blog Markdown posts remain in `src/routes/blog/posts` and are loaded through Astro Content Collections from `src/content.config.ts`. Shared project metadata, screenshots, imported assets, and build-time utilities live under `src/lib`. Public static files, favicons, robots.txt, redirects, and directly served SVGs live in `static`. The contact API and Queue consumer live in `worker/index.ts`; D1 schema migrations live in `migrations`. Generated output (`dist`, `.astro`, `worker-configuration.d.ts`) is disposable.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: run the Astro development server on port `6173` for ordinary site work.
- `pnpm dev:worker`: build the static site, apply local D1 migrations, and run the Worker plus local bindings through Wrangler.
- `pnpm build`: build the static Astro site to `dist`, generate the Pagefind index, and validate routes, canonical URLs, and client boundaries.
- `pnpm preview`: preview the built Astro site locally on port `6173`.
- `pnpm cf-typegen`: regenerate Worker runtime and binding types from `wrangler.jsonc`.
- `pnpm check`: regenerate Worker types, then run Astro and TypeScript diagnostics.
- `pnpm check:watch`: regenerate Worker types, then run diagnostics in watch mode.
- `pnpm lint`: run Prettier in check mode and ESLint.
- `pnpm format`: format the repository with Prettier.
- `pnpm queue:create`: create the production `zixianchen-contact` Queue. This is a one-time bootstrap command; ordinary Queue bindings are not auto-created by Worker deployment.
- `pnpm db:migrate:local`: apply D1 migrations to the local Wrangler database.
- `pnpm db:migrate:remote`: apply D1 migrations to the deployed database.
- `pnpm deploy`: apply remote D1 migrations and deploy through Wrangler. The production Queue must already exist.

Before submitting JavaScript, TypeScript, Astro, or Worker changes, run `pnpm check` and `pnpm lint`. Also run `pnpm build` for route, content, asset, integration, or deployment changes. Deployment changes should additionally pass `pnpm exec wrangler deploy --dry-run`.

## Architecture & Client JavaScript

Production pages remain fully static and are served from `dist` by Cloudflare Workers Static Assets. A small Worker entry point exists only for `/api/contact` and its Queue consumer. Keep this as an explicit infrastructure boundary: do not add an Astro SSR adapter or turn the Worker into a general rendering/runtime layer without a concrete product requirement.

The contact request path validates and enqueues accepted submissions; the Queue consumer persists them to D1 and sends Telegram notifications. D1 is the durable submission record, while Telegram is notification only. Spam caught by the honeypot is recorded only as aggregate telemetry and must not be stored as contact content.

Astro owns routing, layouts, SEO, content rendering, and static markup. Browser JavaScript should stay scoped to the smallest useful feature. Prefer native HTML/CSS and focused DOM scripts. The current interactive features are navigation section tracking, blog theme persistence and Pagefind search/filtering, contact-form enhancement, screenshot galleries, and the animated code canvas.

The build validators intentionally enforce this boundary: key routes and ordinary blog articles must not gain framework islands, and `.svelte` source files or Svelte dependencies are not allowed.

## Coding Style & Naming Conventions

Use TypeScript and established Astro conventions. Prettier is configured for tabs, single quotes, trailing commas, `bracketSameLine`, and a `120` character print width, with Astro and Tailwind plugins enabled. ESLint covers JavaScript, TypeScript, and Astro files.

Name Astro components in PascalCase. Keep route and blog slugs kebab-case. Prefer shared UI and data in `src/components` or `src/lib` over duplicating logic inside pages. Preserve existing markup and classes when doing framework or infrastructure work; design changes should be deliberate and separate.

For Worker bindings, generate `Env` and runtime types with `wrangler types` rather than hand-writing binding interfaces. Use native Cloudflare bindings rather than REST calls for D1 or Queues. Never log contact names, email addresses, message bodies, honeypot payloads, or secrets.

## Testing Guidelines

There is no general-purpose unit-test framework configured. Treat `pnpm check`, `pnpm lint`, and `pnpm build` as the required validation suite. `pnpm build` includes static-output and zero-framework client-boundary assertions. Keep those assertions focused on externally observable guarantees rather than large generated-HTML snapshots.

For Worker changes, also validate the Wrangler bundle with `pnpm exec wrangler deploy --dry-run`. Use `pnpm dev:worker` when exercising `/api/contact`, D1, and Queue behavior locally. Telegram delivery requires local secrets and should not be coupled to the static-site build.

For rendering or CSS changes, verify the affected routes at representative mobile, tablet, and desktop sizes and treat meaningful geometry, typography, spacing, image, or responsive differences as regressions unless the task explicitly calls for a redesign.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commit-style prefixes such as `feat:`, `fix:`, `refactor:`, and `style:`. Keep commit subjects imperative and scoped to one change. Do not include a parenthesized scope in commit subjects; use `feat: ...`, not `feat(sitemap): ...`.

Do not push commits or branches unless the user explicitly asks for a push. A request to commit does not imply permission to push.

Pull requests should include a short summary, linked issue when applicable, commands run, and screenshots or screen recordings for visual changes. Call out client-JavaScript changes, asset additions, and any deployment implications for Cloudflare or static output.

## Security & Configuration Tips

Do not commit secrets, API keys, or local environment files. Keep Telegram credentials in Cloudflare Worker secrets and local values in ignored `.dev.vars` files. Review `astro.config.mjs`, `wrangler.jsonc`, Content Collection configuration, Worker code, migrations, and deployment-related changes carefully. Preserve the slashless URL contract and explicit redirects in `static/_redirects`.

Historical blog posts may accurately mention Svelte or SvelteKit. Do not rewrite historical content merely to make repository-wide searches for old framework names empty.
