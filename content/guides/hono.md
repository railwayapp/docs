---
title: Deploy a Hono App
description: Learn how to deploy a Hono app to Railway with this step-by-step guide. It covers quick setup, community templates, Dockerfile and other deployment strategies.
date: "2026-03-30"
tags:
  - deployment
  - hono
  - javascript
  - backend
topic: frameworks
---

<a href="https://hono.dev" target="_blank">Hono</a> is a lightweight, ultrafast web framework built for any JavaScript runtime, including Node.js, Bun, Deno, and Cloudflare Workers.

This guide covers how to deploy a Hono app on Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

**Note:** You can also choose from a <a href="https://railway.com/templates?q=hono" target="_blank">variety of Hono app templates</a> created by the community.

## Deploy from a GitHub repo

To deploy a Hono app on Railway directly from GitHub, follow the steps below:

1. Create a Hono app that uses the <a href="https://www.npmjs.com/package/@hono/node-server" target="_blank">Node.js adapter</a> (`@hono/node-server`).
   - If you already have a GitHub repo you want to deploy, you can skip this step.
   - Make sure your app reads the port from `process.env.PORT` with a fallback (e.g., `3000`).
2. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
3. Click **Deploy from GitHub repo**.
4. Select your Hono GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
5. Click **Deploy Now**.

Once the deployment is successful, a Railway [service](/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/networking/public-networking#railway-provided-domain).

**Note:** [Railpack](/builds/railpack) will detect your Node.js app and build it automatically. If you need more control over the build, you can also use [Nixpacks](/builds/nixpacks) or a [Dockerfile](#use-a-dockerfile).

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. Navigate to your Hono app directory.
   - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.
   - The CLI will now scan, compress and upload your Hono app files to Railway's backend for deployment.

## Use a Dockerfile

1. Navigate to your Hono app directory.
   - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
2. Create a `Dockerfile` in the app's root directory.
3. Add the content below to the `Dockerfile`:

   ```docker
   FROM node:20-alpine

   WORKDIR /app

   COPY package*.json ./

   RUN npm install

   COPY . ./

   RUN npm run build

   ENTRYPOINT ["node", "dist/index.js"]
   ```

4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next steps

Explore these resources to learn more about Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
