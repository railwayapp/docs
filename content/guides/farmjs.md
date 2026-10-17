---
title: Deploy a Farm.js App
description: Learn how to deploy a Farm.js app to Railway from a GitHub repo, with the CLI, or with a Dockerfile.
date: "2026-10-09"
tags:
  - deployment
  - farmjs
  - javascript
  - fullstack
topic: frameworks
---

<a href="https://farmjs.dev" target="_blank">Farm.js</a> is a full-stack framework with typed file routing, server actions, and streaming server rendering. It uses React by default and also supports Preact, Solid, Vue, and Svelte.

Farm.js builds a Node.js server that handles server rendering, API routes, server actions, and static assets, so it deploys as a standard Node service on Railway.

This guide covers how to deploy a Farm.js app on Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

## Create a Farm.js app

**Note:** If you already have a Farm.js app locally or on GitHub, skip to [Deploy from a GitHub repo](#deploy-from-a-github-repo).

Ensure [Node](https://nodejs.org/en/download) 22.13 or later is installed, then create a new project:

```bash
npx @farm.js/create-app@latest my-app
```

Run the app locally:

```bash
cd my-app
npm run dev
```

Open `http://localhost:3000` to see your app.

Railway uses the `start` script in `package.json` to run the production server. Make sure it runs the server that `farm build` creates:

```json
{
  "scripts": {
    "start": "node .farm/.output/server/index.mjs"
  }
}
```

If your app uses `"start": "farm start"`, that also works on Railway, because Railpack keeps devDependencies installed.

If `farm.config.ts` sets `deploy.target` to another platform, such as `vercel`, remove it or set it to `node`. A platform target builds output that only that platform can serve. Without one, `farm build` creates a Node.js server.

## Deploy from a GitHub repo

To deploy a Farm.js app on Railway directly from GitHub, follow the steps below:

1. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
2. Click **Deploy from GitHub repo**.
3. Select your Farm.js GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you'll be prompted to link it.
4. Click **Deploy Now**.

Once the deployment is successful, a Railway [service](/services) is created for you. By default, this service isn't publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click [Generate Domain](/networking/public-networking#railway-provided-domain).

**Note:** [Railpack](/builds/railpack) detects your Node.js app, runs `npm run build`, and starts it with `npm run start`. The Farm.js server reads the `PORT` variable that Railway sets and listens on all interfaces, so you don't need to configure a port.

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. Navigate to your Farm.js app directory.
   - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.
   - The CLI scans, compresses, and uploads your Farm.js app files to Railway for deployment.

## Use a Dockerfile

1. Navigate to your Farm.js app directory.
   - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
2. Create a `Dockerfile` in the app's root directory.
3. Add the content below to the `Dockerfile`:

   ```docker
   FROM node:22-slim AS build

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . ./
   RUN npm run build

   FROM node:22-slim

   WORKDIR /app
   COPY --from=build /app/.farm/.output ./.farm/.output

   ENV NODE_ENV=production
   EXPOSE 3000
   CMD ["node", ".farm/.output/server/index.mjs"]
   ```

4. Either deploy via the CLI or from GitHub.

`farm build` writes a self-contained server to `.farm/.output`, so the final image doesn't need `node_modules` or your `package.json`.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

## Next steps

Explore these resources to learn more about Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
