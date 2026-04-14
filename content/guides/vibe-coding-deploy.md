---
title: Deploy a Vibe-Coded App on Railway
description: Deploy an application built with AI coding tools like Cursor, Claude Code, Bolt, or Lovable on Railway. Covers common deployment issues with AI-generated code and how to fix them.
date: "2026-04-14"
tags:
  - deployment
  - docker
topic: ai
---

AI coding tools like Cursor, Claude Code, Bolt, and Lovable generate working applications quickly. Deploying that code to production often surfaces issues that did not appear in local development. This guide covers how to deploy AI-generated code on Railway and fix the most common problems.

For Lovable-specific deployment, see the dedicated [Lovable guide](/guides/lovable).

## How Railway detects your app

When you deploy code to Railway, [Railpack](/builds/railpack) (or [Nixpacks](/builds/nixpacks)) analyzes your repository to detect the language and framework. It then installs dependencies, runs the build, and starts the application.

For most AI-generated projects, auto-detection works without extra configuration. If it fails, you can add a [Dockerfile](/builds/dockerfiles) for full control over the build.

## Deploy from GitHub

1. Push your AI-generated code to a GitHub repository.
2. Create a new [project](/projects) on Railway.
3. Click **+ New > GitHub Repo** and select your repository.
4. Railway auto-detects the framework and starts the first build.
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings > Networking**.

If the build fails, check the build logs for errors and see the troubleshooting section below.

## Deploy from the CLI

If your code is not on GitHub, deploy directly from your local machine:

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

The CLI uploads your code, builds it on Railway, and deploys the result.

## Common issues with AI-generated code

### Hardcoded ports

AI tools often hardcode the port number (e.g., `app.listen(3000)`). Railway injects the port via the `PORT` environment variable. Your app must read it:

```javascript
// Wrong
app.listen(3000);

// Correct
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0");
```

Also ensure the app binds to `0.0.0.0`, not `localhost` or `127.0.0.1`. Binding to localhost makes the app unreachable from outside the container.

### Missing environment variables

AI-generated code may reference environment variables that exist in a local `.env` file but are not set on Railway. Check your code for references to `process.env.*` or `os.environ` and add each variable in the Railway [Variables](/variables) tab.

Do not commit `.env` files to your repository. Add sensitive values directly in the Railway dashboard.

### Missing start command

If Railway cannot detect how to start your app, add a [start command](/deployments/start-command) in the service settings. Common examples:

| Framework | Start command |
| --- | --- |
| Next.js | `npm start` |
| Express | `node server.js` |
| FastAPI | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Flask | `gunicorn app:app --bind 0.0.0.0:$PORT` |

### No build step configured

Some AI-generated projects have build steps that are not captured in `package.json` scripts. Verify that `npm run build` (or the equivalent for your framework) produces the expected output. If your project needs a custom build command, set it under **Settings > Build > Build Command**.

### Database connection issues

If your app expects a database, AI tools sometimes generate connection strings that point to `localhost`. On Railway, databases run as separate services. Add a database to your project and [reference its connection URL](/variables#referencing-another-services-variable) as an environment variable.

### Health check failures

Railway checks that your service responds on its assigned port. If your app takes a long time to start or does not respond to HTTP requests, the deploy may fail. Check that:

1. The app binds to `0.0.0.0` and the `PORT` variable.
2. The app responds to requests within the [health check timeout](/deployments/healthchecks).
3. There are no startup errors in the [deployment logs](/observability/logs).

## Adding a Dockerfile

If auto-detection does not work for your project, add a `Dockerfile` to the repository root. Here is a generic Node.js example:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "start"]
```

Railway automatically uses the Dockerfile when present.

## Next steps

- [Railpack](/builds/railpack): How Railway auto-detects and builds your app.
- [Environment Variables](/variables): Configure secrets and connection strings.
- [Deployments](/deployments): Build settings, start commands, and deploy triggers.
- [Deploy a Lovable App](/guides/lovable): Lovable-specific deployment guide.
- [Troubleshooting Builds](/builds/build-configuration): Fix common build failures.
