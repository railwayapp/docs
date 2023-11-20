---
title: Build a Database Service
---

With these primitive platform features, you can build any type of service your system requires, including database services - 

## Docker Images & Dockerfiles

Railway supports deploying services directly from a Docker image hosted in [Docker Hub](https://hub.docker.com/) or
[GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688760102/docs/screenshot-2023-07-07-15.59.59_kxo5fa.png"
alt="Screenshot of a Docker image source"
layout="responsive"
width={699} height={168} quality={80} />

We can also detect and deploy from a [Dockerfile](/deploy/dockerfiles) that exists in your source code.

## Volumes

Railway makes it easy to attach a [volume](/how-to/use-volumes) to any service, to keep your data safe between deployments.

## TCP Proxy

Since databases don't usually communicate over HTTP, you may find the [TCP Proxy](/how-to/exposing-your-app#tcp-proxying) feature helpful for exposing your database service to the Internet.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694217808/docs/screenshot-2023-09-08-20.02.55_hhxn0a.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={700} height={225} quality={100} />

## Template Marketplace

Need inspiration?  Our [Template Marketplace](https://railway.app/templates) already includes solutions for many different database services.  You might even find find a template for the database you need!

Here are some suggestions to check out - 
- [Minio](https://railway.app/template/SMKOEA)
- [ClickHouse](https://railway.app/template/clickhouse)
- [Dragonfly](https://railway.app/template/dragonfly)
- [Chroma](https://railway.app/template/tifygm)