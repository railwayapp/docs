---
title: Build a Database Service
description: Learn how to build a database service on Railway.
---

Railway's platform primitives allow you to build any type of service your system requires, including database services.  This guide aims to guide you through the essential features to build your own database service.

For the purpose of this guide, we will use the official <a href="https://hub.docker.com/_/postgres" target="_blank">Postgres image</a> as an example.

## Service Source

As discussed in the [Services guide](/guides/services), a crucial step in creating a service is [defining a source](/guides/services#defining-a-deployment-source) from which to deploy.

To deploy the official Postgres image, we'll simply enter postgres into the Source Image field:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1701464166/docs/databases/CleanShot_2023-12-01_at_14.54.35_2x_aa5gwt.png"
alt="Screenshot of a Docker image source"
layout="responsive"
width={559} height={168} quality={80} />

## Volumes

Attach a [volume](/guides/volumes) to any service, to keep your data safe between deployments.  For the Postgres image, the default mount path is `/var/lib/postgresql/data`.

Just attach a volume to the service you created, at the mount path:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1701464411/docs/databases/mountpath_lajfam.png"
alt="Screenshot of a mount path"
layout="responsive"
width={519} height={168} quality={80} />

## Environment Variables

Now, all you need to do is configure the appropriate <a href="https://hub.docker.com/_/postgres#environment-variables:~:text=have%20found%20useful.-,Environment%20Variables,-The%20PostgreSQL%20image" target="_blank">environment variables</a> to let the Postgres image know how to run:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1701464670/docs/databases/envvars_aow79p.png"
alt="Screenshot of environment variables"
layout="responsive"
width={460} height={458} quality={80} />

Note the `DATABASE_URL` is configured with TCP Proxy variables, but you can also connect to the database service over the private network.  More information below.

## Connecting

### Private Network

To connect to your database service from other services in your project, you can use the [private network](/guides/private-networking).  For a postgres database service listening on port `5432`, you can use a connection string like this - 

```bash
postgresql://postgres:password@postgres.railway.internal:5432/railway
```

### TCP Proxy

If you'd like to expose the database over the public network, you'll need to set up a [TCP Proxy](/guides/public-networking#tcp-proxying), to proxy public traffic to the Postgres port `5432`:

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743194081/docs/tcp-proxy_edctub.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={1200} height={822} quality={100} />

## Conclusion

That's all it takes to spin up a Postgres service in Railway directly from the official Postgres image.  Hopefully this gives you enough direction to feel comfortable exploring other database images to deploy.  

Remember you can also deploy from a Dockerfile which would generally involve the same features and steps.  For an example of a Dockerfile that builds a custom image with the official Postgres image as base, take a look at <a href="https://github.com/railwayapp-templates/postgres-ssl" target="_blank">Railway's SSL-enabled Postgres image repo</a>.

### Template Marketplace

Need inspiration or looking for a specific database?  Our <a href="https://railway.com/templates" target="_blank">Template Marketplace</a> already includes solutions for many different database services.  You might even find a template for the database you need!

Here are some suggestions to check out - 
- <a href="https://railway.com/template/SMKOEA" target="_blank">Minio</a>
- <a href="https://railway.com/template/clickhouse" target="_blank">ClickHouse</a>
- <a href="https://railway.com/template/dragonfly" target="_blank">Dragonfly</a>
- <a href="https://railway.com/template/kbvIRV" target="_blank">Chroma</a>
- <a href="https://railway.com/template/elasticsearch" target="_blank">Elastic Search</a>
