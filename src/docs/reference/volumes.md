---
title: Volumes
description: Volumes are a feature that enables persistent data for services on Railway.
---

Volumes are a feature that enables persistent data for [services](/reference/services) on Railway.

## How it works

When mounting a volume to a service, a volume is made available to the service on the specified mount path.

## Size Limits

Volumes have a default size based on the [subscription plan](/reference/pricing#plans).

- Free and Trial plans: **0.5GB**
- Hobby plans: **5GB**
- Pro and team plans: **50GB**

Volumes can be "Grown" after upgrading to a different plan.

Pro users and above can self-serve to increase their volume up to 250 GB.

For Pro and above users, please reach out to us on our [Central Station](https://station.railway.com/questions) if you need more then 250GB. Enterprise users with $2,000/month committed spend can also use [Slack](/reference/support#slack).

## Pricing

Volumes are billed at a rate per GB / minutely, and invoiced monthly. You can find [specific per-minute pricing here](/reference/pricing/plans#resource-usage-pricing).

You are only charged for the amount of storage used by your volumes. _Each volume requires aprox 2-3% of the total storage to store metadata about the filesystem, so a new volume will always start with some used amount of space used depending on the size._

## Backups

Services with volumes support manual and automated backups, backups are covered in the [backups](/reference/backups) reference guide.

## Caveats

Here are some limitations of which we are currently aware:

- Each service can only have a single volume
- Replicas cannot be used with volumes
- There is no built-in S/FTP support
- To prevent data corruption, we prevent multiple deployments from being active
  and mounted to the same service. This means that there will be a small amount
  of downtime when re-deploying a service that has a volume attached, even if there is a healthcheck endpoint configured
- Down-sizing a volume is not currently supported, but increasing size is supported
- When resizing a volume, all deployments must be taken offline to prevent data
  corruption
- There is no file browser, or direct file download. To access your files,
  you must do so via the attached service's mount point
- Docker images that run as a non-root UID by default will have permissions issues when performing operations within an attached volume. If you are affected by this, you can set `RAILWAY_RUN_UID=0` environment variable in your service.

## Support

Refer to the guide on [how to use volumes](/guides/volumes) for more details on how to use the feature.
