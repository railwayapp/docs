---
title: Services
---

A Railway service is a deployment target for your application. There are two types of services:
- Persistent database services
- Ephemeral deployment services

Deployment services can be connected to a GitHub repo and automatically deployed on each commit. 

A template is a pre-configured group of services. A template can be used to start a project or to expand an existing project.

Each service keeps a log of deployment attempts, [variables](/develop/variables), and [metrics](/diagnose/metrics). Source references, such as a GitHub repository URI, and relevant start commands are also stored in the service.

## Database Services

Railway projects allow you to provision additional infrastructure on top of your existing services in the form of database services.

You can provision [any database service](/how-to/bring-your-own-database) that your system requires.  Additionally, Railway offers one-click deployments for the following databases:
- [PostgreSQL](/how-to/postgresql)
- [MySQL](/how-to/mysql)
- [MongoDB](/how-to/mongodb)
- [Redis](/how-to/redis)


## Constraints

- Service names have a max length of 32 characters.