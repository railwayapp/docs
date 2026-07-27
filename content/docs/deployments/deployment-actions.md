---
title: Deployment Actions
description: Explore the full range of actions available on the Service Deployments tab to manage your deployments.
---

Various actions can be taken on Deployments from within the Service -> Deployments tab and clicking on the three dots at the end of a previous deployment.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645148376/docs/deployment-photo_q4q8in.png"
alt="Screenshot of Deploy View"
layout="responsive"
width={1103} height={523} quality={80} />

## Rollback

Rollback to previous deployments if mistakes were made. To perform a rollback, click the three dots at the end of a previous deployment, you will then be asked to confirm your rollback.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645149734/docs/rollback_mhww2u.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={1518} height={502} quality={80} />

A deployment rollback will revert to the previously successful deployment. Both the Docker
image and custom variables are restored during the rollback process.

_Note: Deployments older than your [plan's retention policy](/pricing/plans#image-retention-policy) cannot be restored via rollback, and thus the rollback option will not be visible._

## Redeploy

A successful, failed, or crashed deployment can be re-deployed by clicking the three dots at the end of a previous deployment.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666380373/docs/redeploy_ghinkb.png"
alt="Screenshot of Redeploy Menu"
layout="responsive"
width={888} height={493} quality={100} />

This will create an new deployment with the exact same code and build/deploy configuration.

_Note: To trigger a deployment from the latest commit, use the Command Palette: `CMD + K` -> "Deploy Latest Commit". This will deploy the latest commit from the **Default** branch in GitHub._

_Currently, there is no way to force a deploy from a branch other than the Default without [connecting it in your service settings](/deployments/github-autodeploys#configure-the-github-branch-for-deployment-triggers)._

## Cancel

Users can cancel deployments in progress by clicking the three dots at the end
of the deployment tab and select Abort deployment. This will cancel the
deployment in progress.

## Remove

If a deployment is completed, you can remove it by clicking the three dots
at the end of the deployment tab and select Remove. This will remove the
deployment and stop any further project usage.

## Restart a crashed deployment

When a Deployment is `Crashed`, it is no longer running because the underlying process exited with a non-zero exit code - if your deployment exits successfully (exit code 0), the status will remain `Success`.

Railway automatically restarts crashed Deployments up to 10 times (depending on your [Restart Policy](/deployments/restart-policy#plan-limitations)). After this limit is reached, your deployment status is changed to `Crashed` and notifying webhooks & emails are sent to the project's members.

Restart a `Crashed` Deployment by visiting your project and clicking on the "Restart" button that appears in-line on the Deployment:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1643239507/crash-ui_b2yig1.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={947} height={156} quality={80} />

Restarting a crashed Deployment restores the exact image containing the code & configuration of the original build. Once the Deployment is back online, its status will change back to `Success`.

You can also click within a deployment and using the Command Palette restart a deployment at any state.

## Deployment dependencies - startup ordering

When multiple services deploy together, Railway uses [reference variables](/variables#reference-variables) to determine the deploy order. A service that references another service waits for that service to finish deploying before it starts, so it never boots with a stale or missing value from a dependency.

For example, if your API service has `DATABASE_URL=${{Postgres.DATABASE_URL}}` referencing a [PostgreSQL database](/databases/postgresql), Railway will:

1. Deploy the Postgres service first
2. Then deploy the API service (since it has a reference variable to Postgres)

### When ordering applies

Ordering takes effect when multiple deploys are triggered together as a batch:

- [**Template deploys**](/templates/deploy) — deploying a stack of services at once.
- **Applying [staged changes](/deployments/staged-changes)** — for example, a variable edit that redeploys multiple services.
- **[Duplicating an environment](/environments#create-an-environment)**.
- **[PR environments](/environments#pr-environments-1)** — services in an auto-created environment for a pull request.

### When ordering does not apply

When services deploy independently, no ordering is performed:

- **GitHub push deploys** — even in a [monorepo](/deployments/monorepo) where one push triggers multiple services, each service deploys independently.
- **Single-service redeploys** — there is nothing to order against.

### Transitive dependencies

Ordering follows the full chain of references. If service `A` references `B` and `B` references `C`, then `A` waits for both `B` and `C` to finish.

### Circular references

If two services reference each other (for example, `A` references `B` and `B` references `A`), Railway breaks the cycle and deploys them in parallel rather than waiting indefinitely.
