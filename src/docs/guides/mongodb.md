---
title: Deploy MongoDB
---

Railway offers two MongoDB deployment options to accommodate different needs: a **Standalone Instance** and a **High Availability (HA) Replica Set**.

- **Standalone Instance** - a single MongoDB database server that is easy to manage; ideal for development environments, smaller projects, or services that are less sensitive to disruption.

- **High Availability (HA) Replica Set** - intended for production workloads where uptime is critical. It consists of three MongoDB nodes configured as a [replica set](https://www.mongodb.com/docs/manual/replication/).

##  Standalone MongoDB

Let's talk about how to deploy, connect, and manage the standalone instance.

## Deploy

You can deploy a standalone MongoDB database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.app/template/mongodb) from the template marketplace.

#### Service Source

Upon deployment, you will have a standalone MongoDB service running in your project, deployed from the official [mongo](https://hub.docker.com/_/mongo) Docker image.

#### Custom Start Command

The MongoDB database service starts with the following [Start Command](/deploy/deployments#start-command) to enable communication over [Private Network](/reference/private-networking): `mongod --ipv6 --bind_ip ::,0.0.0.0`

## Connect

Connect to MongoDB from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the Mongo service:

- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`

#### Connecting externally

It is possible to connect to MongoDB externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the deployed container is pulled from the official from the official [MongoDB](https://hub.docker.com/_/mongo) image in Docker Hub, you can modify the deployment based on the [instructions in Docker Hub](https://hub.docker.com/_/mongo).

## High Availability MongoDB Replica Set

We'll cover how to deploy, connect, and manage the High Availability (HA) MongoDB Replica Set in this section.

### Deploy

You can deploy a HA MongoDB Replica Set via the [template in the marketplace](https://railway.app/template/ha-mongo).

<Image src="https://res.cloudinary.com/railway/image/upload/v1723605087/docs/databases/CleanShot_2024-08-13_at_21.10.13_2x_xs9enn.png"
alt="MongoDB HA in the marketplace"
layout="responsive"
width={405} height={396} quality={100} />

#### Service Source

Upon deployment, a cluster of 3 MongoDB nodes will be added to your project.  The nodes are deployed from a [custom Dockerfile](https://github.com/railwayapp-templates/mongo-replica-set/tree/main/nodes). The Dockerfile pulls the [mongo Docker image](https://hub.docker.com/_/mongo) and copies a script into the container.  The script is run when the container starts to generate the [keyfile](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/) for authentication.

An init service is deployed alongside the nodes to initiate the replica set once the nodes are up.  It should be deleted post-deploy.

### Connect

To connect to the MongoDB Replica Set, you should construct your MongoDB URI to include all nodes in the set. Unlike the PostgreSQL and MySQL clusters, there is no dedicated proxy service; instead, the MongoDB client will handle communication and failover between the nodes.

Each node exposes a `MONGO_PRIVATE_URL` environment variable that can be referenced to build your connection string.

#### Connecting externally

It is possible to connect to the MongoDB Replica Set externally (from outside of the [project](/develop/projects) in which it is deployed) by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying). To do so, you can reference the `MONGO_PUBLIC_URL` environment variable available in the nodes.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the containers deployed are based on the MongoDB image, you can reference the [documentation in Docker hub](https://hub.docker.com/_/mongo) to understand how to customize them using environment variables.

You can also fork the [Mongo Cluster](https://github.com/railwayapp-templates/mongo-replica-set) repository to make changes not supported by environment variables.

## Backup and Monitoring

Especially for production environments, performing regular backups and monitoring the health of your database is essential.  Consider adding:

- **Backup solutions**: Automate regular backups to ensure data recovery in case of failure.  We suggest checking out this [Database S3 backups](https://railway.app/template/U_wjYd) template as an example.

- **Observability**: Implement monitoring for insights into performance and health of your database.  Check out the tutorial which covers [setting up observability on a Mongo replica set](https://docs.railway.app/tutorials/deploy-and-monitor-mongo#4-set-up-monitoring-of-the-replica-set).

## Additional Resources

Add links to all of the docs here