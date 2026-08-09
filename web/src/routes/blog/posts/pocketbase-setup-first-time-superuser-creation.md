---
title: 'Setting Up PocketBase’s First Superuser on Coolify'
description: 'I created PocketBase’s first superuser on Coolify with the installer URL in the service logs. The current CLI command works too.'
date: '2025-06-15'
date_updated: '2026-08-01'
category: 'Dev'
tags:
  - Coolify
  - PocketBase
published: true
slug: pocketbase-setup-first-time-superuser-creation
---

I've been playing around with Next.js, Stytch, Keycloak and Better Auth, but decided to return to experimenting with PocketBase for a SPA. I deployed a PocketBase instance with Coolify, but couldn't remember how I managed to create a superuser in the past. The official docs and Google didn't help.

Turns out, I needed to see my logs for the PocketBase service in Coolify.

```bash
2025-06-15T15:19:59.758659679Z 2025/06/15 15:19:59 Server started at http://0.0.0.0:8080
2025-06-15T15:19:59.758711719Z ├─ REST API:  http://0.0.0.0:8080/api/
2025-06-15T15:19:59.758715279Z └─ Dashboard: http://0.0.0.0:8080/_/
2025-06-15T15:19:59.856938100Z
2025-06-15T15:19:59.856969020Z (!) Launch the URL below in the browser if it hasn't been open already to create your first superuser account:
2025-06-15T15:19:59.857139780Z http://0.0.0.0:8080/_/#/pbinstal/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiZXhwIjoxNzUwMTAwMDAwLCJpYXQiOjE3NDkxMDAwMDAsInJvbGUiOiJhZG1pbiJ9.K7_Wn2k8rZGLx5tP3QeYvA6j9mFh4sRt8xV1n0cQ2uE
2025-06-15T15:19:59.857146660Z (you can also create your first superuser by running: /app/pocketbase superuser upsert EMAIL PASS)
2025-06-15T15:19:59.857149180Z
```

Replace http://0.0.0.0:8080 with the domain in your Coolify service, e.g., https://pocketbase.domain.com. The URL contains the JWT that allows you to create a superuser.

The log above came from the version I was running in 2025 and printed `superuser upsert`. [PocketBase's current documentation](https://pocketbase.io/docs/going-to-production/) uses:

```bash
/app/pocketbase superuser create EMAIL PASS
```

Use the command shown by your installed version. The installer link remains useful when you would rather finish setup in the browser.

Writing this for my future self too.
