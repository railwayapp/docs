---
title: MongoDB
---

The Railway MongoDB database service allows you to provision and connect to a
MongoDB database with zero configuration.

## Deploy

Add a MongoDB database to your project via the `CMD + K` menu or by clicking the `+ New` button on the Project Canvas.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695934218/docs/databases/addDB_qxyctn.gif"
alt="GIF of the Adding Database"
layout="intrinsic"
width={450} height={396} quality={100} />

## Connect

Connect to MongoDB from another service in your project by [referencing the environment variables](/guides/variables#referencing-another-services-variable) made available in the Mongo service:

- `MONGOHOST`
- `MONGOPORT`
- `MONGOUSER`
- `MONGOPASSWORD`
- `MONGO_URL`

#### Connecting externally

It is possible to connect to MongoDB externally (from outside of the [project](/develop/projects) in which it is deployed), by using the [TCP Proxy](/deploy/exposing-your-app#tcp-proxying) which is enabled by default.

Keep in mind that you will be billed for egress when using the TCP Proxy.


## Image

The MongoDB database service uses the Docker official [mongo](https://hub.docker.com/_/mongo) image.

## Custom Start Command

The MongoDB database service starts with the following [Start Command](/deploy/deployments#start-command) to enable communication over [Private Network](/reference/private-networking): `mongod --ipv6 --bind_ip ::,0.0.0.0`

## Changing System Variables

Tailor your MongoDB service to your needs by adding any variables relevant to the [mongo](https://hub.docker.com/_/mongo) image.