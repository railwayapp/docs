---
title: Volumes
---

Volumes is a feature that allows you to store persistent data for services on Railway.


## Limits

Volumes have a max size based on the type of plan you are on. This may change
after the priority boarding period:
- Trial and Hobby plans: **5GB**
- Pro and team plans: **50GB**

Please reach out if you need more space.

## Pricing

You are only charged for the amount of storage used by your volumes. Each volume requires a small amount of space to store metadata about the filesystem, so a new volume will start with a small amount of space used.

Volumes are billed at **$0.25 / GB**, billed monthly.

Pricing is subject to change during the priority boarding period.

## Caveats

Volumes is a newer feature that
is still under development. Here are some limitations we are currently aware
of:
- Each service can only have a single volume
- Replicas cannot be used with volumes
- There is no built-in S/FTP support
- To prevent data corruption, we prevent multiple deployments from being active
  and mounted to the same service. This means that there will be a small amount
  of downtime when re-deploying a service that has a volume attached
- Down-sizing a volume is not currently supported, but increasing size is supported
- When resizing a volume, all deployments must be taken offline to prevent data
  corruption
- There is no file browser, or direct file download. To access your files,
  you must do so via the attached service's mount point
