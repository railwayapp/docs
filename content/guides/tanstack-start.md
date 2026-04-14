---
title: Deploy a TanStack Start App
description: Deploy a TanStack Start full-stack React application to Railway. Covers GitHub deploys, CLI deploys, Dockerfile setup, and Vinxi server configuration.
date: "2026-04-14"
tags:
  - deployment
  - tanstack
  - react
  - frontend
  - fullstack
topic: frameworks
---

[TanStack Start](https://tanstack.com/start) is a full-stack React framework built on TanStack Router. It provides file-based routing, server functions, SSR, and streaming out of the box. TanStack Start uses Vinxi as its server runtime, which builds on Nitro.

This guide covers how to deploy a TanStack Start app to Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

## Create a TanStack Start app

**Note:** If you already have a TanStack Start app locally or on GitHub, skip to [Deploy the TanStack Start app to Railway](#deploy-the-tanstack-start-app-to-railway).

Ensure [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) is installed, then create a new project:

```bash
npx @tanstack/create-start@latest my-app
```

Follow the prompts to choose your preferred options.

### Run the app locally

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:3000` to see your app.

## Deploy the TanStack Start app to Railway

TanStack Start builds a Node.js server that handles SSR, server functions, and static asset serving. It deploys as a standard Node service on Railway.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your TanStack Start app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Deploy the Application**:
   - Use the command below to deploy your app:
     ```bash
     railway up
     ```
   - This command will scan, compress and upload your app's files to Railway. You'll see real-time deployment logs in your terminal.
   - Once the deployment completes, go to **View logs** to check if the service is running successfully.
4. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/networking/public-networking#railway-provided-domain) to create a public URL for your app.

### Deploy from a GitHub repo

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn't linked to GitHub yet, you'll be prompted to do so.
3. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once deployed, a Railway [service](/services) will be created for your app, but it won't be publicly accessible by default.
4. **Verify the Deployment**:
   - Once the deployment completes, go to **View logs** to check if the server is running successfully.
5. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/networking/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

If Railpack does not detect the start command correctly, use a Dockerfile:

```dockerfile
FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:lts-alpine

WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

TanStack Start (via Vinxi/Nitro) builds into a `.output` directory. The server entry point is `.output/server/index.mjs`.

Deploy via the CLI or from GitHub. Railway automatically detects the `Dockerfile` and [uses it to build and deploy the app](/builds/dockerfiles).

## Port configuration

TanStack Start's Vinxi server listens on port 3000 by default. To make it respect Railway's `PORT` variable, check your `app.config.ts`:

```typescript
// app.config.ts
import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
```

If the server does not bind to the correct port, set a [custom start command](/deployments/start-command):

```bash
PORT=$PORT node .output/server/index.mjs
```

## Server functions

TanStack Start server functions run on the Node.js server, not in the browser. They can access environment variables, databases, and other server-side resources:

```typescript
// app/routes/api/hello.ts
import { createAPIFileRoute } from '@tanstack/react-start/api';

export const Route = createAPIFileRoute('/api/hello')({
  GET: async () => {
    const dbUrl = process.env.DATABASE_URL; // server-only
    return Response.json({ message: 'Hello from Railway' });
  },
});
```

Server functions have access to all Railway [service variables](/variables). Only variables with the `VITE_` prefix are available in client-side code, since TanStack Start uses Vite. See [Manage environment variables in frontend builds](/guides/frontend-environment-variables) for details.

## Add a Postgres database

1. In your Railway project, click **+ New**, then **Database**, then **PostgreSQL**.
2. Add the connection string to your TanStack Start service:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Use an ORM like Prisma or Drizzle to query the database from server functions and loaders.

## Next steps

- [Manage environment variables](/guides/frontend-environment-variables) - Handle `VITE_` prefixed variables in TanStack Start.
- [Choose between SSR, SSG, and ISR](/guides/ssr-ssg-isr) - Understand rendering strategies.
- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
