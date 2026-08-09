# Blog Telegram notifier

This Worker sends a private Telegram message when a new public blog post appears in `https://zixianchen.com/rss.xml`.

The first RSS check records the posts that already exist and sends nothing. Later checks compare all feed GUIDs against D1, so a newly published post is detected even if its publication date puts it below the first RSS item.

Subscribers start on `All posts`. They can use `/settings` to select any combination of the blog's `Work`, `Systems`, `Dev`, and `Life` categories. Category preferences are checked both when a notification is queued and again before it is delivered.

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

## Provision Cloudflare resources

The Worker is configured to use an explicitly provisioned D1 database:

```text
zixianchen-blog-notifier
25196238-e145-40bf-bde5-f70224d0e771
```

Create the notification Queue before deploying the Worker:

```bash
pnpm exec wrangler queues create zixianchen-blog-notifier-notifications
```

The Worker configuration references these resources directly. Deployment should not be relied on to create persistence or Queue infrastructure implicitly.

The Worker creates its small D1 SQL schema on first use.

## Deploy the Worker

From the repository root:

```bash
pnpm exec wrangler deploy --config workers/blog-notifier/wrangler.jsonc
```

The deployment prints the `workers.dev` URL. Keep that URL for the webhook setup below.

## Add secrets

Add the BotFather token:

```bash
pnpm exec wrangler secret put TELEGRAM_BOT_TOKEN --config workers/blog-notifier/wrangler.jsonc
```

Create a webhook secret containing only letters, numbers, `_`, or `-`, then store it:

```bash
pnpm exec wrangler secret put TELEGRAM_WEBHOOK_SECRET --config workers/blog-notifier/wrangler.jsonc
```

On PowerShell, a simple suitable value can be generated with:

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

Telegram will send the webhook secret in `X-Telegram-Bot-Api-Secret-Token`; the Worker rejects webhook requests that do not match it.

## Smoke checks

Check the Worker itself:

```powershell
Invoke-RestMethod "$workerUrl/health"
```

Then open the bot in Telegram and send `/start`. It should subscribe you to all posts and show category buttons. Select a couple of categories, run `/settings` again to confirm the choices, then use `/stop` to unsubscribe.

The RSS check runs every 15 minutes. Existing posts are seeded on the first run and are never broadcast as new posts.

## Inspect subscribers

Count active subscribers:

```powershell
pnpm exec wrangler d1 execute zixianchen-blog-notifier --remote --command="SELECT COUNT(*) AS subscribers FROM subscribers" --config workers/blog-notifier/wrangler.jsonc
```

Inspect category preferences:

```powershell
pnpm exec wrangler d1 execute zixianchen-blog-notifier --remote --command="SELECT categories, COUNT(*) AS subscribers FROM subscribers GROUP BY categories ORDER BY subscribers DESC" --config workers/blog-notifier/wrangler.jsonc
```

## Local validation

```bash
pnpm check:notifier
pnpm test:notifier
```
