---
title: Deploy a Next.js App with Postgres
description: Deploy a Next.js app with a Postgres database on Railway. Covers standalone output, one-click deploys, Dockerfile setup, database wiring, and pre-deploy migrations.
date: "2026-03-30"
tags:
  - deployment
  - nextjs
  - react
  - fullstack
  - frontend
  - postgres
topic: frameworks
---

[Next.js](https://nextjs.org) is a React framework for building full-stack web applications. It handles server-side rendering, static generation, API routes, and routing.

This guide covers how to deploy a Next.js app to Railway and connect it to a Postgres database:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).
5. [Add a Postgres database](#add-a-postgres-database).

## Create a Next.js App

**Note:** If you already have a Next.js app locally or on GitHub, you can skip this step and go straight to [Deploy the Next.js App to Railway](#deploy-the-nextjs-app-to-railway).

To create a new Next.js app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to create a new Next.js app:

```bash
npx create-next-app@latest helloworld
```

Follow the prompts to configure your app. The defaults work well for most projects.

### Run the Next.js App locally

`cd` into the directory and start the development server:

```bash
cd helloworld
npm run dev
```

Open your browser and go to `http://localhost:3000` to see your app.

## Deploy the Next.js App to Railway

Railway offers multiple ways to deploy your Next.js app, depending on your setup and preference.

### One-Click Deploy from a Template

If you're looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/HRZqTF)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=nextjs" target="_blank">variety of Next.js app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Next.js app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Configure for Standalone Output**:

   Next.js needs to produce a standalone build for self-hosted deployment. Add the `output` option to your `next.config.ts` (or `next.config.js`) file:

   **next.config.ts**

   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "standalone",
   };

   export default nextConfig;
   ```

   Then update the start script in `package.json` to serve the standalone server:

   **package.json**

   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "node .next/standalone/server.js",
       "lint": "next lint"
     }
   }
   ```

   **Note:** Railway uses [Railpack](/builds/railpack) (or [Nixpacks](/builds/nixpacks)) to build and deploy your code with zero configuration. The Node provider will pick up the start script in `package.json` and use it to serve the app.

4. **Deploy the Application**:
   - Use the command below to deploy your app:
     ```bash
     railway up
     ```
   - This command will scan, compress and upload your app's files to Railway. You'll see real-time deployment logs in your terminal.
   - Once the deployment completes, go to **View logs** to check if the service is running successfully.
5. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/networking/public-networking#railway-provided-domain) to create a public URL for your app.

### Deploy from a GitHub Repo

To deploy a Next.js app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Configure for Standalone Output**:
   - Follow [step 3 mentioned in the CLI guide](#deploy-from-the-cli) to set `output: "standalone"` and update the start script.
3. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn't linked to GitHub yet, you'll be prompted to do so.
4. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once deployed, a Railway [service](/services) will be created for your app, but it won't be publicly accessible by default.
5. **Verify the Deployment**:
   - Once the deployment completes, go to **View logs** to check if the server is running successfully.
6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/networking/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in your Next.js app's root directory.
2. Add the content below to the `Dockerfile`:

   ```bash
   FROM node:lts-alpine AS base

   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Build the app
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV=production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000
   ENV PORT=3000
   ENV HOSTNAME="0.0.0.0"

   CMD ["node", "server.js"]
   ```

   **Note:** This Dockerfile requires `output: "standalone"` in your `next.config.ts` as described in [step 3 of the CLI guide](#deploy-from-the-cli).

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway also supports <a href="/builds/private-registries" target="_blank">deployment from public and private Docker images</a>.

## Add a Postgres database

Next.js apps that use API routes or server actions often need a database. Railway lets you add Postgres to your project in a few clicks.

### Provision the database

1. Open your project on Railway.
2. Click **+ New** on the project canvas and select **Database** → **PostgreSQL**.
3. Railway provisions the database and exposes connection variables (`DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`) in the database service.

### Connect your Next.js service to Postgres

1. Click on your Next.js service in the project canvas.
2. Go to the **Variables** tab.
3. Click **Add Reference Variable** and select `DATABASE_URL` from the Postgres service.
   - This creates a [reference variable](/variables#referencing-another-services-variable) that stays in sync if the database credentials change.
4. Redeploy the service for the new variable to take effect.

Your app can now read `DATABASE_URL` from `process.env` to connect to Postgres. Most ORMs and query builders (Prisma, Drizzle, Knex) use this variable automatically.

### Run migrations with a pre-deploy command

If your project uses an ORM that requires migrations (for example, Prisma or Drizzle), configure a [pre-deploy command](/deployments/pre-deploy-command) so migrations run before the new version starts serving traffic.

1. In your Next.js service on Railway, go to **Settings** → **Deploy** → **Pre-deploy Command**.
2. Set the command to your migration script. For example:
   - **Prisma**: `npx prisma migrate deploy`
   - **Drizzle**: `npx drizzle-kit migrate`
3. Railway runs this command in a separate container with access to your service's environment variables, including `DATABASE_URL`.

**Note:** The pre-deploy container does not have access to volumes. If your migration process requires file system state beyond what is in the build image, handle that in the build step instead.

## Next steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Choose between SSR, SSG, and ISR](/guides/ssr-ssg-isr) - Pick the right rendering strategy.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle `NEXT_PUBLIC_` prefixed variables.
- [Deploy a full-stack Next.js app](/guides/fullstack-nextjs) - Add Postgres, workers, and file uploads.
- [PostgreSQL on Railway](/databases/postgresql)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
- [Pre-deploy Command](/deployments/pre-deploy-command)
