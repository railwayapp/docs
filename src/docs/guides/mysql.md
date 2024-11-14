---
title: Deploy MySQL
---

Railway offers two MySQL deployment options to accommodate different needs: a **Standalone Instance** and a **High Availability (HA) Cluster**.

- **Standalone Instance** - a single MySQL database server that is easy to manage; ideal for development environments, smaller projects, or services which are less sensitive to disruption.

- **High Availability (HA) Cluster** - intended for production workloads where uptime is critical. It consists of three MySQL nodes configured as an [InnoDB Cluster](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-innodb-cluster.html) as well as a [MySQL Router](https://dev.mysql.com/doc/mysql-router/8.0/en/mysql-router-general.html) service for connecting to the cluster.

## Standalone MySQL

Let's talk about how to deploy, connect, and manage the standalone instance.

### Deploy

You can deploy a standalone MySQL database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.com/template/mysql) from the template marketplace.

#### Deployed Service

Upon deployment, you will have a standalone MySQL service running in your project, deployed directly from the [mysql Docker image](https://hub.docker.com/_/mysql).

### Connect

Connect to MySQL from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the MySQL service:

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQL_URL`

#### Connecting Externally

It is possible to connect to MySQL externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the Deployment

Since the deployed container is pulled from the official MySQL image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/mysql).

## High Availability MySQL InnoDB Cluster

<Banner>
**Released August 2024** 

Be aware that this template has not been battle-tested like the standalone instance.  We are seeking feedback to improve the experience using this template, please provide your input [here](https://help.railway.com/templates/my-sql-inno-db-cluster-6afff85d).
</Banner>

We'll cover how to deploy, connect, and manage the [High Availability (HA) MySQL InnoDB Cluster](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-innodb-cluster.html) in this section.

### Deploy

You can deploy a HA MySQL InnoDB cluster via the [template in the marketplace](https://railway.com/template/ha-mysql).  

You will need a [Railway API token](/guides/public-api#creating-a-token) to deploy the service.  You will be prompted for your token upon deploying the template.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723603487/docs/databases/mysqlcluster_lumnfh.png"
alt="MySQL HA in the marketplace"
layout="responsive"
width={380} height={396} quality={100} />

#### Deployed Services

Upon deployment, a cluster of 3 MySQL nodes will be added to your project.  The nodes are deployed from a [custom Dockerfile](https://github.com/railwayapp-templates/mysql-cluster/tree/main/nodes).  The Dockerfile pulls the [mysql Docker image](https://hub.docker.com/_/mysql) and copies a `my.cnf` file into each container, configuring the necessary settings to prep the nodes to join the [InnoDB cluster](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-innodb-cluster.html).

An [initialization service](https://github.com/railwayapp-templates/mysql-cluster/tree/main/initService) is also deployed, which waits for the nodes to come online before initializing the cluster and joining the nodes.

Lastly, a [MySQL Router](https://dev.mysql.com/doc/mysql-router/8.0/en/mysql-router-general.html) service is also deployed, which serves as a proxy to the cluster. This router is built from the [MySQL Router image](https://hub.docker.com/r/mysql/mysql-router).

#### Multi-region Deployment

By default, each node is deployed to a different region (US West, US East, and EU West) for fault tolerance.

Since region selection is a Pro-only feature, this only applies to Pro users. If you deploy this template as a Hobby user, all nodes will deploy to US West.

### Connect

You should connect to the cluster via a proxy service which is aware of all of the cluster nodes.  We have included a [MySQL Router](https://dev.mysql.com/doc/mysql-router/8.0/en/mysql-router-general.html) service in the template deployment for this purpose.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723760996/docs/databases/CleanShot_2024-08-15_at_16.28.42_miy2og.gif"
alt="MySQL Router variables"
layout="responsive"
width={655} height={396} quality={100} />

Connect to the cluster via the environment variables provided in the MySQL Router:

- `MYSQL_ROUTER_HOST`
- `MYSQL_ROUTER_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB`

For an example, check out the [example app](https://github.com/railwayapp-templates/mysql-cluster/blob/main/exampleApps/python/main.py#L19) in the template's source repo.

#### Connecting Externally

It is possible to connect to the MySQL cluster externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying).

*Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.*

### Modify the Deployment

Since the containers deployed are based on MySQL images in Docker hub, you can reference the documentation for each, to understand how to customize them using environment variables.

- [MySQL](https://hub.docker.com/_/mysql)
- [MySQL Router](https://hub.docker.com/r/mysql/mysql-router)

We also encourage you to fork the [MySQL Cluster](https://github.com/railwayapp-templates/mysql-cluster/tree/main) repository to make changes not supported by environment variables.

## Backups and Observability

Especially for production environments, performing regular backups and monitoring the health of your database is essential.  Consider adding:

- **Backup solutions**: Automate regular backups to ensure data recovery in case of failure.  We suggest checking out this [Database S3 backups](https://railway.com/template/U_wjYd) template as an example.

- **Observability**: Implement monitoring for insights into performance and health of your databases.  If you're not already running an observability stack, check out these templates to help you get started building one:
    - [Prometheus](https://railway.com/template/KmJatA)
    - [Grafana](https://railway.com/template/anURAt)

## Additional Resources

While these templates are available for your convenience, they are considered unmanaged, meaning you have total control over their configuration and maintenance.

We *strongly encourage you* to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively. Here are some links to help you get started:

- [MySQL Documentation](https://dev.mysql.com/doc/relnotes/mysql/8.4/en/)
- [MySQL InnoDB Cluster Documentation](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-innodb-cluster.html)
- [MySQL Router Documentation](https://dev.mysql.com/doc/mysql-router/8.0/en/mysql-router-general.html)