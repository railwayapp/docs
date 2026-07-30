---
title: Roll Back a Bad Deploy Fast
description: How to revert a broken deployment on Railway in under a minute. Covers rollback vs redeploy vs restart, image retention limits, and healthcheck-gated deploys that stop bad code before it goes live.
date: "2026-07-29"
tags:
  - deployments
  - rollback
  - incident-response
  - healthchecks
topic: infrastructure
---

A rollback on Railway restores a previous deployment's Docker image and its custom variables as a new active deployment. There is no rebuild, so it completes in seconds. When a deploy breaks production, rolling back is almost always faster than pushing a fix.

Rollback is one of three recovery actions Railway gives you, alongside redeploy and restart. This guide covers when each one applies, plus how to configure healthcheck-gated deploys so a broken release never receives traffic.

## Roll back from the dashboard

1. Open your project and click the affected service.
2. Go to the **Deployments** tab.
3. Find the last known-good deployment in the list.
4. Click the three dots at the end of that deployment and select **Rollback**.
5. Confirm the rollback.

Railway restores both the Docker image and the custom variables from that deployment, so if the outage was caused by a bad environment variable change rather than bad code, the rollback reverts that too.

That stored image is what makes rollback fast: there's no build step, and the rollback is live as soon as the container starts.

## Which deployments can you roll back to?

Rollback depends on Railway still having the old image. Railway retains images for a period after a deployment is removed, based on your plan:

| Plan | Image retention |
| --- | --- |
| Free / Trial | 24 hours |
| Hobby | 72 hours |
| Pro | 120 hours |
| Enterprise | 360 hours |

Deployments older than your plan's retention window cannot be restored, and the **Rollback** option will not appear on them. For those, use **Redeploy** instead: it rebuilds the image from the deployment's original source code with its original variables. The result is the same version of your app, but you wait for a build.

See the [image retention policy](/pricing/plans#image-retention-policy) for details.

## Rollback vs redeploy vs restart

Railway has three recovery actions. Picking the right one saves time.

| Action | What it does | Build? | Use when |
| --- | --- | --- | --- |
| **Rollback** | Restores a previous deployment's image and variables | No | The latest deploy broke something and an older version worked |
| **Redeploy** | Creates a new deployment from the same source and configuration | Yes | The image expired from retention, or you want a fresh build of the same commit |
| **Restart** | Restarts the current deployment's existing container | No | The app wedged at runtime (memory leak, stuck connection) but the code is fine |

Redeploy and restart are available from the same three-dots menu on the Deployments tab, and restart also appears inline on a `Crashed` deployment. Before reaching that state, Railway automatically restarts crashed deployments up to 10 times, depending on your [restart policy](/deployments/restart-policy), then marks them `Crashed` and notifies project members by email and [webhook](/observability/webhooks).

One more distinction: **Redeploy** on a deployment reuses that deployment's exact code and configuration. To deploy the latest commit from your default branch instead, open the Command Palette (`CMD + K`) and choose "Deploy Latest Commit".

## Roll back or redeploy from the CLI

The dashboard is the only place to roll back to an arbitrary older deployment. The CLI covers the redeploy and restart cases:

```bash
# Redeploy the most recent deployment (triggers a rebuild)
railway redeploy --service backend --yes

# Restart the current deployment without rebuilding
railway restart --service backend --yes
```

`railway restart` reuses the existing image and waits for the deployment to become healthy before the command completes. `railway redeploy` creates a new deployment from the same source, which includes a build.

To inspect deployment history and grab IDs for log correlation:

```bash
# List recent deployments with IDs, statuses, and timestamps
railway deployment list

# View logs for a specific deployment
railway logs <deployment-id>
```

`railway deployment list --json` is useful in scripts, for example to fetch the latest deployment ID with `jq`.

## Prevent bad deploys with a healthcheck

A rollback fixes the incident after users saw it. A healthcheck-gated deploy prevents the incident.

When a service has a healthcheck path configured, Railway queries that endpoint on every new deployment and only switches traffic once it returns HTTP `200`. If the endpoint does not return `200` within the timeout, the deploy is marked failed and the previous deployment keeps serving traffic.

To set it up:

1. Add an endpoint to your app (for example `/health`) that returns status `200` when the app is ready. Your app must listen on the `PORT` variable Railway injects, since the healthcheck targets that port.
2. In the service settings, set the healthcheck path to `/health`.
3. Optionally adjust the timeout. The default is 300 seconds; change it in settings or with the `RAILWAY_HEALTHCHECK_TIMEOUT_SEC` variable.

Two caveats:

- The healthcheck runs only at deploy time. Railway does not monitor the endpoint continuously after the deployment goes live.
- Services with an attached [volume](/volumes) cannot run two deployments at once, so a volume-backed service has a brief window of downtime on every deploy even with a healthcheck configured.

Healthcheck requests come from the hostname `healthcheck.railway.app`. If your framework restricts allowed hosts, add it to the allowlist or the check will fail with errors like "failed with service unavailable".

See [healthchecks](/deployments/healthchecks) for full configuration details.

## What to do when a deploy goes bad

This order minimizes downtime:

1. **Confirm the deploy is the cause.** Check whether errors started right after the latest deployment went live. Deployment timestamps are on the Deployments tab.
2. **Roll back first, debug second.** Click the three dots on the last good deployment and confirm the rollback. Users stop seeing errors in seconds.
3. **Diagnose from the failed deployment's logs.** The failed deployment and its build and runtime logs remain available after the rollback.
4. **Fix forward.** Push the corrected commit. The new deploy replaces the rolled-back one through your normal flow.
5. **Add a healthcheck if you did not have one.** If the bad deploy would have failed a `/health` probe, a healthcheck would have blocked it automatically.

## Next steps

- [Debug a production incident with logs, metrics, and traces](/guides/debug-production-incident)
- [Deployment actions](/deployments/deployment-actions)
- [Healthchecks](/deployments/healthchecks)
- [Set up alerts for crashes and failed deploys](/guides/alerts-crashes-failed-deploys)
