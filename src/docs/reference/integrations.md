---
title: Integrations
description: Discover Railway’s out-of-the-box integrations and how they enhance your development process.
---

Railway offers integrations out of the box, as well as features to enable building your own integrations.

## Project Tokens

Project tokens can be used in environments where you cannot login (e.g. remote
servers or CI). You can create project tokens for a specific [Railway
environment](/reference/environments) on the project page.

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

Use the <a href="https://vercel.com/changelog/railway-integration-postgres-redis-mysql" target="_blank">Railway Vercel
integration</a> to provide your production and preview deployments with access to your [Railway
environments](/develop/environments).

You can enable this integration in your project dashboard by connecting
to your Vercel account, specify a team, project, and production/preview
environments. We will then provide your production and preview deployments on Vercel
with all the environment variables needed to connect to your Railway
environments.

This allows you to keep production and preview deployment databases separate.

### Other Platforms

We are working on adding more integrations to various serverless platforms.
However, if you want to use Railway for a platform we do not support, you can
manually add the environment variables for any of your services (e.g. the `DATABASE_URL`
for Postgres) to the serverless platform.

## GitHub Integration

Railway supports GitHub personal or organizational repos, provided the Railway app is given the correct permissions.

### Railway Deployment Checks

GitHub Commits have a status check to indicate the status of the Railway build. This applies for both PRs and all commits that auto deploy to Railway.

## Doppler Secrets Management

It's common for developers to store secrets in environment variables. However, this can be a security risk if you accidentally commit your secrets to a public repository. To avoid this, you can use a secrets management tool to store your secrets in a secure location. Railway supports Doppler as a secrets management tool. You can use Doppler to manage your Railway environment variables using the Railway Integration that Doppler provides.

You can get instructions on how to use Doppler with Railway on the <a href="https://docs.doppler.com/docs/railway" target="_blank">Doppler Docs
integration</a>.
