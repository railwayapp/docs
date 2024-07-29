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

Upon service creation, or when changes are detected in the service source, Railway will build the service and package it into a container.  (If the source is a Docker Image, the build step is skipped.)  Railway then starts the service using either the detected or configured [Start Command](/reference/build-and-start-commands).

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
Once the Deployment is live and running, the status will change to `Active`.

### Completed
This is the status of the Deployment when the running app exits with a non-zero exit code.

#### Crashed
A Deployment will remain in the `Active` state unless it [crashes](/guides/deployment-actions#restart-a-crashed-deployment), at which point it will become `Crashed`.

#### Removed
When a new Deployment is triggered, older deploys in a `Crashed` or `Active` state are eventually removed - first having their status updated to `Removing` before they are finally `Removed`. Deployments may also be removed manually.

## Ephermal Storage

Every service deployment has access to 10GB of ephemeral storage.  If a service deployment consumes more than 10GB, it can be forcefully stopped and redeployed.

If your service requires data to persist between deployments, or needs more than 10GB of storage, you should add a [volume](/reference/volumes).

## Singleton Deploys

By default, Railway maintains only one deploy per service.

## Support

For information on how to manage your deployments, explore [the guides in this section](/guides/deployments).