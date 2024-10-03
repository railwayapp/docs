---
title: Deploy a Laravel App
---

Laravel is a PHP framework designed for web artisans who value simplicity and elegance in their code. It stands out for its clean and expressive syntax, and offers built-in tools to handle many common tasks found in modern web applications, making development smoother and more enjoyable.

This guide covers how to deploy a Laravel app on Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Deploy via Custom Scripts](#deploy-via-custom-scripts).

## One-Click Deploy from a Template

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/fWEWWf)

This template sets up a basic Laravel application along with a Postgres database on Railway. You can also choose from a <a href="https://railway.app/templates?q=laravel" target="_blank">variety of Laravel app templates</a> created by the community.

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** If you see a "500 Server Error" on your deployed URL, it’s likely because Laravel is missing the **APP_KEY** or other required environment variables. To fix this, go to the Railway dashboard and add the necessary environment variables—especially the **APP_KEY**—and then redeploy the application. You can generate a new **APP_KEY** using this [Laravel APP KEY generator](https://generate-random.org/laravel-key-generator).


## Deploy from a GitHub Repo

To deploy a Laravel app on Railway directly from GitHub, follow the steps below:

1. Fork the basic <a href="https://github.com/railwayapp-templates/laravel" target="_blank">Laravel GitHub repo</a>. 
    - If you already have a GitHub repo you want to deploy, you can skip this step.
2. Create a <a href="https://railway.app/new" target="_blank">New Project.</a>
3. Click **Deploy from GitHub repo**.
4. Select the `laravel` or your own GitHub repo.
    - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
5. Click **Add Variables**. 
    - Add all your app environment variables.
5. Click **Deploy**.

Once the deployment is successful, a Railway [service](/guides/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/guides/public-networking#railway-provided-domain).

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727885952/docs/quick-start/CleanShot_2024-10-02_at_17.18.04_2x_nn78ga.png"
alt="screenshot of the deployed Laravel service showing the Laravel home page"
layout="responsive"
width={2855} height={2109} quality={100} />

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. Clone the forked <a href="https://github.com/railwayapp-templates/laravel" target="_blank">Laravel GitHub repo</a> and `cd` into the directory. 
    - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
3. Run `railway init` within the app directory to create a new project. 
4. Run `railway up` to deploy.
    - The CLI will now scan, compress and upload our Laravel app files to Railway's backend for deployment.

## Deploy via Custom Scripts

This setup deploys your Laravel app on Railway, ensuring that your database, scheduled tasks (crons), and queue workers are all fully operational.

The deployment structure follows a "majestic monolith" architecture, where the entire Laravel app is managed as a single codebase but split into four separate services on Railway:
- **App Service**: Handles HTTP requests and user interactions.
- **Cron Service**: Manages scheduled tasks (e.g., sending emails or running reports).
- **Worker Service**: Processes background jobs from the queue.
- **Database Service**: Stores and retrieves your application's data.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727910244/docs/quick-start/deploy%20architecture.png"
alt="screenshot of the deploy architecture of the Laravel app"
layout="responsive"
width={3118} height={1776} quality={100} />
_My Majestic Monolith Laravel app_

Please follow these steps:

1. Create three bash script files in the root directory of your Laravel app: `run-app.sh`, `run-worker.sh`, and `run-cron.sh`. 

    After creating the files, make them executable by running `chmod +x` on each file in the terminal. This will allow your scripts to run properly when executed.
    - Add the content below to the `run-app.sh` file:
        ```bash
            #!/bin/bash

            # Make sure this file has executable permissions, run `chmod +x run-app.sh`

            # Build assets using NPM
            npm run build

            # Clear cache
            php artisan optimize:clear

            # Cache the various components of the Laravel application
            php artisan config:cache
            php artisan event:cache
            php artisan route:cache
            php artisan view:cache

            # Run any database migrations
            php artisan migrate --force
        ```
    -  Add the content below to the `run-worker.sh` file:
        ```bash
            #!/usr/bin/env bash

            # Make sure this file has executable permissions, run `chmod +x run-worker.sh`

            # Run the queue worker
            php artisan queue:work     
        ```
    -  Add the content below to the `run-cron.sh` file:
        ```bash
            #!/usr/bin/env bash

            # Make sure this file has executable permissions, run `chmod +x run-cron.sh`

            # Runs the Laravel scheduler every minute
            while [ true ]
                do
                    echo "Running the scheduler..."
                    php artisan schedule:run --verbose --no-interaction &
                    sleep 60
                done
        ```
2. Create a Database service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas.</a>
     - Click on **Deploy**.
3. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas.</a>
    -  Name this service **App service**, and click on **Settings** to configure it.
    - Connect your GitHub repo to the  **Source Repo** in the **Source** section.
    - Add `sh ./run-app.sh` to the **Custom Build Command** in the **Build** section.
    - Head back to the top of the service and click on **Variables**.
    - Add all the environment variables.
    - Click **Deploy**.
4. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>. 
    - Name this service **cron service**, and click on **Settings**.
    - Connect your GitHub repo to the  **Source Repo** in the **Source** section.
    - Add `sh ./run-cron.sh` to the **Custom Start Command** in the **Deploy** section.
    - Head back to the top of the service and click on **Variables**.
    - Add all the environment variables.
    - Click **Deploy**.
5. Create a new service again. 
    - Name this service **worker service**, and click on **Settings**.
    - Connect your GitHub repo to the  **Source Repo** in the **Source** section.
    - Add `sh ./run-worker.sh` to the **Custom Start Command** in the **Deploy** section.
    - Head back to the top of the service and click on **Variables**.
    - Add all the environment variables.
    - Click **Deploy**.


At this point, you should have all three services connected to the Database service:

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727910244/docs/quick-start/deploy%20architecture.png"
alt="screenshot of the deploy architecture of the Laravel app"
layout="responsive"
width={3118} height={1776} quality={100} />

- **Cron Service**: This service should have the Laravel Scheduler running to handle scheduled tasks.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727912479/docs/quick-start/CleanShot_2024-10-03_at_00.40.40_2x_cwgazh.png"
alt="screenshot of the cron service of the Laravel app"
layout="responsive"
width={2165} height={1873} quality={100} />

- **Worker Service**: This service should be actively running and ready to process jobs from the queue.
- **App Service**: This service should also be running and is the only one that should have a public domain, allowing users to access your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727885952/docs/quick-start/CleanShot_2024-10-02_at_17.18.04_2x_nn78ga.png"
alt="screenshot of the deployed Laravel service showing the Laravel home page"
layout="responsive"
width={2855} height={2109} quality={100} />
_App service_


**Note:** There is a [community template](https://railway.app/template/Gkzn4k) available that demonstrates this deployment approach. You can easily deploy this template and then connect it to your own GitHub repository for your application.


## Can I deploy with Laravel Sail?
You may be thinking about using [Laravel Sail](https://laravel.com/docs/11.x/sail), which is the standard approach for deploying Laravel applications with Docker. At its core, Sail relies on a `docker-compose.yml` file to manage the environment. 

However, it's important to note that Railway currently does not support Docker Compose.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)

