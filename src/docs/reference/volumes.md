---
title: Volumes
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

Please reach out to us on our [Help Station](https://help.railway.app/questions) or [Slack](/reference/support#slack) if you need more space.

## Pricing

Volumes are billed at **$0.25 / GB**, billed monthly.

You are only charged for the amount of storage used by your volumes. *Each volume requires a small amount of space to store metadata about the filesystem, so a new volume will start with a small amount of space used.*

## Caveats

Volumes is a newer feature that is still under development. Here are some limitations of which we are currently aware:
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
- Docker images that run as a non-root UID by default will have permissions issues when performing operations within an attached volume.  If you are affected by this, you can set `RAILWAY_RUN_UID=0` environment variable in your service.

## Support

Refer to the guide on [how to use volumes](/guides/volumes) for more details on how to use the feature.