---
title: Migrate from Fly to Railway
description: Learn how to migrate your apps from Fly.io to Railway with this step-by-step guide. Fast, seamless, and hassle-free.
---

This guide walks you through the steps needed to seamlessly migrate your app and data from Fly.io to Railway. This process is straightforward and typically takes an average of **5 - 20 minutes**, depending on the size of your database and app complexity.

**TL;DR: Quick Migration Steps**

- Set up new app on Railway
- Export data from Fly.io and Import into Railway DB
- Deploy app (including auto-migration of app config & variables)

We provide everything Fly.io offers—and more! Check out our [comparison guide](/maturity/compare-to-fly) to see the differences and make an informed choice.

Why take our word for it? Experience the [Railway advantage yourself—give it a spin today!](https://railway.com/new)

## Migration Steps

In this guide, we will migrate a Go (Gin) app with a Postgres database from Fly.io to Railway. While we are using this app as an example, the process applies to any app, making it easy to transition your projects smoothly.

Here’s the link to the [app](https://github.com/unicodeveloper/gin).

### 1. Set Up a Railway Project

Navigate to [Railway's Project Creation Page](https://railway.com/new).

Select the **Deploy from GitHub Repo** option and connect your repository. If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.

![Railway new project](https://res.cloudinary.com/railway/image/upload/v1737143344/railwaynewproject_d4jv8c.png)

### 2. Deploy the App

Railway auto-imports all the build configurations, deploy commands, environment variables from your Fly.io app repo—no manual setup needed.

If the environment variables are missing, you can easily add them manually by following these steps:

### Adding Environment Variables on Railway:

1. Navigate to the **Variables** section of your service.
2. Switch to the **Raw Editor** and paste the copied environment variables.
3. Deploy the changes to apply the configuration.

![Variables imported automatically from fly.toml into Railway service](https://res.cloudinary.com/railway/image/upload/v1737143351/environmentvariables_q0xmyh.png)

Railway will deploy the Gin app as a service, as shown in the image above. You can monitor the service building and deploying in the [Project Canvas](https://docs.railway.com/guides/projects#project-canvas).

[**Serverless (App Sleep) activated**](https://docs.railway.com/reference/app-sleeping): In this [**Fly.io** app](https://github.com/unicodeveloper/gin/blob/main/fly.toml), the HTTP service is configured with **`auto_stop_machines='stop'`** and **`auto_start_machines=true`**, enabling automatic stopping and restarting of machines. On Railway import, we automatically enable this setting to effortlessly optimize resource usage.

![App sleep activated to optimize resource usage and spend](https://res.cloudinary.com/railway/image/upload/v1737143360/appsleep_cszmgf.png)

### 3. Database Migration

Railway supports a variety of databases, including **PostgreSQL**, **MongoDB**, **MySQL**, and **Redis**, allowing you to deploy the one that best fits your application needs. We also support many more via our [templates marketplace](https://railway.com/templates).

If you're migrating data to Railway from Fly, you can follow these steps:

1. Provision a new database by right clicking on the dashboard canvas and selecting Postgres.
2. Export your data from Flyio
   - Use `flyctl` to connect to your Flyio Postgres instance
     - `fly postgres connect -a <postgres-app-name>`
   - Use `pg_dump` to export your database
     - `pg_dump -Fc --no-acl --no-owner -h localhost -p 5432 -U <your-db-username> -d <your-db-name> -f flyio_db_backup.dump`
   - Use `pg_restore` to connect to your Railway database and restore the data from the dump.
     - `pg_restore -U <username> -h <host> -p <port> -W -F t -d <db_name> <dump_file_name>`

For detailed instructions, check out [this comprehensive tutorial on migrating PostgreSQL data between services.](https://blog.railway.com/p/postgre-backup)

Once the migration is complete, update the `DATABASE_URL` environment variable in your Railway app to point to the new PostgreSQL database and redeploy.

### 4. Replicas & Multi-region deployments

In this [Fly.io app](https://github.com/unicodeveloper/gin/blob/main/fly.toml), the setting **`min_machines_running=2`** ensures that at least **two instances** of the service remain active. On Railway import, we automatically translate this configuration to ensure that two **service instances** are running without any extra setup.

![Replicas](https://res.cloudinary.com/railway/image/upload/v1737143335/replicas_zwtuwr.png)

If your app needs to use multi-region deployments, you can leverage Railway’s [multi-region replicas](https://docs.railway.com/reference/scaling#multi-region-replicas).

Enable this in the **Settings** section of your Railway service to keep your app close to users worldwide.

**Note:** Multi-region replicas is currently available to Pro users.

And that’s it. That’s all you need to migrate your app from Flyio to Railway.
