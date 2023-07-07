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

Deployment services can be connected to a GitHub repo and automatically deployed on each commit. A template is a pre-configured group of services. A template can be used to start a project or to expand an existing project.

Each service keeps a log of deployment attempts, [variables](/develop/variables), and [metrics](/diagnose/metrics). Source references, such as a GitHub repository URI, and relevant start commands are also saved. Clicking a service from the project canvas reveals the service view.

The service view allows you to edit the service name, view [deployments](/deploy/deployments), add [domains](/deploy/exposing-your-app), and shows the source of the code used to build your service.

## Creating A Service

Create a service by clicking the `New` button or opening the command palette and typing `New Service`. Pick a service to deploy. You can deploy a GitHub repo, provision a database, deploy a template, or create an empty service.

Anytime within a project, a new service can be created with the command palette.

Service names have a max length of 32 characters.

## Service Source

Services on Railway can be deployed from a GitHub repository, a local directory,
or a Docker image.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688760102/docs/screenshot-2023-07-07-16.00.54_e2r6mk.png"
alt="Screenshot of how to connect a service to a GitHub repo or Docker image"
layout="responsive"
width={709} height={190} quality={80} />

### GitHub

Services can be linked to a GitHub repository and branch. When a new commit is
pushed to the linked branch, Railway will automatically build and deploy the new
code.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688759920/docs/screenshot-2023-07-07-15.58.09_dmufxl.png"
alt="Screenshot of a GitHub deployment trigger"
layout="responsive"
width={708} height={245} quality={80} />

### CLI

You can deploy to a service with the `railway up` [command](/deploy/railway-up)
CLI command. This command will push your code to Railway which will then be
built and deployed.

### Docker Image

<PriorityBoardingBanner />

Services can be connected to a Docker image hosted on DockerHub or GHCR. Railway
will pull the image and deploy it to your service.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688760102/docs/screenshot-2023-07-07-15.59.59_kxo5fa.png"
alt="Screenshot of a Docker image source"
layout="responsive"
width={699} height={168} quality={80} />

## Monorepos

To deploy a monorepo on Railway, just create multiple services from the single GitHub monorepo. Add a service, choose the GitHub repo, then select the appropriate directory from the same repo as a different deployment target. You can deploy a monorepo within a project even if it's already deployed. This is useful when you have a monorepo with multiple services. Change the directory that Railway hosts from within the service settings page.

## Horizontal Scaling with Replicas

<Image src="https://res.cloudinary.com/railway/image/upload/v1684534939/docs/Export-replica_lrtrvs.png"
alt="Screenshot of replica setting"
layout="responsive"
width={800} height={317} quality={100} />

By default Railway will scale your service up to the the specified vCPU and Memory limits of your plan. You can scale horizontally by increasing the number of replicas for a service.

To change the number of replicas per deploy within your service, go to the service settings view and look for the "Replicas" field in the "Deploy" section. This will create multiple instances of your service and distribute traffic between them.

At the moment, Railway will round-robin requests to the replicas of your service. We plan to add more advanced load balancing strategies in the future. If you need more advanced load balancing, you can use an external load balancer such as Cloudflare to distribute traffic between your services.

**Note:** For now Railway does not support sticky sessions nor report the usage of the replicas within the metrics view.

## I Can't See My GitHub Repo?

You might need to configure the Railway app on your connected GitHub account. Please make sure that you have the requisite permissions for Railway's GitHub app. [You can configure the app by clicking this link.](https://github.com/apps/railway-app/installations/new)

## Database Services

Railway projects allow you to provision additional infrastructure on top of your existing services in the form of database services.

Railway currently offers the following database services.

- [PostgreSQL](/databases/postgresql)
- [MySQL](/databases/mysql)
- [MongoDB](/databases/mongodb)
- [Redis](/databases/redis)

You can add a database service via the Command + K menu or by clicking the New Service button on the Project Canvas.

### Connecting to Your Database

Railway provides connection strings and project variables that let your application connect to the database service.

You can access your database connection strings under the Connect tab in the service view.

If you run `railway run` locally, Railway will use your database variables to facilitate local development.

### Managing Database Data

Railway has a user interface for managing your database service's data. You can introspect the tables and the data of your chosen database service.

## Templates

Railway offers 60+ community-maintained templates. A template will clone a GitHub repo to your account and deploy the service(s) to a project. You can deploy a template from the Project Canvas unless there are variables to configure. To configure environment variables, you'll need to use the New Project button. Templates are useful for deploying common pieces of infrastructure — like a DataDog Agent.

## Empty Application Services

Empty application services don't reference a repo. They are useful for [CLI](/develop/cli) deploys, running ad-hoc processes, or storing environment variables for local development. Use the service's settings page to connect a repo at any time.

## Service Metrics

You can see services metrics under the [Metrics](/diagnose/metrics) tab when the service view is made visible.

## Deleting a Service

Delete a service by opening the project's settings and navigating to the danger page.

## Service Icons

Within the Command Palette, you can change the default service icon to something else. The list of available icons is pulled from our [devicons](https://devicons.railway.app/) service.
