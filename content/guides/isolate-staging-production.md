---
title: Isolate Staging from Production for Compliance
description: Separate staging and production on Railway with per-environment networks, per-environment bucket instances, and environment-scoped credentials.
date: "2026-07-29"
tags:
  - environments
  - compliance
  - security
  - architecture
topic: architecture
---

Auditors for SOC 2, HIPAA, and similar frameworks expect a clear boundary between production and everything else: separate networks, separate data stores, separate credentials, and controlled access to production configuration. On Railway, that boundary is the environment.

A Railway environment is an isolated instance of every service in a project. Each environment gets its own private network, its own variables, its own bucket instances, and its own deployments. Nothing in staging can reach production over the private network, and staging credentials never grant access to production data.

That isolation is what this guide builds: a staging environment that mirrors production but stays separate from it, plus the access controls compliance reviews look for.

## What isolation you get per environment

| Layer | Isolation boundary |
| --- | --- |
| Private network | Per environment. Services in staging cannot reach production services at `<service>.railway.internal`. Each environment has its own isolated network. |
| Variables | Per environment. Every variable value is scoped to one environment. |
| Buckets | Per environment. Each environment gets its own bucket instance with its own S3 credentials. |
| Databases and volumes | Per environment. Each environment is an isolated instance of every service, so a duplicated environment gets its own database services with their own volumes and data. |
| Deployments | Per environment. Each environment deploys from its own configured branch. |

Two things are shared across environments and need their own handling: project membership (addressed with [Environment RBAC](#restrict-who-can-touch-production)) and public networking (every service with a public domain is reachable from the internet regardless of environment, so staging endpoints should still require authentication).

## Create a staging environment

Every project starts with a `production` environment. To add staging:

1. Open the environment dropdown in the top navigation and select **+ New Environment**, or go to **Settings → Environments**.
2. Choose **Duplicate Environment** to copy production, including services, variables, and configuration. Choose **Empty Environment** if you want to add services one at a time.
3. Review the staged changes banner and click **Deploy** to create the services.

Duplicating is the common path. It gives you a copy of every service, so staging structurally matches production. One exception is deliberate: [sealed variables](/variables#sealed-variables) are not copied when duplicating an environment. Any secret you sealed in production must be set again in staging. That is what you want: staging should hold staging credentials, not production ones.

## Point staging at its own branch

Each service in each environment has its own deployment trigger. Configure them so code flows through staging before production:

1. Switch to the `staging` environment in the environment dropdown.
2. Open the service, go to **Settings**, and set the trigger branch to `staging`.
3. Switch to `production` and confirm the same service triggers from `main`.

Pushes to `staging` now deploy only the staging environment. Merges to `main` deploy production. See [GitHub autodeploys](/deployments/github-autodeploys) for details.

## Per-environment private networks

Railway's private networking is isolated at the project and environment level. Every service gets an internal DNS name at `<service>.railway.internal`, and that name resolves only within the same environment. So a misconfigured staging worker that tries to call `api.railway.internal` gets the staging API, never the production one; there is no route between the two networks.

This means you do not need to build network segmentation yourself. The same connection string shape works in both environments and always resolves to the right instance:

```
http://api.railway.internal:3000
postgresql://postgres:${{Postgres.PGPASSWORD}}@postgres.railway.internal:5432/railway
```

Because the DNS name is identical in both environments, your application code and reference variables stay the same. Only the environment they run in changes what they resolve to.

## Per-environment bucket instances

Railway [Storage Buckets](/storage-buckets) follow the same model. Each environment gets its own separate bucket instance with isolated credentials. When you duplicate an environment, staging gets its own bucket instance, separate from production's. Staging code cannot delete production objects, and test uploads never land next to customer data.

Buckets are private only. Objects are reachable exclusively with the bucket's S3 credentials, through presigned URLs, or proxied through your backend; there is no public-bucket mode to accidentally enable in either environment.

Wire the bucket credentials into your service with reference variables, so each environment's service receives that environment's credentials:

```
BUCKET=${{ bucket.BUCKET }}
ACCESS_KEY_ID=${{ bucket.ACCESS_KEY_ID }}
SECRET_ACCESS_KEY=${{ bucket.SECRET_ACCESS_KEY }}
ENDPOINT=${{ bucket.ENDPOINT }}
```

In production, these resolve to the production bucket instance. In staging, the same references resolve to the staging instance, with no conditional logic or environment checks in your code.

## Environment-scoped credentials

Every variable in Railway is scoped to a single environment. Use that to keep external credentials separated too:

- **Third-party API keys**: set the production key (for example, a live Stripe key) only in the production environment, and the test key in staging. Neither environment can read the other's values.
- **Shared variables**: shared variables are also defined per environment under **Project Settings → Shared Variables**, so a project-wide `API_KEY` can hold different values in staging and production.
- **Sealed variables**: seal production secrets so their values are never visible in the UI and cannot be retrieved via the API. Sealed values are excluded from environment duplication, PR environments, environment sync diffs, and external integrations.

Your application should never branch on environment to pick credentials. If you find code like `if (env === "production") use LIVE_KEY`, move both keys into their respective environments under the same variable name. If you need the environment name at runtime for logging or guardrails, Railway provides `RAILWAY_ENVIRONMENT_NAME` automatically.

## Restrict who can touch production

Isolating the infrastructure is half the requirement. Compliance frameworks also ask who can access production secrets and data.

[Environment RBAC](/enterprise/environment-rbac), available on Railway Enterprise, lets you mark the production environment as restricted:

- Non-admin members and deployers can see the environment exists but cannot view its variables, logs, metrics, services, or configuration.
- Deployments can still be triggered via git push, so developers keep deploying without ever reading production secrets.
- Only admins can access restricted environments or toggle the restriction.

Recommended setup for a compliance posture:

1. Mark `production` as restricted.
2. Keep `staging` unrestricted so the team can debug there freely.
3. Limit admin membership to the people who operate production.
4. Review admin access periodically.

[Audit logs](/enterprise/audit-logs) give workspace admins a record of changes to projects, services, deployments, variables, and workspace settings, which covers the change-management evidence most audits ask for.

## Keep staging and production in sync

Isolation creates drift risk: staging stops matching production and tests stop being representative. Environment sync fixes this without breaking the boundary:

1. Switch to the environment that should receive changes.
2. Click **Sync** at the top of the canvas and select the source environment.
3. Review the staged changes (services tagged "New", "Edited", "Removed") and click **Deploy**.

Sync copies configuration, not data, so databases, volumes, and bucket contents stay separate. Sealed variables are also excluded from the sync diff, so production secrets never leak into staging through a sync.

## Checklist

- Staging environment duplicated from production, deploying from a `staging` branch
- Production deploys only from `main`
- All secrets set per environment; production secrets sealed
- Bucket credentials wired via reference variables, not hardcoded
- Live third-party keys present only in production
- Production environment restricted via Environment RBAC (Enterprise)
- Audit logs reviewed as part of your change-management process

## Next steps

- [Environments](/environments) covers PR environments, sync, and environment types in depth.
- [Managing secrets on Railway](/guides/managing-secrets-on-railway) goes deeper on sealed variables and secret hygiene.
- [Preview deployments with PR environments](/guides/preview-deployments-with-pr-environments) adds ephemeral per-PR environments on top of staging.
- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime) covers the credential lifecycle after isolation is in place.
