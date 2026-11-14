---
title: "Bots Scraped Lingo, and Now I Can't Tell Who's Human"
description: "Scrapers keep hitting Lingo, my list of Singapore public service acronyms. Cloudflare challenges helped a bit, but now I don't know if any humans are left in my stats."
date: '2026-11-14'
category: 'Systems'
tags:
  - Cloudflare
  - WAF
  - Bots
  - Analytics
  - Lingo
published: false
listed: false
slug: 'cloudflare-managed-challenge-scrapers-lingo'
---

Lingo is my curated list of acronyms and jargon used in the Singapore Public Service, with plain-English explanations. It normally gets about 10–20 hits a day, which is fine for a niche site.

Then one day it was 300–500 hits a day from outside Singapore, with the US as the top country.

## The first wave

I'm pretty sure they were bots. They went to all kinds of routes, including the report term page for term after term. Nobody does that. It felt like simplistic stuff to me.

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

The US was the biggest country, but only 57 of the 326. The rest came from all over. Everyone looked at one page for about a second, and no page got more than 14 visitors.

## What I tried first

I put an interactive challenge on everything outside Singapore. I excluded known bots so Googlebot still gets in.

```text
Hostname = lingo.zixian.dev AND Country ≠ SG AND Known Bots ≠ true → Interactive Challenge
```

It worked on every country except the US. The bots from everywhere else stopped. By 19 Aug it was down to 60 visitors, but 56 of them were from the US, all on Chrome, and 40 just loaded the home page. They were getting through the challenge.

I don't know why. Maybe US traffic gets an easier challenge, or maybe those were just better bots. I couldn't tell.

So I blocked the US instead.

```text
Hostname = lingo.zixian.dev AND Country = US AND Known Bots ≠ true → Block
```

That more or less stopped it after a while. Blocking a whole country feels crude though. That rule is disabled now.

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

One person, three views, 41 minutes. Probably a human, or someone who left a tab open. Keep this in mind for the next section.

## Then they came from Singapore

Recently it got worse. 700+ hits a day, and this time from Singapore, so my country rules did nothing.

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

637 visitors for 658 views is basically one view each. Every one is on Chrome, and the top paths each had exactly one visitor. Looks like bots to me. It's a different crowd from August, which was Chrome, Firefox and Edge from lots of countries. Now it's Chrome from Singapore only. I'm guessing each request comes from a different IP, but I haven't checked.

So I added another challenge, this time for everyone who isn't a known bot, Singapore included.

```text
Hostname = lingo.zixian.dev AND Known Bots ≠ true → Interactive Challenge
```

Cloudflare's rule list shows these solve rates:

```text
Lingo challenge (outside SG):   228 events, 21.05% solved
Lingo challenge (SG):           254 events,  1.57% solved
```

Only 1.57% solved on the SG rule, so most of what hits it probably isn't human. That rule is only a few hours old though. I added it at about 10:48am on 14 Nov, so most of the 637 in that Umami screenshot got in before it existed.

I'm now making Singaporeans prove they're human just to look up an acronym. Not great.

## What happened after I added it

Cloudflare counts requests, not visits, so these numbers are bigger than Umami's. Lingo loads a lot of JavaScript, so one page view is several requests. The shape is still clear.

Before the rule, Singapore was sending 900 to 1,000 requests an hour and none of them were challenged. In the hour after, that dropped to around 150 an hour, and almost nothing got through unchallenged.

But traffic from outside Singapore went from about 15 requests an hour to about 800. Most of it already had a valid clearance, which means it had passed a challenge. It has been tailing off since.

I think the bots changed country as soon as Singapore started challenging them. I'd only just turned off the US block, so I don't think that explains it. Some of them are solving the interactive challenge too.

## Umami vs PostHog

I also run PostHog on Lingo. It says 13 pageviews from 10 visitors yesterday. Umami says 637 visitors in 24 hours.

I haven't confirmed why. My guess is that PostHog drops traffic from bot user agents, and Umami counts anything that loads its script. If so, PostHog is accidentally a decent human filter. But I can't be sure, since real visitors with ad blockers could be missing from both.

## Things I haven't tried

- **Rate limiting per IP.** Probably won't catch much if every request comes from a different IP.
- **A rule on the report term route.** Humans barely use it and the bots hit it constantly.
- **Something other than country.** ASN, user agent, that sort of thing.
- **Cloudflare's own bot detection.** The dashboard shows it as not running (0/1), and I haven't looked at what the free plan gives me.
- **Doing nothing.** About 37% of the 498k monthly requests across zixian.dev reach my origin. Annoying, but nothing's breaking.

## Where that leaves me

I care about humans, not bots. But after all this I've no idea if there are even any human visitors. PostHog says yes, about the same as before. I'll go with that for now.
