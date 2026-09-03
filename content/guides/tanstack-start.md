---
title: Build a TanStack App
description: Deploy a TanStack app to Railway. Covers GitHub deploys, CLI deploys, Dockerfile setup, and choosing a production server.
date: "2026-09-03"
tags:
  - deployment
  - frontend
  - tanstack
  - fullstack
topic: frameworks
---

[TanStack Start](https://tanstack.com/start) is a full-stack React framework built on TanStack Router. It provides file-based routing, server functions, server routes, SSR, and streaming out of the box. TanStack Start is a Vite plugin, so a TanStack Start app builds and deploys as a standard Node service on Railway.

Railway is an [official TanStack hosting partner](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), and the TanStack scaffolder ships a Railway option that configures your app to deploy here with no extra setup.

This guide covers how to deploy a TanStack app to Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

## Create a TanStack app

**Note:** If you already have a TanStack app locally or on GitHub, skip to [Choose a production server](#choose-a-production-server).

Ensure [Node](https://nodejs.org/en/download) is installed, then create a new project:

```bash
npx @tanstack/cli@latest create my-app --deployment railway
```

The `--deployment railway` flag adds a Nitro server, a `start` script, and everything else Railway needs to build and run your app — see [Choose a production server](#choose-a-production-server) below for what it does and why it matters. You can also omit the flag and pick `railway` from the deployment prompts instead.

### Run the app locally

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:3000` to see your app.

## Choose a production server

This is the one decision that determines whether your deploy works, so it is worth understanding before you push.

`vite build` compiles your app, but it does not produce a server that runs on its own. TanStack Start needs a server runtime on top of the build, and which one you use changes both the build output path and the command that starts it:

| Setup | Build output | Start command |
| --- | --- | --- |
| **Nitro** (recommended) | `.output/server/index.mjs` | `node .output/server/index.mjs` |
| No server runtime | `dist/server/server.js` + `dist/client/` | `srvx --prod -s ../client dist/server/server.js` |

**Use Nitro.** It is what the Railway option in the scaffolder sets up, and it is the configuration this guide documents from here on.

If you picked `railway` when scaffolding, you already have it and there is nothing to do. To add it to an existing app, install Nitro and register its Vite plugin:

```bash
npm install nitro
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [nitro(), tanstackStart(), viteReact()],
});
```

Then add a `start` script, which Railway uses to run your app:

```json
{
  "scripts": {
    "start": "node .output/server/index.mjs"
  }
}
```

A freshly scaffolded TanStack Start app has **no `start` script at all** unless you add one or pick a deployment option that adds it for you. If Railway doesn't find one, it falls back to serving your build with [`srvx`](https://srvx.h3.dev). That does work, so a missing `start` script won't necessarily break your deploy — but it means the server you run in production is chosen for you rather than by you. Adding the script keeps that decision explicit.

## Deploy the TanStack app to Railway

TanStack Start builds a Node.js server that handles SSR, server functions, server routes, and static asset serving. It deploys as a standard Node service on Railway.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your TanStack app directory.
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

If you'd rather control the build yourself, use a Dockerfile. This one assumes [Nitro](#choose-a-production-server), which builds to `.output`:

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

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

The Nitro build bundles its own dependencies into `.output`, so the runtime stage does not need `node_modules` or your `package.json`.

Deploy via the CLI or from GitHub. Railway automatically detects the `Dockerfile` and [uses it to build and deploy the app](/builds/dockerfiles).

## Port configuration

You don't need any. Both Nitro and srvx read the `PORT` environment variable that Railway sets, and both bind all interfaces by default, so your app is reachable as soon as it starts.

If you have an older app with an `app.config.ts` that sets a port, you can delete that file. It was part of the Vinxi-based setup that TanStack Start no longer uses, and it has no effect on current versions.

## Server functions

Server functions run on the server, never in the browser. Use them to reach environment variables, databases, and other server-side resources from your loaders and components:

```typescript
// src/fns.ts
import { createServerFn } from '@tanstack/react-start';

export const getMessage = createServerFn().handler(async () => {
  const dbUrl = process.env.DATABASE_URL; // server-only
  return { message: 'Hello from Railway' };
});
```

## Server routes

To expose an HTTP endpoint, add a `server` property to a file route:

```typescript
// src/routes/api.hello.ts
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: async () => {
        const dbUrl = process.env.DATABASE_URL; // server-only
        return Response.json({ message: 'Hello from Railway' });
      },
    },
  },
});
```

Both server functions and server routes have access to all Railway [service variables](/variables). Only variables prefixed with `VITE_` are available in client-side code, since TanStack Start is built on Vite. See [Manage environment variables in frontend builds](/guides/frontend-environment-variables) for details.

## Add a Postgres database

1. In your Railway project, click **+ New**, then **Database**, then **PostgreSQL**.
2. Add the connection string to your TanStack app's service:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Use an ORM like Prisma or Drizzle to query the database from server functions and loaders.

## Troubleshooting

**The build succeeds, but the container exits right away or the domain returns a 502.**
Check the deploy logs for the command Railway actually ran. If your app has no `start` script, Railway starts it with `srvx` against `dist/`, which fails if your build produced something else. See [Choose a production server](#choose-a-production-server).

**Pages render, but CSS and JavaScript assets 404.**
Your server isn't serving the client build. With Nitro this is handled for you. Without it, check that the `-s` path in your srvx command points at the client output directory.

**The deploy works but the app serves the dev server.**
Never use `vite dev` as a production start command. It is not a production server, and it will not behave correctly behind Railway's edge. Build the app and run the built server instead.

**A deploy healthcheck fails even though the app starts cleanly.**
Railway's healthcheck does not follow redirects, so a healthcheck path that answers a 3xx fails every deploy. Point it at a path that returns a 200 directly, or remove the healthcheck.

## Next steps

- [Manage environment variables](/guides/frontend-environment-variables) - Handle `VITE_` prefixed variables in TanStack Start.
- [Choose between SSR, SSG, and ISR](/guides/ssr-ssg-isr) - Understand rendering strategies.
- [Add a Database Service](/databases/build-a-database-service) - Connect Postgres, MySQL, Redis, and more.
- [Monitor your app](/observability) - Track logs, metrics, and deployment health.
