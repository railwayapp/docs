---
title: Services
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1656640995/docs/CleanShot_2022-06-30_at_18.17.31_cl0wlr.gif"
alt="GIF of the Services view"
layout="intrinsic"
width={800} height={646} quality={100} />

A railway service is a deployment target for your application. There are two types of services

- Persistent database services
- Ephemeral deployment services

Deployment services can be connected to a GitHub repo and automatically deployed on each commit. Templates are a pre-configured group of services that can be used as a starting off point for your project, or added to an existing project.

Services keep track of all current and historical deployment attempts as well as [variables](/develop/variables), [metrics](/diagnose/metrics), and application source like a GitHub repo and a start command. Clicking a service within the project canvas will bring up the service view on the side of your browser.

Within the service view, you can change the service name, view all [deployments](/deploy/deployments), add [domains](/deploy/exposing-your-app), and the code used to build your service.

## Creating A Service

Create a service by opening the command palette and typing `New Service`. You may also use the `New` button to open this exact flow. Afterwards, there is a prompt to pick a type of service to deploy. You can deploy a GitHub repo, provision a database, deploy a template, or create an empty service.

Anytime within a project, a new service can be created with the command palette.

## Deployment Services

Application services are services which tie to a GitHub repo as the source of deployment. Railway will clone into the root directory of the provided repo and initiate a [deployment](/deploy/deployments). We will then use a Cloud Native buildpack to automagically determine the application runtime and begin hosting it.

### Monorepo Services

You can deploy the same GitHub repo within a project even if it's already deployed. This is useful if you have a monorepo with multiple expected services. You can change the root directory that Railway hosts from within the service settings page.

## Replicas and Horizontal Scaling

<Image src="https://res.cloudinary.com/railway/image/upload/v1684534939/docs/Export-replica_lrtrvs.png"
alt="Screenshot of replica setting"
layout="responsive"
width={800} height={317} quality={100} />

By default Railway will scale up to the the specified vCPU and Memory limits of your plan. You can scale horizontally by increasing the number of replicas for a service. Within the service settings view, under "Deploy", you can change the number of replicas per deploy within your service.

This will create multiple instances of your service and distribute traffic between them.

At the moment, Railway will round-robin requests to the replicas of your service. We plan to add more advanced load balancing strategies in the future. If you need more advanced load balancing, you can use an external load balancer such as Cloudflare to distribute traffic between your services. **Note:** Railway does not support sticky sessions nor report the usage of the replicas within the metrics view for now.

## I Can't See My GitHub Repo?

You might need to configure the Railway app on your connected GitHub account. Please make sure that you have the requisite permissions for Railway's GitHub app. [You can configure the app by clicking this link.](https://github.com/apps/railway-app/installations/new)

## Database Services

Railway projects allow you to provision additional infrastructure on top of your existing services in the form of database services.

Railway currently offers the following databases.

- [PostgreSQL](/databases/postgresql)
- [MySQL](/databases/mysql)
- [MongoDB](/databases/mongodb)
- [Redis](/databases/redis)

You can add a plugin in the Command + K menu or by clicking the New Service button on the Project Canvas.

### Connecting to Your Database

Railway provides connection strings and project variables that let your application connect to the database service.

You can access your plugin's connection strings under the Connect tab in the service view.

Database variables can be referenced within a service by creating [Variable References](/develop/variables#variable-references).

### Managing Database Data

Railway provides a user interface into your plugin's data that allows you to inspect data in your plugin, such as database tables.

## Templates

Railway offers 60+ templates that are maintained by the community. A template will clone a GitHub repo to your connected account and deploy the service(s) to your project. You can deploy a template within the canvas provided there are no variables to configure, else you must use the new project flow. This is especially useful if you wish to deploy common pieces of infrastructure like a DataDog Agent.

## Empty Application Services

Empty services are services with no reference to a repo. They are perfect for [CLI](/develop/cli) deploys, running ad-hoc processes, or storing environment variables for local development. A repo can be connected to an empty service at any time on the service settings page.

## Service Metrics

You can see services metrics under the [Metrics] tab of the service view.

## Deleting a Service

You can delete your service by opening the project's settings and navigating to the danger page.

## Service Icons

Within the Command Palette, you can change the default service icon to something else. The list of available icons is pulled from our [devicons](https://devicons.railway.app/) service.
