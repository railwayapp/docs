---
title: MySQL
---

The Railway MySQL database service allows you to provision and connect to a
MySQL database with zero configuration.

## Connect

There are two ways to connect to a MySQL database:
- Add a [Reference Variable](/develop/variables#reference-variables) to a service
- Run `railway connect` to start a `mysql` shell

The following variables can be referenced in your services:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQL_URL`
- `MYSQL_PRIVATE_URL`

Connect to your MySQL container using your library of choice and supplying the
appropriate environment variables.

## Image

The MySQL database service uses the [mysql:latest](https://hub.docker.com/_/mysql) docker image.

## Changing System Variables

Tailor your MySQL service to your needs by adding any variables relevant to the [mysql](https://hub.docker.com/_/mysql) image.
