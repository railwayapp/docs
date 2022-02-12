---
title: Healthchecks
---

Healthchecks can be used to guarantee zero-downtime deployments of your application by ensuring the new version is live and able to handle requests.

<Image 
src="https://res.cloudinary.com/railway/image/upload/v1636427657/docs/healthchecks_xov2f5.png"
alt="Screenshot of Healthchecks"
layout="intrinsic"
width={967} height={694} quality={80} />

First, make sure your webserver has an endpoint (e.g. `/health`) that will return a response with HTTP status code 200 when your application is live and ready. If your application needs to do some initialization on startup (running database migrations, populating cache, etc.), it's a good idea to return a non-200 status code from your endpoint until the initialization completes.

Under Deployments → Settings, input your health endpoint. Railway will wait for this endpoint to serve a 200 status code before switching traffic to your new deployment.

The default timeout on healthchecks is 120 seconds - if your application fails to serve a 200 status code during this allotted time, the deploy will be marked as failed and removed. To increase the timeout, specify the `RAILWAY_HEALTHCHECK_TIMEOUT_SEC` variable on your deployment.
