---
title: Create and Manage Services
---

A Railway Service is a deployment target for your application.

## Creating A Service

Create a service by clicking the `New` button in the top right corner of your project canvas, or by typing new service from the [command palette]().

<Image src="https://res.cloudinary.com/railway/image/upload/v1656640995/docs/CleanShot_2022-06-30_at_18.17.31_cl0wlr.gif"
alt="GIF of the Services view"
layout="intrinsic"
width={370} height={300} quality={100} />

Services on Railway can be deployed from a GitHub repository, a local directory, or a Docker image.


## Accessing Service Settings

To access a service's settings, simply click on the service tile from your project canvas and go to the Settings tab.

## Defining a deployment source

If you've created an empty service, or would like to update the source for a deployed service, you can do so in the Service settings.

Click on the service, go to the Settings tab, and find the **Service Source** setting.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688760102/docs/screenshot-2023-07-07-16.00.54_e2r6mk.png"
alt="Screenshot of how to connect a service to a GitHub repo or Docker image"
layout="responsive"
width={709} height={190} quality={80} />

## Deploying from a Docker Image

To deploy from a docker image, specify the path of the image when prompted in the creation flow.

Railway can deploy images from [Docker Hub](https://hub.docker.com/) or [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).  Example paths - 

Docker Hub:
- `bitnami/redis`

GitHub Container Registry:
- `ghcr.io/railwayapp-templates/postgres-ssl:latest`

## Deploying from a local directory

Use the CLI to deploy a local directory to a service -

1. Create an Empty Service by choosing `Empty Service` during the service creation flow.
2. In a Terminal, navigate to the directory you would like to deploy.
3. Link to your Railway project using the `railway link` CLI command.
4. Deploy the directory using `railway up`.  The CLI will prompt you to choose a service target, be sure to choose the empty service you created.


## Deploying a Monorepo

For information on how to deploy a Monorepo click [here](/how-to/deploy-a-monorepo).


## Monitoring Usage

Monitor a service's resource usage by navigating to the [Metrics](/diagnose/metrics) tab in your service panel.


## Deleting a Service

Delete a service by opening the project's settings and scrolling to the danger section.

## Changing the Service Icon

Customize your project canvas for easier readability by changing the service icon.

1. Right click on the service
2. Choose `Update Info`
3. Choose `Icon`
4. Begin typing to see a list of available icons, pulled from our [devicons](https://devicons.railway.app/) service.

You can also access this configuration from the command palette.

## FAQ

### I Can't See My GitHub Repo?

You might need to configure the Railway app on your connected GitHub account. Ensure that you have the requisite permissions for Railway's GitHub app. [You can configure the app by clicking this link.](https://github.com/apps/railway-app/installations/new)