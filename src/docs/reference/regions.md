---
title: Regions
description: Explore the multiple regions worldwide where you can deploy your apps on Railway.
---

Railway's infrastructure spans multiple regions across the globe. This allows you to deploy your applications closer to your users no matter where they are located. **This feature is only available to Pro plan workspaces.**

 Consider factors like compliance needs and proximity to your users when choosing a region.

## Region Options
Railway has deploy regions in the Americas, Europe, and Asia-Pacific to provide broad coverage around the world.

Within the service settings, you can select one of the following regions:

| Name                 | Location               | Region Identifier        |
|----------------------|------------------------|--------------------------|
| US West              | Oregon, USA            | `us-west1`               |
| US West Metal        | California, USA        | `us-west2`               |
| US East              | Virginia, USA          | `us-east4`               |
| US East Metal        | North Carolina, USA    | `us-east4-eqdc4a`        |
| EU West              | Amsterdam, Netherlands | `europe-west4`           |
| EU West Metal        | Amsterdam, Netherlands | `europe-west4-drams3a`   |
| Southeast Asia       | Singapore              | `asia-southeast1`        |
| Southeast Asia Metal | Singapore              | `asia-southeast1-eqsg3a` |

<Image
    quality={100}
    width={1359}
    height={651}
    src="https://res.cloudinary.com/railway/image/upload/v1695660846/docs/service_region_picker.png"
    alt="Volume"
/>

**Notes:**

- Additional regions may be added in the future as Railway continues expanding its infrastructure footprint.

- Metal regions do not support services with volumes attached to them.

- Metal regions are available to all users as opposed to the other regions which are limited to Pro plan users.

- By default, Railway deploys to `us-west1` located in Portland, Oregon.

- All regions provide the same experience, performance, and reliability you expect from Railway.

- Impact of Region Changes

- The region of a service can be changed at any time, without any changes to your domain, private networking, etc.

- There will be no downtime when changing the region of a service, except if it has a volume attached to it (see next section).

### Volumes

Volumes follow the region of the service they are attached to. This means if you attach a new volume to a service, it will be deployed in the same region as the service.

If you change the region of a service with an existing attached volume, that volume will need to be migrated to the new region. You will experience minimal downtime, even for volumes containing large amounts of data.

The same is true if you attach a detached volume to a service in a different region. It will need to be migrated to the new region.

<Image
    quality={100}
    src="https://res.cloudinary.com/railway/image/upload/v1695661106/docs/volume_migration.png"
    alt="Volume"
    width={732}
    height={483}
/>

## Support

For information on how to deploy your services to different regions, refer to [this guide](/guides/optimize-performance#configure-a-region).
