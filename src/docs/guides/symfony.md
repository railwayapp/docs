---
title: Deploy a Symfony App
description: Learn how to deploy a Symfony app to Railway with this step-by-step guide. It covers quick setup, database integration, cron and workers, one-click deploys and other deployment strategies.
---

[Symfony](https://symfony.com) is a PHP web framework composed of a set of decoupled and reusable components all working together in harmony to create websites and web applications.

This guide covers how to deploy a Symfony app to Railway in three ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).

Now, let's create a Symfony app!

## Create a Symfony App

**Note:** If you already have a Symfony app locally or on GitHub, you can skip this step and go straight to the [Deploy Symfony App to Railway](#deploy-the-symfony-app-to-railway).

To create a new Symfony app, ensure that you have [Composer](https://getcomposer.org/download/), [PHP](https://www.php.net/manual/en/install.php) and [Symfony](https://symfony.com/download) installed on your machine.

Run the following command in your terminal to create a new Symfony app:

```bash
symfony new --webapp apphelloworld
```

A new Symfony app will be provisioned for you in the `apphelloworld` directory.

### Run the Symfony App locally

To start your app, run:

```bash
symfony server:start
```

Once the app is running, open your browser and navigate to `http://localhost:8000` to view it in action.

## Deploy the Symfony App to Railway

Railway offers multiple ways to deploy your Symfony app, depending on your setup and preference.

## One-Click Deploy from a Template

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/4tnH_D)

This template sets up a starter Symfony application along with a Postgres database on Railway. You can also choose from a <a href="https://railway.com/templates?q=symfony" target="_blank">variety of Symfony app templates</a> created by the community.

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

## Deploy from the CLI

If you have your Symfony app locally, you can follow these steps:

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Symfony app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Add a Postgres Database Service**:
   - Run `railway add -d postgres`.
   - Hit **Enter** to add it to your project.
   - A database service will be added to your Railway project.
4. **Add a Service and Environment Variable**:
   - Run `railway add`.
   - Select `Empty Service` from the list of options.
   - In the `Enter a service name` prompt, enter `app-service`.
   - In the `Enter a variable` prompt, enter `DATABASE_URL=${{Postgres.DATABASE_URL}}`.
     - The value, `${{Postgres.DATABASE_URL}}`, references the URL of your new Postgres database. Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
   - Set the other environment variables: - `APP_ENV=prod` - This setting informs Symfony that the app is running in a production environment, optimizing it for performance. - `APP_SECRET=secret` where _secret_ is your generated app secret. - `COMPOSER_ALLOW_SUPERUSER="1"` - This is necessary to allow Composer to run as root, enabling the plugins that Symfony requires during installation. - `NIXPACKS_PHP_ROOT_DIR="/app/public"` - This ensures the Nginx configuration points to the correct [root directory path to serve the app](https://nixpacks.com/docs/providers/php).
     **Note:** Explore the [Railway CLI reference](/reference/cli-api#add) for a variety of options.
5. **Deploy the Application**:
   - Run `railway up` to deploy your app.
     - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
   - Once the deployment is complete, we can proceed to generate a domain for the app service.
6. **Set Up a Public URL**:
   - Run `railway domain` to generate a public URL for your app.
   - Visit the new URL to see your app live in action!

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731432139/docs/quick-start/symfony7_on_railway.png"
alt="screenshot of the deployed Symfony service"
layout="responsive"
width={2741} height={2193} quality={100} />

## Deploy from a GitHub Repo

To deploy a Symfony app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables and Provision a Database Service**:
   - Click **Add Variables**, but hold off on adding anything just yet. First, proceed with the next step.
   - Right-click on the Railway project canvas or click the **Create** button, then select **Database** and choose **Add PostgreSQL**.
     - This will create and deploy a new PostgreSQL database for your project.
   - Once the database is deployed, you can return to adding the necessary environment variables:
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `APP_ENV=prod` - This setting informs Symfony that the app is running in a production environment, optimizing it for performance.
     - `APP_SECRET=secret` where _secret_ is your generated app secret.
     - `COMPOSER_ALLOW_SUPERUSER="1"` - This is necessary to allow Composer to run as root, enabling the plugins that Symfony requires during installation.
     - `NIXPACKS_PHP_ROOT_DIR="/app/public"` - This ensures the Nginx configuration points to the correct [root directory path to serve the app](https://nixpacks.com/docs/providers/php).
4. **Deploy the App Service**:
   - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:

   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s a PHP app via Nixpacks](https://nixpacks.com/docs/providers/php).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

**Note:** The next step shows how to run your Symfony app along with a database, migrations, cron jobs, and workers.

## Set Up Database, Migrations, Crons and Workers

This setup deploys your Symfony app on Railway, ensuring that your database, scheduled tasks (crons), and queue workers are all fully operational.

The deployment structure follows a "majestic monolith" architecture, where the entire Symfony app is managed as a single codebase but split into four separate services on Railway:

- **App Service**: Handles HTTP requests and user interactions.
- **Cron Service**: Manages scheduled tasks (e.g., sending emails or running reports).
- **Worker Service**: Processes background jobs from the queue.
- **Database Service**: Stores and retrieves your application's data.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731432227/docs/quick-start/symfony_architecture.png"
alt="screenshot of the deploy architecture of the Symfony app"
layout="responsive"
width={3294} height={2048} quality={100} />
_My Majestic Monolith Symfony app_

Please follow these steps to get started:

1. Create three bash scripts in the root directory of your Symfony app: `run-app.sh`, `run-worker.sh`, and `run-cron.sh`.

   These scripts will contain the commands needed to deploy and run the app, worker, and cron services for your Symfony app on Railway.

   - Add the content below to the `run-app.sh` file:

     **Note:** This is required to start your app service after the build phase is complete. This script will execute the migrations and then start the Nginx server.

     ```bash
     #!/bin/bash
     # Make sure this file has executable permissions, run `chmod +x run-app.sh`
     # Run migrations, process the Nginx configuration template and start Nginx
     php bin/console doctrine:migrations:migrate --no-interaction && node /assets/scripts/prestart.mjs /assets/nginx.template.conf /nginx.conf && (php-fpm -y /assets/php-fpm.conf & nginx -c /nginx.conf)
     ```

   - Add the content below to the `run-worker.sh` file. This script will run the queue worker:

     ```bash
     #!/bin/bash
     # Make sure this file has executable permissions, run `chmod +x run-worker.sh`

     # This command runs the queue worker.
     php bin/console messenger:consume async --time-limit=3600 --memory-limit=128M &
     ```

   - Symfony doesn't natively include a scheduler. So, please install the [CronBundle](https://github.com/Cron/Symfony-Bundle) to define and run scheduled tasks. With that set up, add the content below to the `run-cron.sh` file:

     ```bash
     #!/bin/bash
     # Make sure this file has executable permissions, run `chmod +x run-cron.sh`

     # This block of code runs the scheduler every minute
     while [ true ]
         do
             echo "Running the scheduler..."
             php bin/console cron:start [--blocking] --no-interaction &
             sleep 60
         done
     ```

2. Create a Postgres Database service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas.</a>
   - Click on **Deploy**.
3. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas.</a>
   - Name the service **App Service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a> to configure it.
   - Connect your GitHub repo to the **Source Repo** in the **Source** section.
   - Add `chmod +x ./run-app.sh && sh ./run-app.sh` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.
   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.
   - Add all the necessary environment variables required for the Symfony app especially the ones listed below.
     - `APP_ENV=prod`
     - `APP_SECRET=secret` where _secret_ is your generated app secret.
     - `COMPOSER_ALLOW_SUPERUSER="1"` - This is necessary to allow Composer to run as root, enabling the plugins that Symfony requires during installation.
     - `NIXPACKS_PHP_ROOT_DIR="/app/public"` - This ensures the Nginx configuration points to the correct [root directory path to serve the app](https://nixpacks.com/docs/providers/php).
     - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (this references the URL of your Postgres database).
   - Click **Deploy**.
4. Create a new service on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>.
   - Name the service **Cron Service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a>.
   - Connect your GitHub repo to the **Source Repo** in the **Source** section.
   - Add `chmod +x ./run-cron.sh && sh ./run-cron.sh` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.
   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.
   - Add all the necessary environment variables especially those highlighted already in step 3.
   - Click **Deploy**.
5. Create a new service again on the <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>.
   - Name the service **Worker Service**, and click on <a href="/overview/the-basics#service-settings">**Settings**</a>.
   - Connect your GitHub repo to the **Source Repo** in the **Source** section.
   - Add `chmod +x ./run-worker.sh && sh ./run-worker.sh` to the <a href="/guides/start-command">**Custom Start Command**</a> in the **Deploy** section.
   - Head back to the top of the service and click on <a href="/overview/the-basics#service-variables">**Variables**</a>.
   - Add all the necessary environment variables especially those highlighted already in step 3.
   - Click **Deploy**.

At this point, you should have all three services deployed and connected to the Postgres Database service:

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731432227/docs/quick-start/symfony_architecture.png"
alt="screenshot of the deploy architecture of the Symfony app"
layout="responsive"
width={3294} height={2048} quality={100} />

- **Cron Service**: This service should run the cron bundler Scheduler to manage scheduled tasks.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731432857/docs/quick-start/cron_service.png"
alt="screenshot of the cron service of the Symfony app"
layout="responsive"
width={2547} height={2057} quality={100} />

- **Worker Service**: This service should be running and ready to process jobs from the queue.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731432862/docs/quick-start/worker_service_symfony.png"
alt="screenshot of the worker service of the Symfony app"
layout="responsive"
width={2545} height={2069} quality={100} />

- **App Service**: This service should be running and is the only one that should have a public domain, allowing users to access your application.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731432139/docs/quick-start/symfony7_on_railway.png"
alt="screenshot of the deployed Symfony service"
layout="responsive"
width={2741} height={2193} quality={100} />
_App service_

**Note:** There is a [community template](https://railway.com/template/4tnH_D) available that demonstrates this deployment approach. You can easily deploy this template and then connect it to your own GitHub repository for your application.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)
