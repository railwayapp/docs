---
title: Deploy a React App
description: Learn how to deploy a React app to Railway with this step-by-step guide. It covers quick setup, caddy server setup, one-click deploys and other deployment strategies.
---

[React](https://react.dev), also known as React.js or ReactJS, is a popular JavaScript library developed by Meta for building user interfaces, especially for web and native applications. 

React simplifies the process of creating interactive and dynamic UIs by breaking them down into reusable components.

This guide covers how to deploy a React app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a React app!

## Create a React App

**Note:** If you already have a React app locally or on GitHub, you can skip this step and go straight to the [Deploy React App on Railway](#deploy-the-react-app-to-railway).

To create a new React app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to create a new React app using [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project):

```bash
npm create vite@latest helloworld -- --template react
```

A new React app will be provisioned for you in the `helloworld` directory.

### Run the React App locally

Next, `cd` into the directory and install the dependencies.

```bash
npm install
```

Start the Vite development server by running the following command:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173` to see your app.

## Deploy the React App to Railway

Railway offers multiple ways to deploy your React app, depending on your setup and preference. 

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a React app with [Caddy](https://caddyserver.com) to serve the dist folder.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/NeiLty)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=react" target="_blank">variety of React app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your React app directory. 
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

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1729182225/docs/quick-start/vite_react_app.png"
alt="screenshot of the deployed React service"
layout="responsive"
width={2431} height={2051} quality={100} />

### Deploy from a GitHub Repo

To deploy a React app to Railway directly from GitHub, follow the steps below:

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

1. Create a `Dockerfile` in the `helloworld` or React app's root directory.
2. Add the content below to the `Dockerfile`:
    ```bash
    # Use the Node alpine official image
    # https://hub.docker.com/_/node
    FROM node:lts-alpine AS build

    # Set config
    ENV NPM_CONFIG_UPDATE_NOTIFIER=false
    ENV NPM_CONFIG_FUND=false

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

    # Use the Caddy image
    FROM caddy

    # Create and change to the app directory.
    WORKDIR /app

    # Copy Caddyfile to the container image.
    COPY Caddyfile ./

    # Copy local code to the container image.
    RUN caddy fmt Caddyfile --overwrite

    # Copy files to the container image.
    COPY --from=build /app/dist ./dist

    # Use Caddy to run/serve the app
    CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
    ```
    The `Dockerfile` will use Caddy to serve the React app.
3. Add a `Caddyfile` to the app's root directory:
    ```bash
    # global options
    {
        admin off # theres no need for the admin api in railway's environment
        persist_config off # storage isn't persistent anyway
        auto_https off # railway handles https for us, this would cause issues if left enabled
        # runtime logs
        log {
            format json # set runtime log format to json mode 
        }
        # server options
        servers {
            trusted_proxies static private_ranges 100.0.0.0/8 # trust railway's proxy
        }
    }

    # site block, listens on the $PORT environment variable, automatically assigned by railway
    :{$PORT:3000} {
        # access logs
        log {
            format json # set access log format to json mode
        }

        # health check for railway
        rewrite /health /*

        # serve from the 'dist' folder (Vite builds into the 'dist' folder)
        root * dist

        # enable gzipping responses
        encode gzip

        # serve files from 'dist'
        file_server

        # if path doesn't exist, redirect it to 'index.html' for client side routing
        try_files {path} /index.html
    }
    ```
4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your React apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)

