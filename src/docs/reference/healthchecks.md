---
title: Healthchecks
description: Learn about healthchecks on Railway.
---

Healthchecks can be used to guarantee zero-downtime [deployments](/reference/deployments) of your [service](/reference/services) by ensuring the new version is live and able to handle requests.

## How it Works

When a new deployment is triggered for a service, if a healthcheck endpoint is configured, Railway will query the endpoint until it receives an HTTP `200` response.  Only then will the new deployment be made active and the previous deployment inactive.

#### Note About Continuous Monitoring

The healthcheck endpoint is currently ***not intended for continuous monitoring*** as it is only called at the start of the deployment, to ensure it is healthy prior to routing traffic to it.

If you are looking for a quick way to setup continuous monitoring of your service(s), check out the <a href="https://railway.com/template/p6dsil" target="_blank">Uptime Kuma template</a> in our template marketplace.

## Healthcheck Timeout

The default timeout on healthchecks is 300 seconds (5 minutes). If your application fails to serve a `200` status code during this allotted time, the deploy will be marked as failed.

This timeout is configurable in the service settings.

## Support

For information on how to configure healthchecks, click [here](/guides/healthchecks).