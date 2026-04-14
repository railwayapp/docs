---
title: Deploy a Gatsby App
description: Deploy a Gatsby static site to Railway with Caddy. Covers one-click template deployment, CLI deploys, GitHub deploys, and Dockerfile setup.
date: "2026-04-14"
tags:
  - deployment
  - gatsby
  - frontend
topic: frameworks
---

[Gatsby](https://www.gatsbyjs.com) is a React-based static site generator that builds fast websites from data sources like Markdown, CMSes, and APIs. Gatsby produces a directory of static HTML, CSS, and JavaScript files that can be served by any web server.

This guide covers how to deploy a Gatsby app to Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

## Create a Gatsby app

**Note:** If you already have a Gatsby app locally or on GitHub, skip to [Deploy the Gatsby app to Railway](#deploy-the-gatsby-app-to-railway).

Ensure [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) is installed, then create a new Gatsby site:

```bash
npm init gatsby my-gatsby-site
```

Follow the prompts to choose your preferred options.

### Run the Gatsby app locally

```bash
cd my-gatsby-site
npm run develop
```

Open `http://localhost:8000` to see your site.

## Deploy the Gatsby app to Railway

Railway offers multiple ways to deploy your Gatsby app. Gatsby builds produce static files in the `public/` directory, so all deployment methods use a web server (Caddy) to serve those files.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Gatsby app directory.
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

To deploy a Gatsby app to Railway directly from GitHub:

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

1. Create a `Dockerfile` in your Gatsby app's root directory.
2. Add the content below to the `Dockerfile`:

   ```dockerfile
   FROM node:lts-alpine AS build

   ENV NPM_CONFIG_UPDATE_NOTIFIER=false
   ENV NPM_CONFIG_FUND=false

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . ./
   RUN npm run build

   FROM caddy
   WORKDIR /app
   COPY Caddyfile ./
   RUN caddy fmt Caddyfile --overwrite
   COPY --from=build /app/public ./public

   CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
   ```

   The `Dockerfile` uses a multi-stage build: Node builds the site, then Caddy serves the `public/` directory.

3. Add a `Caddyfile` to the app's root directory:

   ```
   {
       admin off
       persist_config off
       auto_https off
       log {
           format json
       }
       servers {
           trusted_proxies static private_ranges 100.0.0.0/8
       }
   }

   :{$PORT:3000} {
       log {
           format json
       }

       rewrite /health /*

       root * public

       encode gzip

       file_server

       try_files {path} /index.html
   }
   ```

   Note that the root directive points to `public` (Gatsby's build output directory) instead of `dist`.

4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway also supports <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Client-side routes

Gatsby supports [client-only routes](https://www.gatsbyjs.com/docs/how-to/routing/client-only-routes-in-gatsby/) for pages that handle routing in the browser. The `try_files {path} /index.html` directive in the Caddyfile ensures these routes work correctly on refresh. For more details on configuring this, see [Configure SPA Routing](/guides/spa-routing-configuration).

## Build memory

Gatsby builds can be memory-intensive for large sites with many pages or image processing. If the build fails with an out-of-memory error, increase the Node.js heap size:

```
NODE_OPTIONS=--max-old-space-size=4096
```

Add this as a [service variable](/variables) in Railway.

## Next steps

- [Configure SPA routing](/guides/spa-routing-configuration) - Details on Caddy and Nginx fallback routing.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle `GATSBY_` prefixed variables.
- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
