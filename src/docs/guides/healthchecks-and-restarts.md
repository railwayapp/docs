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

## Restart Policy

The restart policy dictates what action Railway should take if a deployed service stops or otherwise becomes unhealthy, e.g. exits with a non-zero exit code.

To configure a restart policy, go to the Service settings, set a restart policy of `Never`, `Always`, or `On-Failure` with an optional maximum number of restarts.