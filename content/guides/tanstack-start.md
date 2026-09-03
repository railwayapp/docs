---
title: Build a TanStack App
description: Deploy a TanStack app to Railway. Covers scaffolding with the Railway option, GitHub and CLI deploys, environment variables, database migrations, and troubleshooting.
date: "2026-09-03"
tags:
  - deployment
  - frontend
  - tanstack
  - fullstack
topic: frameworks
---

[TanStack Start](https://tanstack.com/start) is a full-stack React framework built on TanStack Router. It provides file-based routing, server functions, server routes, SSR, and streaming out of the box. TanStack Start is a Vite plugin, so a TanStack Start app builds and deploys as a standard Node service on Railway.

Railway is an <a href="https://tanstack.com/start/latest/docs/framework/react/guide/hosting" target="_blank">official TanStack hosting partner</a>, and the TanStack scaffolder ships a Railway deployment option that configures your app to deploy here with no extra setup.

This guide covers how to deploy a TanStack app to Railway in three ways:

1. [Using the CLI](#deploy-from-the-cli).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using a Dockerfile](#use-a-dockerfile).

## Create a TanStack app

**Note:** If you already have a TanStack app locally or on GitHub, skip to [Choose a production server](#choose-a-production-server).

Ensure [Node](https://nodejs.org/en/download) is installed, then create a new project with the Railway deployment option:

```bash
npx @tanstack/cli@latest create my-app --deployment railway
```

The `--deployment railway` flag adds a Nitro server and a `start` script, which is everything Railway needs to build and run your app. Follow the prompts to choose your remaining options.

If you run the command without the `--deployment` flag, select `Railway` at the **Deploy** prompt. The default `Nitro (agnostic)` choice also deploys on Railway, but it adds the Nitro server without a `start` script, so Railway chooses the server command for you. Picking `Railway` keeps that decision explicit. See [Choose a production server](#choose-a-production-server).

### Run the app locally

```bash
cd my-app
npm run dev
```

Open `http://localhost:3000` to see your app.

## Choose a production server

`vite build` compiles your app, but TanStack Start needs a server runtime on top of the build. Which one you use changes both the build output and the command that starts it:

| Setup | Build output | Start command |
| --- | --- | --- |
| Nitro with a `start` script (recommended) | `.output/server/index.mjs` | `node .output/server/index.mjs` |
| Nitro, no `start` script | `.output/server/index.mjs` | `node .output/server/index.mjs`, chosen by Railway |
| No server runtime | `dist/server/` and `dist/client/` | `npx srvx --prod -s ../client dist/server/server.js`, chosen by Railway |

**Use Nitro with a `start` script.** It is what the Railway option in the scaffolder sets up, it produces a self-contained server bundle, and it is the configuration this guide documents from here on.

All three layouts deploy on Railway without configuration. When there is no `start` script, Railway's builder ([Railpack](/builds) v0.39 and later) picks the right server for your build output: `node .output/server/index.mjs` for Nitro apps, and [srvx](https://srvx.h3.dev) for the default Vite build. The build logs state which command was chosen and suggest adding a `start` script to make it explicit.

Adding the `start` script is still recommended: it keeps the production server your decision, and it makes the app portable to hosts that only run `npm start`.

To add Nitro to an existing app, install it and register its Vite plugin:

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
   - Generate a domain for your service:
     ```bash
     railway domain
     ```
   - You can also generate one from the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your service.

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
   - Once the deployment completes, go to [**View logs**](/observability/logs#build--deploy-panel) to check if the server is running successfully.
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

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

The Nitro build bundles its own dependencies into `.output`, so the runtime stage does not need `node_modules` or your `package.json`.

Deploy via the CLI or from GitHub. Railway automatically detects the `Dockerfile` and [uses it to build and deploy the app](/builds/dockerfiles).

## Port configuration

You don't need any. Both Nitro and srvx read the `PORT` environment variable that Railway sets, and both bind all interfaces by default, so your app is reachable as soon as it starts.

If you have an older app with an `app.config.ts` that sets a port, you can delete that file. It was part of the Vinxi-based setup that TanStack Start no longer uses, and it has no effect on current versions.

## Server functions and server routes

Server functions run on the server, never in the browser. Use them to reach environment variables, databases, and other server-side resources from your loaders and components:

```typescript
// src/fns.ts
import { createServerFn } from '@tanstack/react-start';

export const getMessage = createServerFn().handler(async () => {
  const dbUrl = process.env.DATABASE_URL; // server-only
  return { message: 'Hello from Railway' };
});
```

To expose an HTTP endpoint, add a `server` property to a file route:

```typescript
// src/routes/api.hello.ts
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({ message: 'Hello from Railway' });
      },
    },
  },
});
```

## Environment variables

TanStack Start apps use two kinds of variables, and they behave differently on Railway.

**Server variables** are read at runtime with `process.env` in server functions, server routes, and loaders. They are available on the next deploy after you change them, and they never reach the browser. Use them for secrets.

**Client variables** must be prefixed with `VITE_`, are read with `import.meta.env.VITE_*`, and are baked into the JavaScript bundle when `npm run build` runs. Never put secrets in a `VITE_` variable, since anyone can read them in the shipped bundle.

Set both kinds as [service variables](/variables) on your Railway service. Variables are available during the build and at runtime, so `VITE_` values are baked in correctly.

Changing a `VITE_` variable takes effect on the next build. Updating a variable in the dashboard prompts a redeploy, and a redeploy of a Railpack-built service rebuilds it, so the new value is picked up. A plain container restart does not rebuild, so it keeps the old value. See [Manage environment variables in frontend builds](/guides/frontend-environment-variables) for details.

## Add a Postgres database

1. In your Railway project, click **+ New**, then **Database**, then **PostgreSQL**.
2. Add the connection string to your TanStack app's service as a [reference variable](/variables#reference-variables):

```plaintext
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

This connects over Railway's [private network](/networking/private-networking), so it works at runtime with no extra configuration. Query the database from server functions and loaders with an ORM like Drizzle or Prisma:

```typescript
import { createServerFn } from '@tanstack/react-start';
import { drizzle } from 'drizzle-orm/node-postgres';
import { visits } from '../db/schema';

export const recordVisit = createServerFn().handler(async () => {
  const db = drizzle(process.env.DATABASE_URL!);
  await db.insert(visits).values({});
  const rows = await db.select().from(visits);
  return { visitCount: rows.length };
});
```

### Run migrations with a pre-deploy command

Run schema migrations in a [pre-deploy command](/deployments/pre-deploy-command), which executes between the build and the deploy with access to your service variables and the private network:

1. Navigate to your service **Settings** on Railway.
2. In the **Deploy** section, set **Pre-deploy Command** to your ORM's migration command. For Drizzle:
   ```bash
   npx drizzle-kit migrate
   ```

Keep the migration tool in `dependencies` rather than `devDependencies` so it is present in the deployed image, and generate migration files locally (`npx drizzle-kit generate` for Drizzle) so the pre-deploy step only applies them. The deploy logs show the migration output, and a failed migration stops the deploy before your app starts.

## Use Bun instead of Node

Railpack detects a `bun.lock` file and switches the whole pipeline to Bun: it installs with `bun install`, builds with `bun run build`, and runs the production server with Bun. Scaffold with `npx @tanstack/cli@latest create my-app --package-manager bun` and deploy the same way as a Node app. No extra configuration is needed.

## Troubleshooting

**The build succeeds, but the domain returns a 502 and the deployment flips to `CRASHED`.**
Check the runtime logs for srvx exiting with `ENOENT ... dist/server/server.js`. On Railpack versions before v0.39, an app with the `nitro()` plugin but no `start` script hit this on every deploy: the srvx fallback looked for `dist/` while Nitro built `.output/`. Redeploy to pick up the current Railpack version, or add the `start` script from [Choose a production server](#choose-a-production-server).

**The app deploys as a static site, and every page 404s.**
`@tanstack/react-start` is in `devDependencies`, so Railway's TanStack Start detection misses it. The build logs show `Deploying as vite static site` with a suggestion to move `@tanstack/react-start` to `dependencies`. Do that and redeploy.

**A `VITE_` variable is undefined in the browser, or shows a stale value.**
Check the prefix first, since only `VITE_`-prefixed variables reach client code. If the variable is set and still shows an old value, it was baked in by an earlier build. Trigger a redeploy so the app rebuilds with the current value.

**A deploy healthcheck fails even though the app starts cleanly.**
Railway's [healthcheck](/deployments/healthchecks) requires an HTTP `200` response and does not follow redirects, so a healthcheck path that answers a `3xx` fails every deploy. Point it at a path that returns a `200` directly.

**The build logs recommend setting up Nitro.**
Your app has no server runtime, so Railway is serving the default Vite build with srvx. This works, but Nitro is the recommended production server. See [Choose a production server](#choose-a-production-server).

**Pages render, but CSS and JavaScript assets 404.**
Your server isn't serving the client build. With Nitro this is handled for you. Without it, check that a [custom start command](/deployments/start-command) points srvx's `-s` flag at the client output directory.

**The deploy works but the app serves the dev server.**
Never use `vite dev` as a production start command. It is not a production server, and it will not behave correctly behind Railway's edge. Build the app and run the built server instead.

**A custom server entry or start command isn't detected.**
Autodetection covers the standard layouts. If you run a custom server file, set a [custom start command](/deployments/start-command) in your service settings, or use a [Dockerfile](#use-a-dockerfile) for full control.

## Next steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Manage environment variables](/guides/frontend-environment-variables) - Handle `VITE_` prefixed variables in TanStack Start.
- [Choose between SSR, SSG, and ISR](/guides/ssr-ssg-isr) - Understand rendering strategies.
- [Add a Database Service](/databases/build-a-database-service) - Connect Postgres, MySQL, Redis, and more.
- [Monitor your app](/observability) - Track logs, metrics, and deployment health.
