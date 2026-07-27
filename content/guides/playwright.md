---
title: Run Playwright in a Docker Container
description: Deploy Playwright scripts on Railway using a Docker container with browser dependencies, font packages, and memory configuration.
date: "2026-03-30"
tags:
  - deployment
  - playwright
  - docker
  - testing
topic: integrations
---

Playwright requires browser binaries and system-level dependencies that are not available in standard Node.js images. The steps below cover building a Dockerfile that includes everything Playwright needs and deploying it on Railway.

## Why Playwright needs a custom Dockerfile

Playwright automates real browsers (Chromium, Firefox, WebKit), which depend on:

- **Browser binaries** that are not bundled with Node.js images.
- **System libraries** like `libgbm`, `libnss3`, `libatk-bridge2.0`, and others required by the browsers at runtime.
- **Font packages** needed for accurate page rendering and screenshot generation.
- **Sufficient memory**, since browser processes are resource-intensive.

If you try to run a Playwright script in a vanilla `node` Docker image, it will fail with missing library errors. The fix is to use an image that includes these dependencies.

## Build the Dockerfile

There are two approaches: use the official Playwright Docker image, or install dependencies manually on a standard Node.js image.

### Option A: Official Playwright image

The official image from Microsoft includes all supported browsers and system dependencies out of the box.

```dockerfile
FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

# Include this line if your project has a build step
RUN npm run build

ENTRYPOINT ["node", "index.js"]
```

This is the recommended approach. The image is maintained by the Playwright team and is tested against each Playwright release.

### Option B: Custom setup on a Node.js image

If you need more control over the base image or only want a single browser, you can install Playwright's dependencies manually.

```dockerfile
FROM node:20-bookworm

# Install only Chromium and its system dependencies
RUN npx playwright install --with-deps chromium

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

ENTRYPOINT ["node", "index.js"]
```

The `--with-deps` flag tells Playwright to install both the browser binary and the required system libraries.

## Configure environment variables

Set the following variables on your Railway service as needed:

| Variable | Value | Purpose |
|---|---|---|
| `PLAYWRIGHT_BROWSERS_PATH` | `/ms-playwright` | Points Playwright to the browser binaries. This is the default in the official image. Set to `0` if you want Playwright to use a local install in `node_modules`. |
| `NODE_OPTIONS` | `--max-old-space-size=4096` | Increases the Node.js heap size for memory-intensive browser operations. |
| `PORT` | Your app's port | Required only if your script exposes an HTTP API (e.g., a screenshot service). |

You can add these in the Railway dashboard under your service's **Variables** tab, or with the CLI:

```bash
railway variables set PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
railway variables set NODE_OPTIONS=--max-old-space-size=4096
```

## Deploy on Railway

### From a GitHub repo

1. Push your project (including the `Dockerfile`) to a GitHub repository.
2. Open the <a href="https://railway.com/dashboard" target="_blank">Railway dashboard</a> and create a new project.
3. Select **Deploy from GitHub repo** and connect your repository.
4. Railway detects the `Dockerfile` and uses it automatically.
5. Add the environment variables listed above in the **Variables** tab.
6. Click **Deploy**.

### From the CLI

1. Install the Railway CLI if you have not already. See [Installing the CLI](/cli#installing-the-cli) for instructions.
2. Authenticate and link your project:
   ```bash
   railway login
   railway link
   ```
3. Deploy:
   ```bash
   railway up
   ```
   The CLI uploads your project files. Railway detects and builds the `Dockerfile`.

## Verify the deployment

After the deployment completes, confirm Playwright is running correctly:

1. Open the **Deployments** tab for your service in the Railway dashboard.
2. Check the build logs to verify the Dockerfile built successfully and the browser binaries are present.
3. Check the deploy logs for your application's output. A successful Playwright launch typically logs the browser version on startup.
4. If your script exposes an HTTP endpoint, generate a domain under **Settings > Networking** and send a test request.

If you see errors related to missing shared libraries, make sure you are using one of the Dockerfile approaches above and that the `PLAYWRIGHT_BROWSERS_PATH` variable points to the correct location.

## Memory configuration

Browser automation is memory-intensive. A single Chromium instance can use several hundred megabytes of RAM.

- Allocate at least **1 GB of memory** to the Railway service.
- For workloads that run multiple browser contexts or pages concurrently, increase memory further.
- You can adjust memory in the Railway dashboard under **Service Settings > Resources**.

## Common use cases

Playwright on Railway works well for:

- **Scheduled browser tests** using [Railway cron jobs](/cron-jobs).
- **Screenshot or PDF generation APIs** that accept a URL and return a rendered output.
- **Web scraping services** that need to interact with JavaScript-heavy pages.
- **Automated testing pipelines** triggered by deployments or webhooks.

## Next steps

- [Running a Cron Job](/cron-jobs) - Schedule your Playwright scripts to run on an interval.
- [Monitor your app](/observability) - Set up logging and monitoring for your service.
- [Scaling](/deployments/scaling) - Adjust memory and replicas for browser workloads.
