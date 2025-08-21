---
title: Deployments
description: Deployments are attempts to build and deliver your service. Learn how they work on Railway.
---

Deployments are attempts to build and deliver your [service](/reference/services).

All deployments will appear in the deployments view on your selected service.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645148376/docs/deployment-photo_q4q8in.png"
alt="Screenshot of Deploy View"
layout="responsive"
width={1103} height={523} quality={80} />

## How it Works

Upon service creation, or when changes are detected in the service source, Railway will build the service and package it into a container with [Nixpacks](https://nixpacks.com/docs) or a [Dockerfile](/guides/dockerfiles) if present. If the source is a Docker Image, the build step is skipped.

Railway then starts the service using either the detected or configured [Start Command](/reference/build-and-start-commands).

This cycle represents a deployment in Railway.

## Deployment States

A comprehensive up to date list of statues can be found in [Railway's GraphQL playground](https://railway.com/graphiql) under DeploymentStatus ([screenshot](https://res.cloudinary.com/railway/image/upload/v1737950391/docs/deploy-statuses.png)).

Deployments can be in any of the following states:

#### Initializing

Every Deployment in Railway begins as `Initializing` - once it has been accepted into our build queue, the status will change to `Building`.

#### Building

While a Deployment is `Building`, Railway will attempt to create a deployable Docker image containing your code and configuration (see [Builds](/guides/builds)).

#### Deploying

Once the build succeeds, Railway will attempt to deploy your image and the Deployment's status becomes `Deploying`. If a [healthcheck](/reference/healthchecks) is configured, Railway will wait for it to succeed before proceeding to the next step.

#### Failed

If an error occurs during the build or deploy process, the Deployment will stop and the status will become `Failed`.

#### Active

Railway will determine the deployment's active state with the following logic -

- If the deployment **has** a [healthcheck](/reference/healthchecks) configured, Railway will mark the deployment as `Active` when the healthcheck succeeds.

- If the deployment **does not** have a healthcheck configured, Railway will mark the deployment as `Active` after starting the container.

#### Completed

This is the status of the Deployment when the running app exits with a non-zero exit code.

#### Crashed

A Deployment will remain in the `Active` state unless it [crashes](/guides/deployment-actions#restart-a-crashed-deployment), at which point it will become `Crashed`.

#### Removed

When a new [Deployment](/overview/the-basics#deployments) is triggered, older deploys in a `Active`, `Completed`, or a `Crashed` state are eventually removed - first having their status updated to `Removing` before they are finally `Removed`. Deployments may also be [removed manually](/reference/deployments#remove).

The time from when a new deployment becomes `Active` until the previous deployment is removed can be controlled by setting a [`RAILWAY_DEPLOYMENT_OVERLAP_SECONDS`](/reference/variables#user-provided-configuration-variables) [service variable](/overview/the-basics#service-variables).

## Deployment Menu

The deployment menu contains actions you can take on a deployment.

**Note:** Some actions are only available on certain deployment states.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1726503037/docs/redeploy_remove_deploy_jescm0.png"
  alt="Deployment Menu"
  width={1007}
  height={690}
  quality={80}
/>

#### View logs

Opens the deployment up to the corresponding logs, during build the build logs will be shown, during deploy the deploy logs will be shown.

#### Restart

Restarts the process within the deployment's container, this is often used to bring a service back online after a crash or if you application has locked up.

#### Redeploy

Redeploys the selected deployment.

This is often used to bring a service back online after -

- A crash.
- A usage limit has been reached and raised.
- Upgrading to Hobby when trial credits were previously depleted.
- Being demoted from Hobby to free and then upgrading again.

**Notes** -

- The redeploy will use the source code from the selected deployment.

- Deployments older than your [plan's retention policy](/reference/pricing/plans#image-retention-policy) cannot be restored via rollback, and thus the rollback option will not be visible.

#### Rollback

Redeploys the selected deployment.

**Notes** -

- The rollback will use the source code from the selected deployment.

- Deployments older than your [plan's retention policy](/reference/pricing/plans#image-retention-policy) cannot be restored via rollback, and thus the rollback option will not be visible.

#### Remove

Stops the currently running deployment, this also marks the deployment as `REMOVED` and moves it into the history section.

#### Abort

Cancels the selected [initializing](#initializing) or [building](#building) deployment, this also marks the deployment as `REMOVED` and moves it into the history section.

## Ephemeral Storage

Every service deployment has access to 10GB of ephemeral storage. If a service deployment consumes more than 10GB, it can be forcefully stopped and redeployed.

If your service requires data to persist between deployments, or needs more than 10GB of storage, you should add a [volume](/reference/volumes).

## Singleton Deploys

By default, Railway maintains only one deploy per service.

In practice, this means that if you trigger a new deploy either [manually](/guides/deployment-actions#redeploy) or [automatically](/guides/github-autodeploys), the old version will be stopped and removed with a slight overlap for zero downtime.

Once the new deployment is online, the old deployment is sent a SIGTERM signal and given 3 seconds to gracefully shutdown before being forcefully stopped with a SIGKILL. We do not send any other signals under any circumstances.

The time given to gracefully shutdown can be controlled by setting a [`RAILWAY_DEPLOYMENT_DRAINING_SECONDS`](/reference/variables#user-provided-configuration-variables) [service variable](/overview/the-basics#service-variables).

## Railway Initiated Deployments

Occasionally, Railway will initiate a new deployment to migrate your service from one host to another. **This is primarily for your service's security and performance.**

We perform these migrations when implementing security patches or platform upgrades to the underlying infrastructure where your service was previously running. During platform-wide upgrades, your service might be redeployed multiple times as we roll out changes across our infrastructure. These deployments are mandatory and cannot be opted out of.

These Railway-initiated deployments will display with a banner above the Active deployment to clearly identify them.

## Deployments Paused - Limited Access

Railway's core offering is dynamic, allowing you to vertically or horizontally scale with little-to-no-notice. To offer this flexibility to customers, Railway takes the stance that Pro/Enterprise tiers may, in rare occasions, be prioritized above Free/Hobby tiers.

During periods where Pro/Enterprise users require additional resources, Railway may temporarily suspend resource allocation, including builds, to Free, and more rarely Hobby, customers.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1749837403/CleanShot_2025-06-13_at_10.55.34_2x_ks2adh.png"
  alt="Limited Access indicator shown during high traffic periods"
  layout="responsive"
  width={1200}
  height={479}
  quality={100}
/>

### During a Pause

- You'll see a "Limited Access" indicator in your dashboard
- New deployments will be queued rather than immediately processed
- All other Railway features remain fully functional
- No data or existing deployments are affected

### Continue Deploying During High Traffic

If you need to deploy immediately during a high traffic pause, you can upgrade to the Pro plan to bypass the deployment queue. Pro tier customers are not affected by deployment pausing and can continue deploying normally during high traffic periods.

### When Normal Operations Resume

- Queued deployments will automatically process in order
- You'll receive a notification when deployment capabilities are restored
- No action is required on your part

## Support

For information on how to manage your deployments, explore [the guides in this section](/guides/deployments).
