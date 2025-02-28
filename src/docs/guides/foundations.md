---
title: Foundations
description: Learn Railway's core components and fundamentals to build, deploy, and manage applications with confidence.
---

Welcome!  Let's get started building in Railway!

To start, you should be familiar with the core components and features of the platform. Therefore, the goal of this section is to guide you through the steps of laying a solid foundation on which to iterate.

#### Core Components
|||
|-|-|
| **Projects** | A Project is like an application stack, or a system of related components.  Everything needed by the components in the system are encapsulated in a Project, including environments and variables.                                                                                   |
| **Services** | Services are components that make up the Project - frontend web servers, backend APIs, message queues, databases, etc.  Services can be configured with [variables](/guides/variables), start and run commands, restart policies, [volume mounts](/guides/volumes), etc. |
| **Variables** | Variable management is an essential part of development operations.  Variables can be scoped to both Services and Environments in Railway.                                                                                                            |
| **Environments** | Environments exist within a Project and are useful for maintaining separation between Production and Development environments.                                                                                                           |
| **CLI**          | The CLI is handy for local development, used for things like running services locally using variables stored in Railway, deploying local code repositories, etc.                                                                                                                    |
|||

The next pages will go through how to create and manage your Projects, Services, Variables, and Environments.  They will also explain how to use Volumes to persist your data and how to install and use the CLI.

If you prefer a crash course, check out our [Quickstart guide](/quick-start)!
