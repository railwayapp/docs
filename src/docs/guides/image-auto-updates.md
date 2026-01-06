---
title: Image Auto Updates
description: Learn how to automatically keep your Docker images up to date with scheduled maintenance windows.
---

When you deploy a service using a Docker image, Railway can automatically check for new versions and update your service during configurable maintenance windows. With this, you can keep your services up to date without manual intervention.

## Supported Registries

Image auto updates are only available for images hosted on the following registries:

- **Docker Hub** (`docker.io` or no domain prefix)
- **GitHub Container Registry** (`ghcr.io`)

Images from other registries (ECR, GCR, ACR, private registries, etc.) do not support auto updates.

## How It Works

Railway periodically checks the Docker registry for new versions of your configured image. When an update is available and your maintenance window is active, Railway will:

1. Create a backup of any attached volumes
2. Update the image in your service configuration to the `:latest` tag
3. Redeploy your service with the new image
4. Notify workspace admins of the update

## Configure Auto Updates

To enable automatic image updates:

1. Navigate to your service's **Settings** page
2. Under the **Source** section, select **Configure Auto Updates**
3. Choose your preferred update type
4. Choose a maintenance window

<video src="https://res.cloudinary.com/railway/video/upload/v1767630771/Schedule_jvpido.mp4" controls autoplay loop muted playsinline/>

## Maintenance Windows

Maintenance windows define when Railway is allowed to apply automatic updates. All schedules are evaluated in **UTC**.

| Window | Schedule |
| ------ | -------- |
| **Weekends** | Saturday and Sunday, all day |
| **Night** | 02:00 - 06:00 UTC daily |
| **Anytime** | Updates are applied immediately after detection |
| **Custom** | User-defined day and hour ranges |

Note that updates are applied after Railway detects new versions, not the moment they're published. To avoid overwhelming registries, detection results are cached for up to a few hours.

### Custom Schedules

Custom maintenance windows let you define days and hour ranges for updates. You can configure multiple windows to match your operational requirements.

<video src="https://res.cloudinary.com/railway/video/upload/v1767630800/CustomSchedule_xau6q1.mp4" controls autoplay loop muted playsinline />

## Safety Features

Railway includes several safety mechanisms to protect your services during automatic updates:

### Volume Backups

For Pro plan users, Railway automatically creates a backup of all volumes attached to the service before applying any update. These backups are named `Auto Update {image}` and can be used to restore data if needed.

### Skip Versions

If a specific version causes issues, you can skip it to prevent Railway from automatically updating to that version. Skipped versions will be excluded from future auto-update checks.

When prompted select the dropdown and click "Skip this version" 

![Skip version dialog](https://res.cloudinary.com/railway/image/upload/v1767663458/skipversion_v7dcux.png)

## Notifications

When an automatic update is applied, workspace admins receive a notification containing:

- Service and environment name
- Previous version
- New version
- Update type

To disable these notifications, create a custom rule setting "ServiceInstance Auto Updated" to "None" for a project.
