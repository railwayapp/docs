---
title: Deploy a Nuxt App
description: Learn how to deploy a Nuxt app to Railway with this step-by-step guide. It covers quick setup, one-click deploys, Dockerfile and other deployment strategies.
---

[Nuxt](https://nuxt.com) is a Vue.js framework that makes web development intuitive and powerful. You can create performant and production-grade full-stack web apps and websites with confidence.

Nuxt is known as **The Intuitive Vue Framework** because it simplifies building Vue.js applications with features like server-side rendering and easy routing.

This guide covers how to deploy a Nuxt app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Nuxt app!

## Create a Nuxt App

**Note:** If you already have a Nuxt app locally or on GitHub, you can skip this step and go straight to the [Deploy Nuxt App on Railway](#deploy-the-nuxt-app-to-railway).

To create a new Nuxt app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to create a new Nuxt app:

```bash
npx nuxi@latest init helloworld
```

A new Nuxt app will be provisioned for you in the `helloworld` directory.

### Run the Nuxt App locally

Next, `cd` into the directory and start the development server by running the following command:

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000` to see your app.

## Deploy the Nuxt App to Railway

Railway offers multiple ways to deploy your Nuxt app, depending on your setup and preference. 

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/lQQgLR)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=nuxt" target="_blank">variety of Nuxt app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your Vue app directory. 
        ```bash
        railway init
        ```
    - Follow the prompts to name your project.
    - After the project is created, click the provided link to view it in your browser.
3. **Modify Package.json Config**:
    - By default, Nuxt doesn't add a start script in the `package.json` file. We'll need to add that to instruct Railway on how to run our app. 
    
    - Add `"start":"node .output/server/index.mjs"` to the `package.json` file.

    **package.json**
    ```bash
    {
        "name": "nuxt-app",
        "private": true,
        "type": "module",
        "scripts": {
            "build": "nuxt build",
            "dev": "nuxt dev",
            "start": "node .output/server/index.mjs",
            "generate": "nuxt generate",
            "preview": "nuxt preview",
            "postinstall": "nuxt prepare"
        },
        "dependencies": {
            "nuxt": "^3.13.0",
            "vue": "latest",
            "vue-router": "latest"
        }
    }
    ```
    **Note:** Railway uses [Nixpacks](/reference/nixpacks) to build and deploy your code with zero configuration. The Nixpack Node provider will pick up the start script in the `package.json` file and use it to serve the app.
4. **Deploy the Application**:
    - Use the command below to deploy your app:
        ```bash
        railway up
        ```
    - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
    - Once the deployment completes, go to **View logs** to check if the service is running successfully.
5. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1729262446/docs/quick-start/nuxt_app.png"
alt="screenshot of the deployed Nuxt service"
layout="responsive"
width={2383} height={2003} quality={100} />

### Deploy from a GitHub Repo

To deploy a Nuxt app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
    - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Modify Package.json Config**:
    - Follow [step 3 mentioned in the CLI guide](#deploy-from-the-cli)
3. **Deploy from GitHub**: 
    - Select **Deploy from GitHub repo** and choose your repository.
        - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
4. **Deploy the App**: 
    - Click **Deploy** to start the deployment process.
    - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
5. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.
6. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the `helloworld` or Nuxt app's root directory.
2. Add the content below to the `Dockerfile`:
    ```bash
    # Use the Node alpine official image
    # https://hub.docker.com/_/node
    FROM node:lts-alpine AS build

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

    # Copy files to the container image.
    COPY --from=build /app ./
    
    # Serve the app
    CMD ["npm", "run", "start"]
    ```
3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Nuxt apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)

