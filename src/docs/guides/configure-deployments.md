---
title: Configure Deployments
---

[Deployments](/reference/deployments) are attempts to build and deliver your [service](/reference/services).

|||
|-|-|
| **Deployment Controls** | A Project is like an application stack, or a system of related components.  Everything needed by the components in the system are encapsulated in a Project, including environments and variable.                                                                                   |
| **Regional Deployments** | Services are components that make up the Project. Services can be anything from frontend web servers, backend APIs, message queues, databases, etc.  Services can be configured with [variables](/guides/use-variables), start and run commands, restart policies, [volume mounts](/guides/use-volumes), etc. |
| **Healthchecks** | Variable management is an essential part of development operations.  Variables can be scoped to both Services and Environments in Railway.                                                                                                            |
| **Monorepos** | Environments exist within a Project and are useful for maintaining separation between Production and Development environments.                                                                                                           |
| **Scheduled Jobs**          | The CLI is handy for local development, used for things like running services locally using variables stored in Railway, deploying local code repositories, etc.                                                                                                                    |
| **Usage Optimization**          | The CLI is handy for local development, used for things like running services locally using variables stored in Railway, deploying local code repositories, etc.                                                                                                                    |
|||

Explore the guides in this section to learn about how to configure services for optimal deployments:
- [Set a Start Command](/how-to/set-a-start-command)
- [Deployment Actions](/how-to/deployment-actions)
- [Control Github Autodeploys](/how-to/control-github-autodeploys)
  - [Github Trigger Branch]()
  - [Enable Check Suites]()
- [Optimize Performance](/how-to/optimize-performance)
  - [Horizontal Scaling with Replicas](/how-to/optimize-performance#configure-horizontal-scaling)
  - [Configure Regions](/how-to/optimize-deployments#configure-regions)
- [Healthchecks and Restart Policy](/how-to/healthchecks-and-restart-policy)
  - [Healthcheck Endpoint]()
  - [Restart policy]()
- [Deploy a Monorepo](/how-to/deploy-a-monorepo)
- [Run a Cron Job](/how-to/run-a-cron-job)
- [Optimize Usage](/how-to/optimize-usage)
  - [App Sleeping]()
  - [Set Usage Limits]()