---
title: Deployment Regions
description: Deploy your apps across multiple regions worldwide with Railway’s powerful infrastructure.
---

Railway's infrastructure spans multiple regions across the globe. This allows you to deploy your applications closer to your users no matter where they are located.

Consider factors like compliance needs and proximity to your users when choosing a region.

## Region Options

Railway has deploy regions in the Americas, Europe, and Asia-Pacific to provide broad coverage around the world.

Within the service settings, you can select one of the following regions -

| Name                 | Location               | Region Identifier        |
| -------------------- | ---------------------- | ------------------------ |
| US West Metal        | California, USA        | `us-west2`               |
| US East Metal        | Virginia, USA          | `us-east4-eqdc4a`        |
| EU West Metal        | Amsterdam, Netherlands | `europe-west4-drams3a`   |
| Southeast Asia Metal | Singapore              | `asia-southeast1-eqsg3a` |

_Additional regions may be added in the future as Railway continues expanding its infrastructure footprint._

**Note:** The region identifier is the value that can be used in your [Config as Code file](/reference/config-as-code#multi-region-configuration).

By default, Railway deploys to your preferred region, you can change this in your [Account Settings](https://railway.com/workspace).

All regions provide the same experience, performance, and reliability you expect from Railway.

## Impact of Region Changes

The region of a service can be changed at any time, without any changes to your domain, private networking, etc.

There will be no downtime when changing the region of a service, except if it has a volume attached to it (see below).

### Volumes

Volumes follow the region of the service to which they are attached.

If you change the region of a service with an attached volume, the volume will need to be migrated to the new region.

<Image
    quality={100}
    src="https://res.cloudinary.com/railway/image/upload/v1695660986/docs/volume_migrate_modal.png"
    alt="Volume"
    width={669}
    height={678}
/>

Note that this migration can take a while depending on the size of the volume, and will cause downtime of your service during that time.

<Image
    quality={100}
    src="https://res.cloudinary.com/railway/image/upload/v1695661106/docs/volume_migration.png"
    alt="Volume"
    width={732}
    height={483}
/>

The same is true if you attach a detached volume to a service in a different region. It will need to be migrated to the new region, which can take a while and cause downtime.
