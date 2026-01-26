---
title: Deploy Static Sites with Zero Configuration and Custom Domains
description: Learn how to deploy static websites to Railway with automatic GitHub builds, SSL certificates, custom domains, and integrate with a CDN. Perfect for marketing sites, blogs, and documentation.
---

In this guide, you'll learn how to deploy static websites to Railway with automatic GitHub builds, SSL certificates, and custom domains. All with zero configuration required.

## What is Railway?

Railway is a modern deployment platform that lets you deploy static websites and applications without managing servers, configuring load balancers, or learning complex infrastructure. It provides automatic builds, zero-downtime deployments, and built-in CI/CD.

Learn more about Railway's [core components and foundations](/guides/foundations).

## Why Choose Railway for Static Hosting?

Railway offers several advantages for static site hosting:

- Zero configuration: Deploy from GitHub without build scripts or complex setup.
- Automatic builds: Every push triggers a new deployment automatically.
- Custom domains: Automatically provisioned SSL certificates and custom domain setup.
- Preview environments: Test changes with automatic PR previews.
- Usage-based pricing: Pay only for what you use, starting at $5/month.
- Private repositories: Deploy from private GitHub repos without additional cost.

## Prerequisites

This is a beginner-friendly guide. You'll need:

- A Railway account
- [Git](https://git-scm.com/) configured and a [GitHub](https://github.com/) account 

## Deploy a static site on Railway from your own GitHub repository

1. Go to [railway.com/new](https://railway.com/new)
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account and choose your repository
4. Railway will automatically detect the build configuration and deploy your site

## Configure a custom domain

Custom domains can be added to any Railway service with automatic SSL certificate provisioning.

1. Navigate to your service settings:
   - In your Railway project, click on your deployed service
   - Go to the "Settings" tab
   - Scroll to the "Networking" section

2. Add your domain:
   - Click the "+ Custom Domain" button
   - Enter your domain (e.g., `example.com`) and specify the target port
   - Railway will provide you with a CNAME record to configure in your DNS provider

![Add a Custom Domain](https://res.cloudinary.com/railway/image/upload/v1758569589/CleanShot_2025-09-22_at_22.32.05_2x_io3eqe.png)

3. Configure DNS:
   - In your DNS provider (Cloudflare, Namecheap, etc.), create a CNAME record
   - Point your domain to the Railway-provided CNAME
   - Wait for verification (usually takes a few minutes but can take up to 72 hours)

4. SSL Certificate:
   - Railway automatically issues and renews SSL certificates
   - Your site will be available at `https://your-domain.com`

Learn more about [custom domains](/guides/public-networking#custom-domains) and [SSL configuration](/guides/public-networking#ssl-certificates) in Railway.

## Set up preview environments for every pull request for your static site

Railway can automatically create preview environments for every pull request, letting you test changes before merging.

1. Configure project settings:
   - Go to your Project Settings → Environments tab
   - Click "Enable PR Environments"

![PR Environments](https://res.cloudinary.com/railway/image/upload/v1758274258/docs/PR_environmetns_q4z0yy.png)

2. Create a feature branch:
   ```bash
   git checkout -b feature/new-page
   # Make your changes
   git add .
   git commit -m "Add new page"
   git push origin feature/new-page
   ```

3. Create a pull request:
   - Once you create a pull request, Railway will automatically deploy a preview environment with a unique URL where you can preview your changes.
   - When the PR is merged or closed, the PR environment is automatically deleted.

Learn more about [using environments](/guides/environments) and [PR environments](/guides/environments#enable-pr-environments).

## Deploy replicas in different regions for global performance

Railway enables you to deploy your static site across multiple regions for improved global performance and availability.

- Reduced latency: Serve content from the region closest to your users
- High availability: If one region experiences issues, traffic automatically routes to healthy regions
- Better performance: Faster loading times for users worldwide
- Automatic failover: Seamless traffic routing without manual intervention

To get started:

1. In your Railway project, click on your deployed service
2. Go to the "Settings" tab
3. Under "Deploy", go to the "Regions" section and click "+ Add Region"

Railway automatically distributes replicas across available regions and routes traffic to the nearest region.

![Multi-region deployment](https://res.cloudinary.com/railway/image/upload/v1758247839/docs/multi-region_deployment_h5fxqz.png)


Each replica runs with the full resource limits of your plan. So if you're on the Pro plan and deploy 3 replicas, you'll get a combined capacity of 72 vCPU and 72 GB RAM across all regions.

```
Total resources = number of replicas × maximum compute allocation per replica
```

Learn more about [scaling applications](/reference/scaling) and [multi-region deployments](/maturity/compare-to-vps#multi-region-deployment) in Railway.

Alternatively, you can integrate a CDN like Cloudflare for global content delivery and improved performance.

## Add Cloudflare as a CDN

While Railway doesn't currently provide a built-in CDN, you can easily integrate a CDN like [Cloudflare](https://www.cloudflare.com/) for global content delivery and improved performance.

1. Add your domain to Cloudflare:
   - Sign up for a free Cloudflare account
   - Add your Railway domain to Cloudflare
   - Update your nameservers as instructed

2. Configure DNS:
   - Create a CNAME record in Cloudflare
   - Point your domain to your Railway service URL
   - Enable "Proxy" (orange cloud) for CDN benefits

3. Verify setup:
   - Test your domain to ensure it's working correctly
   - Monitor performance improvements in Cloudflare's dashboard

## Add API Endpoints with Railway Functions

For static sites that need lightweight API endpoints, [Railway Functions](/reference/functions) enable you to write and deploy code from the Railway canvas without managing infrastructure or creating a git repository.

Railway Functions are [Services](/reference/services) that run a single file of TypeScript code using the [Bun](https://bun.com/) runtime. They're perfect for:

- Form submissions
- Simple API endpoints
- Webhook handlers
- Cron jobs

1. Add a new service:
   - In your Railway project, click the "+ Create" button
   - Choose "Function" as the service type
   - Deploy

2. Write your function:
   - Click on the "Source Code" tab
   - Write your function code

3. Deploy instantly:
   - Press `Cmd+S` (or `Ctrl+S`) to stage changes
   - Press `Shift+Enter` to deploy
   - Your function is live in seconds

Learn more about [Railway Functions](/reference/functions).

For most static sites, the Hobby plan with included usage is sufficient. You only pay for resources you actually use.

Learn more about [Railway pricing](https://railway.com/pricing) and [usage optimization](/guides/optimize-usage).

## Next Steps

Now that you've deployed your static site, explore these resources:

- [Add a Database Service](/guides/build-a-database-service) for dynamic content
- [Monitor your application](/guides/monitoring) with built-in metrics
- [Set up custom domains](/guides/public-networking) and SSL certificates
- [Configure environment variables](/guides/variables) for different environments
- [Use Railway Functions](/reference/functions) for API endpoints
- [Optimize performance](/guides/optimize-performance) and [usage](/guides/optimize-usage)

## Need Help?

If you have any questions or run into issues, you can reach out in the [Railway Discord](http://discord.gg/railway) community or on [Central Station](https://station.railway.com/).
