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

You can also deploy it via the [template](https://railway.com/template/mongodb) from the template marketplace.

#### Deployed Service

Upon deployment, you will have a MongoDB service running in your project, deployed from the official [mongo](https://hub.docker.com/_/mongo) Docker image.

#### Custom Start Command

The MongoDB database service starts with the following [Start Command](/deploy/deployments#start-command) to enable communication over [Private Network](/reference/private-networking): `mongod --ipv6 --bind_ip ::,0.0.0.0  --setParameter diagnosticDataCollectionEnabled=false`

## Connect

Connect to MongoDB from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the Mongo service:

- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`

#### Connecting Externally

It is possible to connect to MongoDB externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the Deployment

Since the deployed container is pulled from the official [MongoDB](https://hub.docker.com/_/mongo) image in Docker Hub, you can modify the deployment based on the [instructions in Docker Hub](https://hub.docker.com/_/mongo).

## Backup and Monitoring

Especially for production environments, performing regular backups and monitoring the health of your database is essential. Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out our native [Backups](/reference/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your database.  Check out the tutorial which covers [setting up observability on a Mongo replica set](https://docs.railway.com/tutorials/deploy-and-monitor-mongo#4-set-up-monitoring-of-the-replica-set).

## Additional Resources

While these templates are available for your convenience, they are considered unmanaged, meaning you have total control over their configuration and maintenance.  

We *strongly encourage you* to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively.  Here are some links to help you get started:

- [Mongo Documentation](https://www.mongodb.com/docs/manual/introduction/)
- [Replication in Mongo](https://www.mongodb.com/docs/manual/replication/)