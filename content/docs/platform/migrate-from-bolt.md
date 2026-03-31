---
title: Migrate from Bolt to Railway
description: Step-by-step guide to migrate a Bolt-generated app to Railway. Covers code export, environment variables, and production deployment.
---

This guide covers how to move a Bolt-generated app to Railway for production hosting.

## Prerequisites

- A <a href="https://railway.com" target="_blank">Railway account</a>
- A <a href="https://github.com" target="_blank">GitHub account</a>
- A Bolt project ready to export

## 1. Export your code from Bolt

Bolt provides two ways to get your code out:

- **GitHub integration** -- If your Bolt project is already connected to GitHub, note the repository name. You will connect this same repo to Railway.
- **Download as zip** -- In your Bolt project, download the project as a zip file. Extract it to a local directory.

## 2. Push to GitHub

If you downloaded the zip, create a new GitHub repository and push the code:

```bash
cd your-project
git init
git add .
git commit -m "Initial commit from Bolt"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

If you used Bolt's GitHub integration, your repo is already set. Skip to the next step.

## 3. Create a Railway project

1. Go to <a href="https://railway.com/new" target="_blank">railway.com/new</a>.
2. Select **Deploy from GitHub Repo**.
3. Connect your GitHub account if you have not already.
4. Select the repository containing your Bolt project.
5. Click **Deploy Now**.

Railway will begin building and deploying your app. You can monitor progress in the [Project Canvas](/projects#project-canvas).

## 4. Configure environment variables

Bolt projects often rely on environment variables for API keys, database connections, and third-party service credentials.

1. In Bolt, open your project settings and note all configured environment variables.
2. In Railway, select your service in the Project Canvas.
3. Open the **Variables** tab.
4. Use the **Raw Editor** to paste your variables in `KEY=VALUE` format.
5. Click **Deploy** to apply.

## 5. Add a database (if needed)

If your Bolt project uses a database:

- **External database (e.g., Supabase, PlanetScale)** -- Add the connection string as an environment variable in Railway. No other changes are needed.
- **Railway-managed database** -- Right-click the Project Canvas and add a Postgres, MySQL, or Redis service. Railway provides connection variables automatically when you link the database to your service.

See [Databases on Railway](/databases) for setup details.

## 6. Configure builds

Bolt typically generates React, Next.js, or Vite projects. Railway's build system (Railpack) auto-detects Node.js projects and installs dependencies automatically.

Some framework-specific notes:

- **Next.js** -- Set `output: "standalone"` in your `next.config.js`. See the [Next.js guide](/guides/nextjs) for details.
- **Vite SPA** -- If your app is a single-page application with client-side routing, you may need to configure static file serving or add a small server.
- **Full-stack projects** -- If your Bolt project has both a frontend and a backend, deploy them as separate services within the same Railway project. Each service gets its own build and deploy configuration.

## 7. Set up a public domain

1. Select your service in the Project Canvas.
2. Go to **Settings**.
3. Under **Public Networking**, click **Generate Domain** to get a `.railway.app` URL.

To use a custom domain, see [Custom Domains](/networking/domains).

## Migration checklist

- [ ] Code exported from Bolt and pushed to GitHub
- [ ] Railway project created and linked to the repo
- [ ] Environment variables transferred to Railway
- [ ] Database provisioned or external connection string set (if applicable)
- [ ] Build completes without errors
- [ ] App is accessible via the public domain
- [ ] Custom domain configured (if applicable)

## Next steps

- [Add a Database Service](/databases)
- [Monitor your app](/observability)
- [Set up a custom domain](/networking/domains)
