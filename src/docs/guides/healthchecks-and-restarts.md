---
title: Configure Healthchecks and Restart Policy
---

Railway provides controls for ensuring deployed services remain healthy.

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

### Services with Attached Volumes

To prevent data corruption, we prevent multiple deployments from being active and mounted to the same service. This means that there will be a small amount of downtime when re-deploying a service that has a volume attached, even if there is a healthcheck endpoint configured.

### Continuous Healthchecks

The healthcheck endpoint is currently ***not intended for continuous monitoring*** as it is only called at the start of the deployment, to ensure it is healthy prior to routing traffic to it.

If you are looking for a quick way to setup continuous monitoring of your service(s), check out the <a href="https://railway.app/template/p6dsil" target="_blank">Uptime Kuma template</a> in our template marketplace.

## Restart Policy

The restart policy dictates what action Railway should take if a deployed service stops or otherwise becomes unhealthy, e.g. exits with a non-zero exit code.

To configure a restart policy, go to the Service settings, set a restart policy of `Never`, `Always`, or `On-Failure` with an optional maximum number of restarts.

- `Always`: This means Railway will automatically restart your service every time it stops, regardless of the reason. It's useful for services that are designed to run continuously and should always be available.

- `On-Failure`: Railway will only restart your service if it stops due to an error (e.g., crashes, exits with a non-zero code). This is a good option if you want to avoid unnecessary restarts when the service stops intentionally.

- `Never`: Railway will never automatically restart your service, even if it crashes. This is typically used for one-off tasks or scheduled jobs where you don't want the service to keep running after it completes.