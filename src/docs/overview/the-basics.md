---
title: The Basics
---

This document outlines the core concepts of Railway, providing foundational knowledge of the basic building blocks you'll work with in the platform.

## Dashboard / Projects

Your main entrypoint to Railway where all your [projects](/overview/the-basics#projects) are shown in the order they where last opened.

Projects contain your [services](/overview/the-basics#services) and [environments](https://docs.railway.app/overview/the-basics#environments).

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144285/docs/the-basics/dashboard_ycmxnk.png"
alt="Screenshot of the Railway dashboard"
layout="responsive"
width={1305} height={735} quality={100} />

## Project / Project Canvas

A project represents a capsule for composing infrastructure in Railway.  You can think of a project as an application stack, a service group, or even a collection of service groups.

Services within a project are automatically joined to a [private network](/reference/private-networking) scoped to that project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144285/docs/the-basics/project_canvas_dxpzxe.png"
alt="Screenshot of the project canvas"
layout="responsive"
width={1365} height={765} quality={100} />

## Project Settings

This page contains all the project level settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144286/docs/the-basics/project_settings_ghwzih.png"
alt="Screenshot of the project settings page"
layout="responsive"
width={1365} height={765} quality={100} />

Some of the most commonly used project settings are -

- Transfer Project

    Transfer your project between [workspaces](/reference/teams#transferring-projects).

- [Environments](https://docs.railway.app/reference/environments)

    Manage various settings regarding environments.

- [Members](https://docs.railway.app/reference/project-members)

    Add or remove members to collaborate on your project.

- Danger

    Remove individual [services](/overview/the-basics#services) or delete the entire project.

## Services

A Railway service is a deployment target for your deployment source. Deployment sources can be [code repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) or [Docker Images](https://docs.docker.com/guides/docker-concepts/the-basics/what-is-an-image/). Once you create a service and choose a source, Railway will analyze the source, build a Docker image (if the source is a code repository), and deploy it to the service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144283/docs/the-basics/services_zuyl56.png"
alt="Screenshot of the project canvas with services highlighted"
layout="responsive"
width={1365} height={765} quality={100} />

Out of the box, your service is deployed with a set of default configurations which can be overridden as needed.

## Service Variables

Service [Variables](/reference/variables) provide a powerful way to manage configuration and secrets across services in Railway.

You can configure variables scoped to services or to projects to be shared amongst all services in a project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144282/docs/the-basics/service_variables_galkry.png"
alt="Screenshot of the service variables tab"
layout="responsive"
width={1365} height={765} quality={100} />

## Service Metrics

Service [Metrics](/reference/metrics) provide an essential overview of CPU, memory, and network usage for a given service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144286/docs/the-basics/service_metrics_dcbfms.png"
alt="Screenshot of the service metrics tab"
layout="responsive"
width={1365} height={770} quality={100} />

## Service Settings

This tab contains all the service level settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144286/docs/the-basics/service_metrics_dcbfms.png"
alt="Screenshot of the service settings tab"
layout="responsive"
width={1365} height={765} quality={100} />

Some of the most commonly used service settings are -

- [Source](https://docs.railway.app/reference/services#service-source)

    Here, you can configure the deployment source, which can be either a GitHub repository with a specific branch or an image with optional credentials.

- [Networking](/guides/public-networking#railway-provided-domain)

    Generate a Railway-provided domain or add your own custom one.

- Custom Build Command

    Here, you can configure a custom build command if you need to overwrite the default, only applicable with [Nixpacks](https://nixpacks.com/docs) based builds.

- Custom Start Command

    Here, you can configure a custom start command if you need to overwrite the default.


## Volumes

[Volumes](/reference/volumes) are a feature that allows services on Railway to [maintain persistent data](/guides/volumes).

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144284/docs/the-basics/volumes_yom2km.png"
alt="Screenshot of the project canvas with a volume highlighted"
layout="responsive"
width={1365} height={765} quality={100} />

## Volume Metrics

Volume Metrics show the amount of data stored in the volume and its maximum capacity.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144283/docs/the-basics/volume_metrics_thv60n.png"
alt="Screenshot of the volume metrics tab"
layout="responsive"
width={1365} height={826} quality={100} />

## Volume Settings

This tab contains all the volume centric settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1722144283/docs/the-basics/volume_settings_kirpdn.png"
alt="Screenshot of the volume settings tab"
layout="responsive"
width={1365} height={826} quality={100} />

Some of the most commonly used volume settings are -

- Mount path

    The absolute path where the volume will be mounted within the deployed service.

- Volume Size

    Displays the current volume capacity and offers the option to expand it if your plan permits.

- Wipe Volume

    This action wipes all data in the volume and then redeploys the connected service.

## What Next?

If you've read enough for now and are ready to get started, we suggest checking out either of these two resources next -

- [Quick Start guide](/quick-start) to deploy a To Do app from a [template](/reference/templates).

- [Guides section](/guides/foundations) to dive into how things work.

If you want to go deeper, click the Next button below to head to the next section - [Advanced Concepts](/overview/advanced-concepts).