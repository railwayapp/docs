---
title: Deploy a SvelteKit App
description: Learn how to deploy a Sveltekit app to Railway with this step-by-step guide. It covers quick setup, adapter configuration, one-click deploys and other deployment strategies.
date: "2026-08-14"
tags:
  - deployment
  - frontend
  - sveltekit
  - fullstack
  - svelte
topic: frameworks
---

[SvelteKit](https://svelte.dev/docs/kit/introduction) is a framework for rapidly developing robust, performant web applications using Svelte.

This guide covers how to deploy a SvelteKit app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a SvelteKit app!

## Create a SvelteKit app

**Note:** If you already have a SvelteKit app locally or on GitHub, you can skip this step and go straight to the [Deploy SvelteKit App to Railway](#deploy-sveltekit-app-to-railway).

To create a new SvelteKit app, ensure that you have [Node](https://nodejs.org/en/download) installed on your machine.

Run the following command in your terminal to create a new SvelteKit app using [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project):

```bash
npx sv create svelteapp --add sveltekit-adapter="adapter:node" --install npm
```

Follow the prompts:

1. Select the `SvelteKit demo` template.
2. Add type checking with TypeScript syntax.
3. Add prettier, eslint, and tailwindcss.
4. No tailwindcss plugins. Hit enter and move on.

A new SvelteKit app will be provisioned for you in the `svelteapp` directory.

### Run the SvelteKit app locally

Next, `cd` into the directory and start the Vite development server by running the following command:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173` to see the app. You can play the demo game by visiting the `/sverdle` route.

### Prepare SvelteKit app for deployment

Your app has been configured to use the [SvelteKit Node adapter](https://svelte.dev/docs/kit/adapter-node#Deploying). It takes your app's build output and generates a standalone Node server.

Next, add the start script to the `package.json` file.

Svelte builds your project into a `build` directory. The server starts when the server entry point is executed, which is by default located at `build/index.js`.

Open up the `package.json` file and add the start script. Set it to `node build` like so:

```json
{
	"name": "svelteapp",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"start": "node build",
```

_package.json_

Now you're ready to deploy!

## Deploy the SvelteKit app to Railway

Railway offers multiple ways to deploy your SvelteKit app, depending on your setup and preference.

### One-click deploy from a template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/svelte-kit)

It is highly recommended that [you eject from the template after deployment](/templates/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=sveltekit" target="_blank">variety of Svelte app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your SvelteKit app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Deploy the Application**:
   - Use the command below to deploy your app:
     ```bash
     railway up
     ```
   - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
   - Once the deployment completes, go to **View logs** to check if the service is running successfully.
4. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/networking/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1730489695/docs/quick-start/sveltekit_on_railway.png"
alt="screenshot of the deployed SvelteKit service"
layout="responsive"
width={2695} height={2199} quality={100} />

### Deploy from a GitHub repo

To deploy a SvelteKit app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once the deployed, a Railway [service](/services) will be created for your app, but it won’t be publicly accessible by default.
4. **Verify the Deployment**:
   - Once the deployment completes, go to [**View logs**](/observability/logs#build--deploy-panel) to check if the server is running successfully.
5. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/networking/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the SvelteKit app's root directory.
2. Add the content below to the `Dockerfile`:

   ```bash
   # Use the Node alpine official image
   # https://hub.docker.com/_/node
   FROM node:lts-alpine

   # Create and change to the app directory.
   WORKDIR /app

   # Copy the files to the container image
   COPY package*.json ./

   # Install packages
   RUN npm ci

   # Copy local code to the container image.
   COPY . ./

   # Build the app.
   RUN npm run build

   # Serve the app
   CMD ["npm", "run", "start"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your SvelteKit apps seamlessly!

## Next steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Choose between SSR, SSG, and ISR](/guides/ssr-ssg-isr) - Pick the right rendering strategy.
- [Manage environment variables](/guides/frontend-environment-variables) - Handle `PUBLIC_` prefixed variables.
- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
