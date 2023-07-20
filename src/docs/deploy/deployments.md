---
title: Deployments
---

Service Deployments are attempts to build and deliver your application.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645148376/docs/deployment-photo_q4q8in.png"
alt="Screenshot of Deploy View"
layout="responsive"
width={1103} height={523} quality={80} />

All deployments will appear in the deployments view on your selected service.
Clicking on the deployment will bring up the build and deploy logs. Each deploy has the option to configure a Railway provided domain as well as attaching a custom domain.

## Deployment Lifecycle

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

While a Deployment is building, Railway will attempt to create a deployable Docker image containing your code and configuration (see [Builds](builds) for more details).

Once the build succeeds, Railway will attempt to deploy your image and the Deployment's status becomes `Deploying`. If a [healthcheck](../diagnose/healthchecks) is configured, Railway will wait for it to succeed before proceeding to the next step.

If an error occurs during the build or deploy process, the Deployment will stop and the status will become `Failed`.

Once the Deployment is live and running, the status will change to `Success`. A Deployment will remain in this state unless it [crashes](deployments#restart-a-crashed-deployment), at which point it will become `Crashed`.

When a new Deployment is triggered, older deploys in a `Crashed` and `Success` state are eventually removed - first having their status updated to `Removing` before they are finally `Removed`. Deployments may also be removed manually.

## Deploy Triggers

A new deployment is triggered when the [command](/deploy/railway-up) `railway up` is
executed. [GitHub Services](/develop/services#github-services) that are linked to a GitHub repo automatically deploy when
new commits are detected in the connected branch.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645148953/docs/triggers_i2nrwd.png"
alt="Screenshot of GitHub Integration"
layout="responsive"
width={1001} height={740} quality={80} />

## Check Suites

<Banner variant="info">
  Please make sure you have{" "}
  <Link href="https://github.com/settings/installations">accepted our updated GitHub permissions</Link>{" "}
  required for this feature to work.
</Banner>

When using GitHub Actions, enable the `Check Suites` flag to ensure Railway waits for your GitHub Actions to run successfully before triggering a new deployment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1671003153/docs/check-suites.png" alt="Check Suites Configuration" layout="responsive" width={1340} height={392} quality={80} />

When enabled, deployments will be moved to a `WAITING` state while your workflows are running. If any workflow fails, the deployments will be `SKIPPED`. When all workflows are successful, deployments will proceed as usual.

## Start Command

A start command is the process used to run a Deployment's code. For example, a Python project may have a start command of `python main.py`, or a NodeJS project may have a start command of `npm run start`.

Railway automatically configures the start command based on the code being
deployed. If your code uses a Dockerfile, the start command defaults to the ENTRYPOINT and/or CMD defined in the Dockerfile. Otherwise, the buildpack used to create the image will determine the start command - see [Builds](builds) for more details.

Start commands may be overridden for advanced use-cases such as
deploying multiple projects from a single [monorepo](/deploy/monorepo).

When specifying a start command, the behavior of the image depends on type of build:
- **Dockerfile**: the start command overrides the Docker image's ENTRYPOINT in [exec form](https://docs.docker.com/engine/reference/builder/#exec-form-entrypoint-example)
- **Buildpack**: the start command is inserted as a [buildpack launch process](https://buildpacks.io/docs/app-developer-guide/run-an-app/#user-provided-shell-process)

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />

## Singleton Deploys

By default, Railway maintains only one deploy per service.

## Logs

Railway allows users to see running logs of your application to help with
monitoring. Railway displays the last 10,000 lines of logs available for a
deployment.

We maintain logs for inactive deployments as well as active. Under the logs pane, you can search within your logs for certain keywords.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645149733/docs/logs_seqcps.png"
alt="Animation of Log Filtering"
layout="responsive"
width={1512} height={1254} quality={80} />

## Deployment Actions

### Rollback

Users can rollback to previous deployments if mistakes were made. A deployment
rollback will revert to the previously successful deployment. Both the Docker
image and custom variables are restored during the rollback process.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1645149734/docs/rollback_mhww2u.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={1518} height={502} quality={80} />

To perform a rollback, click the three dots at the end of a previous deployment,
you will then be asked to confirm your rollback.

### Redeploy

A successful, failed, or crashed deployment can be re-deployed. This will create
an new deployment with the exact same code and build/deploy configuration.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666380373/docs/redeploy_ghinkb.png"
alt="Screenshot of Redeploy Menu"
layout="responsive"
width={888} height={493} quality={100} />

### Cancel

Users can cancel deployments in progress by clicking the three dots at the end
of the deployment tab and select Abort deployment. This will cancel the
deployment in progress.

### Remove

If a deployment is completed, you can remove it by clicking the the three dots
at the end of the deployment tab and select Remove. This will remove the
deployment and stop any further project usage.

### Restart a Crashed Deployment

When a Deployment is `Crashed`, it is no longer running because the underlying process exited with a non-zero exit code - if your deployment exits successfully (exit code 0), the status will remain `Success`.

Railway automatically restarts crashed Deployments up to 10 times. After this limit is reached, your deployment status is changed to `Crashed` and notifying webhooks & emails are sent to the project's members.

You can restart a `Crashed` Deployment by visiting your project and clicking on the "Restart" button that appears in-line on the Deployment:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1643239507/crash-ui_b2yig1.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={947} height={156} quality={80} />

Restarting a crashed Deployment restores the exact image containing the code & configuration of the original build. Once the Deployment is back online, its status will change back to `Success`.

You can also click within a deployment and using the Command Palette restart a deployment at any state.

## Restart Policy

Within the Service settings, a user is able to configure a restart policy of either `Never`, `Always`, or `On-Failure` with an optional maximum number of restarts.

## How come my GitHub PR won't deploy?

Railway will not deploy a PR branch from a user who is not in your team or invited to your project without their associated GitHub account.
