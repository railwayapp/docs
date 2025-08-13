---
title: Deploy a Laravel App
description: Learn how to deploy a Laravel app to Railway with this step-by-step guide. It covers quick setup, private networking, database integration, one-click deploys and other deployment strategies.
---

[Laravel](https://laravel.com) is a PHP framework designed for web artisans who value simplicity and elegance in their code. It stands out for its clean and expressive syntax, and offers built-in tools to handle many common tasks found in modern web applications, making development smoother and more enjoyable.

This guide covers how to deploy a Laravel app on Railway in three ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).

## One-Click Deploy From a Template

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/fWEWWf)

This template sets up a basic Laravel application along with a Postgres database on Railway. You can also choose from a <a href="https://railway.com/templates?q=laravel" target="_blank">variety of Laravel app templates</a> created by the community.

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

## Deploy From a GitHub Repo

To deploy a Laravel app on GitHub to Railway, follow the steps below:

1. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>

2. Click **Deploy from GitHub repo**.

3. Select your GitHub repo.

   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.

4. Click **Add Variables**.

   - Add all your app environment variables.

5. Click **Deploy**.

Once the deployment is successful, a Railway [service](/guides/services) will be created for you. By default, this service will not be publicly accessible.

**Note:** Railway will automatically detect that it's a Laravel app during [deploy and run your app via php-fpm and nginx](https://nixpacks.com/docs/providers/php).

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/guides/public-networking#railway-provided-domain).

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727885952/docs/quick-start/CleanShot_2024-10-02_at_17.18.04_2x_nn78ga.png"
alt="screenshot of the deployed Laravel service showing the Laravel home page"
layout="responsive"
width={2855} height={2109} quality={100} />

