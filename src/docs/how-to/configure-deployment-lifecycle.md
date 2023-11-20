---
title: Configure Deployment Lifecycle
---

Railway offers several ways to manage the lifecycle of your deployed services.

## Configure the Start Command

A start command is the process used to run a Deployment's code. For example, a Python project may have a start command of `python main.py`, or a NodeJS project may have a start command of `npm run start`.

Railway automatically configures the start command based on the code being
deployed. If your code uses a Dockerfile, the start command defaults to the ENTRYPOINT and/or CMD defined in the Dockerfile. Otherwise, the buildpack used to create the image will determine the start command - see [Builds](/reference/builds) for more details.

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

## Configure the GitHub branch for deployment triggers

[Services that are linked to a GitHub repo](/how-to/create-and-manage-services#deploying-from-a-github-repo) automatically deploy when new commits are detected in the connected branch.

To update the branch that triggers automatic deployments, go to your Service Settings and choose the appropriate trigger branch.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1699395694/docs/deployTrigger_tuxk5l.png"
alt="Screenshot of GitHub Integration"
layout="responsive"
width={1103} height={523} quality={80} />

### Disable Automatic Deployments

To disable automatic deployment, simply choose `Disable Trigger` from your Service Settings.


## Configure Healthcheck Endpoint

A Healthcheck can be used to guarantee zero-downtime deployments of your web services by ensuring the new version is live and able to handle requests.

To configure a healthcheck -
1. Ensure your webserver has an endpoint (e.g. `/health`) that will return an HTTP status code of 200 when the application is live and ready
2. Under your service settings, input your health endpoint.  Railway will wait for this endpoint to serve a `200` status code before switching traffic to your new endpoint

Note that Railway does not monitor the healthcheck endpoint after the deployment has gone live.

### Healthcheck Timeout

The default timeout on healthchecks is 300 seconds (5 minutes) - if your application fails
to serve a `200` status code during this allotted time, the deploy will be marked
as failed.

<Image 
src="https://res.cloudinary.com/railway/image/upload/v1664564544/docs/healthcheck-timeout_lozkiv.png"
alt="Screenshot of Healthchecks Timeouts"
layout="intrinsic"
width={1188} height={348} quality={80} />

To increase the timeout, change the number of seconds on the service settings page.

## Enable Check Suites

<Banner variant="info">
  Please make sure you have{" "}
  <Link href="https://github.com/settings/installations">accepted our updated GitHub permissions</Link>{" "}
  required for this feature to work.
</Banner>

Enable the `Check Suites` flag in service settings to ensure Railway waits for your GitHub Actions to run successfully before triggering a new deployment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1671003153/docs/check-suites.png" alt="Check Suites Configuration" layout="responsive" width={1340} height={392} quality={80} />

When enabled, deployments will be moved to a `WAITING` state while your workflows are running. 

If any workflow fails, the deployments will be `SKIPPED`. 

When all workflows are successful, deployments will proceed as usual.

## Restart Policy

Within the Service settings, configure a restart policy of either `Never`, `Always`, or `On-Failure` with an optional maximum number of restarts.

## Enable App Sleeping

<PriorityBoardingBanner />

Enabling App Sleep on a service tells Railway to stop a service when it is inactive, effectively reducing the overall cost to run it.

To enable App Sleeping, toggle the feature on within the service configuration pane in your project:

<Image src="https://res.cloudinary.com/railway/image/upload/v1696548703/docs/scale-to-zero/appSleep_ksaewp.png"
alt="Enable App Sleep"
layout="intrinsic"
width={700} height={460} quality={100} />

1. Navigate to your service's settings > Deploy > App Sleeping
2. Toggle "Enable App Sleeping"
3. To _disable_ App Sleeping, toggle the setting again

Read more about how App Sleeping works in the [App Sleeping Reference page](/reference/app-sleeping).

## Configure a Cron Job

Cron Jobs allow you to start a service based on a crontab expression. 

Service configured as cron jobs are expected to execute a task, and terminate as soon as that task is finished. 

Make sure the service doesn't leave any resources open, such as database connections, otherwise the service won't terminate, and Railway wont't start it again until the previous execution has finished.

To configure a cron job -
1. Select a service and go to the Settings section. 
2. Within "Cron Schedule", input a crontab expression.
3. Once the setting is saved, the service will run according to the cron schedule.

Find more information about cron jobs, including examples of cron expressions, in the [reference page for Cron Jobs](/reference/cron-jobs).

#### In app scheduling libraries

If you are already using a scheduling library or system in your service such as [node-cron](https://www.npmjs.com/package/node-cron) or [Quartz](http://www.quartz-scheduler.org/), Railway cron jobs are a substitute of them that allows you to save resources between executions.