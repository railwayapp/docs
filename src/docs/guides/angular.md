---
title: Deploy an Angular App
description: Learn how to deploy an Angular app to Railway with this step-by-step guide. It covers quick setup, caddy server setup, one-click deploys, Dockerfile and other deployment strategies.
---

[Angular](https://angular.dev) is a JavaScript web framework that empowers developers to build fast and reliable applications. It is designed to work at any scale, keep large teams productive and is proven in some of Google's largest web apps such as [Google fonts](https://fonts.google.com) and [Google Cloud](https://console.cloud.google.com).

This guide covers how to deploy an Angular app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template)
2. [From a GitHub repository](#deploy-from-a-github-repo)
3. [Using the CLI](#deploy-from-the-cli)
4. [Using a Dockerfile](#use-a-dockerfile)

Now, let's create an Angular app!

## Create an Angular App

**Note:** If you already have an Angular app locally or on GitHub, you can skip this step and go straight to the [Deploy Angular App on Railway](#deploy-the-angular-app-to-railway).

To create a new Angular app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) and [Angular CLI](https://angular.dev/installation#install-angular-cli) installed on your machine.

Run the following command in your terminal to create a new Angular app:

```bash
ng new gratitudeapp
```

You'll be presented with some config options in the prompts for your project. 
- Select `CSS` 
- Select `Yes` for enabling Server-Side Rendering (SSR) and Static Site Generation (SSG)
- Select `Yes` for enabling Server Routing and App Engine APIs (Developer Preview)

### Run the Angular App locally

Next, `cd` into the directory and run the app.

```bash
npm start
```

Open your browser and go to `http://localhost:4200` to see your app.

## Modify Start Script

Before deploying, we need to update the `package.json` file.

Angular builds the project into the `dist` directory. For server-side rendered apps, the server starts with the command: `node dist/gratitudeapp/server/server.mjs` as defined in the scripts section below:

```js
"scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "serve:ssr:gratitudeapp": "node dist/gratitudeapp/server/server.mjs"
  },
```

- The development server starts with `npm start`.
- The production server runs with `npm run serve:ssr:gratitudeapp`.

Since Railway relies on the `build` and `start` scripts to automatically build and launch applications, we need to update the `start` script to ensure it runs the production server correctly.

Your scripts section should look like this:

```js
...
"scripts": {
    "ng": "ng",
    "dev": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "start": "node dist/gratitudeapp/server/server.mjs"
  },
... 
```
 
Now, we are good to go!

## Deploy the Angular App to Railway

Railway offers multiple ways to deploy your Angular app, depending on your setup and preference. 

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/A5t142)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=angular" target="_blank">variety of Angular app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your Angular app directory. 
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

<Image src="https://res.cloudinary.com/railway/image/upload/v1741028014/CleanShot_2025-03-03_at_18.49.07_2x_ewelfy.png"
alt="screenshot of the deployed Angular service"
layout="responsive"
width={2644} height={2114} quality={100} />

### Deploy from a GitHub Repo

To deploy an Angular app to Railway directly from GitHub, follow the steps below:

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

1. Create a `Dockerfile` in the `gratitudeapp` or Angular app's root directory.
2. Add the content below to the `Dockerfile`:
    ```dockerfile
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

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Angular apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)

