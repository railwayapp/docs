---
title: Healthchecks
---

Healthchecks can be used to guarantee zero-downtime deployments of your service by ensuring the new version is live and able to handle requests.

<Image 
src="https://res.cloudinary.com/railway/image/upload/v1645223701/docs/healthcheck_usnoiu.png"
alt="Screenshot of Healthchecks"
layout="intrinsic"
width={876} height={434} quality={80} />

First, make sure your webserver has an endpoint (e.g. `/health`) that will return a response with HTTP status code 200 when your application is live and ready. If your application needs to do some initialization on startup (running database migrations, populating cache, etc.), it's a good idea to return a non-200 status code from your endpoint until the initialization completes.

Under Service → Settings, input your health endpoint. Railway will wait for this endpoint to serve a `200` status code before switching traffic to your new deployment.

## Timeout

The default timeout on healthchecks is 300 seconds (5 minutes) - if your application fails
to serve a `200` status code during this allotted time, the deploy will be marked
as failed. To increase the timeout, change the number of seconds on the service settings page.

<Image 
src="https://res.cloudinary.com/railway/image/upload/v1664564544/docs/healthcheck-timeout_lozkiv.png"
alt="Screenshot of Healthchecks Timeouts"
layout="intrinsic"
width={1188} height={348} quality={80} />

## Debugging

<Image 
src="https://res.cloudinary.com/railway/image/upload/v1656640465/docs/healthcheck_bzbjbd.png"
alt="Screenshot of Healthchecks Logs"
layout="intrinsic"
width={1350} height={744} quality={80} />

Build Logs include detailed healthcheck failure logs.

We also maintain Deploy logs for failed deployments, allowing healthcheck debugging.
