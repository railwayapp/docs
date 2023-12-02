---
title: Migrating from Legacy Plugins to Database Services
---

We've introduced a more secure and flexible way to deploy databases on Railway.  The purpose of this guide is to provide an overview of why we are making these changes, what they mean for you, and how you can migrate.

## What is Changing?
### Legacy Plugins
In the early stages of Railway, we introduced "Plugins", a foundational part of our offering. They were databases deployed from Docker images with a fixed version, no data persistence, and no way to customize the database to your needs.

### Database Services
Some of our newest features - [Volumes](/reference/volumes), [Docker Image Deployments](/develop/services#docker-image), [TCP Proxy](https://docs.railway.app/deploy/exposing-your-app#tcp-proxying) - open the door for deploying databases as services, complete with data persistence, flexible configuration and management, and connectivity over the public Internet or [private network](/reference/private-networking).

In fact, we have [updated our official databases](https://blog.railway.app/p/launch-01-next-gen-databases) to deploy from templates, built as database services using all of the features above, utilizing the `latest` image versions available in Docker Hub.

## Why Migrate?

There are several key reasons why this migration is beneficial -

1. Data Security
2. Modern Architecture
3. Flexibility in configuration

## Migration Process

You have some options when it comes to migrating from a database plugin to a database service.

We wanted to make the process as easy as possible, so we built an automated process to migrate the data for you.  However, there are other options in case you would like a bit more control over the process.

### One-click Automated Migration

When you access the plugin panel from within your project canvas, you will see a prompt to migrate.

<Image src="https://res.cloudinary.com/railway/image/upload/v1698952078/docs/db-migration-guide/migrateBanner_hfgxbh.png"
alt="Plugin migration banner"
layout="fixed"
width={500} height={150} quality={80} />

Once you click the `Migrate` button, a modal will appear, detailing the steps that will be taken on your behalf, to migrate your data.  After acknowledgment, the data migration will begin -

<Image src="https://res.cloudinary.com/railway/image/upload/v1699418913/docs/db-migration-guide/nzln10tlvu00oe2teh3e.png"
alt="Plugin migration steps"
layout="fixed"
width={725} height={613} quality={80} />


1. **Deploy Database Service** - A new database service with an attached volume will be deployed.
2. **Stop Connected Services** - Any service within your project that is connected to the plugin via a [variable reference](/develop/variables#reference-variables) will be stopped, for the duration of the migration, to prevent data loss or corruption.

    *Note: You should ensure that any service(s) external to Railway which is writing to, or reading from, the database plugin is also stopped, or otherwise prevented from performing operations against the database, for the duration of the migration.*

3. **Data Transfer** - A migration service will be deployed that will execute a migration script.  The script will connect to your database plugin, create a dump of the data, and then transfer it to the new database service.  The scripts are open-source and can be reviewed here:
    - [PostgreSQL](https://github.com/railwayapp-templates/postgres-plugin-migration/blob/main/migrate.sh)
    - [MySQL](https://github.com/railwayapp-templates/mysql-plugin-migration/blob/main/migrate.sh)
    - [MongoDB](https://github.com/railwayapp-templates/mongo-plugin-migration/blob/main/migrate.sh)
    - [Redis](https://github.com/railwayapp-templates/redis-plugin-migration/blob/main/migrate.sh)

    Once the migration is complete, the migration service will be deleted.
4. **Update Service Variables** - [Variable references](/develop/variables#reference-variables) within services that point to the database plugin will be updated to the new database service

5. **Redeploy Connected Services** - Services previously connected to the database plugin will be redployed to apply the updated connection string and connect to the new database service.

_**NOTE: The legacy plugin will NOT be deleted automatically.**_

Once you have performed the necessary actions to ensure data consistency between the database plugin and the new database service, you should [delete](/develop/services#deleting-a-service) the database plugin from your project.

**If you have hard-coded the plugin `DATABASE_URL` anywhere, make sure to update it to point to the new database**

### Other Options

If you would prefer not to go through the migration flow as outlined above, there are other options for your migration path - 

1. **Template** - The template which is used in the automation can be deployed at-will.  Deploy this manually in your project if you prefer this method.
    - [PostgreSQL](https://railway.app/template/postgres-plugin-migration)
    - [MySQL](https://railway.app/template/mysql-plugin-migration)
    - [MongoDB](https://railway.app/template/mongo-plugin-migration)
    - [Redis](https://railway.app/template/redis-plugin-migration)
2. **DIY** - If our tools don't align with your needs, or you have a unique migration process in mind, you're welcome to execute your own strategy.  We always recommend ensuring you have a backup and a process for testing.

## FAQ

### What is the risk?

The migration process has been designed to minimize risks. By temporarily stopping services that reference the old plugin, we prevent data corruption. Also, we don't immediately delete the old plugin, allowing you to verify the migration.

### Will there be downtime?

Yes, there will be a brief downtime for services that reference the old plugin. However, this is essential to ensure a seamless and error-free migration.

### Do I have to perform the migration for every environment?

If you follow the one-click automated process, each environment will be handled for you.  If you perform the migration via another process, you will need to perform the migration within each environment.

### What is the deadline for migration?

While we encourage users to migrate as soon as possible to benefit from the enhanced features, you will have until **January 31st, 2024** to complete the migration.

### What if something goes wrong?

The old plugin remains intact until you verify the migration. If you encounter any issues, please reach out on our [Discord](https://discord.gg/railway) or contact our support team at [support@railway.app](mailto:support@railway.app).

## Conclusion

We're committed to providing the best solutions for your needs, and the new database services are a big step in that direction.  We're excited about the possibilities that this transition brings to your experience on Railway.

## Need Help?

If you run into any issues, or would like help with your migrations, we would be more than happy to answer your questions on our [Discord](https://discord.gg/railway) or over email at [support@railway.app](mailto:support@railway.app).