---
title: MySQL
---

Railway offers two MySQL deployment options to accommodate different needs: a **Standalone Instance** and a **High Availability (HA) Cluster**.

- **Standalone Instance** - a single MySQL database server that is easy to manage; ideal for development environments, smaller projects, or services which are less sensitive to disruption.

- **High Availability (HA) Cluster** - intended for production workloads where uptime is critical. It consists of three MySQL nodes configured as an InnoDB Cluster.

## Standalone MySQL

Let's talk about how to deploy, connect, and manage the standalone instance.

### Deploy

You can deploy a standalone MySQL database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.app/template/mysql) from the template marketplace.

#### Service Source

Upon deployment, you will have a standalone MySQL service running in your project, deployed directly from the [mysql Docker image](https://hub.docker.com/_/mysql).

### Connect

Connect to MySQL from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the MySQL service:

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQL_URL`

#### Connecting externally

It is possible to connect to MySQL externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the deployed container is pulled from the official MySQL image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/mysql).

## High Availability MySQL InnoDB Cluster

We'll cover how to deploy, connect, and manage the High Availability (HA) MySQL InnoDB Cluster in this section.

### Deploy

You can deploy a HA MySQL InnoDB cluster via the [template in the marketplace](https://railway.app/template/ha-mysql).

<Image src="https://res.cloudinary.com/railway/image/upload/v1723603487/docs/databases/mysqlcluster_lumnfh.png"
alt="MySQL HA in the marketplace"
layout="responsive"
width={380} height={396} quality={100} />

#### Service Source

Upon deployment, a cluster of 3 MySQL nodes will be added to your project.  The nodes are deployed from a [custom Dockerfile](https://github.com/railwayapp-templates/mysql-cluster/tree/main/nodes).  The Dockerfile pulls the [mysql Docker image](https://hub.docker.com/_/mysql) and copies a `my.cnf` file into each container, configuring the necessary settings to initialize the [InnoDB cluster](https://dev.mysql.com/doc/mysql-shell/8.4/en/mysql-innodb-cluster.html).

A MySQL Router service is also deployed, which serves as a proxy to the cluster. This router is built from the [MySQL Router image](https://hub.docker.com/r/mysql/mysql-router).

### Connect

You should connect to the cluster via the MySQL Router service, which is aware of all cluster nodes. We have included a simple [example app](https://github.com/railwayapp-templates/mysql-cluster/blob/main/exampleApps/python/main.py#L19) in the template's source repo, to demonstrate how to connect to MySQL Router.

Connect to the cluster via the environment variables provided in the MySQL Router:

- `MYSQL_ROUTER_HOST`
- `MYSQL_ROUTER_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB`

#### Connecting externally

It is possible to connect to the MySQL cluster externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying).  To do so, you can reference the `MYSQL_URL` environment variable available in the MySQL router service.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the deployment

Since the containers deployed are based on MySQL images in Docker hub, you can reference the documentation for each, to understand how to customize them using environment variables.

- [MySQL](https://hub.docker.com/_/mysql)
- [MySQL Router](https://hub.docker.com/r/mysql/mysql-router)

You can also fork the [MySQL Cluster](https://github.com/railwayapp-templates/mysql-cluster/tree/main) repository to make changes not supported by environment variables.

## Backups and Observability

Especially for production environments, performing regular backups and monitoring the health of your database is essential.  Consider adding:

- **Backup solutions**: Automate regular backups to ensure data recovery in case of failure.  We suggest checking out this [Database S3 backups](https://railway.app/template/U_wjYd) template as an example.

- **Observability**: Implement monitoring for insights into performance and health of your databases.  If you're not already running an observability stack, check out these templates to help you get started building one:
    - [Prometheus](https://railway.app/template/KmJatA)
    - [Grafana](https://railway.app/template/anURAt)

## Additional Resources

Add links to all of the docs here