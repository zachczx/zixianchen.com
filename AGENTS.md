# Repository Guidelines

## Project Structure & Module Organization

This repository contains two independently deployable pnpm workspace packages:

- `web/` is the static SvelteKit personal website. Route files live in `web/src/routes`, blog Markdown posts live in `web/src/routes/blog/posts`, shared components and imported assets live under `web/src/lib`, and public static files live in `web/static`.
- `notifier/` is the Cloudflare Worker for Telegram blog notifications. Entrypoints live in `notifier/src/index.ts`, handlers in `notifier/src/handlers`, D1 persistence in `notifier/src/repositories`, and focused tests in `notifier/src/notifier.test.ts`.

Repository-level CI, workspace configuration, product notes, and shared documentation stay at the root. Generated output such as `web/build`, `web/.svelte-kit`, `web/static/pagefind`, and Wrangler state must not be committed.

## Build, Test, and Development Commands

Run normal commands from the repository root:

- `pnpm install`: install all workspace dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: run the web Vite dev server.
- `pnpm dev:notifier`: run the notifier with Wrangler locally.
- `pnpm build`: build the web app and Pagefind index.
- `pnpm preview`: preview the built website.
- `pnpm check`: run both web and notifier checks.
- `pnpm check:web`: run SvelteKit sync and `svelte-check` for `web/`.
- `pnpm check:notifier`: run notifier TypeScript and a Wrangler dry-run deploy.
- `pnpm test:notifier`: run the notifier Node test suite.
- `pnpm lint`: run repository formatting checks plus package-specific ESLint checks.
- `pnpm format`: format root files and both packages.
- `pnpm deploy:web`: build and deploy the static site through the web package's Wrangler config.
- `pnpm deploy:notifier`: deploy the notifier Worker through its own Wrangler config.

Before submitting changes, run the checks relevant to the changed package. For structural or shared changes, run `pnpm check`, `pnpm test:notifier`, `pnpm lint`, and `pnpm build`.

## Coding Style & Naming Conventions

Use TypeScript and Svelte conventions already present in the repository. Prettier uses tabs, single quotes, trailing commas, `bracketSameLine`, and a 120-character print width. The web package additionally loads the Svelte and Tailwind Prettier plugins.

Name Svelte components in PascalCase, for example `ProjectShell.svelte`. Keep route and blog slugs kebab-case. Prefer shared web UI and data in `web/src/lib` over duplicating logic inside route files. Keep notifier request/cron/queue entrypoints thin and put application logic in handlers, domain helpers, and repositories.

## Testing Guidelines

The web app relies on Svelte/TypeScript checks plus production builds. The notifier has focused Node tests in `notifier/src/notifier.test.ts`. Add tests when changing preference behavior, RSS parsing, Telegram serialization, or notification matching.

## Commit & Pull Request Guidelines

Recent commits use Conventional Commit-style prefixes such as `feat:`, `fix:`, `refactor:`, `chore:`, and `style:`. Keep commit subjects imperative and scoped to one change. Do not include a parenthesized scope in commit subjects; use `feat: ...`, not `feat(site): ...`.

Do not merge pull requests on the user's behalf. Pull requests should include a short summary, commands/checks run, and any deployment implications. For visual changes, include screenshots or screen recordings when useful.

## Security & Configuration Tips

Do not commit secrets, API keys, BotFather tokens, webhook secrets, or local environment files. The site and notifier have separate Wrangler configs at `web/wrangler.jsonc` and `notifier/wrangler.jsonc`; review changes to either carefully. D1 database IDs, Queue names, and Worker bindings are identifiers rather than credentials, but Cloudflare API credentials and Telegram secrets must remain outside Git.
