---
title: Deployments
description: Learn how to configure deployments on Railway.
---

Let's configure your deployments!

Now that you understand how to tailor your builds if necessary, let's get into the various ways you can control how your services are deployed and run.  Like builds, when you deploy a service, Railway will apply some defaults that can easily be overridden when necessary.

#### Deployment Concepts

|||
|-|-|
| **Deployment Controls** | Deployments are attempts to build and run your code.  Railway provides controls for changing the default run behavior, and for acting on existing deployments, for example rolling back to a previous deployment or restarting a service.                                                                                    |
| **Auto Deploys**          | If you have deployed from your GitHub repo, we will automatically build and deploy your code when you push a change to the connected branch.                                                                                                                    |
| **Regional Deployments** | By default, services are deployed to your [preferred region](https://railway.com/workspace). To optimize performance for your users in other parts of the world, we offer regional deployments. |
| **Scaling** | Scaling your application has never been so easy.  Vertical auto-scaling is performed without any configuration on your part.  Horizontal scaling is made possible with replicas. |
| **Healthchecks** | Healthchecks can be configured on your services to control when a new deployment is deemed healthy and ready for connections.                                                                                                            |
| **Monorepos** | Using a monorepo?  We do too!  To deploy your monorepo, you'll need to let us know how your repo is structured using the various configuration options.                                                                                                           |
| **Scheduled Jobs**          | Scheduled Jobs, or Cron Jobs, are pieces of code that are executed on a schedule.  You'll find it's easy to schedule a job to run, using our Cron Schedule configuration.                                                                                                                     |
| **Usage Optimization**          | Give yourself some peace of mind by using the various controls to tighten your usage.  You can set Usage Limits and configure your deployments to auto-sleep when inactive.                                                                                                                    |
|||

Dive into the next pages to learn how to configure these items.
