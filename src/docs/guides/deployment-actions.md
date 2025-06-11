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

Rollback to previous deployments if mistakes were made.  To perform a rollback, click the three dots at the end of a previous deployment, you will then be asked to confirm your rollback.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645149734/docs/rollback_mhww2u.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={1518} height={502} quality={80} />

A deployment rollback will revert to the previously successful deployment. Both the Docker
image and custom variables are restored during the rollback process.

*Note: Deployments older than your [plan's retention policy](/reference/pricing/plans#image-retention-policy) cannot be restored via rollback, and thus the rollback option will not be visible.*

## Redeploy

A successful, failed, or crashed deployment can be re-deployed by clicking the three dots at the end of a previous deployment.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666380373/docs/redeploy_ghinkb.png"
alt="Screenshot of Redeploy Menu"
layout="responsive"
width={888} height={493} quality={100} />

This will create an new deployment with the exact same code and build/deploy configuration.

*Note: To trigger a deployment from the latest commit, use the Command Pallette: `CMD + K` -> "Deploy Latest Commit".  This will deploy the latest commit from the **Default** branch in GitHub.*

*Currently, there is no way to force a deploy from a branch other than the Default without [connecting it in your service settings](/guides/github-autodeploys#configure-the-github-branch-for-deployment-triggers).*

## Cancel

Users can cancel deployments in progress by clicking the three dots at the end
of the deployment tab and select Abort deployment. This will cancel the
deployment in progress.

## Remove

If a deployment is completed, you can remove it by clicking the three dots
at the end of the deployment tab and select Remove. This will remove the
deployment and stop any further project usage.

## Restart a Crashed Deployment

When a Deployment is `Crashed`, it is no longer running because the underlying process exited with a non-zero exit code - if your deployment exits successfully (exit code 0), the status will remain `Success`.

Railway automatically restarts crashed Deployments up to 10 times (depending on your [Restart Policy](/guides/restart-policy#plan-limitations)). After this limit is reached, your deployment status is changed to `Crashed` and notifying webhooks & emails are sent to the project's members.

Restart a `Crashed` Deployment by visiting your project and clicking on the "Restart" button that appears in-line on the Deployment:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1643239507/crash-ui_b2yig1.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={947} height={156} quality={80} />

Restarting a crashed Deployment restores the exact image containing the code & configuration of the original build. Once the Deployment is back online, its status will change back to `Success`.

You can also click within a deployment and using the Command Palette restart a deployment at any state.

## Deployment Dependencies - Startup Ordering

You can control the order your services start up with [Reference Variables](https://docs.railway.com/guides/variables#reference-variables).
When one service references another, it will be deployed after the service it is referencing when applying a [staged change](https://docs.railway.com/guides/staged-changes) or [duplicating an environment](https://docs.railway.com/guides/environments#create-an-environment).

Services that have circular dependencies will simply ignore them and deploy as normal.

For example, let's say you're deploying an API service that depends on a [PostgreSQL database](https://docs.railway.com/guides/postgresql).

When you have services with reference variables like:
- API Service has `DATABASE_URL=${{Postgres.DATABASE_URL}}` which is defined on your Postgres Service in the same project.

Railway will:
1. Deploy the Postgres Service first
2. Then deploy the API Service (since it has a reference variable to Postgres)
