---
title: MongoDB
---

The Railway MongoDB database service allows you to provision and connect to a
MongoDB database with zero configuration.

## Deploy

You can add a MongoDB database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="intrinsic"
width={450} height={396} quality={100} />

## Connect

There are two ways to connect to a MongoDB database:
- privately via [Private Networking](/reference/private-networking)
- publicly via [TCP Proxy](/deploy/exposing-your-app#tcp-proxying)

When you deploy your MongoDB database, you will have access to two environment [variables](/develop/variables) that enable one of the two connection types (private or public).

As you create more services in your project, you can use [Reference Variables](/guides/variables#referencing-another-services-variable) to easily connect to the MongoDB database.

### Private Networking

To access your MongoDB database from another service within the same [project](/develop/projects), you can use the connection string stored in the `MONGO_PRIVATE_URL` environment variable.

This connection string uses [Private Networking](/reference/private-networking) to route communication to your service over the private network.

### TCP Proxy Connection

To access your MongoDB database over the public internet, you can use the connection string stored in the `DATABASE_URL` environment variable available in the service.

This connection string uses the [TCP Proxy connection](/deploy/exposing-your-app#tcp-proxying) to route communication to your service over the public internet.

You can also connect using mongo shell:
```bash
mongo mongodb://mongo:PASSWORD@PUBLIC_DOMAIN:PUBLIC_PORT
```

## Variables

The following variables are included in the MongoDB service and can be referenced in other services:
- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`
- `MONGO_PRIVATE_URL`
 
Connect to your MongoDB container using your library of choice and supplying the
appropriate environment variables.

## Image

The MongoDB database service uses the [mongo:latest](https://hub.docker.com/_/mongo) docker image.

## Custom Start Command

The MongoDB database service starts with the following [Start Command](/deploy/deployments#start-command) to enable communication over [Private Network](/reference/private-networking): `mongod --ipv6 --bind_ip ::,0.0.0.0`

## Changing System Variables

Tailor your MongoDB service to your needs by adding any variables relevant to the [mongo:latest](https://hub.docker.com/_/mongo) image.