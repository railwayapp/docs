---
title: Databases
---

Railway's platform primitives enable you to build any type of database service your system requires.

## How Databases work in Railway

Whether you deploy from a template or build your own database service, the functionality is simple.  

### Docker Images
We deploy a Docker image containing the necessary binaries to run the database service.

We can build your Docker image based on a [Dockerfile](/reference/dockerfiles) that you create, or we can deploy an image directly from <a href="https://hub.docker.com/" target="_blank">Docker Hub</a> or <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank">GitHub Container Registry</a>.  

### Volumes

If you mount a [volume](/reference/volumes) to your service, your database will be persisted between redeploys of the Docker image.  

### TCP Proxy

If you need to be able to access your database over the public internet, you can use [TCP Proxy](/reference/tcp-proxy) to proxy the traffic to the apporpriate port.

## Railway-provided Database Templates

Railway provides four, one-click templates that provision some of the most popular databases out there, which deploy with a helpful [Database View](/how-to/use-the-database-view).  

Explore the guides in the How To section for information on how to use these templates: 
- [PostgreSQL](/how-to/postgresql)
- [MySQL](/how-to/mysql)
- [MongoDB](/how-to/mongodb)
- [Redis](/how-to/redis)


## Template Marketplace

Our <a href="https://railway.app/templates" target="_blank">Template Marketplace</a> includes many solutions for database services.

Here are some suggestions to check out - 
- [Minio](https://railway.app/template/SMKOEA)
- [ClickHouse](https://railway.app/template/clickhouse)
- [Dragonfly](https://railway.app/template/dragonfly)
- [Chroma](https://railway.app/template/tifygm)

