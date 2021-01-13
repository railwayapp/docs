---
title: Deployment
---

## Deploying with Up

You can deploy your app to Railways infrastructure by either connecting a GitHub
repo or with `railway up`.

Railway uses [buildpacks](https://buildpacks.io/) to attempt to build and deploy
with zero configuration. Currently we support the following languages out of the
box

- NodeJS
- Python
- Go
- Ruby
- Java 

We will also look and use a `Dockerfile` at the project
root if it exists.

**Important**: If you are starting a server, you need to use the `PORT`
environment variable. This is how railway can expose your deployment!

All deployments will appear in the deployments view on your project dashboard.
Clicking on the build will bring up the build and deploy logs. Each deploy get a
unique URL and is considered immutable.

### Auto Deploy from GitHub

You can configure Railway to deploy every push to a repo by going to
"Deployments" > "Auto Deploys" in your project. Here you can connect to your
GitHub account and select a repo/branch to deploy from. If you have more than 1
Railway environment, you can select which environment to use. (e.g. deploy every
push to _master_ using the _production_ railway environment).

### Up Command

If you run `railway up` inside of your project, we will deploy the current
directory using the currently selected Railway environment.

## Deploying to a Server

You can deploy to a separate server (e.g. AWS, GCP, DigitalOcean) and still
connect to your Railway plugins. On the server, you can either login to the CLI
with `railway login` or use a [project token](#project-tokens). Then prefix the
server start command with `railway run`.

```shell:always
railway run start-server
```

## Deploying to Serverless

We currently [support deploying](/changelog/2020-10-23#vercel-integration) to
the [Vercel](https://vercel.com/) platform through a project integration. Under
project settings > integrations on your project dashboard, you can connect your
Vercel account and specify a team, project, and production/preview environments.
We will then provide your production and preview deploys on Vercel with access
to your Railway environments. This allows you to easily use a different database
for all Vercel preview deploys.

We are working on adding more integrations to various serverless platforms.
However, if you want to use Railway for a platform we do not support, you can
manually add the environment variables for each plugin (e.g. the `DATABASE_URL`
for the Postgres plugin).

## Project Tokens

Project tokens can be used in environments where you cannot login (e.g. remote
servers or CI). You can create project tokens for a specific [Railway
environment](/docs/environments) on the project page.

Project tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway run` or `railway
env`.

```shell:always
RAILWAY_TOKEN=XXXX railway run
```

### Problems?

If you are having issues deploying to a specific platform, please [reach out on
Discord](https://discord.gg/xAm2w6g)!
