---
title: Backups
---

Backups are a feature that enables data recovery for [volumes](/reference/volumes) on Railway.

## How it works

When a [volume](/reference/volumes) is mounted to a service, backups can be manually created, deleted and restored. And they can also work on a Daily/Weekly/Monthly schedule.

Schedules are beta and exist behind a feature-flag, that can be toggled in the service settings panel and then enabled in the Backups tab of a service.

## Retention

- Daily backups are taken every day and are kept for 6 days
- Weekly backups are taken every week and are kept for 4 weeks
- Monthly backups are taken every month and are kept for 3 months

## Pricing

Backups are incremental and Copy-on-Write, we only charge for the data exclusive to them, that aren't from other snapshots or the volume itself.

You are only billed for the incremental size of the backup at $0.25 / GB, billed monthly.

## Caveats

Backups are a newer feature that is still under development. Here are some limitations of which we are currently aware:

- Backup incremental sizes are cached for a couple of hours when listed in the frontend, so they may show slightly stale data.
- Wiping a volume deletes all backups.
- Backups can only be restored into the same project + environment.

