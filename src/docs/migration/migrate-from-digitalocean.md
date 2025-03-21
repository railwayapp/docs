---
title: Migrate from DigitalOcean to Railway
description: Learn how to migrate your WordPress site from DigitalOcean to Railway with this step-by-step guide. Fast, seamless, and hassle-free.
---

This guide demonstrates how to migrate your WordPress site from DigitalOcean to Railway's modern cloud platform. Railway provides a streamlined deployment experience with powerful infrastructure features.

Railway offers:

- **Modern Infrastructure**: High-performance cloud platform

- **Quick Setup**: WordPress-ready deployment template

- **Database Support**: MariaDB database capabilities

- **Integrated SSL**: Automatic SSL certificate management

- **Scalable Infrastructure**: Easily handle traffic spikes and growth

- **Collaborative Features**: Team management, deployment protection, and role-based access

- **Priority Support**: Dedicated support for Railway users

## Migration Steps

Let's walk through migrating a WordPress site from DigitalOcean to Railway. This process involves backing up your existing installation, deploying WordPress on Railway and then restoring from your backup.

### 1. Backup your WordPress site

- Ensure you have a backup of your existing site. Use a WordPress backup plugin of your choice to export your site data.

    Make sure this backup includes, All WordPress files, All WordPress database tables, All WordPress uploads.

- Document your current configuration

    - Note any custom domain settings

    - Keep track of your username and password for wp-admin.

### 2. Deploy WordPress

- Open the [WordPress Template](https://railway.com/template/EP4wIt) page

    <Image src="https://res.cloudinary.com/railway/image/upload/v1741839172/docs/do-migration-guide/wordpress_template_pqnksc.png"
    alt="Screenshot of the WordPress template"
    layout="responsive"
    width={1301} height={799} quality={100} />

- Click "Deploy Now" to Deploy the WordPress template.

- Since this template doesn’t require any configuration, Click "Deploy" and wait for the deployment to complete.

The template will automatically configure -

- A MariaDB database

- Initial WordPress setup

- Required environment variables

- A temporary service domain

<Image src="https://res.cloudinary.com/railway/image/upload/v1741839172/docs/do-migration-guide/wordpress_deployment_qwg5j1.png"
alt="Screenshot of wordpress after deployment"
layout="responsive"
width={838} height={454} quality={100} />

### 3. Restore your site content

After the template deployment completes -

1. Access your WordPress installation via the temporary service domain.

2. Configure your WordPress settings

3. Install your preferred backup plugin

4. Restore your site content from your backup

### 4. Configure Domain Settings

To set up your custom domain:

1. Open your service's Settings in Railway

2. Navigate to the "Networking" section

3. Add your custom domain

4. Update your DNS records according to the instructions given.

**Note:** You will need to redeploy your service for WordPress to pick up the new domain.

<Image src="https://res.cloudinary.com/railway/image/upload/v1741839172/docs/do-migration-guide/wordpress_service_settings_networking_meyhcs.png"
alt="Screenshot of Railway domain configuration page"
layout="responsive"
width={763} height={505} quality={100} />

### 5. Verify Migration

Before finalizing your migration - 

1. Test all WordPress functionality

2. Verify all pages and posts are displaying correctly

3. Check media files are properly loaded

4. Test user authentication

5. Verify contact forms and other interactive elements

### 6. Performance Optimization

Consider these optimization options for your WordPress deployment:

- Configure caching by placing Cloudflare or a similar CDN in front of your site.

- Optimize database performance by setting up a caching plugin.

- Set up appropriate scaling configurations.

- Implement CDN if needed

That's all you need to migrate your WordPress site from DigitalOcean to Railway! Need assistance? The [Central Station](https://station.railway.com/) is there to help you with any questions during your migration process.