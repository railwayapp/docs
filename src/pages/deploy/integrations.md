---
title: Integrations
---

## GitHub Integration

Configure Railway to deploy every push to a repo by going to Deployments > Triggers in your project. Here you can select a GitHub repo and branch to deploy
from. If you have more than 1 [Railway environment](develop/environments), you can
select which environment to use.

<NextImage  src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/github-deploys_bscowt.png" 
            alt="Screenshot of GitHub Integration"
            layout="responsive"
            width={1001} 
            height={740}
            quality={80} />

It is possible to create multiple triggers. With this workflow you can connect to your repo and
- Deploy _main_ using the _production_ environment
- Deploy _staging_ using the _staging_ environment

## Project Tokens

Project tokens can be used in environments where you cannot login (e.g. remote
servers or CI). You can create project tokens for a specific [Railway
environment](develop/environments) on the project page.

 <NextImage  src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/project-tokens_rslnr6.png" 
            alt="Screenshot of Project Tokens"
            layout="responsive"
            width={1076} 
            height={741}
            quality={80} />

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
environments](/environments).

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
with `railway login` or use a [project token](/deploy/project-tokens). Then prefix the
server start command with `railway run`.

```shell:always
railway run start-server
```
