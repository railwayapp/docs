---
title: Managing Services
---

A Railway Service is a deployment target for your application.

## Creating A Service

Create a service by clicking the `New` button in the top right corner of your project canvas, or by typing new service from the **command palette**, accessible via `CMD + K` (Mac) or `Ctrl + K`(Windows).

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

### Deploying from a Github Repo

Define a GitHub repository as your service source by selecting `Connect Repo` and choosing the repository you'd like to deploy. 

When a new commit is pushed to the linked branch, Railway will automatically build and deploy the new code.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1688759920/docs/screenshot-2023-07-07-15.58.09_dmufxl.png"
alt="Screenshot of a GitHub deployment trigger"
layout="responsive"
width={708} height={245} quality={80} />

You must link your Railway account to Github, to enable Railway to connect to your Github repositories.  <a href="https://github.com/apps/railway-app/installations/new" target="_blank">You can configure the Railway App in Github by clicking this link.</a>

### Deploying from a Docker Image

To deploy from a docker image, specify the path of the image when prompted in the creation flow.

Railway can deploy images from <a href="https://hub.docker.com/" target="_blank">Docker Hub</a> or <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank">GitHub Container Registry</a>.  Example paths - 

Docker Hub:
- `bitnami/redis`

GitHub Container Registry:
- `ghcr.io/railwayapp-templates/postgres-ssl:latest`

## Deploying from a local directory

[Use the CLI](/guides/cli) to deploy a local directory to a service -

1. Create an Empty Service by choosing `Empty Service` during the service creation flow.
2. In a Terminal, navigate to the directory you would like to deploy.
3. Link to your Railway project using the `railway link` CLI command.
4. Deploy the directory using `railway up`.  The CLI will prompt you to choose a service target, be sure to choose the empty service you created.


## Deploying a Monorepo

For information on how to deploy a Monorepo click [here](/guides/monorepo).


## Monitoring

Logs, metrics, and usage information is available for services and projects.  Check out the [monitoring guides](/guides/monitoring) for information on how to track this data.

## Changing the Service Icon

Customize your project canvas for easier readability by changing the service icon.

1. Right click on the service
2. Choose `Update Info`
3. Choose `Icon`
4. Begin typing to see a list of available icons, pulled from our <a href="https://devicons.railway.app/" target="_blank">devicons</a>service.

You can also access this configuration from the command palette.

## Deleting a Service

Delete a service by opening the project's settings and scrolling to the danger section.
