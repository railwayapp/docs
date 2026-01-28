---
title: Migrate from Vercel to Railway
description: Learn how to migrate your Next.js app from Vercel to Railway with this step-by-step guide. Fast, seamless, and hassle-free.
---

This guide demonstrates how to transition your application from Vercel to Railway's developer-centric platform. Whether you're running a simple static site or a complex full-stack application, Railway streamlines your deployment workflow.

With features like instant rollbacks, integrated observability, and seamless environment management, Railway empowers developers to focus on building great applications rather than managing infrastructure.

Railway offers -

- **Next.js Optimization**: Built-in support for all Next.js features including ISR, SSR, and API routes

- **Zero Config Deployments**: Automatic framework detection and build optimization

- **Enhanced Development Flow**: Local development with production parity

- **Collaborative Features**: Team management, deployment protection, and role-based access

- **Priority Support**: Dedicated support for Railway users

## Migration Steps

Let's walk through migrating a Next.js application to Railway. For this guide, we'll use a sample e-commerce app that showcases common Next.js features and configurations.

### Deploying Your Application

To get started deploying our NextJS app, we will first make a new <a href="/overview/the-basics#project--project-canvas" target="_blank">project</a>.

- Open up the <a href="/overview/the-basics#dashboard--projects" target="_blank">dashboard</a> → Click **New Project**.
- Choose the **GitHub repo** option.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752559/docs/quick-start/new_project_uyqqpx.png"
alt="screenshot of new project menu with deploy from github selected"
layout="responsive"
width={836} height={860} quality={100} />

_Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it._

- Search for your GitHub project and click on it.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752559/docs/quick-start/new_github_project_pzvabz.png"
alt="screenshot of new project menu with nextjs repo selected"
layout="responsive"
width={836} height={596} quality={100} />

- Choose either **Deploy Now** or **Add variables**.
  **Deploy Now** will immediately start to build and deploy your selected repo.
  **Add Variables** will bring you to your service and ask you to add variables, when done you will need to click the **Deploy** button at the top of your canvas to initiate the first deployment.
  _For brevity we will choose **Deploy Now**._

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752558/docs/quick-start/deploy_now_pmrqow.png"
alt="screenshot of new project menu with deploy now option selected"
layout="responsive"
width={836} height={620} quality={100} />

When you click **Deploy Now**, Railway will create a new project for you and kick off an initial deploy after the project is created.

**Once the project is created you will land on your <a href="/overview/the-basics#project--project-canvas" target="_blank">Project Canvas</a>**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1723752560/docs/quick-start/project_canvas_nextjs_c6bjbq.png"
alt="screenshot of the project canvas showing environment variables configuration"
layout="responsive"
width={1363} height={817} quality={100} />

From here Railway will automatically -

- Detect your Next.js configuration

- Configure the appropriate Node.js version

- Build your application

- Run your application

### Environment Configuration

Next.js applications often rely on environment variables for API keys, database connections, and feature flags. Here's how to transfer them -

**From Vercel -**

1. Visit your Vercel project settings

2. Navigate to the Environment Variables tab

3. Export your variables (you can copy them directly)

**To Railway -**

1. Select your service in the Project Canvas

2. Open the Variables tab

3. Use the Raw Editor for bulk variable import

4. Click Deploy to apply changes

### Domain Configuration

Railway makes it simple to set up custom domains or use our provided domains -

1. Open your service's Settings

2. Navigate to the Public Networking section

3. Choose between:

   - Generating a Railway service domain

   - Adding your custom domain

4. Follow the DNS configuration steps if using a custom domain

### Deployment Verification

Before finalizing your migration:

1. Check your application's core functionality

2. Verify environment variables are properly set

3. Test dynamic routes and API endpoints

4. Confirm image optimization is working

5. Monitor build and runtime logs

Railway's integrated observability helps you catch any issues early in the migration process.

### Local Development

Railway makes local development seamless with your production environment:

1. Install the Railway CLI: `npm i -g @railway/cli`

2. Run `railway link` to connect to your project

3. Use `railway run` to start your app locally with production variables

This ensures development/production parity and helps catch issues before they reach production.

That's all it takes to move your Next.js application to Railway! Need help? Our [team and community](https://station.railway.com/) are always ready to assist.

Need more information on how we compare to Vercel? Check out our [comparison page](/maturity/compare-to-vercel).
