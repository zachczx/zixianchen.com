# Blog Telegram notifier

This package is the Cloudflare Worker that sends a private Telegram message when a new public blog post appears in `https://zixianchen.com/rss.xml`.

The first RSS check records the posts that already exist and sends nothing. Later checks compare all feed GUIDs against D1, so a newly published post is detected even if its publication date puts it below the first RSS item.

Subscribers start on `All posts`. They can use `/settings` to select any combination of the blog's `Work`, `Systems`, `Dev`, and `Life` categories. Category preferences are checked both when a notification is queued and again before it is delivered.

The notifier is a standalone pnpm workspace package at `notifier/`. Commands below are written to run from the repository root.

## BotFather setup

Create the bot with `@BotFather` and keep the token out of the repository.

Suggested commands:

```text
start - Notify me about new posts
settings - Choose which posts to get
stop - Stop new-post notifications
help - Show notification commands
```

Suggested description:

```text
Get a Telegram message when I publish something new on zixianchen.com.
```

## Verify the Cloudflare account

Before creating or deploying anything, confirm which authenticated Cloudflare account Wrangler will modify:

```bash
pnpm --filter @zixianchen/notifier exec wrangler whoami
```

Check the account name and account ID before continuing.

## Verify the D1 database

The Worker is pinned in `notifier/wrangler.jsonc` to the explicitly provisioned D1 database named `zixianchen-blog-notifier`.

```bash
pnpm --filter @zixianchen/notifier exec wrangler d1 info zixianchen-blog-notifier
```

Confirm the database UUID reported by Wrangler matches the `database_id` committed in `notifier/wrangler.jsonc`. The Worker creates its small SQL schema on first use.

## Provision and verify the Queue

Create the notification Queue once:

```bash
pnpm --filter @zixianchen/notifier exec wrangler queues create zixianchen-blog-notifier-notifications
```

Then verify it exists:

```bash
pnpm --filter @zixianchen/notifier exec wrangler queues list
```

The Worker configuration references the existing D1 database and Queue directly. Deployment should not be relied on to create persistence or Queue infrastructure implicitly.

## Deploy the Worker

From the repository root:

```bash
pnpm deploy:notifier
```

That delegates to the notifier package's `wrangler deploy` script, so Wrangler automatically uses `notifier/wrangler.jsonc`. The deployment prints the `workers.dev` URL.

## Add secrets

You can manage secrets in the Cloudflare dashboard or with package-local Wrangler commands.

Add the BotFather token:

```bash
pnpm --filter @zixianchen/notifier exec wrangler secret put TELEGRAM_BOT_TOKEN
```

Create a webhook secret containing only letters, numbers, `_`, or `-`, then store it:

```bash
pnpm --filter @zixianchen/notifier exec wrangler secret put TELEGRAM_WEBHOOK_SECRET
```

On PowerShell, a suitable value can be generated with:

```powershell
[guid]::NewGuid().ToString('N')
```

Keep the value: Telegram needs the same secret when the webhook is registered.

## Register the Telegram webhook

Set these local PowerShell variables without committing them:

```powershell
$token = Read-Host 'Telegram bot token'
$secret = Read-Host 'Telegram webhook secret'
$workerUrl = Read-Host 'Worker URL, without trailing slash'
```

Then register the webhook:

```powershell
$body = @{
  url = "$workerUrl/telegram/webhook"
  secret_token = $secret
  allowed_updates = '["message","callback_query"]'
  drop_pending_updates = 'true'
}

Invoke-RestMethod `
  -Method Post `
  -Uri "https://api.telegram.org/bot$token/setWebhook" `
  -Body $body
```

Telegram sends the webhook secret in `X-Telegram-Bot-Api-Secret-Token`; the Worker rejects requests that do not match it.

## Smoke checks

Check the Worker:

```powershell
Invoke-RestMethod "$workerUrl/health"
```

Then open the bot in Telegram and send `/start`. It should subscribe you to all posts and show category buttons. Select a couple of categories, tap `Done`, then use `Change preferences` to reopen the picker and change the selection again. Run `/settings` once more to confirm the saved choices, then use `/stop` to unsubscribe.

The RSS check runs every 15 minutes. Existing posts are seeded on the first run and are never broadcast as new posts.

## Inspect subscribers

Count active subscribers:

```powershell
pnpm --filter @zixianchen/notifier exec wrangler d1 execute zixianchen-blog-notifier --remote --command="SELECT COUNT(*) AS subscribers FROM subscribers"
```

Inspect category preferences:

```powershell
pnpm --filter @zixianchen/notifier exec wrangler d1 execute zixianchen-blog-notifier --remote --command="SELECT categories, COUNT(*) AS subscribers FROM subscribers GROUP BY categories ORDER BY subscribers DESC"
```

## Local validation

From the repository root:

```bash
pnpm check:notifier
pnpm test:notifier
```

Or work directly with the package:

```bash
pnpm --filter @zixianchen/notifier check
pnpm --filter @zixianchen/notifier test
pnpm --filter @zixianchen/notifier dev
```
