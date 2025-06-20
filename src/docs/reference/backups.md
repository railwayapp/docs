---
title: Backups
description: Learn how Railway handles backups for volume contents to ensure data safety and recovery.
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

## How to restore a backup

The available backups for a volume are listed in the attached [service's](/overview/the-basics#services) Backups tab.

<Image src="https://res.cloudinary.com/railway/image/upload/v1737785142/docs/the-basics/backups_fdx09o.png"
alt="Screenshot of the service backups tab"
layout="responsive"
width={1365} height={765} quality={100} />

To restore a backup, first locate the backup you want to restore via its date stamp, then click the `Restore` button on the backup.

**Note:** Depending on the size of the backup, this may take a few seconds to a few minutes to complete.

Once completed, we will [stage the change](/guides/staged-changes) for you to review, click the `Details` button at the top of the [project canvas](/overview/the-basics#project--project-canvas) to view the changes.

During this process, you will see a new [volume](/overview/the-basics#volumes) mounted to the same location as the original volume, its name will be the date stamp of the backup.

The previous volume will be retained but has been unmounted from the service, it will have the original volume name such as `silk-volume`.

**Note:** Restoring a backup will remove any newer backups you may have created after the backup you are restoring, you will still have access to backups older than the one you are restoring.

If everything looks good and you're ready to proceed, click the `Deploy` button to complete the restore.

The changes will be applied and your service will be redeployed.


## Pricing

Backups are incremental and Copy-on-Write, we only charge for the data exclusive to them, that aren't from other snapshots or the volume itself.

You are only billed for the incremental size of the backup at a rate per GB / minutely, and invoiced monthly. Backups follow the same pricing as Volumes. You can find [specific per-minute pricing here](/reference/pricing/plans#resource-usage-pricing).

## Volume Backup Limits

Volume backups have size limitations based on the volume capacity:

- **Manual backups** are limited to 50% of the volume's total size
- This limitation applies to prevent backup operations from consuming excessive storage resources
- If your data exceeds this threshold, consider growing your volume capacity before creating backups or reaching out to support to raise the limit

## Caveats

Backups are a newer feature that is still under development. Here are some limitations of which we are currently aware:

- Backup incremental sizes are cached for a couple of hours when listed in the frontend, so they may show slightly stale data.
- Wiping a volume deletes all backups.
- Backups can only be restored into the same project + environment.