**Note**: [Jump to the **Set Up Database, Migrations, Crons and Workers** section](#deploy-via-custom-scripts) to learn how to run your Laravel app along with a Postgres(or MySQL) database, cron jobs, and workers.

## Deploy From the CLI

If you have your Laravel app locally, you can follow these steps:

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the Railway CLI.</a>

2. Run `railway init` within your Laravel app root directory to create a new project on Railway.

   - Follow the steps in the prompt to give your project a name.

3. Run `railway up` to deploy.

   - The CLI will now scan, compress and upload our Laravel app files to Railway's backend for deployment.

   - Your terminal will display real-time logs as your app is being deployed on Railway.

4. Once the deployment is successful, click on **View logs** on the recent deployment on the dashboard.

   - You'll see that the server is running. However you'll also see logs prompting you to add your env variables.

5. Click on the <a href="/overview/the-basics#service-variables">**Variables**</a> section of your service on the Railway dashboard.

6. Click on **Raw Editor** and add all your app environment variables.

7. Click on **Deploy** to redeploy your app.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/guides/public-networking#railway-provided-domain).

**Note:** The next step shows how to run your Laravel app along with a database, migrations, cron jobs, and workers.

## Set Up Database, Migrations, Crons and Workers

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

Please follow these steps to get started:

1. Create four bash scripts in the root directory of your Laravel app: `build-app.sh`, `run-worker.sh`, and `run-cron.sh`.

   These scripts will contain the commands needed to deploy and run the app, worker, and cron services for your Laravel app on Railway.

   - Add the content below to the `build-app.sh` file:

     **Note:** You can add any additional commands to the script that you want to run each time your app service is built.

     ```bash
     #!/bin/bash
     # Make sure this file has executable permissions, run `chmod +x build-app.sh`

     # Exit the script if any command fails
     set -e

     # Build assets using NPM
     npm run build

     # Clear cache
     php artisan optimize:clear

     # Cache the various components of the Laravel application
     php artisan config:cache
     php artisan event:cache
     php artisan route:cache
     php artisan view:cache
     ```

   - Add the content below to the `run-worker.sh` file:

     ```bash
     #!/bin/bash
     # Make sure this file has executable permissions, run `chmod +x run-worker.sh`

     # This command runs the queue worker.
     # An alternative is to use the php artisan queue:listen command
     php artisan queue:work
     ```

   - Add the content below to the `run-cron.sh` file:

     ```bash
     #!/bin/bash
     # Make sure this file has executable permissions, run `chmod +x run-cron.sh`

     # This block of code runs the Laravel scheduler every minute
     while [ true ]
         do
             echo "Running the scheduler..."
             php artisan schedule:run --verbose --no-interaction &
             sleep 60
         done
     ```

2. Create a Postgres Database service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas.</a>

   - Click on **Deploy**.

3. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas.</a>

   - Name the service **App service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a> to configure it.

   - Connect your GitHub repo to the **Source Repo** in the **Source** section.

   - Add `chmod +x ./build-app.sh && sh ./build-app.sh` to the **Custom Build Command** in the <a href="/guides/build-configuration#customize-the-build-command">**Build**</a> section.

   - Add `php artisan migrate` to the <a href="/guides/pre-deploy-command">**Pre-Deploy Command**</a> in the **Deploy** section.

   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.

   - Add all the necessary environment variables required for the Laravel app especially the ones listed below.

     - `APP_KEY`: Set the value to what you get from the `php artisan key:generate` command.

     - `DB_CONNECTION`: Set the value to `pgsql`.

     - `QUEUE_CONNECTION`: Set the value to `database`.

     - `DB_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).

   - Click **Deploy**.

4. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>.

   - Name the service **cron service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a>.

   - Connect your GitHub repo to the **Source Repo** in the **Source** section.

   - Add `chmod +x ./run-cron.sh && sh ./run-cron.sh` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.

   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.

   - Add all the necessary environment variables especially those highlighted already in step 3.

   - Click **Deploy**.

5. Create a new service again on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>.

   - Name the service **worker service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a>.

   - Connect your GitHub repo to the **Source Repo** in the **Source** section.

   - Add `chmod +x ./run-worker.sh && sh ./run-worker.sh` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.

   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.

   - Add all the necessary environment variables especially those highlighted already in step 3.

   - Click **Deploy**.

At this point, you should have all three services deployed and connected to the Postgres Database service:

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727910244/docs/quick-start/deploy%20architecture.png"
alt="screenshot of the deploy architecture of the Laravel app"
layout="responsive"
width={3118} height={1776} quality={100} />

- **Cron Service**: This service should run the Laravel Scheduler to manage scheduled tasks.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727912479/docs/quick-start/CleanShot_2024-10-03_at_00.40.40_2x_cwgazh.png"
alt="screenshot of the cron service of the Laravel app"
layout="responsive"
width={2165} height={1873} quality={100} />

- **Worker Service**: This service should be running and ready to process jobs from the queue.

- **App Service**: This service should be running and is the only one that should have a public domain, allowing users to access your application.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1727885952/docs/quick-start/CleanShot_2024-10-02_at_17.18.04_2x_nn78ga.png"
alt="screenshot of the deployed Laravel service showing the Laravel home page"
layout="responsive"
width={2855} height={2109} quality={100} />
_App service_

**Note:** There is a [community template](https://railway.com/template/Gkzn4k) available that demonstrates this deployment approach. You can easily deploy this template and then connect it to your own GitHub repository for your application.

## Logging

Laravel, by default, writes logs to a directory on disk. However, on Railway’s ephemeral filesystem, this setup won’t persist logs.

To ensure logs and errors appear in Railway’s console or with `railway logs`, update the `LOG_CHANNEL` environment variable to `errorlog`. You can set it via the Railway dashboard or CLI as shown:

```bash
railway variables --set "LOG_CHANNEL=errorlog"
```

## Can I Deploy with Laravel Sail?

You may be thinking about using [Laravel Sail](https://laravel.com/docs/11.x/sail), which is the standard approach for deploying Laravel applications with Docker. At its core, Sail relies on a `docker-compose.yml` file to manage the environment.

However, it's important to note that Railway currently does not support Docker Compose.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)
