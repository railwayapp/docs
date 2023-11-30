---
title: Configure Builds
---

Railway uses [Nixpacks](https://nixpacks.com) to build and deploy your code with
zero configuration.  You can find a complete list of languages we support out of the box [here](/reference/nixpacks#supported-languages).

|||
|-|-|
| **Nixpacks** | A Project is like an application stack, or a system of related components.  Everything needed by the components in the system are encapsulated in a Project, including environments and variable.                                                                                   |
| **Build Configuration** | Services are components that make up the Project. Services can be anything from frontend web servers, backend APIs, message queues, databases, etc.  Services can be configured with [variables](/guides/use-variables), start and run commands, restart policies, [volume mounts](/guides/use-volumes), etc. |
| **Dockerfiles** | Variable management is an essential part of development operations.  Variables can be scoped to both Services and Environments in Railway.                                                                                                            |
|||
