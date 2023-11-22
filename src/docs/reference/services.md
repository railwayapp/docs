---
title: Services
---

A Railway service is a deployment target for your application. There are two types of services:
- Persistent database services
- Ephemeral deployment services

Deployment services can be connected to a GitHub repo and automatically deployed on each commit. 

A template is a pre-configured group of services. A template can be used to start a project or to expand an existing project.

Each service keeps a log of [deployment attempts](/reference/deployments), [variables](/reference/variables), and [metrics](/reference/metrics). Source references, such as a GitHub repository URI, and relevant start commands are also stored in the service.

## Constraints

- Service names have a max length of 32 characters.