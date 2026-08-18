# Repository Guidelines

## Project Structure & Module Organization

This is an Astro personal website with a small number of Svelte islands. Public routes live in `src/pages`; shared Astro layouts and components live in `src/layouts` and `src/components`. Existing Svelte presentation components that are still useful during the migration live under `src/lib` and selected files under `src/routes`, but they do not define routes anymore. Blog Markdown posts remain in `src/routes/blog/posts` and are loaded through Astro Content Collections from `src/content.config.ts`. Shared project metadata, logos, screenshots, and imported assets live under `src/lib`. Public static files, favicons, robots.txt, redirects, and directly served SVGs live in `static`. Generated output (`dist`, `.astro`) should be treated as disposable build artifacts.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: run the Astro development server on port `6173`.
- `pnpm build`: build the static Astro site to `dist`, generate the Pagefind index, and validate route/canonical/client-island boundaries.
- `pnpm preview`: preview the built Astro site locally on port `6173`.
- `pnpm check`: run Astro and TypeScript diagnostics.
- `pnpm lint`: run Prettier in check mode and ESLint.
- `pnpm format`: format the repository with Prettier.

Before submitting JavaScript, TypeScript, Astro, or Svelte changes, run `pnpm check` and `pnpm lint`. Also run `pnpm build` for route, content, asset, integration, or deployment changes. Deployment changes should additionally pass `pnpm exec wrangler deploy --dry-run`.

## Architecture & Client JavaScript

The production site is fully static and is served from `dist` by Cloudflare Workers Static Assets. Do not add an Astro SSR adapter, a Worker `main` entry point, or server runtime code without a concrete product requirement.

Astro should own routing, layouts, SEO, content rendering, and other static markup. Browser JavaScript should be scoped to the smallest useful feature. Prefer native HTML/CSS and small focused scripts before hydrating a framework component. Existing Svelte components may be rendered server-side without a `client:*` directive. Add a Svelte island only when the component genuinely needs browser state or lifecycle behavior.

The build validators intentionally enforce this boundary: ordinary blog articles, the contact page, and static project pages should not gain framework islands accidentally.

## Coding Style & Naming Conventions

Use TypeScript and established Astro/Svelte conventions. Prettier is configured for tabs, single quotes, trailing commas, `bracketSameLine`, and a `120` character print width, with Astro, Svelte, and Tailwind plugins enabled. ESLint covers TypeScript, Astro, and retained Svelte files.

Name Astro and Svelte components in PascalCase. Keep route and blog slugs kebab-case. Prefer shared UI and data in `src/lib` or focused Astro components/layouts over duplicating logic inside pages.

## Testing Guidelines

There is no general-purpose unit-test framework configured. Treat `pnpm check`, `pnpm lint`, and `pnpm build` as the required validation suite. `pnpm build` includes migration-specific static-output and client-boundary assertions. Keep those assertions focused on externally observable route/output guarantees rather than large generated-HTML snapshots.

If adding tests later, keep names explicit, such as `feature-name.test.ts`, and document the new command in `package.json` and this guide.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commit-style prefixes such as `feat:`, `fix:`, `refactor:`, and `style:`. Keep commit subjects imperative and scoped to one change. Do not include a parenthesized scope in commit subjects; use `feat: ...`, not `feat(sitemap): ...`.

Do not push commits or branches unless the user explicitly asks for a push. A request to commit does not imply permission to push.

Pull requests should include a short summary, linked issue when applicable, commands run, and screenshots or screen recordings for visual changes. Call out content migrations, client-JavaScript changes, asset additions, and any deployment implications for Cloudflare or static output.

## Security & Configuration Tips

Do not commit secrets, API keys, or local environment files. Review `astro.config.mjs`, `wrangler.jsonc`, Content Collection configuration, and deployment-related changes carefully because the production site is a static Astro build. Preserve the slashless URL contract and the explicit redirects in `static/_redirects`.
