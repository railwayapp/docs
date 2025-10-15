---
title: Deploy a Sails App
description: Learn how to deploy a Sails app to Railway with this step-by-step guide. It covers quick setup, database integration, the Boring JavaScript stack, one-click deploys and other deployment strategies.
---

[Sails](https://sailsjs.com) is a MVC framework for Node.js. It is designed to emulate the familiar MVC pattern of frameworks like Ruby on Rails, but with support for the requirements of modern apps: data-driven APIs with a scalable, service-oriented architecture.

Sails makes it easy to build custom, enterprise-grade Node.js apps.

## Create a Sails App

**Note:** If you already have a Sails app locally or on GitHub, you can skip this step and go straight to the [Deploy Sails App on Railway](#deploy-sails-app-on-railway).

To create a new Sails app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to install Sails:

```bash
npm install sails -g
```

Next, run the command below to create a new Sails app

```bash
sails new workapp
```

Select `Web App` as the template for your new Sails app. Once the dependencies have been installed, `cd` into the `workapp` directory and run `sails lift` to start your app.

Open your browser and go to `http://localhost:1337` to see your app.

Now, let's deploy to Railway!

## Deploy Sails App on Railway

Railway offers multiple ways to deploy your Sails app, depending on your setup and preference. Choose any of the following methods:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Using the CLI](#deploy-from-the-cli).
3. [From a GitHub repository](#deploy-from-a-github-repo).

## One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Sails app along with a Postgres database and Redis.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/t3sAEH)

After deploying, we recommend that you [eject from the template](/guides/deploy#eject-from-template-repository) to create a copy of the repository under your own GitHub account. This will give you full control over the source code and project.

## Deploy from the CLI

To deploy the Sails app using the Railway CLI, please follow the steps:

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Sails app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Modify Sails Config**:
   - Open up `config/env/production.js` file and make some changes:
     - Set `http.trustProxy` to `true` because our app will be behind a proxy.
     - Set `session.cookie.secure` to `true`
     - Add this function to the `socket` object just after the `onlyAllowOrigins` array:
       ```js
       beforeConnect: function(handshake, proceed) {
         // Send back `true` to allow the socket to connect.
         // (Or send back `false` to reject the attempt.)
         return proceed(undefined, false);
       },
       ```
       **Note:** We only added this because we don't need sockets now. If you do, skip this step and add your public app URL to the `onlyAllowOrigins` array. The function simply rejects socket connection attempts.
4. **Deploy the Application**:
   - Use the command below to deploy your app:
     ```bash
     railway up
     ```
   - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.

- **Note:** You'll come across an error about how the default `sails-disk` adapter and `connect.session()` MemoryStore is not designed for use as a production database, don’t worry. We’ll fix this in the next step.

5. **Add PostgreSQL & Redis Database Services**:
   - Run `railway add`.
   - Select `PostgreSQL` by pressing space
   - Select `Redis` by also pressing space and hit **Enter** to add both database services to your project.
6. **Modify Sails Database Config**:
   - Open up `config/env/production.js` file and make some changes to let your app know what database to connect to and where to save sessions:
     - In the `datastores:` section,
       - Add `adapter: 'sails-postgresql'`,
       - Add `url: process.env.DATABASE_URL`
     - In the `session:` section,
       - Add `adapter: '@sailshq/connect-redis'`,
       - Add `url: process.env.REDIS_URL`,
   - Run `npm install sails-postgresql --save` to add the new adapter to your app locally.
7. **Configure Environment Variables on Railway**:
   - Go to your app service <a href="/overview/the-basics#service-variables">**Variables**</a> section and add the following:
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `REDIS_URL`: Set the value to `${{Redis.REDIS_URL}}` (this references the URL of your new Redis Database)
   - Use the **Raw Editor** to add any other required environment variables in one go.
8. **Redeploy the Service**:
   - Click **Deploy** on the Railway dashboard to apply your changes.
9. **Upload Local Changes**:
   - Run `railway up` to upload all the changes we made locally and redeploy our service.
10. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.
11. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1728580600/docs/quick-start/new_sails_service.png"
alt="screenshot of the deployed Sails service"
layout="responsive"
width={2986} height={2140} quality={100} />

## Deploy from a GitHub Repo

To deploy the Sails app to Railway, start by pushing the app to a GitHub repo. Once that’s set up, follow the steps below to complete the deployment process.

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables**:
   - Click **Add Variables** and configure all the necessary environment variables for your app.
4. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
5. **Add a Database Service**:
   - Right-click on the Railway project canvas or click the **Create** button.
   - Select **Database**.
   - Select **Add PostgreSQL** from the available databases.
     - This will create and deploy a new Postgres database service for your project.
6. **Add a Redis Database Service**:
   - Right-click on the Railway project canvas or click the **Create** button.
   - Select **Database**.
   - Select **Add Redis** from the available databases.
     - This will create and deploy a new Redis database service for your project.
7. **Configure Environment Variables**:
   - Go to your app service <a href="/overview/the-basics#service-variables">**Variables**</a> section and add the following:
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
     - `REDIS_URL`: Set the value to `${{Redis.REDIS_URL}}` (this references the URL of your new Redis Database)
   - Use the **Raw Editor** to add any other required environment variables in one go.
8. **Modify Sails Config**:
   - Follow [steps 3 & 5 mentioned in the CLI guide](#deploy-from-the-cli).
9. **Redeploy the Service**:
   - Click **Deploy** on the Railway dashboard to apply your changes.
10. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.
11. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Sails apps effortlessly!

Here’s how your setup should look:

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1728580319/docs/quick-start/all_services_connected.png" alt="Diagram showing all sails services connected on Railway" layout="responsive" width={2985} height={1815} quality={100} />

By following these steps, you’ll have a fully functional Sails app. If you run into any issues or need to make adjustments, check the logs and revisit your environment variable configurations.

## The Boring JavaScript Stack Sails Starter

If you're a fan of [The Boring JavaScript Stack](https://github.com/sailscastshq/boring-stack), we’ve got a one-click deploy option for you.

Simply click the button below to get started:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/ia84_3)

**Note:** After deploying, we recommend [ejecting from the template](/guides/deploy#eject-from-template-repository) to create your own GitHub repository. This will give you full control over the project and source code.

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Monitoring](/guides/monitoring)
- [Deployments](/guides/deployments)
