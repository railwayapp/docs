---
title: Deployments
---

Service Deployments are attempts to build and deliver your application.

All deployments will appear in the deployments view on your selected service.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645148376/docs/deployment-photo_q4q8in.png"
alt="Screenshot of Deploy View"
layout="responsive"
width={1103} height={523} quality={80} />

Clicking on the deployment will bring up the build and deploy logs. 


## Deployment States

Deployments can be in any of the following states:

- Initializing
- Building
- Deploying
- Success
- Failed
- Crashed
- Removed
- Removing

Every Deployment in Railway begins as `Initializing` - once it has been accepted into our build queue, the status will change to `Building`.

While a Deployment is building, Railway will attempt to create a deployable Docker image containing your code and configuration (see [Builds](/reference/builds) for more details).

Once the build succeeds, Railway will attempt to deploy your image and the Deployment's status becomes `Deploying`. If a [healthcheck](/reference/healthchecks) is configured, Railway will wait for it to succeed before proceeding to the next step.

If an error occurs during the build or deploy process, the Deployment will stop and the status will become `Failed`.

Once the Deployment is live and running, the status will change to `Success`. A Deployment will remain in this state unless it [crashes](deployments#restart-a-crashed-deployment), at which point it will become `Crashed`.

When a new Deployment is triggered, older deploys in a `Crashed` and `Success` state are eventually removed - first having their status updated to `Removing` before they are finally `Removed`. Deployments may also be removed manually.

## Singleton Deploys

By default, Railway maintains only one deploy per service.

## Support

For information on how to manage your deployments, explore [the guides in this section](/how-to/configure-deployments).