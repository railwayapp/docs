---
title: Deploy a Vue App
description: Learn how to deploy a Vue app to Railway with this step-by-step guide. It covers quick setup, caddy server setup, one-click deploys, Dockerfile and other deployment strategies.
---

[Vue](https://vuejs.org), also known as Vue.js or VueJS, is a popular JavaScript library for building snappy, performant and versatile user interfaces for web applications. 

Vue prides itself as **The Progressive JavaScript Framework**.

This guide covers how to deploy a Vue app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Vue app!

## Create a Vue App

**Note:** If you already have a Vue app locally or on GitHub, you can skip this step and go straight to the [Deploy Vue App on Railway](#deploy-the-vue-app-to-railway).

To create a new Vue app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to create a new Vue app using [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project):

```bash
npm create vue@latest
```

You'll be presented with choices for different options in the prompts. Give the app a name, `helloworld` and answer `Yes` to the other options or select what you want.

A new Vue app will be provisioned for you in the `helloworld` directory.

### Run the Vue App locally

Next, `cd` into the directory and install the dependencies.

```bash
npm install
```

Start the Vite development server by running the following command:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173` to see your app.

## Deploy the Vue App to Railway

Railway offers multiple ways to deploy your Vue app, depending on your setup and preference. 

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal. It sets up a Vue app with [Caddy](https://caddyserver.com) to serve the dist folder.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/Qh0OAU)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=vue" target="_blank">variety of Vue app templates</a> created by the community.

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
3. **Set Up Config for a Production Ready Server**:
    - To ensure we're not running a development server in production, we'll add two files to our app directory to configure Railway to serve our app using the fast, reliable, and production-ready [Caddy server](https://caddyserver.com).
    - A `Caddyfile` and `nixpacks.toml` file. 

    **Caddyfile**
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

    **nixpacks.toml**
    ```bash
    # https://nixpacks.com/docs/configuration/file
    # set up some variables to minimize annoyance
    [variables]
        NPM_CONFIG_UPDATE_NOTIFIER = 'false' # the update notification is relatively useless in a production environment
        NPM_CONFIG_FUND = 'false' # the fund notification is also pretty useless in a production environment

    # download caddy from nix
    [phases.caddy]
        dependsOn = ['setup'] # make sure this phase runs after the default 'setup' phase
        nixpkgsArchive = 'ba913eda2df8eb72147259189d55932012df6301' # Caddy v2.8.4 - https://github.com/NixOS/nixpkgs/commit/ba913eda2df8eb72147259189d55932012df6301
        nixPkgs = ['caddy'] # install caddy as a nix package

    # format the Caddyfile with fmt
    [phases.fmt]
        dependsOn = ['caddy'] # make sure this phase runs after the 'caddy' phase so that we know we have caddy downloaded
        cmds = ['caddy fmt --overwrite Caddyfile'] # format the Caddyfile to fix any formatting inconsistencies

    # start the caddy web server
    [start]
        cmd = 'exec caddy run --config Caddyfile --adapter caddyfile 2>&1' # start caddy using the Caddyfile config and caddyfile adapter
    ```
    **Note:** Railway uses [Nixpacks](/reference/nixpacks) to build and deploy your code with zero configuration. You can customize your [deployment configuration](https://nixpacks.com/docs/configuration/file) by adding a `nixpacks.toml` or `nixpacks.json` file to your app.
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

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1729252336/docs/quick-start/vue_app_on_railway.png"
alt="screenshot of the deployed Vue service"
layout="responsive"
width={2642} height={2080} quality={100} />

### Deploy from a GitHub Repo

To deploy a Vue app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
    - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**: 
    - Select **Deploy from GitHub repo** and choose your repository.
        - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Deploy the App**: 
    - Click **Deploy** to start the deployment process.
    - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
    **Note:** Your app will be running via a development server, which is not ideal. We'll fix that in the next step.
5. **Set Up Config for a Production Ready Server**:
    - Follow [step 3 mentioned in the CLI guide](#deploy-from-the-cli).
6. **Redeploy the Service**:
    - Click **Deploy** on the Railway dashboard to apply your changes.
7. **Verify the Deployment**:
    - Once the deployment completes, go to **View logs** to check if the server is running successfully.
8. **Set Up a Public URL**:
    - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
    - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the `helloworld` or Vue app's root directory.
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
    The `Dockerfile` will use Caddy to serve the Vue app.
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

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Vue apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)

