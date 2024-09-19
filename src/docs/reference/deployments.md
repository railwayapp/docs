---
title: Deployments
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

Deployments can be in any of the following states.

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

**Note:** Some actions are only available on **Active** or **Completed** deployments.

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

Restarts the currently running process in the deployment, this is often used to bring a service back online after a crash or if you application has locked up.

#### Redeploy

Redeploys the selected deployment.

This is often used to -

- Bring a service back online after a crash.

- Restart a service after a usage limit has been reached.

- Restart a service after upgrading to Hobby when trial credits are depleted.

- Restart a service if you were demoted from Hobby to trial.

**Notes** -

- The redeploy will use the source code from the selected deployment.

- Railway only retains deployment images for 2 weeks. You can only redeploy a deployment that is 2 weeks old or newer. Older deployments will not be available for redeployment.

#### Rollback

Redeploys the selected deployment.

**Notes** -

- The rollback will use the source code from the selected deployment.

- Railway only retains deployment images for 2 weeks. You can only roll back to a deployment that is 2 weeks old or newer. Older deployments will not be available for rollback.

#### Remove

Stops the currently running deployment, this also marks the deployment as `REMOVED` and moves it to the history section.

## Ephemeral Storage

Every service deployment has access to 10GB of ephemeral storage. If a service deployment consumes more than 10GB, it can be forcefully stopped and redeployed.

If your service requires data to persist between deployments, or needs more than 10GB of storage, you should add a [volume](/reference/volumes).

## Singleton Deploys

By default, Railway maintains only one deploy per service.

## Support

For information on how to manage your deployments, explore [the guides in this section](/guides/deployments).
