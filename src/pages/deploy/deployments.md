---
title: Deployments
---

Project Deployments are attempts to build and deliver your application.

Deployments can be in any of the following states:

- Initializing
- Building
- Deploying
- Success
- Failure
- Crashed
- Removed
- Removing

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/deploy-view_pohple.png"
alt="Screenshot of Deploy View"
layout="responsive"
width={1005} height={505} quality={80} />

All deployments will appear in the deployments view on your project dashboard.
Clicking on the build will bring up the build and deploy logs. Each deploy gets
a pair of unique URLs and is considered immutable.

## Deployment Lifecycle

Every Deployment in Railway begins as `Initializing` - once it has been accepted into our build queue, the status will change to `Building`. 

While a Deployment is building, Railway will attempt to create a deployable Docker image containing your code and configuration (see [Builds](builds) for more details). Once the build succeeds, Railway will attempt to deploy your image and the Deployment's status becomes `Deploying`. If a [healthcheck](../diagnose/healthchecks) is configured, Railway will wait for it to succeed before proceeding to the next step. 

If an error occurs during the build or deploy process, the Deployment will stop and the status will become `Failure`. Once the Deployment is live and running, the status will change to `Success`. A Deployment will remain in this state unless it [crashes](deployments#restart-a-crashed-deployment), at which point it will become `Crashed`.

When a new Deployment is triggered, older deploys in a `Crashed` and `Success` state are eventually removed - first having their status updated to `Removing` before they are finally `Removed`. Deployments may also be removed manually. 

## Bad Gateway

If you get a Bad Gateway when you attempt to visit the deployment URL, it could
be that your `PORT` variable is misconfigured. Railway needs an explicit port to
listen on to expose the application to the internet. You can provide a `PORT`
variable under the Variables page in your project.

## Deploy Triggers

A new deploy is triggered when the [command](railway-up.md) `railway up` is
executed. Projects that are linked to a GitHub repo automatically deploy when
new commits are detected in the connected branch.

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/github-deploys_bscowt.png"
alt="Screenshot of GitHub Integration"
layout="responsive"
width={1001} height={740} quality={80} />

You can configure additional deployment triggers such as when a new PR is
created using
the [GitHub Trigger's integration](integrations#github-integration).

## Start Commands

A start command is the process used to run a Deployment's code. For example, a Python project may have a start command of `python main.py`, or a NodeJS project may have a start command of `npm run start`.

Railway automatically configures the start command based on the code being
deployed. If your code uses a Dockerfile, the start command defaults to the ENTRYPOINT and/or CMD defined in the Dockerfile. Otherwise, the buildpack used to create the image will determine the start command - see [Builds](builds) for more details. 

Start commands may be overridden for advanced use-cases such as
deploying multiple projects from a single [monorepo](/deploy/monorepo).

When specifying a start command, the behavior of the image depends on type of build:

- Dockerfile: the start command overrides the Docker image's ENTRYPOINT in [exec form](https://docs.docker.com/engine/reference/builder/#exec-form-entrypoint-example)
- Buildpack: the start command is inserted as a [buildpack launch process](https://buildpacks.io/docs/app-developer-guide/run-an-app/#user-provided-shell-process)

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />

## Singleton Deploys

For those who prefer to keep only one deploy active, you can enable (default
behaviour) singleton deploys under the Settings tab of the Deployments page.
This setting is useful for bots where there might be conflicts with log ins.

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/singletons_oajxpb.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={994} height={756} quality={80} />

## Deployment Actions

### Rollback

Users can rollback to previous deploys if mistakes were made. A deployment
rollback will revert to the previously successful deployment. Both the Docker
image and custom variables are restored during the rollback process.

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/rollback_i4mge0.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={992} height={426} quality={80} />

To perform a rollback, click the three dots at the end of a previous deployment,
you will then be asked to confirm your rollback.

### Logs

Railway allows users to see running logs of your application to help with
monitoring. Railway displays the last 10,000 lines of logs available for a
deployment.

We maintain logs for inactive deployments as well as active. Under the logs pane, you can search within your logs for certain keywords.

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1643229357/docs/log-filtering_tkzope.gif"
alt="Animation of Log Filtering"
layout="responsive"
width={1200} height={798} quality={80} />

### Delete Deployments

Users can cancel deployments in progress by clicking the three dots at the end
of the deployment tab and select Abort deployment. This will cancel the
deployment in progress.

If a deployment is completed, you can delete a live deploy by clicking the the
three dots at the end of the deployment tab and select Remove. This will remove
the deployment and stop any further project usage.

### Restart a Crashed Deployment

When a Deployment is `Crashed`, it is no longer running because the underlying process exited with a non-zero exit code - if your deployment exits successfully (exit code 0), the status will remain `Success`. 

Railway automatically restarts crashed Deployments up to 3 times. After this limit is reached, your deployment status is changed to `Crashed` and notifying webhooks & emails are sent to the project's members. 

You can restart a `Crashed` Deployment by visiting your project and clicking on the "Restart" button that appears in-line on the Deployment:

<NextImage
src="https://res.cloudinary.com/railway/image/upload/v1643239507/crash-ui_b2yig1.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={947} height={156} quality={80} />

Restarting a crashed Deployment restores the exact image containing the code & configuration of the original build. Once the Deployment is back online, its status will change back to `Success`. 

