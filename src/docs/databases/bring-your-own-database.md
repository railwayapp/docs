---
title: Bring Your Own Database
---

Our goal at Railway is to create a best-in-class developer experience by minimizing the time it takes to spin up and manage infrastructure.

One way we try to achieve this goal, is by providing four, one-click templates that provision some of the most popular databases out there ([PostgreSQL](/databases/postgresql), [MySQL](databases/mysql), [MongoDB](/databases/mongodb), & [Redis](/databases/redis)).

But what about the rest of the data storage options?

## Database Options

We know that there are numerous data storage options designed to accommodate various needs, and we are pleased to support any one that best suits your system.  Our platform primitives are built with flexibility in mind.

## Railway Primitives

With these primitive platform features, you can build any type of service your system requires, including database services - 

### Docker Images & Dockerfiles

Railway supports deploying services directly from a Docker image hosted in [Docker Hub](https://hub.docker.com/) or
[GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688760102/docs/screenshot-2023-07-07-15.59.59_kxo5fa.png"
alt="Screenshot of a Docker image source"
layout="responsive"
width={699} height={168} quality={80} />

We can also detect and deploy from a [Dockerfile](/deploy/dockerfiles) that exists in your source code.

### Volumes

Need to persist your data?  Of course you do.  Railway makes it easy to attach a [volume](/reference/volumes) to any service, to keep your data safe between deployments.

### TCP Proxy

Railway understands that database services don't usually communicate over HTTP.  That's why we've enabled [TCP Proxying](/deploy/exposing-your-app#tcp-proxying), to facilitate communication to your database services from anywhere.
<Image
src="https://res.cloudinary.com/railway/image/upload/v1694217808/docs/screenshot-2023-09-08-20.02.55_hhxn0a.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={700} height={225} quality={100} />