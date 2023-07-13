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

Connect to your MySQL container using your library of choice and supplying the
appropriate environment variables.

## Image

The MySQL database service uses the [mysql:8](https://hub.docker.com/_/mysql) docker image.

## Changing System Variables

We do not support changing System Variables for MySQL at the moment.
