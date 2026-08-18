# Repository Guidelines

## Project Structure & Module Organization

This is a fully static Astro personal website. Public routes live in `src/pages`; shared layouts and components live in `src/layouts` and `src/components`. Blog Markdown posts remain in `src/routes/blog/posts` and are loaded through Astro Content Collections from `src/content.config.ts`. Shared project metadata, screenshots, imported assets, and build-time utilities live under `src/lib`. Public static files, favicons, robots.txt, redirects, and directly served SVGs live in `static`. Generated output (`dist`, `.astro`) is disposable.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: run the Astro development server on port `6173`.
- `pnpm build`: build the static Astro site to `dist`, generate the Pagefind index, and validate routes, canonical URLs, and client boundaries.
- `pnpm preview`: preview the built Astro site locally on port `6173`.
- `pnpm check`: run Astro and TypeScript diagnostics.
- `pnpm lint`: run Prettier in check mode and ESLint.
- `pnpm format`: format the repository with Prettier.

Before submitting JavaScript, TypeScript, or Astro changes, run `pnpm check` and `pnpm lint`. Also run `pnpm build` for route, content, asset, integration, or deployment changes. Deployment changes should additionally pass `pnpm exec wrangler deploy --dry-run`.

## Architecture & Client JavaScript

The production site is fully static and served from `dist` by Cloudflare Workers Static Assets. Do not add an Astro SSR adapter, Worker `main` entry point, server runtime, or client framework without a concrete product requirement.

Astro owns routing, layouts, SEO, content rendering, and static markup. Browser JavaScript should stay scoped to the smallest useful feature. Prefer native HTML/CSS and focused DOM scripts. The current interactive features are navigation section tracking, blog theme persistence and Pagefind search/filtering, contact-form enhancement, screenshot galleries, and the animated code canvas.

The build validators intentionally enforce this boundary: key routes and ordinary blog articles must not gain framework islands, and `.svelte` source files or Svelte dependencies are not allowed.

## Coding Style & Naming Conventions

Use TypeScript and established Astro conventions. Prettier is configured for tabs, single quotes, trailing commas, `bracketSameLine`, and a `120` character print width, with Astro and Tailwind plugins enabled. ESLint covers JavaScript, TypeScript, and Astro files.

Name Astro components in PascalCase. Keep route and blog slugs kebab-case. Prefer shared UI and data in `src/components` or `src/lib` over duplicating logic inside pages. Preserve existing markup and classes when doing framework or infrastructure work; design changes should be deliberate and separate.

## Testing Guidelines

There is no general-purpose unit-test framework configured. Treat `pnpm check`, `pnpm lint`, and `pnpm build` as the required validation suite. `pnpm build` includes static-output and zero-framework client-boundary assertions. Keep those assertions focused on externally observable guarantees rather than large generated-HTML snapshots.

For rendering or CSS changes, verify the affected routes at representative mobile, tablet, and desktop sizes and treat meaningful geometry, typography, spacing, image, or responsive differences as regressions unless the task explicitly calls for a redesign.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commit-style prefixes such as `feat:`, `fix:`, `refactor:`, and `style:`. Keep commit subjects imperative and scoped to one change. Do not include a parenthesized scope in commit subjects; use `feat: ...`, not `feat(sitemap): ...`.

Do not push commits or branches unless the user explicitly asks for a push. A request to commit does not imply permission to push.

Pull requests should include a short summary, linked issue when applicable, commands run, and screenshots or screen recordings for visual changes. Call out client-JavaScript changes, asset additions, and any deployment implications for Cloudflare or static output.

## Security & Configuration Tips

Do not commit secrets, API keys, or local environment files. Review `astro.config.mjs`, `wrangler.jsonc`, Content Collection configuration, and deployment-related changes carefully because production is a static Astro build. Preserve the slashless URL contract and explicit redirects in `static/_redirects`.

Historical blog posts may accurately mention Svelte or SvelteKit. Do not rewrite historical content merely to make repository-wide searches for old framework names empty.
