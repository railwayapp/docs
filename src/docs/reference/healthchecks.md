---
title: Healthchecks
---

Healthchecks can be used to guarantee zero-downtime [deployments](/reference/deployments) of your [service](/reference/services) by ensuring the new version is live and able to handle requests.

## How it Works

When a new deployment is triggered for a service, if a healthcheck endpoint is configured, Railway will query the endpoint until it receives an HTTP `200` response.  Only then will the new deployment be made active and the previous deployment inactive.

## Healthcheck Timeout

The default timeout on healthchecks is 300 seconds (5 minutes). If your application fails to serve a `200` status code during this allotted time, the deploy will be marked as failed.

This timeout is configurable in the service settings.

## Support

For information on how to configure healthchecks, click [here](/how-to/configure-deployment-lifecycle#configure-healthcheck-endpoint).