---
title: Deploy on Merge with PR Environments as Canaries
description: Set up a trunk-based promotion workflow on Railway. Every pull request gets a canary environment; every merge to main deploys production automatically.
date: "2026-07-29"
tags:
  - ci-cd
  - environments
  - deployment
  - github
topic: infrastructure
---

Deploy on merge is a trunk-based promotion workflow. Every pull request spins up a disposable copy of your stack where the change is validated. Merging to `main` is the promotion step: Railway builds the merged commit and deploys it to production, with no manual deploy button and no separate release process.

The PR environment is the canary. It runs the exact change that is about to land, on real infrastructure, before production ever sees it. If the canary looks wrong, you close or fix the PR. If it looks right, the merge itself is the deploy.

Setting this up assumes PR environments already work. If you have not enabled them before, read [Preview Deployments with PR Environments](/guides/preview-deployments-with-pr-environments) first. From there, this guide wires production to deploy on merge, gates that deploy on CI, validates changes in PR environments, cuts over with zero downtime, and rolls back when a bad merge lands anyway.

## How the pipeline fits together

The full lifecycle of a change looks like this:

1. You open a pull request against `main`.
2. Railway creates a temporary [PR environment](/environments#pr-environments-1) that replicates your base environment and deploys the PR branch into it.
3. You (and your reviewers) validate the change in the PR environment. CI runs in parallel on GitHub.
4. You merge the PR. Railway deletes the PR environment.
5. The push to `main` triggers a production deployment. With **Wait for CI** enabled, Railway holds the deployment in a `WAITING` state until your GitHub Actions pass.
6. With a healthcheck configured, Railway keeps the old deployment serving traffic until the new one returns `200`, then cuts over.
7. If something slips through, you roll back to the previous deployment in one action.

Each step maps to a Railway setting. The rest of this guide configures them in order.

## Step 1: Deploy production on merge to main

Services linked to a GitHub repository automatically deploy when commits are pushed to the connected branch. A merged PR is a push to `main`, so this is the whole promotion mechanism.

1. Open your production service settings.
2. Under the GitHub integration, set the trigger branch to `main`.
3. Confirm automatic deployments are enabled.

See [Controlling GitHub Autodeploys](/deployments/github-autodeploys) for the requirements. The important one: at least one project member must have a connected GitHub account with contributor access to the repository, or autodeploy cannot be enabled.

If your production environment inherits from a persistent staging environment instead, the same mechanism applies. Point the staging service at `main` and promote from staging to production by [syncing environments](/environments#sync-environments).

## Step 2: Enable PR environments as the canary stage

In Project Settings, open the Environments tab and enable PR environments. From then on, every PR opened by a project member gets its own temporary environment with all services, networking, and variables copied from your base environment. The environment is deleted automatically when the PR is merged or closed, so canaries do not accumulate.

Two behaviors matter for the canary role:

- **The base environment defines what the canary replicates.** By default that is production. Whatever variables and services exist in the base at PR-open time are what the canary runs against.
- **PRs from outside contributors do not deploy.** Railway will not deploy a PR branch from a user who is not in your workspace or invited to your project with their GitHub account connected. This is a safety property: an external PR cannot spin up infrastructure or read your variables.

For monorepos, enable [Focused PR environments](/environments#focused-pr-environments) so the canary only deploys the services whose files changed in the PR. A frontend-only PR does not need a fresh backend, and skipped services can still be deployed manually from the canvas if you need them.

To get a shareable URL for each canary automatically, make sure the services in your base environment use Railway-provided domains: PR environment services only receive domains automatically when their base counterparts do.

## Step 3: Gate the merge deploy with Wait for CI

Autodeploy on its own deploys every push to `main`, including one where your tests fail. **Wait for CI** closes that gap: Railway holds the production deployment in a `WAITING` state until all GitHub Actions workflows on that commit succeed. If any workflow fails, the deployment is `SKIPPED` and production keeps running the previous version.

Requirements:

- Your repository has a GitHub workflow.
- The workflow runs on push to the trigger branch:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test
```

When the workflow satisfies these requirements, a **Wait for CI** toggle appears in your service settings. Turn it on. The `pull_request` trigger in the same workflow gives you the standard GitHub merge gate on the PR itself, so untested code does not reach `main` in the first place.

See [Wait for CI](/deployments/github-autodeploys#wait-for-ci) for details, including the GitHub App permissions the feature needs.

## Step 4: Cut over with zero downtime

A merge deploy replaces a live production deployment, so configure a [healthcheck](/deployments/healthchecks). With a healthcheck path set, Railway queries the endpoint on the new deployment until it returns HTTP `200`, and only then routes traffic to it and retires the old deployment. Without one, there is no readiness gate on the cutover.

Your server needs an endpoint that returns `200` only when it is ready to serve:

```bash
npm install express
```

```js
// server.js
const express = require("express");

const app = express();

app.get("/health", (req, res) => {
  // Add real readiness checks here: database connectivity,
  // required variables present, migrations applied.
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send(`Running commit ${process.env.RAILWAY_GIT_COMMIT_SHA || "local"}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
```

Set the healthcheck path to `/health` in your service settings. Railway performs the check against the `PORT` variable it injects, so listen on it. That check times out after 300 seconds by default; if the endpoint never returns `200` in that window, the deployment is marked failed and the previous one keeps serving traffic.

One caveat: services with an attached volume cannot run two deployments at once, so a redeploy of a volume-backed service has a brief window of downtime even with a healthcheck configured. Keep stateful services (databases, queues) on their own service so your stateless application services get the zero-downtime path.

The `RAILWAY_GIT_COMMIT_SHA` variable in the example above is injected automatically on every deployment. Expose it from an endpoint or log it at startup to confirm which commit production is running after a merge.

## Step 5: Roll back a bad merge

Canaries and CI reduce bad deploys; they do not eliminate them. When a bad merge reaches production:

1. Open the production service and go to the Deployments tab.
2. Click the three dots on the last good deployment and select **Rollback**.

Rollback restores the previous deployment's Docker image and custom variables. It does not rebuild, so it is fast, and it does not depend on reverting the commit in Git. Deployments older than your plan's image retention policy cannot be restored this way. See [Deployment Actions](/deployments/deployment-actions#rollback).

After rolling back, revert or fix-forward the offending commit in Git. Until `main` is fixed, the next merge would redeploy the bad code.

## Keep canaries honest

A canary is only useful if it resembles production. Two habits help:

- **Sync long-lived PR environments.** If the base environment changes while a PR is open (a new variable, a new service), the canary is stale. Use [Sync environments](/environments#sync-environments) to pull those changes into the PR environment instead of closing and reopening the PR.
- **Branch the canary's state, not just its code.** By default the canary copies production's variables, which may include a production `DATABASE_URL`. Use per-environment variables, or provision a per-PR database branch from your CI pipeline, so canary writes stay out of production data. [GitHub Actions PR Environment](/guides/github-actions-pr-environment) shows a CLI-driven variant of the workflow that injects a per-PR database URL into each environment.

Inside your application, `RAILWAY_ENVIRONMENT_NAME` tells you which environment the code is running in, which is useful for disabling outbound side effects (emails, payment calls, webhooks) in canaries.

## Next steps

- [Preview Deployments with PR Environments](/guides/preview-deployments-with-pr-environments)
- [Controlling GitHub Autodeploys](/deployments/github-autodeploys)
- [Healthchecks](/deployments/healthchecks)
- [Deployment Actions](/deployments/deployment-actions)
