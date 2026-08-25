---
title: 'Blocking Scanner Noise with Cloudflare WAF'
description: "I don't run PHP or WordPress, so I used Cloudflare WAF to stop those probes from reaching my server and cluttering its logs."
date: '2026-08-01'
date_updated: '2026-08-26'
category: 'Systems'
tags:
  - Cloudflare
  - WAF
  - Security
  - Self-hosting
  - Observability
published: true
listed: true
slug: 'blocking-scanner-noise-with-cloudflare-waf'
---

I kept seeing 404 requests in my Grafana logs, and it was annoying because my 404 line charts were spiking for no reason. Stuff like `favicon.ico` (joke's on you, I use PNG), `wp-login.php`, and an endless supply of rubbish PHP filenames.

Some personal favourites:

```text
/zip-onee.php
/adminfuns.php
/classwithtostring.php
/bless.php
/file1221.php
/123456789.php
/a3ampzmbipnkpxeqhqpsanCdefault.php
```

The more conventional probes looked like this:

```text
/wp-admin/
/wp-login.php
/wordpress/wp-includes/wlwmanifest.xml
/index.php
/.git/config
/.aws/credentials
/.env
```

## Blocking them before my server

I found [Loopwerk's post about blocking PHP requests with Cloudflare WAF](https://www.loopwerk.io/articles/2025/cloudflare-waf-block-php/). I could have dealt with the requests in Caddy, but Cloudflare is already in front of these sites. Made more sense to stop them there.

For requests to a proxied hostname, the order becomes:

```text
request → Cloudflare WAF block → nothing reaches my server
```

## The rule

I expanded the original idea to cover the other useless probes I was seeing:

```text
(
  (http.request.uri.path wildcard "*/.git") or
  (http.request.uri.path wildcard "*/.git/*") or
  (http.request.uri.path wildcard "*/.aws") or
  (http.request.uri.path wildcard "*/.aws/*") or
  (http.request.uri.path wildcard "*/.env*") or
  (http.request.uri.path wildcard "*/laravel") or
  (http.request.uri.path wildcard "*/laravel/*") or
  (http.request.uri.path wildcard "*/wp-*") or
  (http.request.uri.path wildcard "*/wordpress*") or
  (http.request.uri.path wildcard "*.php") or
  (http.request.uri.path wildcard "*.php/*") or
  (http.request.uri.path wildcard "*/wlwmanifest.xml")
)
```

The action is **Block**.

I used `http.request.uri.path` instead of the full URI. The path excludes the query string, so `/index.php?anything=1` still matches `*.php`. Cloudflare's [`wildcard` operator](https://developers.cloudflare.com/ruleset-engine/rules-language/operators/) is case-insensitive and matches the whole field.

The `*/.env*` check also catches common variants such as `.env.local`, `.env.production`, and nested `.env` paths.

The extra `*.php/*` (didn't receive so dropped `*.php7/*`) checks catch path-info variations such as `/index.php/admin` too.

The hidden directories are the more worrying probes. Like `.git`, `.aws` or `.env` though realistically who even publishes such stuff?! I don't do `laravel` so I can't be sure but it cant be good. And the rest is mostly WordPress and PHP noise, sure glad I moved away from WordPress years ago.

## Things to watch

Watch out for:

- If the zone includes a PHP site, add a domain matcher (`http.host`) before the path rules.
- Routes with a segment starting `wp-`, or containing `wordpress`, will also be blocked.
- Hostnames that are not proxied through Cloudflare.
- Direct access to the origin, which bypasses the WAF.
