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
integration](https://vercel.com/changelog/railway-integration-postgres-redis-mysql)
to provide your production and preview deployments with access to your [Railway
environments](/develop/environments).

Under Project Settings > Integrations in your project dashboard, you can connect
to your Vercel account, specify a team, project, and production/preview
environments. We will then provide your production and preview deployments on Vercel
with all the environment variables needed to connect to your Railway
environments.

This allows you to keep production and preview deployment databases separate.

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

## GitHub Integration

Railway supports GitHub personal or organizational repos, provided the Railway app is given the correct permissions.

### Railway Deployment Checks

GitHub Commits have a status check to indicate the status of the Railway build. This applies for both PRs and all commits that auto deploy to Railway.

## Secrets Management

It's common for developers to store secrets in environment variables. However, this can be a security risk if you accidentally commit your secrets to a public repository. To avoid this, you can use a secrets management tool to store your secrets in a secure location. Railway supports Doppler as a secrets management tool. You can use Doppler to manage your Railway environment variables using the Railway Integration that Doppler provides.
### Doppler

You can get instructions on how to use Doppler with Railway on the [Doppler Docs](https://docs.doppler.com/docs/railway).
