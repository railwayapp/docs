---
title: Serverless
---

## Vercel

Use the [Railway Vercel
integration](https://railway.app/changelog/2020-10-23#vercel-integration)
to provide your production and preview deploys with access to your [Railway
environments](/environments).

Under Project Settings > Integrations in your project dashboard, you can connect
to your Vercel account, specify a team, project, and production/preview
environments. We will then provide your production and preview deploys on Vercel
with all the environment variables needed to connect to your Railway
environments.

This allows you to keep production and preview deploy databases separate.

## Other Platforms

We are working on adding more integrations to various serverless platforms.
However, if you want to use Railway for a platform we do not support, you can
manually add the environment variables for each plugin (e.g. the `DATABASE_URL`
for the Postgres plugin).
