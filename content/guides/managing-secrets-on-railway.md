---
title: Managing Secrets on Railway
description: How to store API keys, database URLs, and other secrets on Railway using service, shared, reference, and sealed variables, with no separate secrets manager.
date: "2026-06-10"
tags:
  - variables
  - secrets
  - environment-variables
  - security
topic: infrastructure
---

## Introduction

When you're starting a new project, you need somewhere to put sensitive values. A database URL, an API key, a Stripe secret. That works until you accidentally commit it. A committed API key usually means bad actors can go and exploit your usage-based billing with a vendor, or worse... data leakage.

Railway solves this without the need for a separate secrets manager. You set variables in the dashboard, scope them per service and per environment, and your code reads them as plain environment variables at runtime. Production credentials can be sealed so nobody, including you, can read them back.

## What counts as a "secret" in a Railway project

A secret is a piece of configuration that grants access to a resource or system. Unlike a port number or a feature flag, a secret has consequences if exposed, someone else can use it to read your data, charge your account, or impersonate your app. You may hear people use the word "environment variable" for this as well.

Common examples include Stripe API keys, database passwords, and Shopify API keys. What they share is that they authenticate or authorize something. That's the line. If a value proves identity or unlocks access, it's a secret.

The practical test is simple: would you paste this into a public GitHub repo? If not, it belongs in Railway's variables, not your source tree.

## How Railway handles secrets for you

Railway gives you four ways to store secrets, and each one solves a different scoping problem. Service variables hold per-service values. Shared variables centralize anything reused across services. Reference variables pull those shared or cross-service values in without copy-paste. Sealed variables lock production credentials so nobody can read them back. Pick the layer that matches how widely a secret needs to travel, and you avoid the duplication and exposure that .env files create.

### Service variables

Service variables are the default home for any secret tied to a single service. You set them in that service's Variables tab through New Variable, or you open the RAW Editor and paste an entire `.env` or JSON block at once. Railway scans your repo root for `.env`, `.env.local`, `.env.production`, and similar files, then suggests those keys for import so you don't retype them.

Each service variable is scoped to one service in one environment. The same key can hold a different value in production than it does in staging, which keeps your environments cleanly separated.

### Shared variables

Shared variables live one level up, at the project. Open Project Settings, go to Shared Variables, and define a value once for every service that needs it. A single `DATABASE_URL` or `STRIPE_SECRET_KEY` no longer gets pasted into five services where one of the five drifts out of sync.

Scoping still runs per environment, so a shared variable in production carries a different value than the same key in staging. To attach one, click Share from the Shared Variables menu and pick your services, or open a service's Variables tab and select Shared Variable. Either path drops a reference into that service rather than a duplicated copy.

### Reference variables

Reference variables point at a value defined elsewhere instead of storing their own. Write `${{ shared.STRIPE_SECRET_KEY }}` to pull from a shared variable, `${{ Postgres.DATABASE_URL }}` to read another service's value, or `${{ VARIABLE_NAME }}` to reference a key in the same service. The dashboard autocompletes both the name and the value fields as you type.

Railway-provided values work the same way. Reference `${{ RAILWAY_PUBLIC_DOMAIN }}` and you get the live domain without hardcoding it. Update the source once and every reference resolves to the new value on the next deploy.

### Sealed variables

Sealed variables are write-only, and that's the point. Railway injects the value into your builds and deployments, but it never displays the value in the UI and refuses to return it through the API. Open a variable's three-dot menu and click Seal to lock production credentials so a leaked dashboard session can't read them.

Sealing is permanent. You can edit a sealed value through the three-dot menu, but you can never un-seal it or use the RAW Editor on it. Railway also skips sealed values when copying to PR environments, duplicating services, syncing diffs, and exporting through `railway run` or external integrations.

## How Railway handles secrets in preview environments

When you open a pull request, Railway spins up a preview environment with its own copy of your variables. Each PR environment inherits service and shared variables from the base environment, so your branch deploy gets the same database URL and API keys without any manual setup. The values stay scoped to that environment, which means a reviewer's branch never leaks into production config.

Sealed variables break this pattern, and you need to plan around it. Railway does not copy sealed values into PR environments, so any production credential you marked write-only simply won't exist on the preview deploy. A service that reads `STRIPE_SECRET_KEY` from a sealed variable will start with that value missing.

Keep a separate non-sealed test credential for anything a PR environment needs to boot. Reserve sealed variables for production-only secrets that preview deploys should never touch anyway.

## Local development with Railway secrets

With Railway, you don't have to worry about moving .envs between machines. The Railway CLI can pull your variables down at runtime and inject them into the process, so nothing lands on disk.

1. Install the CLI. On macOS or Linux, run `brew install railway`, or use `npm i -g @railway/cli`.
2. Authenticate with `railway login`. The browser flow links the CLI to your account.
3. Link the repo to a project with `railway link`. Pick the project and environment when prompted.
4. Start your app with `railway run <command>`. For a Node service that means `railway run npm run dev`. The CLI fetches the linked environment's variables and sets them for that process only.

Prefer an interactive session? Run `railway shell` to open a shell with every project variable already set, then run as many commands as you like.

You can also take advantage of `railway environment` to jump between staging and production, and your next `railway run` picks up the new values.

Keep in mind that sealed variables are never provided through `railway run` or `railway variables`. If your app depends on a sealed credential locally, set a separate non-sealed value for development.

## Reading Railway secrets in your application

Railway injects every variable into your service as a standard environment variable at runtime. You read them the same way you would read any env var in your language of choice. No Railway SDK, no client library, no special imports. The values your code sees come from the service's variables, any shared variables you've referenced, and any sealed secrets attached to that environment.

### Node.js

Read variables through `process.env` in Node.js. A database URL set in your service variables shows up as `process.env.DATABASE_URL` with no extra setup.

```javascript
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.STRIPE_SECRET_KEY;
const port = process.env.PORT || 3000;
```

Skip the `dotenv` package in production. Railway already populates the environment, so loading a `.env` file only matters for local runs outside `railway run`.

### Python

Read variables through the `os` module in Python, which ships with the standard library. Use `os.environ['MY_VAR']` when the variable must exist and you want a clear `KeyError` if it doesn't.

```python
import os

db_url = os.environ['DATABASE_URL']
api_key = os.getenv('STRIPE_SECRET_KEY')
debug = os.getenv('DEBUG', 'false')
```

Reach for `os.getenv` with a default when a variable is optional. It returns `None` or your fallback instead of raising.

## When Railway's built-in secrets are the right fit

Railway's native secrets handle the full problem for most projects. If the following describes you, there's no reason to add another tool.

- You're building on Railway and want zero extra infrastructure to manage.
- Your secrets are standard env vars: API keys, database URLs, tokens.
- You don't need automatic credential rotation or short-lived dynamic secrets.
- You don't need cross-project secret sharing outside of Railway.

Sealed variables already protect your production credentials from accidental exposure, and per-environment scoping keeps staging and production cleanly separated without any extra configuration.

## Summary

Railway covers secrets for most projects without a second tool on your bill. Service variables scope to one service. Shared variables cut duplication across services. Reference variables keep config DRY with `${{ shared.VAR }}`. Sealed variables lock production credentials down for good. And as always, we're looking for feedback on this experience at [station.railway.com](https://station.railway.com).
