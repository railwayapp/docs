---
title: Deploy a Laravel App
---

Laravel is a PHP framework designed for web artisans who value simplicity and elegance in their code. It stands out for its clean and expressive syntax, and offers built-in tools to handle many common tasks found in modern web applications, making development smoother and more enjoyable.

This guide covers how to deploy a Laravel app on Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

## One-Click Deploy from a Template

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/fWEWWf)

This template deploys a simple Laravel and Postgres Database service. Make sure to add your environment variables to Railway dashboard especially your **APP_KEY**. You'll get a 500 Server Error if Laravel can't read the **APP_KEY**.

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.app/templates?q=laravel" target="_blank">variety of Laravel app templates</a> created by the community.

## Deploy from a GitHub Repo

To deploy a Laravel app on Railway directly from GitHub, follow the steps below:

1. Fork the basic <a href="https://github.com/railwayapp-templates/laravel" target="_blank">Laravel GitHub repo</a>. 
    - If you already have a GitHub repo you want to deploy, you can skip this step.
2. Create a <a href="https://railway.app/new" target="_blank">New Project.</a>
3. Click **Deploy from GitHub repo**.
4. Select the `laravel` or your own GitHub repo.
    - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
5. Click **Deploy Now**.

Once the deployment is successful, a Railway [service](/guides/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/guides/public-networking#railway-provided-domain).

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727418781/docs/languages-and-frameworks/CleanShot_2024-09-27_at_07.31.37_2x_m3zaxx.png"
alt="screenshot of the deployed fastapi service showing a hello world API response on a browser"
layout="responsive"
width={2435} height={919} quality={100} />

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. Clone the forked <a href="https://github.com/railwayapp-templates/laravel" target="_blank">laravel GitHub repo</a> and `cd` into the directory. 
    - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
3. Run `railway init` within the app directory to create a new project. 
4. Run `railway up` to deploy.
    - The CLI will now scan, compress and upload our laravel app files to Railway's backend for deployment.

## Use a Dockerfile

**Note:** If you already have an app directory or repo on your machine that you want to deploy, you can skip the first two steps.

1. Clone the forked `laravel` repo and `cd` into the directory.
2. Create a `Dockerfile` in the `fastapi` or app's root directory.
3. Add the content below to the `Dockerfile`:
    ```bash
    # Use the Python 3 alpine official image
    # https://hub.docker.com/_/python
    FROM python:3-alpine

    # Create and change to the app directory.
    WORKDIR /app

    # Copy local code to the container image.
    COPY . .

    # Install project dependencies
    RUN pip install --no-cache-dir -r requirements.txt

    # Run the web service on container startup.
    CMD ["hypercorn", "main:app", "--bind", "::"]
    ```
4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
- [Running a Cron Job](/guides/cron-jobs)

