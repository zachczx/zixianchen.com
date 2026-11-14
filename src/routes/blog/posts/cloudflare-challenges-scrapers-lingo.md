---
title: "Bots Scraped Lingo, and Now I Can't Tell Who's Human"
description: "Scrapers keep hitting Lingo, my list of Singapore public service acronyms. Cloudflare challenges stop the lazy ones, but I'm making real people prove they're human and still can't tell how many are left in my stats."
date: '2026-11-14'
category: 'Systems'
tags:
  - Cloudflare
  - WAF
  - Bots
  - Analytics
  - Lingo
published: true
listed: true
slug: 'cloudflare-challenges-scrapers-lingo'
---

Lingo is my curated list of acronyms and jargon used in the Singapore Public Service, with plain-English explanations. It normally gets about 10-20 hits a day, which is fine for a niche site, until traffic jumped to 300-500 hits a day from outside Singapore, with US as the top country.

## The first wave

I'm pretty sure they were bots, because they went to all kinds of routes, including the report term page for term after term, which felt like fairly simplistic scraping.

They were scraping the list I curated, which was also made with help from AI, so that's a bit ironic. I don't know if it's AI scrapers or something else.

This is 18 Aug in Umami:

```text
Visitors:        326
Visits:          326
Views:           342
Bounce rate:     96%
Visit duration:  1s
Countries:       US 57, Brazil 27, India 17, Singapore 13,
                 Pakistan / France / South Africa / Iraq / Argentina 12 each
Browsers:        Chrome 168, Firefox 96, Edge 62
```

US was the biggest country at 57 of the 326, with the rest coming from all over. Everyone looked at one page for about a second, and no page got more than 14 visitors.

## What I tried first

I put an interactive challenge on everything outside Singapore, excluding known bots so Googlebot still gets in.

```text
Hostname = lingo.zixian.dev AND Country ≠ SG AND Known Bots ≠ true → Interactive Challenge
```

It stopped the bots from everywhere except US. By 19 Aug traffic was down to 60 visitors, 56 of them from US on Chrome, with 40 hitting the home page, so US traffic was still getting through the challenge.

I don't know why, maybe US traffic gets an easier challenge, or maybe those were just better bots.

So I blocked US instead:

```text
Hostname = lingo.zixian.dev AND Country = US AND Known Bots ≠ true → Block
```

That more or less stopped it after a while, though blocking a whole country feels crude (that rule is disabled now).

A normal day after the block looked like this one, 28 Aug:

```text
Visitors:        1
Visits:          1
Views:           3
Bounce rate:     0%
Visit duration:  41m 42s
Pages:           /terms
Countries:       Singapore 100%
Browsers:        Chrome 100%
```

One person, three views, 41 minutes, probably a human, or someone who left a tab open.

## Then they came from Singapore

Recently it got worse, jumping to 700+ hits a day from Singapore, where my country rules did nothing.

This is what Umami showed for the last 24 hours:

```text
Visitors:        637
Visits:          652
Views:           658
Bounce rate:     99%
Visit duration:  4s
Countries:       Singapore 100%
Browsers:        Chrome 100%
```

637 visitors for 658 views is basically one view each, all on Chrome, with the top paths each getting a single visitor. It looks like a different crowd of bots from August, which had Chrome, Firefox and Edge from lots of countries rather than just Chrome from Singapore. I'm guessing each request comes from a different IP, though I haven't checked.

So I added another challenge, this time for everyone who isn't a known bot, Singapore included.

```text
Hostname = lingo.zixian.dev AND Known Bots ≠ true → Interactive Challenge
```

Cloudflare's rule list shows these solve rates:

```text
Lingo challenge (outside SG):   228 events, 21.05% solved
Lingo challenge (SG):           254 events,  1.57% solved
```

Only 1.57% solved on the SG rule, so most of what hits it probably isn't human. That rule is only a few hours old though, since I added it at about 10:48am SGT on 14 Nov, so most of the 637 in that Umami screenshot got in before it existed.

Meanwhile, over a fifth of the challenges outside Singapore are being solved, so interactive challenges aren't much of a wall anymore, and I'm making Singaporeans prove they're human just to look up an acronym.

## What happened after I added it

Cloudflare counts requests rather than visits, and Lingo loads a lot of JavaScript so one page view is several requests, making these numbers bigger than Umami's.

Before the rule, Singapore was sending 900 to 1,000 requests an hour and none of them were challenged. In the hours after, that dropped to around 150 an hour, and almost nothing got through unchallenged.

At the same time, traffic from outside Singapore jumped from about 15 requests an hour to about 800, most of it carrying a valid clearance from already passing a challenge. It has been tailing off since. Switching countries only helps if foreign IPs pass more easily, which fits the solve rates (21.05% outside Singapore vs 1.57% in Singapore, though over different time windows), even if I can't separate that from turning off US block at the same time.

## Umami vs PostHog

I also run PostHog on Lingo. It says 13 pageviews from 10 visitors yesterday, while Umami says 637 visitors in 24 hours.

I still dont know why. Maybe PostHog drops traffic from bot user agents while Umami counts anything that loads its script. If so, PostHog would be a good human filter, though real visitors with ad blockers could still be missing from both.

## Things I haven't tried

- **Rate limiting per IP.** Probably won't catch much if every request comes from a different IP.
- **A rule on the report term route.** Humans barely use it and the bots hit it constantly.
- **Something other than country.** ASN, user agent, that sort of thing.
- **Cloudflare's own bot detection.** The dashboard shows it as not running (0/1), and I haven't looked at what the free plan gives me.
- **Doing nothing.** About 37% of the 498k monthly requests across zixian.dev reach my origin, which is annoying, though nothing is breaking.

## Where that leaves me

An interactive challenge stops the lazy scrapers, while the ones that persist still find ways through, leaving me making real visitors prove they're human with muddied analytics. I just care about human visitors, so after all this I'm not sure how many are left. PostHog says about the same as before, so I'll go with that for now.
