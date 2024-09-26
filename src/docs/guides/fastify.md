---
title: Deploy a Fastify App
---

Fastify is a high-performance, low-overhead web framework for Node.js, designed to deliver an exceptional developer experience.

This guide covers how to deploy a Fastify app on Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

## One-Click Deploy from a Template

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/ZZ50Bj)

You can also choose from a <a href="https://railway.app/templates?q=fastify" target="_blank">variety of Fastify app templates</a> created by the community.

## Deploy from a GitHub Repo

To deploy a Fastify app on Railway directly from GitHub, follow the steps below:

1. Fork the basic <a href="https://github.com/railwayapp-templates/fastify-hello-world" target="_blank">fastify-hello-world GitHub repo</a>.
2. Create a <a href="https://railway.app/new" target="_blank">New Project.</a>
3. Click **Deploy from GitHub repo**.
4. Select your `fastify-hello-world` repo.
    - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
5. Click **Deploy Now**.

Once your Fastify app is successfully deployed, a Railway service (also referred to as an app) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for your app, navigate to the **Networking** section in the **Settings** tab of your new service and click on **Generate Domain**.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727377689/docs/languages-and-frameworks/fastifyhelloworld_xbkrry.png"
alt="screenshot of new project menu with deploy from github selected"
layout="responsive"
width={2447} height={1029} quality={100} />

**Note:** Railway requires that Fastify's `.listen` method for the `host` be set to `0.0.0.0` or `::`. 
You can find this in the <a href="https://github.com/railwayapp-templates/fastify-hello-world/blob/main/index.js#L23">sample Fastify GitHub repo</a>. 

If you don’t set it correctly, you may encounter a 502 error page.



## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. Clone the forked <a href="https://github.com/railwayapp-templates/fastify-hello-world" target="_blank">fastify-hello-world GitHub repo</a> and `cd` into the directory.
3. Run `railway init` to create a new project. 
4. Run `railway up` to deploy.
    - The CLI will now scan, compress and upload our fastify app files to Railway's backend for deployment.

## Use a Dockerfile

1. Clone the forked `fastify-hello-world` repo and `cd` into the directory.
2. Create a `Dockerfile` in the `fastify-hello-world` root directory.
3. Add the content below to the `Dockerfile`:
    ```bash
    # Use the Node.js 18 alpine official image
    # https://hub.docker.com/_/node
    FROM node:18-alpine

    # Create and change to the app directory.
    WORKDIR /app

    # Copy local code to the container image.
    COPY . .

    # Install project dependencies
    RUN npm ci

    # Expose port 3000
    EXPOSE 3000

    # Run the web service on container startup.
    CMD ["npm", "start"]
    ```
4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a CDN using Amazon CloudFront to your Fastify app](/tutorials/add-a-cdn-using-cloudfront)
- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)

