---
title: Managing Services
description: A step by step guide to managing services on Railway.
---

A Railway Service is a deployment target for your application.

_As you create and manage your services, your changes will be collected in a set of [staged changes](/guides/staged-changes) that you must review and deploy, in order to apply them._

## Creating a Service

Create a service by clicking the `New` button in the top right corner of your project canvas, or by typing new service from the **command palette**, accessible via `CMD + K` (Mac) or `Ctrl + K`(Windows).

<Image src="https://res.cloudinary.com/railway/image/upload/v1656640995/docs/CleanShot_2022-06-30_at_18.17.31_cl0wlr.gif"
alt="GIF of the Services view"
layout="responsive"
width={370} height={300} quality={100} />

Services on Railway can be deployed from a GitHub repository, a local directory, or a Docker image.

## Accessing Service Settings

To access a service's settings, simply click on the service tile from your project canvas and go to the Settings tab.

## Defining a Deployment Source

If you've created an empty service, or would like to update the source for a deployed service, you can do so in the Service settings.

Click on the service, go to the Settings tab, and find the **Service Source** setting.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743121798/docs/deployment-source_sir4mo.png"
alt="Screenshot of how to connect a service to a GitHub repo or Docker image"
layout="responsive"
width={1200} height={421} quality={80} />

### Deploying From a GitHub Repo

Define a GitHub repository as your service source by selecting `Connect Repo` and choosing the repository you'd like to deploy.

When a new commit is pushed to the linked branch, Railway will automatically build and deploy the new code.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743121857/docs/github-repo_z8qkst.png"
alt="Screenshot of a GitHub deployment trigger"
layout="responsive"
width={1200} height={371} quality={80} />

You must link your Railway account to GitHub, to enable Railway to connect to your GitHub repositories. <a href="https://github.com/apps/railway-app/installations/new" target="_blank">You can configure the Railway App in GitHub by clicking this link.</a>

### Deploying a Public Docker Image

To deploy a public Docker image, specify the path of the image when prompted in the creation flow.

Railway can deploy images from <a href="https://hub.docker.com/" target="_blank">Docker Hub</a>, <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank">GitHub Container Registry</a>, <a href="https://quay.io/" target="_blank">Quay.io</a>, or <a href="https://docs.gitlab.com/ee/user/packages/container_registry/">GitLab Container Registry</a>. Example paths -

Docker Hub:

- `bitnami/redis`

GitHub Container Registry:

- `ghcr.io/railwayapp-templates/postgres-ssl:latest`

GitLab Container Registry:

- `registry.gitlab.com/gitlab-cicd15/django-project`

Microsoft Container Registry:

- `mcr.microsoft.com/dotnet/aspire-dashboard`

Quay.io:

- `quay.io/username/repo:tag`

### Updating Docker Images

Railway automatically monitors Docker images for new versions. When an update is available, an update button appears in your service settings. If your image tag specifies a version (e.g., `nginx:1.25.3`), updating will stage the new version tag. For tags without versions (e.g., `nginx:latest`), Railway redeploys the existing tag to pull the latest image digest.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1757369631/docs/screenshot-2025-09-08-18.09.17_rkxbqa.png"
alt="Screenshot of a Docker image update button"
layout="responsive"
width={681} height={282} quality={100} />

To enable automatic updates, configure the update settings in your service. You can specify an update schedule and maintenance window. Note that automatic updates trigger a redeployment, which may cause brief downtime (typically under 2 minutes) for services with attached volumes.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1757369630/docs/screenshot-2025-09-08-18.12.09_u2jiz4.png"
alt="Screenshot of a auto update configuration"
layout="responsive"
width={836} height={684} quality={100} />

### Deploying a Private Docker Image

If you'd like to deploy from a private Docker registry, ensure you're on the [Pro plan](pricing/plans#plans).

To deploy from a private Docker registry, specify the path of the image when prompted in the creation flow, as well as authentication credentials (username, password) to the registry.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743197249/docs/source-image_gn52ff.png"
alt="GIF of the Services view"
layout="intrinsic"
width={1200} height={746} quality={100} />

If deploying an image from <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank">GitHub Container Registry</a>, provide a <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry" target="_blank">personal access token (classic)</a>.

## Deploying From a Local Directory

[Use the CLI](/guides/cli) to deploy a local directory to a service -

1. Create an Empty Service by choosing `Empty Service` during the service creation flow.
2. In a Terminal, navigate to the directory you would like to deploy.
3. Link to your Railway project using the `railway link` CLI command.
4. Deploy the directory using `railway up`. The CLI will prompt you to choose a service target, be sure to choose the empty service you created.

## Deploying a Monorepo

For information on how to deploy a Monorepo click [here](/guides/monorepo).

## Monitoring

Logs, metrics, and usage information is available for services and projects. Check out the [monitoring guides](/guides/monitoring) for information on how to track this data.

## Changing the Service Icon

Customize your project canvas for easier readability by changing the service icon.

1. Right click on the service
2. Choose `Update Info`
3. Choose `Icon`
4. Begin typing to see a list of available icons, pulled from our <a href="https://devicons.railway.com/" target="_blank">devicons</a>service.

You can also access this configuration from the command palette.

## Approving a Deployment

If a member of a GitHub repo doesn't have a linked Railway account. Railway by default will not deploy any pushes to a connected GitHub branch within Railway.

Railway will then create a Deployment Approval within a Service prompting a user to determine if they want to deploy their commit or not.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724222405/CleanShot_2024-08-21_at_02.38.25_2x_vxurvb.png"
alt="screenshot of the deployment approval ui"
layout="responsive"
width={874} height={302} quality={100} />

Deploy the queued deployment by clicking the "Approve" button. You can dismiss the request by clicking the three dots menu and clicking "Reject".

## Storing Data

Every service has access to 10GB of ephemeral storage. If your service requires data to persist between deployments, or needs more than 10GB of storage, you should add a [volume](/guides/volumes).

## Deleting a Service

Delete a service by opening the project's settings and scrolling to the danger section.
