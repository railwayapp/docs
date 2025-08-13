---
title: Deploy a SvelteKit App
description: Learn how to deploy a Sveltekit app to Railway with this step-by-step guide. It covers quick setup, adapter configuration, one-click deploys and other deployment strategies.
---

[SvelteKit](https://svelte.dev/docs/kit/introduction) is a framework for rapidly developing robust, performant web applications using Svelte.

This guide covers how to deploy a SvelteKit app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a SvelteKit app!

## Create a SvelteKit App

**Note:** If you already have a SvelteKit app locally or on GitHub, you can skip this step and go straight to the [Deploy SvelteKit App to Railway](#deploy-sveltekit-app-to-railway).

To create a new SvelteKit app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Run the following command in your terminal to create a new SvelteKit app using [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project):

```bash
npx sv create svelteapp
```

Follow the prompts:

1. Select the `SvelteKit demo` template.
2. Add typechecking with Typescript.
3. Add prettier, eslint, and tailwindcss.
4. No tailwindcss plugins. Hit enter and move on.
5. Select `npm` as the package manager to install dependencies.

A new SvelteKit app will be provisioned for you in the `svelteapp` directory.

### Run the SvelteKit App locally

Next, `cd` into the directory and start the Vite development server by running the following command:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173` to see the app. You can play the demo game by visiting the `/sverdle` route.

### Prepare SvelteKit App for deployment

First, we need to enable SvelteKit Node adapter.

[SvelteKit adapters](https://svelte.dev/docs/kit/adapters) are plugins that take the built app as input and generate output for deployment. These adapters are used to run your project on deployment platforms.

Let's add the Node adapter to the app. Run the command below in your terminal:

```bash
npm i -D @sveltejs/adapter-node
```

Once it is installed, add the adapter to the app's `svelte.config.js` file.

The `svelte.config.js` file should look like this:

```js
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
  },
};

export default config;
```

Next, we need to add the start script to the `package.json` file.

Svelte builds your project into a `build` directory. The server starts when the server entry point is executed, which is by default located at `build/index.js`.

Open up the `package.json` file and add the start script. Set it to `node build/index.js` like so:

```js
{
	"name": "svelteapp",
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"start": "node build/index.js",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"format": "prettier --write .",
		"lint": "prettier --check . && eslint ."
	},
	"devDependencies": {
		"@fontsource/fira-mono": "^5.0.0",
		"@neoconfetti/svelte": "^2.0.0",
		"@sveltejs/adapter-auto": "^3.0.0",
		"@sveltejs/adapter-node": "^5.2.9",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^4.0.0",
		"@types/eslint": "^9.6.0",
		"autoprefixer": "^10.4.20",
		"eslint": "^9.7.0",
		"eslint-config-prettier": "^9.1.0",
		"eslint-plugin-svelte": "^2.36.0",
		"globals": "^15.0.0",
		"prettier": "^3.3.2",
		"prettier-plugin-svelte": "^3.2.6",
		"prettier-plugin-tailwindcss": "^0.6.5",
		"svelte": "^5.0.0",
		"svelte-check": "^4.0.0",
		"tailwindcss": "^3.4.9",
		"typescript": "^5.0.0",
		"typescript-eslint": "^8.0.0",
		"vite": "^5.0.3"
	}
}
```

_package.json_

Now, we are ready to deploy!

## Deploy the SvelteKit App to Railway

Railway offers multiple ways to deploy your SvelteKit app, depending on your setup and preference.

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/svelte-kit)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

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
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1730489695/docs/quick-start/sveltekit_on_railway.png"
alt="screenshot of the deployed SvelteKit service"
layout="responsive"
width={2695} height={2199} quality={100} />

### Deploy from a GitHub Repo

To deploy a SvelteKit app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Deploy the App**:
   - Click **Deploy** to start the deployment process.
   - Once the deployed, a Railway [service](/guides/services) will be created for your app, but it won’t be publicly accessible by default.
4. **Verify the Deployment**:
   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.
5. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

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

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your SvelteKit apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
