---
title: Databases
---

Railway can support any type of Database service required for an application stack.

Databases can be deployed into a Railway project from a template, or by creating one through the service creation flow.

## How Database Services work in Railway

Below are the core concepts to understand when working with databases in Railway.

#### Services
Railway services are containers deployed from a Docker Image or code repository, usually with environment variables defined within the service configuration to control the behavior of the service.

#### Volumes
When deploying a database service, data can be persisted between rebuilds of the container by attaching a Volume to the service.

#### TCP Proxy
To access a database service from outside the private network of a particular project, proxy traffic to the exposed TCP port by enabling TCP Proxy on the service.

## Database Templates

Many database templates are available to Railway users, which ease the process of deploying a database service.

### Railway-provided Templates

Railway provides several templates to provision some of the most popular databases out there.  They also deploy with a helpful [Database View](/guides/use-the-database-view).  

Explore the guides in the How To section for information on how to use these templates - 
- [PostgreSQL](/guides/postgresql)
- [MySQL](/guides/mysql)
- [MongoDB](/guides/mongodb)
- [Redis](/guides/redis)


### Template Marketplace

Our <a href="https://railway.app/templates" target="_blank">Template Marketplace</a> includes many solutions for database services.

Here are some examples - 
- [Minio](https://railway.app/template/SMKOEA)
- [ClickHouse](https://railway.app/template/clickhouse)
- [Dragonfly](https://railway.app/template/dragonfly)
- [Chroma](https://railway.app/template/tifygm)

## Support

Explore the [Databases](/guides/databases) guide section for more information on how to get started using databases in Railway.