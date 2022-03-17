---
title: Integrations
---

## Project Tokens

Project tokens can be used in environments where you cannot login (e.g. remote
servers or CI). You can create project tokens for a specific [Railway
environment](/develop/environments) on the project page.

<Image src="https://res.cloudinary.com/railway/image/upload/v1644622499/docs/projecttokens_lwjgat.png"
alt="Screenshot of Project Canvas"
layout="responsive"
width={1377} height={823} quality={100} />

Project tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway run`.

```bash
RAILWAY_TOKEN=XXXX railway run
```

## Serverless Platforms

### Vercel

Use the [Railway Vercel
integration](https://railway.app/changelog/2020-10-23#vercel-integration)
to provide your production and preview deploys with access to your [Railway
environments](/develop/environments).

Under Project Settings > Integrations in your project dashboard, you can connect
to your Vercel account, specify a team, project, and production/preview
environments. We will then provide your production and preview deploys on Vercel
with all the environment variables needed to connect to your Railway
environments.

This allows you to keep production and preview deploy databases separate.

### Other Platforms

We are working on adding more integrations to various serverless platforms.
However, if you want to use Railway for a platform we do not support, you can
manually add the environment variables for each plugin (e.g. the `DATABASE_URL`
for the Postgres plugin).

## Self Hosted Server

You can deploy to a separate server (e.g. AWS, GCP, DigitalOcean) and still
connect to your Railway plugins. On the server, you can either login to the CLI
with `railway login` or use a [project token](/deploy/integrations#project-tokens). Then prefix the
server start command with `railway run`.

```shell:always
railway run start-server
```
