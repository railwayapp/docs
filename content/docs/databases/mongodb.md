---
title: MongoDB
description: Learn how to deploy a MongoDB database on Railway.
---

The Railway MongoDB database template allows you to provision and connect to a MongoDB database with zero configuration.

## Deploy

Add a MongoDB database to your project via the `ctrl / cmd + k` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.com/deploy/mongo) from the template marketplace.

#### Deployed service

Upon deployment, you will have a MongoDB service running in your project, deployed from the official [mongo](https://hub.docker.com/_/mongo) Docker image.

#### Custom start command

The MongoDB database service starts with the following [Start Command](/deployments/start-command) to enable communication over [Private Network](/networking/private-networking): `mongod --ipv6 --bind_ip ::,0.0.0.0  --setParameter diagnosticDataCollectionEnabled=false`

## Connect

Connect to MongoDB from another service in your project by [referencing the environment variables](/variables#referencing-another-services-variable) made available in the Mongo service:

- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`

#### Connecting externally

It is possible to connect to MongoDB externally (from outside of the [project](/projects) in which it is deployed). Databases are deployed private by default — to expose one, open the service's **Settings → Networking** and add **Public Access**. This creates a [TCP Proxy](/networking/tcp-proxy) and populates a `MONGO_PUBLIC_URL` variable with the external connection string.

_Keep in mind that you will be billed for [Network Egress](/pricing/plans#resource-usage-pricing) when using the TCP Proxy._

### Modify the deployment

Since the deployed container is pulled from the official [MongoDB](https://hub.docker.com/_/mongo) image in Docker Hub, you can modify the deployment based on the [instructions in Docker Hub](https://hub.docker.com/_/mongo).

A modified or forked image is yours to run; see [database support scope](/databases#database-support-scope).

## High availability

A MongoDB service can be converted into a high-availability replica set with automatic failover from its **Database → Config → High Availability** section. See [Upgrading MongoDB to High Availability](/databases/mongo-ha).

## Backup and monitoring

Especially for production environments, performing regular backups and monitoring the health of your database is essential. Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out the native [Backups](/volumes/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your database.

## Additional resources

Railway maintains this template; [what Railway manages](/databases#what-railway-manages) lists which operations Railway handles and which are yours. Changes outside Railway's dashboard and CLI, such as to the image, start command or the template's variables, make the database yours to run; see [database support scope](/databases#database-support-scope).

We _strongly encourage you_ to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively. Here are some links to help you get started:

- [Mongo Documentation](https://www.mongodb.com/docs/manual/introduction/)
- [Replication in Mongo](https://www.mongodb.com/docs/manual/replication/)
