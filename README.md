# zixianchen.com

Monorepo for the personal website and its Telegram blog notifier.

## Apps

- `web/` — static SvelteKit site for `zixianchen.com`, including the blog and `/rss.xml`.
- `notifier/` — Cloudflare Worker that receives Telegram updates, polls the RSS feed, stores state in D1, and fans notifications out through Cloudflare Queues.

Both apps are pnpm workspace packages and can be developed or deployed independently.

## Common commands

Run these from the repository root:

```bash
pnpm install
pnpm dev                 # web dev server
pnpm dev:notifier        # Wrangler dev server
pnpm check               # web + notifier checks
pnpm test:notifier
pnpm lint
pnpm build               # production web build + Pagefind
pnpm deploy:web
pnpm deploy:notifier
```

Direct package commands also work:

```bash
pnpm --filter @zixianchen/web <script>
pnpm --filter @zixianchen/notifier <script>
```

The two applications share Git history and CI, but each owns its own runtime configuration and dependencies.
