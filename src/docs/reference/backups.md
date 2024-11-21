---
title: Backups
---

The backup feature enables data recovery for all content stored in [volumes](/reference/volumes). This includes both our database offerings and any other data stored within a volume, such as an SQLite database.

## How it works

When a [volume](/reference/volumes) is mounted to a service, backups can be manually created, deleted and restored. And they can also be scheduled to run on a Daily / Weekly / Monthly schedule.

## Backup Schedules

Backups can be scheduled to run on a daily, weekly or monthly basis. They will be kept for a number of days / months based on the schedule.

You can set the schedule in the service settings panel, under the Backups tab.

- **Daily** - Backed up every 24 hours, kept for 6 days
- **Weekly** - Backed up every 7 days, kept for 1 month
- **Monthly** - Backed up every 30 days, kept for 3 months

You can select multiple backup schedules for a single volume. These schedules can be modified at any time, and you can also manually trigger backups as needed.

## Pricing

Backups are incremental and Copy-on-Write, we only charge for the data exclusive to them, that aren't from other snapshots or the volume itself.

You are only billed for the incremental size of the backup at $0.25 / GB, billed monthly.

## Caveats

Backups are a newer feature that is still under development. Here are some limitations of which we are currently aware:

- Backup incremental sizes are cached for a couple of hours when listed in the frontend, so they may show slightly stale data.
- Wiping a volume deletes all backups.
- Backups can only be restored into the same project + environment.

