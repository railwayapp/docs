---
title: MongoDB
---

The Railway MongoDB database service allows you to provision and connect to a
MongoDB database with zero configuration.

## Connect

There are two ways to connect to a MongoDB database:
- Add a [Reference Variable](/develop/variables#reference-variables) to a service
- Run `railway connect` to start a `mongodb` shell

The following variables can be referenced in your services:
- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`
 
Connect to your MongoDB container using your library of choice and supplying the
appropriate environment variables.

## Image

The MongoDB database service uses the [mongo:4.4](https://hub.docker.com/_/mongo) docker image.
