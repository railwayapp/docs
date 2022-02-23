---
title: MySQL
---

The Railway MySQL database service allows you to provision and connect to a
MySQL database with zero configuration.

## Connect

When you run `railway run` in a project with the MySQL database service installed, we inject several environment variables.

- MYSQLHOST
- MYSQLPORT
- MYSQLUSER
- MYSQLPASSWORD
- MYSQLDATABASE
- MYSQL_URL

Many libraries will automatically look for the `MYSQL_URL` variable and use
it to connect to MySQL. You can also manually use these variables however you
like.

## Image

The MySQL database service uses the [mysql:8](https://hub.docker.com/_/mysql) docker image.
