---
title: MongoDB
---

The Railway MongoDB plugin allows you to provision and connect to a
MongoDB database with zero configuration.

## Connect

When you run `railway run` in a project with the MongoDB plugin installed, we inject several environment variables.

- MONGOHOST
- MONGOPORT
- MONGOUSER
- MONGOPASSWORD
- MONGO_URL

## Image

The MongoDB plugin uses the [mongo:4.4](https://hub.docker.com/_/mongo) docker image.
