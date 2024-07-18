---
title: MySQL
---

The Railway MySQL database service allows you to provision and connect to a
MySQL database with zero configuration.

## Deploy

You can add a MySQL database via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="intrinsic"
width={450} height={396} quality={100} />

## Connect

Connect to MySQL from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the MySQL service:

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQL_URL`

#### Connecting externally

It is possible to connect to MySQL externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

Keep in mind that you will be billed for [Network Egress](/reference/pricing/plans#resource-usage-pricing) when using the TCP Proxy.

## Image

The MySQL database service uses the [mysql:latest](https://hub.docker.com/_/mysql) docker image.

## Changing System Variables

Tailor your MySQL service to your needs by adding any variables relevant to the [mysql](https://hub.docker.com/_/mysql) image.
