---
title: "Cloudflare's Proxy Slowed My Sites at Night"
description: 'My sites kept getting multi-second TTFB through Cloudflare while the origins stayed fast. I eventually reproduced the problem from the origin server itself.'
date: '2026-08-24'
date_updated: ''
category: 'Systems'
tags:
  - Cloudflare
  - Networking
  - Coolify
published: true
slug: cloudflare-proxy-slow-at-night
---

## It was Cloudflare

For several nights, some of my Cloudflare-proxied sites would intermittently slow to a crawl.

The problem hasn't returned in the past week, but it had flared several times before that. During the worst episode, I eventually reproduced it from the origin VPS itself:

```text
Local request to Lingo:
~15–20ms consistently

VPS → Cloudflare → same Lingo VPS:
~300ms to 6.5s
```

Chrome had also caught requests where Cloudflare reported:

```text
cfEdge:     ~20ms
cfOrigin:   6–8s
```

So I'm fairly comfortable closing this episode with one conclusion: **Cloudflare proxying was introducing substantial intermittent latency, with the worst delays occurring in the origin-facing transaction.**

I still don't know exactly why. It could have been routing, connection handling, peering somewhere on Cloudflare's side, or something else in that path.

At this point, I don't think I need to know.

## The Symptoms

I first noticed it on my Coolify dashboard.

Pages would normally load quickly, then suddenly take several seconds. It seemed to happen more often at night.

Then I noticed the same behaviour on Lingo. Later, I'd see similar flare-ups on Umami on another VPS, and at other times on apps running on yet another provider.

The frustrating part was how intermittent it was. Everything could be normal at 100ms, then the next reload would take several seconds.

It wasn't limited to large responses either.

At one point, a tiny cached JavaScript file spent around 1.3 seconds waiting for its first byte. A fresh `curl` to the same Cloudflare-cached asset completed in about 90ms.

Dynamic requests could be much worse.

One `/terms` request showed:

```text
TTFB:      8.25s
cfOrigin:  8.22s
cfEdge:    21ms
```

Almost the entire delay was in the origin transaction as measured by Cloudflare.

## What I Ruled Out

I went through quite a few suspects.

- **Server load and my GitHub Actions runners.** Some earlier episodes coincided with CI and deployments (it did mess up my other OCI VM), and there were genuine CPU and network bursts. I added soft CPU priority and memory limits to the runners anyway. But later slowdowns happened while the server was mostly idle, with negligible I/O wait and plenty of disk headroom.

- **Coolify.** It was where I first noticed the problem, so I looked at its PHP workers, Redis, Postgres, Docker calls, background jobs and SSH activity. The same behaviour later appeared on unrelated apps and other VPSes.

- **Disk I/O.** Even during some fairly heavy deployment activity, NVMe latency and utilisation remained low. More importantly, local requests stayed fast during the actual slowdown.

- **HTTP/3 / QUIC.** Chrome was using HTTP/3 when I first investigated, and restarting Chrome sometimes appeared to help. Then I caught the same slowdown over HTTP/2.

- **Cloudflare's optional speed features.** I disabled Speed Brain, Early Hints, Rocket Loader and Cloudflare Fonts. It made no material difference.

- **HTTP/2 to Origin.** I disabled it as another experiment. Requests through Cloudflare still varied from a few hundred milliseconds to several seconds.

- **My ISP.** M1 initially looked plausible, especially because bypassing Cloudflare immediately improved things. That theory died once I reproduced the slowdown from the origin VPS itself.

- **One bad Cloudflare edge IP.** Lingo resolved to two Cloudflare IPv6 addresses. I pinned each one and ran repeated requests. Both showed the same kind of latency variance.

There were plenty of reasonable theories. None explained all the evidence.

## Cloudflare Became the Common Factor

After changing from proxied orange cloud to DNS-only gray cloud in Cloudflare, it immediately became very fast. For the same Lingo endpoint:

```text
Through Cloudflare:
TTFB ~1.93s

Direct to VPS:
TTFB ~86ms
```

I was thinking maybe my ISP, M1 had a poor route to Cloudflare, or maybe Chrome had a bad persistent connection, or it was a temporary network issue. But I had also seen similar issues across multiple applications and VPSes (including my OCI one). I figured Cloudflare was the issue.

## `cfOrigin` Narrowed It Down

Cloudflare's `Server-Timing` headers made the problem much easier to reason about. During the worst dynamic requests I saw:

```text
cfEdge:     9–21ms
cfOrigin:   6–8s
```

The Cloudflare edge itself wasn't processing the request in seconds. The delay was in the transaction between Cloudflare going upstream and receiving the origin response:

```text
PC → VPS directly:
~90ms

VPS → application locally:
~18ms
```

## The Smoking Gun

ChatGPT suggested the best test was to SSH into the Lingo VPS and request Lingo through its normal public Cloudflare hostname:

```text
VPS → Cloudflare → same VPS
```

A set of requests looked like this:

```text
3.93s
0.51s
2.18s
0.42s
1.95s
0.78s
0.40s
0.48s
1.84s
0.40s
```

Other batches produced spikes above four seconds, and one pinned Cloudflare address reached more than six seconds. Then I bypassed Cloudflare and requested the same application locally through Traefik:

```text
18ms
20ms
18ms
17ms
18ms
18ms
18ms
17ms
16ms
16ms
```

So to sum up, it wasn't the browser, my ISP, the home network, or the app. The Cloudflare proxy path was the culprit that added hundreds of milliseconds of latency and some delay that went into several seconds.

## MTR Didn't Show an Obviously Bad Route

I also ran MTR from the VPS toward Cloudflare. The path was short:

```text
VPS
→ Leaseweb Singapore
→ Equinix Singapore
→ Cloudflare AS13335
```

A TCP MTR to Cloudflare on port 443 reached the final hop at around 1–2ms.

There were some alarming-looking intermediate spikes and probe loss, but those didn't propagate to subsequent hops, so they looked more like probe deprioritisation than real forwarding loss. This didn't look like a permanently terrible route.

I also used `tcpdump` to confirm actual Cloudflare source addresses connecting to the origin:

```text
172.70.143.230
172.70.250.183
104.22.105.51
```

## It Wasn't Simply "Cloudflare Singapore Is Slow"

There was one important complication. Although the app was affected during one episode, Cubby on my Oracle VPS was completely fine:

```text
Cubby through Cloudflare:
~142ms
```

So it was probably something more intermittent in Cloudflare's origin-facing path or connection state, with different origins potentially affected differently, instead of Cloudflare for Singapore is really slow at night.

## Unfortunately, Suck Thumb

I still needed Cloudflare. Lingo had been getting hit by bots and scrapers from endpoints around the world, and I was using Cloudflare's WAF rules and challenges to deal with them.

Toggling the proxy off and back on sometimes seemed to clear the problem temporarily. In fact, after doing it at the end of this episode, everything became fast again and has stayed that way for the past week.

I don't know whether that reset some connection state, changed Cloudflare's routing, or was just coincidental. For what I'm using, nothing comes close to Cloudflare at $0.
