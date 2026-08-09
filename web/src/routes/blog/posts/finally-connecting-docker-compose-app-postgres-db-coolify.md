---
title: 'Coolify: Connecting Docker Compose App to Postgres DB'
description: 'I connected a Docker Compose app to a separate Coolify Postgres service by enabling the predefined network and using the internal database URL.'
date: '2024-11-16'
date_updated: ''
category: 'Systems'
tags:
  - Docker
  - Postgres
  - Coolify
published: true
slug: 'finally-connecting-docker-compose-app-postgres-db-coolify'
---

For the longest time, I simply couldn't connect to my Postgres DB on Coolify if I deployed my app on Docker Compose. This was the case even when I deployed everything in the same project. An error like:

```bash
failed to connect to `user=postgres database=db`:
	hostname resolving error: lookup n4wgw0k04w0kskccwsccwo0w on 127.0.0.11:53: server misbehaving
	lookup n4wgw0k04w0kskccwsccwo0w on 127.0.0.11:53: server misbehaving
```

It was always a pain point with Coolify. But still something I could live with if I deployed JS stuff, because Nixpacks took care of everything. But not for Go, because I needed to do multi-stage builds.

## Finally solved it after dwelling on Coolify's Discord community

### The problem: Containers deployed via docker compose are on their own networks.

The issue was with deploying via docker compose and it's not available via the internal docker container address. Even if it was already in the same project.

Admitted this was already covered in the docs, just not intuitive when I was working with the Coolify UI. To quote the [docs](https://coolify.io/docs/knowledge-base/docker/compose/):

> ### Connect to Predefined Networks
>
> By default, each compose stack is deployed to a separate network, with the name of your resource uuid This will allow to each service in your stack to communicate with each other.
>
> But in some cases, you would like to communicate with other resources in your account. For example, you would like to connect your application to a database, which is deployed in another stack.
>
> To do this you need to enable Connect to Predefined Network option on your Service Stack page, but this will make the internal Docker DNS not work as expected.

## To solve it:

1. Go to "Advanced" > Enable "Connect To Predefined Network"
2. I quite like just the container names without the identifiers behind, so I also enabled "Consistent Container Names".
3. Then just use the internal address from the connection string on the Postgres container UI page (Postgres URL (internal))

## Troubleshooting

1. If you need to check if they're connected, try this and refer to container names on individual deployment/DB UI configs.

   ```bash
   docker network inspect -f '{{range .Containers}}{{.Name}} {{end}}' coolify
   ```

2. You could manually connect the container to Coolify via the Terminal (from the left panel in Coolify), but there's not much point tbh. Though if that's what you prefer, Discord did offer suggestions:

   ```bash
   docker network connect coolify containername
   ```

3. If all else fails, these are the places I pored over. (Searching on Discord was a real pain though.)
   - [Coolify Docker Compose Docs](https://coolify.io/docs/knowledge-base/docker/compose/)
   - [How do I setup PgBouncer with the PostgreSQL database?](https://discordapp.com/channels/459365938081431553/1278688419475755019)
