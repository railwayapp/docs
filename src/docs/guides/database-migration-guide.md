---
title: Migrating from Legacy Plugins to Database Services
---

As we continue to deliver the best solutions for your needs, we've introduced a more robust and flexible way to deploy database services.  In an effort to sunset the legacy component that 

This guide aims to provide an overview of why we're making this transition, what it means for you, and how you can migrate.

## What is Changing?
### Legacy Plugins
In the early stages of Railway, we introduced `plugins`, a foundational part of our offering. They were databases deployed from Docker images with a fixed version, no data persistence, and no way to customize the database to your needs.

### Database Services
Some of our newest features - Volumes, Docker Image Deployments, TCP Proxy - open the door for deploying databases as services, complete with data persistence, flexible configuration and management, and connectivity from the external network.

## Why Migrate?

There are several primary reasons why this migration is beneficial -

1. Data Security
2. Modern Architecture
3. Flexibility in configuration

## Migration Process

Here is what will happen when you choose to migrate via our one-click migration process - 

  *screenshot of button?*

1. **One-click button** - When you access the plugin settings from within your project canvas, you will see a prompt to migrate.
2. **Modal** - Once you click on the button, a modal will appear, detailing the steps that will be taken on your behalf to migrate your data.
3. **Services Stop** - Any service within your project that is connected via a variable reference to the plugin will be stopped for the duration of the migration to prevent data loss or corruption.
4. **Database Service** - A new database service with an attached volume will be deployed.
5. **Data Transfer** - A separate service will be deployed that will execute a migration script.  The script will connect to your old plugin, create a dump of the data, and then transfer it to the new database service.
6. **Reference Update** - All variable references within other services that point to the old plugin will be updated to the new database service.

_**NOTE: Your old plugin will NOT be deleted automatically.  You should perform the necessary actions to ensure data consistency between the plugin and the new database service.**_

## Other Options

If you would prefer not to go through the migration flow as outline above, there are other options for your migration path - 

1. **Template** - The template which is used in the automation can be deployed at-will.  Deploy this manually in your project if you prefer this method.
2. **DIY** - If our tools don't align with your needs, or you have a unique migration process in mind, you're welcome to execute your own strategy.  We always recommend ensuring you have a backup and a process for testing.

## FAQ

### What is the risk?

The migration process has been designed to minimize risks. By temporarily stopping services that reference the old plugin, we prevent data corruption. Also, we don't immediately delete the old plugin, allowing you to verify the migration.

### Will there be downtime?

Yes, there will be a brief downtime for services that reference the old plugin. However, this is essential to ensure a seamless and error-free migration.

### What is the deadline for migration?

While we encourage users to migrate as soon as possible to benefit from the enhanced features, you will have ???? to complete the migration. After this, we may start sunsetting the old plugins.

### What if something goes wrong?

The old plugin remains intact until you verify the migration. If you encounter any issues, please contact our support team. We're here to assist you through every step.

## Conclusion

We're committed to providing you with the best tools and solutions for your needs. This migration is a significant step in that direction. While change can sometimes be daunting, rest assured that we've made the process as smooth and risk-free as possible. We appreciate your understanding and cooperation, and we're excited about the new possibilities this transition brings!

## Need Help?

If you run into any issues, or would like help with your migrations, we would be more than happy to answer your questions on our [Discord](https://discord.gg/railway) or over email at [team@railway.app](mailto:team@railway.app).