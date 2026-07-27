---
title: Migrate from Lovable to Railway
description: Step-by-step guide to migrate a Lovable-generated app to Railway. Covers GitHub export, environment variables, database setup, and production configuration.
---

This guide is for users who want to stop using Lovable entirely and run their application on Railway. You take full ownership of the codebase, infrastructure, and deployment pipeline.

If you want to keep using Lovable for AI code generation while hosting on Railway, see [Deploy a Lovable App on Railway](/guides/lovable) instead.

## When to migrate vs. when to deploy

**Keep using Lovable + deploy to Railway** if you still want Lovable's AI code generation and prompt-driven development. Changes you make in Lovable auto-deploy to Railway. See the [Lovable deployment guide](/guides/lovable).

**Migrate fully to Railway** if you've outgrown Lovable's environment, want full control over your codebase, or need infrastructure Lovable doesn't support (background workers, cron jobs, multiple services, managed databases).

## Prerequisites

- A <a href="https://lovable.dev" target="_blank">Lovable</a> project with a working application
- A <a href="https://github.com" target="_blank">GitHub</a> account
- A <a href="https://railway.com" target="_blank">Railway</a> account

## 1. Connect your Lovable project to GitHub

If your Lovable project is already connected to GitHub, skip to [step 2](#2-create-a-railway-project-from-the-github-repo).

1. In Lovable, go to **Settings > Integrations > GitHub**.
2. Click **Connect GitHub** and authorize Lovable to access your GitHub account.
3. Install the Lovable GitHub App on your account or organization.
4. Click **Connect project** and select where the repository should be created.

Lovable creates a repository containing your application code. Changes made through Lovable's interface push to this repository automatically. This repository is what you deploy on Railway.

## 2. Create a Railway project from the GitHub repo

1. Go to <a href="https://railway.com/new" target="_blank">railway.com/new</a>.
2. Select **Deploy from GitHub repo** and choose the repository Lovable created.
3. Click **Deploy**.

Railway detects the project configuration from `package.json` and starts the build. Once the deployment finishes, check **View logs** to confirm the application started.

## 3. Configure environment variables

Lovable may store API keys and configuration values in its own environment. These do not transfer automatically.

1. In Lovable, open your project settings and note any environment variables (Supabase keys, OpenAI keys, Stripe keys, etc.).
2. In Railway, open your service and go to the **Variables** tab.
3. Add each variable as a key-value pair.

Railway redeploys automatically when variables change. See the [Variables guide](/variables) for more detail.

## 4. Add a database

Many Lovable projects use Supabase as their database. You have two options:

**Keep Supabase.** Add your Supabase connection string as an environment variable in Railway. No other changes are needed. Your application connects to the hosted Supabase instance the same way it did on Lovable.

**Migrate to Railway Postgres.** If you want to run the database on Railway:

1. Click **+ New** in your Railway project and select **Database > PostgreSQL**.
2. Export your Supabase data with `pg_dump`:
   ```bash
   pg_dump -h <supabase-host> -U postgres -d postgres -F c -f backup.dump
   ```
3. Import into Railway Postgres with `pg_restore`:
   ```bash
   pg_restore -h <railway-host> -U postgres -d railway -F c backup.dump
   ```
4. Update the database connection string in your Railway service variables to point to the new instance.

See [PostgreSQL on Railway](/databases/postgresql) for connection details and configuration.

## 5. Configure production builds

Lovable typically generates React applications using Vite. Railway's build system auto-detects Node.js projects and runs `npm run build` from `package.json`.

Where things may differ from Lovable's hosted environment:

- **Static frontend apps.** If your Lovable project is a single-page application with no backend server, it produces a `dist/` folder during the build. You need a way to serve those static files. See the [serving a static site guide](/guides/static-hosting) for options, including adding a lightweight server like `serve` to your project.

- **Apps with a backend.** If your project includes a backend (Express, Fastify, or similar), check that the start command in `package.json` runs the server. Railway uses the `start` script by default.

- **Supabase Edge Functions.** If your Lovable project relies on Supabase Edge Functions, those continue to run on Supabase. They do not need to be deployed on Railway unless you are replacing them with your own backend service.

## 6. Set up a public domain

Railway services are not publicly accessible by default.

1. Open your service and go to **Settings > Networking**.
2. Click **Generate Domain** to get a `.up.railway.app` URL.

To use a custom domain, add it in the networking settings and update your DNS records. See [Custom Domains](/networking/domains) for instructions.

## 7. Disconnect Lovable GitHub sync

Once you've verified that Railway is serving your application correctly, you can disconnect the Lovable GitHub integration to stop auto-syncing changes from Lovable to your repository.

1. In Lovable, go to **Settings > Integrations > GitHub**.
2. Disconnect the project from the repository.

This is optional but recommended if you are fully migrating. Disconnecting prevents accidental changes in Lovable from pushing to the repository and triggering Railway deployments.

## Migration checklist

- [ ] Lovable project connected to GitHub
- [ ] Railway project created from the GitHub repository
- [ ] Environment variables copied from Lovable to Railway
- [ ] Database connected (Supabase or Railway Postgres)
- [ ] Build and start commands verified in deployment logs
- [ ] Public domain configured
- [ ] Lovable hosting can be retired once Railway deployment is confirmed working
- [ ] Lovable GitHub sync disconnected (optional)

## Next steps

- [Add a Database Service](/databases)
- [Monitor your app](/observability)
- [Set up a custom domain](/networking/domains)
