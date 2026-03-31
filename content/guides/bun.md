---
title: Deploy a Bun App
description: Learn how to deploy a Bun app to Railway with this step-by-step guide. It covers one-click deploys, Dockerfile setup, and other deployment strategies.
date: "2026-03-30"
tags:
  - deployment
  - bun
  - javascript
  - backend
topic: frameworks
---

<a href="https://bun.sh" target="_blank">Bun</a> is a fast all-in-one JavaScript runtime and toolkit designed as a drop-in replacement for Node.js.

This guide covers how to deploy a Bun app on Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

## One-click deploy from a template

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/bun-starter)

It is highly recommended that [you eject from the template after deployment](/templates/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=bun" target="_blank">variety of Bun templates</a> created by the community.

## Deploy from a GitHub repo

To deploy a Bun app on Railway directly from GitHub, follow the steps below:

1. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
2. Click **Deploy from GitHub repo**.
3. Select your Bun GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
4. Click **Deploy Now**.

**Note:** [Railpack](/builds/railpack) does not yet detect Bun projects automatically. Add a `Dockerfile` to your repo for Railway to build and deploy your app.

Once the deployment is successful, a Railway [service](/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/networking/public-networking#railway-provided-domain).

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. `cd` into your Bun app directory.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.

**Note:** [Railpack](/builds/railpack) does not yet detect Bun projects automatically. Add a `Dockerfile` to your repo for Railway to build and deploy your app.

## Use a Dockerfile

1. Create a `Dockerfile` in your app's root directory.
2. Add the content below to the `Dockerfile`:

   ```docker
   FROM oven/bun:1-alpine

   WORKDIR /app

   COPY package.json bun.lockb ./

   RUN bun install --frozen-lockfile

   COPY . ./

   ENTRYPOINT ["bun", "run", "src/index.ts"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next steps

Explore these resources to learn more about Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
