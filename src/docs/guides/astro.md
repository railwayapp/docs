---
title: Deploy an Astro App
description: Learn how to deploy an Astro app to Railway with this step-by-step guide. It covers quick setup, server side rendering, one-click deploys, Dockerfile and other deployment strategies.
---

[Astro](https://astro.build) is the web framework for content-driven websites. It's a JavaScript framework optimized for building fast, content-driven websites. It also supports every major UI framework, allowing you to bring in your existing components and benefit from Astro's optimized client build performance.

This guide covers how to deploy an Astro app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create an Astro app!

## Create an Astro App

**Note:** If you already have an Astro app locally or on GitHub, you can skip this step and go straight to the [Deploy Astro Apps on Railway](#deploy-the-astro-app-to-railway).

To create a new Astro app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to create a new Astro app:

```bash
npm create astro@latest
```

Follow the prompts and provide a directory name, such as `blog`, where you'd like to set up your app.

When prompted to choose how you'd like to start your project, select **Use blog template**. For TypeScript, choose **Yes**.

For the remaining options, select the defaults and press Enter. All necessary dependencies will then be installed.

A new Astro app will be provisioned for you in the `blog` directory.

### Run the Astro App Locally

Enter your project directory using `cd blog`.

Start the local dev server by running the following command:

```bash
npm run dev
```

Open your browser and go to `http://localhost:4321` to see your app.

### Enable Server Side Rendering (SSR)

Astro has several [SSR adapters](https://docs.astro.build/en/guides/server-side-rendering/). These adapters are used to run your project on the server and handle SSR requests.

Let's add the Node adapter to enable SSR in our blog project.

Run the command below in your terminal:

```bash
npx astro add node
```

Select **Yes** at the prompt to proceed. The Node adapter will be installed, and our Astro config file will be updated accordingly.

Open up the `astro.config.mjs` file:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),
});
```

In the config file, `output` is set to `server`, meaning every page in the app is server-rendered by default.

For mostly static sites, set `output` to `hybrid`. This allows you to add `export const prerender = false` to any file that needs to be server-rendered on demand.

### Modify Start Script and Astro Config

Astro builds your project into a `dist` directory. In `standalone` mode, a server starts when the server entry point is executed, which is by default located at `./dist/server/entry.mjs`. 

In this mode, the server handles file serving as well as page and API routes.

Open up the `package.json` file and modify the start script from `astro dev` to `node ./dist/server/entry.mjs`.

```js
{
    "name": "astroblog",
    "type": "module",
    "version": "0.0.1",
    "scripts": {
        "dev": "astro dev",
        "start": "node ./dist/server/entry.mjs",
        "build": "astro check && astro build",
        "preview": "astro preview",
        "astro": "astro"
    },
    "dependencies": {
        "@astrojs/check": "^0.9.4",
        "@astrojs/mdx": "^3.1.8",
        "@astrojs/node": "^8.3.4",
        "@astrojs/rss": "^4.0.9",
        "@astrojs/sitemap": "^3.2.1",
        "astro": "^4.16.6",
        "typescript": "^5.6.3"
    }
}
```

Open the `astro.config.mjs` file and configure the server to run on host `0.0.0.0` by adding the following block inside the `defineConfig` function.

```js
...
server: {
    host: '0.0.0.0'
},
```

Your app needs to listen on either `0.0.0.0` or `::` to accept traffic. If not configured properly, you'll encounter a 502 error.

## Deploy the Astro App to Railway

Railway offers multiple ways to deploy your Astro app, depending on your setup and preference. 

### One-Click Deploy From a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/Ic0JBh)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=astro" target="_blank">variety of Astro app templates</a> created by the community.

### Deploy From the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your Vue app directory. 
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
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1729535599/astro_blog_app.png"
alt="screenshot of the deployed Astro service"
layout="responsive"
width={2556} height={2164} quality={100} />

### Deploy From a GitHub Repo

To deploy an Astro app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
    - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**: 
    - Select **Deploy from GitHub repo** and choose your repository.
        - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Deploy the App**: 
    - Click **Deploy** to start the deployment process.
    - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
4. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.
5. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the `blog` or Astro app's root directory.
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

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Astro apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)

