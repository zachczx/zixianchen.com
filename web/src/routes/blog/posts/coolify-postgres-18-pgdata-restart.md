---
title: 'Coolify Postgres 18 Data Disappearing on Restart? Check PGDATA'
description: 'Postgres 18 Alpine changed the default PGDATA path, silently breaking Coolify storage mounts that worked fine on Postgres 16.'
date: '2026-03-11'
date_updated: ''
category: 'Systems'
tags:
  - Coolify
  - Postgres
published: true
slug: coolify-postgres-18-pgdata-restart
---

## My Coolify Postgres Data Kept Getting Wiped

I recently started a new project using Postgres 18 Alpine on Coolify. Was setting things up, toggling options, trying SSL, making the service publicly available. So I kept restarting the service whenever I changed the options.

Strangely, I noticed my data kept disappearing, and eventually I realized it disappeared whenever I restarted the Coolify database. Then again after another restart.

Running `docker volume ls -f dangling=true` confirmed it. I had a count and it turns out a new dangling volume was being created each time I restarted the database service.

## Try 1: Maybe Coolify Was Cleaning Up?

I read the Discord and first thing I did was check whether Coolify was pruning or cleaning stuff. But it didn't, the option was unchecked. So the data wasn't being actively deleted, it was just never being persisted properly.

## Try 2: Fix the Storage Tab

Coolify has a Storages tab on each service for binding a fixed host path to the container. I checked mine and the Source Path was blank, not sure if it was just my config problem. Only the destination `/var/lib/postgresql/data` was set, so this kinda explained the anonymous volumes, because maybe without a source path Coolify just spun up a new unnamed volume on every restart.

I added the source path:

```
Source:      /data/coolify/volumes/cubby-postgres
Destination: /var/lib/postgresql/data
```

and after I restarted the data was still wiped, even though postgres was still running. So it seemed the container was healthy, Postgres was accepting connections, but nothing was being written there.

If the mount itself were broken, Postgres wouldn't even start. A healthy Postgres writing nothing to the mounted path likely indicated it was writing somewhere else.

## Finding the Culprit

I ran a full mount inspection on the container:

```bash
docker inspect u8cgscwss4488k0sk4gg8kc8 | grep -A 30 Mounts
```

The bind mount was correctly set up. But buried in the environment variables was this,

```
PGDATA=/var/lib/postgresql/18/docker
```

not `/var/lib/postgresql/data`. The [official Postgres Docker image documentation](https://hub.docker.com/_/postgres#pgdata) explains that Postgres 18 changed `PGDATA` to a version-specific path and moved the volume target to `/var/lib/postgresql`. The bind mount was working fine, but it was just pointing at the wrong place. Postgres was happily writing to `/var/lib/postgresql/18/docker` the whole time while my mounted directory was empty and got wiped on every restart.

## The Fix

I updated the destination path in Coolify's Storages tab to match the actual `PGDATA`:

```
Source:      /data/coolify/volumes/cubby-postgres
Destination: /var/lib/postgresql/18/docker
```

That fixed it!

## Backups Saved Me

I had continuous backups via Coolify's S3 storages so I didn't lose data. Without it I'd probably have had to dig through all dangling volumes with `docker volume ls -f dangling=true`, inspect each one to find which has the right data, and restore from there.

## Takeaway

The `PGDATA` path varies by Postgres version. I was always using Postgres 16 Alpine because it came with Coolify in the past and I was lazy to try to upgrade it. Also, `/var/lib/postgresql/data` was always correct so I never had to think about it. Using Postgres 18 for recent projects meant I got the new default and I had no idea, my bad!

A quick `docker inspect <container> | grep PGDATA` before setting up the storage mount would've caught this immediately. Two minutes of checking, a lot of head-scratching saved.
