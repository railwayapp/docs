---
title: MySQL
description: Learn how to deploy a MySQL database on Railway.
---

The Railway MySQL database template allows you to provision and connect to a MySQL database with zero configuration.

### Deploy

Add a MySQL database to your project via the `ctrl / cmd + k` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="responsive"
width={450} height={396} quality={100} />

You can also deploy it via the [template](https://railway.com/template/mysql) from the template marketplace.

#### Deployed Service

Upon deployment, you will have a MySQL service running in your project, deployed directly from the [mysql Docker image](https://hub.docker.com/_/mysql).

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

_Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy._

### Modify the Deployment

Since the deployed container is pulled from the official MySQL image in Docker hub, you can modify the deployment based on the [instructions in Docker hub](https://hub.docker.com/_/mysql).

## Backups and Observability

Especially for production environments, performing regular backups and monitoring the health of your database is essential. Consider adding:

- **Backups**: Automate regular backups to ensure data recovery in case of failure. We suggest checking out our native [Backups](/reference/backups) feature.

- **Observability**: Implement monitoring for insights into performance and health of your databases. If you're not already running an observability stack, check out these templates to help you get started building one:
  - [Prometheus](https://railway.com/template/KmJatA)
  - [Grafana](https://railway.com/template/anURAt)

## Additional Resources

While these templates are available for your convenience, they are considered unmanaged, meaning you have total control over their configuration and maintenance.

We _strongly encourage you_ to refer to the source documentation to gain deeper understanding of their functionality and how to use them effectively. Here are some links to help you get started:

- [MySQL Documentation](https://dev.mysql.com/doc/relnotes/mysql/8.4/en/)
- [MySQL InnoDB Cluster Documentation](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-innodb-cluster.html)
- [MySQL Router Documentation](https://dev.mysql.com/doc/mysql-router/8.0/en/mysql-router-general.html)
