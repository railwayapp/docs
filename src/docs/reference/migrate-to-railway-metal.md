---
title: Migrate to Railway Metal
description: Learn how to move self-migrate your services over to Railway Metal
---

This page will describe in detail the migration process when a service moves to Railway Metal.

We will cover: how to initiate a migration, how to best prepare for a migration, and what mechanically happens when you initiate a migration of your services to Railway Metal.

## What is Railway Metal?

Railway Metal is the next generation of Railway's underlying infrastructure. It is built on hardware that we own and operate in datacenters around the world. You can get more information about Railway Metal on the parent [documentation page here.](/railway-metal)

We announced on December 26th that we would be moving users to Railway Metal over a 6 month migration timeline.

**We expect all user workloads to be on Railway Metal by July 4th, 2025.**

Railway is **currently** initating migrations of user workloads to Railway Metal regions at off-peak times per region.

As such, we advise our customers to move all of their workloads to Railway Metal to avoid Railway initiated downtime.

## What does a migration to Railway Metal entail?

A migration to Railway Metal is just like any deployment on Railway that would happen if you changed the region setting to a different value.

Railway is built region agnostically, meaning, the choice of region doesn't impact the availibility of products or features depending on the region. In doing so, user workloads can be deployed into different geographic regions at will.

A migration to Railway Metal is a simple region change.

For Stateless deployments, meaning, a deployment with no volume- there is no downtime. Stateless deployments are just landing into a new region.

For services with a volume attached, or Stateful deployments, there is a brief 30-45 second period of downtime as the volume re-mounts into the new deployment. *This is exactly the same as the existing cross region deployment functionality that exists in Railway today.*

## Initiating a migration

You can initate a migration by selecting a region in the service settings pane with any label that has: `Metal (New)`

After you select the region, you will get the Staged Change anchored modal at the center top position of the project canvas.

By pressing: "Deploy", you initiate a migration to Railway Metal.

### What happens when my service is migrating?

When you change the value of the region within the service settings page, Railway is told to deploy into that region when the environment applies the staged change. In Railway's system, we process a deployment request from our queue triggering a build.

Depending on if the service is Stateful or Stateless- we then initiate one of two bespoke migration processes.

**For Stateless:** Railway rebuilds your application onto our Metal region, and after the container image is built, then is landed on a running host in one of our datacenters.

**For Stateful:** Railway detects if a volume is mounted to your service, if a volume is detected, Railway initates a volume migration and holds the deployment until the volume is ready to be mounted within the new region. The process is as follows:

1. Railway initates a backup of the volume for internal and customer use.
2. Railway makes the backup of the volume accessible on the project canvas in the original region.
3. Railway then copies the volume into the new region.
4. (Optional) If there are backups in the volume, we also copy those backups into the new region. *Depending on the number and size of backups, this incurs a time penalty on the migration.*
5. Railway then confirms the integrity of data.
6. Railway attempts a build of the deployment after the volume is confirmed to be accessible in the new region.
7. Railway mounts to the volume in the new region after a successful build.

During the process, as of 2025/05/13 - Railway is able to report the transfer speed and progress of the volume migration to users.

### What happens to writes on the DB on migrations that I initated?

Because Railway is copying the volume primitive using the same primitive that we use for the volume backup feature, writes persist until we unmount the running deployment of the DB. As such, you don't need to plan for downtime of your database except for the 30 to 40 seconds when a deployment remounts into the database.

## Preparing for migration

For production applications on Railway, we advise customers to make sure your service has configuration to ensure it's online between deployments. Railway by default, attempts to only deploy a new instance of your service only when your application is live and healthy. However, there are a number of additional measures you can take to increase resilience.

Before initiating a migration we recommend that users configure the following:
- [Healthchecks](/reference/healthchecks)
- [Build and start commands](/reference/build-and-start-commands)
- [Volume Backups](/reference/backups)
- [Deployment overlap](/reference/variables#user-provided-configuration-variables)
  - Configured by setting `RAILWAY_DEPLOYMENT_OVERLAP_SECONDS` within the Railway service variable settings

We also advise users to make sure that:

- Data is being written to disk instead of the ephermeral container storage
  - If unsure, you can check by SSHing into the container via the Railway CLI and running `ls` on the mount point.
- On your DB, that the version is pinned to a major version instead of `:latest` on the image source
- You are able to backup and restore your data
- You test in a development environment before you migrate your production environment

Railway is not responsible for data loss that occurs on re-deployment for data on the container's ephermeral disk.

## Post-migration

The Railway team throughout this period is checking in with all customers to ensure:

- They recieve their Metal seat discount
- Application performance is within customer expectations
- A great experience migrating with adequate communication

### Rollback

If you encounter any issues with your service after a Railway initated upgrade, you can
rollback to the previous version by clicking `Rollback` button in the banner
above.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970652/docs/m4_rtxp2z.png"
alt="Automatic rollback"
layout="responsive"
width={1338} height={608} quality={80} />

### Manual rollback

To rollback manually, modify your service's `Settings -> Deploy -> Regions`
and select regions without the `Metal` tag.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736970930/docs/m3_kvwdgd.png"
alt="Manual rollback"
layout="responsive"
width={1140} height={560} quality={80} />

The Railway team during this period has doubled the amount of staffing around on-call and support to ensure this transition goes smoothly for our users.

Any issues, comments, and concerns- [raise a thread on Station.](https://station.railway.com)
