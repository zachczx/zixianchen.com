---
title: 'Using Coolify’s Internal Postgres Database URL'
description: 'I found Coolify’s internal Postgres URL for an app in the same project, then used the public port only when I needed remote database access.'
date: '2024-06-29'
date_updated: ''
category: 'Systems'
tags:
  - Coolify
  - Postgres
published: true
slug: using-postgres-coolify-internal-database-url
---

I like using [Coolify](https://coolify.io/) now to deploy my SvelteKit + Postgres apps on Node.js. The docs are somewhat barebones so it took some getting used to, coming from the likes of Svelte, Django, Drizzle which have comprehensive docs.

## Postgres/DB Config

A minor thing that took me some time to realize (after erroring out as a newb) was this part of the documentation:

> ## Access database during builds
>
> If you are using Nixpacks build pack, you have two ways to access your database during builds:
>
> 1. Database & your application are in the same network: You can reach it using the internal URL provided by Coolify.
> 2. Database & your application are not in the same network: You need to set enable your database to be Accessible over the internet and use the public URL provided by Coolify.

I was just trying to deploy a postgres instance in the same docker container as my app.

I struggled to figure this out immediately, since I was used to just hosting it directly via an Ubuntu box and installing the services directly via SSH.

I couldn't find this internal URL. I also couldn't understand how I could manage postgres DB without psql.

Asking on the Github discussion wasn't useful because there weren't any answers.

## Solution

1. Go to your postgres DB in the same project + environment in Coolify as your app

2. Copy the entire "Postgres URL (internal)" field that's hidden, this is all you need for Drizzle or whatever ORM as the .env key. It was what Coolify wrote down when you set up the DB the first time.

3. If you need DB access remotely,
   - _MAKE SURE YOU OPEN THE PORT IN YOUR CSP'S CONFIG_ (this tripped me up until I realized while doing other stuff with routing tables)
   - Use something like DBeaver with the query string above, the port you specify, and tick the "Make it publicly available" option

Hope this saves you 10 mins at least!
