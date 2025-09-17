---
title: Deploy an Express App
description: Learn how to deploy an Express app to Railway with one-click templates, GitHub, CLI, or Dockerfile. This guide covers setup, private networking, database integration, and deployment strategies.
---

[Express](https://expressjs.com) is a fast and flexible web application framework for Node.js that provides a simple and minimalistic approach to building web servers and APIs. It is known for its speed and unopinionated nature, allowing developers to structure their applications as they see fit while offering powerful features.

This guide covers how to deploy an Express app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create an Express app!

## Create an Express App

**Note:** If you already have an Express app locally or on GitHub, you can skip this step and go straight to the [Deploy Express App to Railway](#deploy-the-express-app-to-railway).

To create a new Express app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed on your machine.

Create a directory, `helloworld`, and `cd` into it.

Run the following command in your terminal to create a new Express app within the `helloworld` directory:

```bash
npx express-generator --view=pug
```

A new Express app will be provisioned for you in the `helloworld` directory using [pug](https://pugjs.org/api/getting-started.html) as the view engine.

### Run the Express App locally

Run `npm install` to install all the dependencies.

Next, start the app by running the following command:

```bash
npm start
```

Launch your browser and navigate to `http://localhost:3000` to view the app.

If you'd prefer to run the app on a different port, simply use the command `PORT=8080 npm start` in the terminal.

Afterward, you can access the app at `http://localhost:8080`.

### Add and Configure Database

**Note:** We will be using Postgres for this app. If you don’t have it installed locally, you can either [install it](https://www.postgresql.org/download) or use a different Node.js database package of your choice.

1. Create a database named `expresshelloworld_dev`.

2. Install the [pg-promise](https://www.npmjs.com/package/pg-promise) package:

```bash
npm i pg-promise
```

3. Open the `routes/index.js` file and modify the content to the code below:

```js
const express = require("express");
const pgp = require("pg-promise")();
const db = pgp(
  "postgres://username:password@127.0.0.1:5432/expresshelloworld_dev",
);
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  db.one("SELECT NOW()")
    .then(function (data) {
      // Render the page only after receiving the data
      res.render("index", {
        title: "Hello World, Railway!",
        timeFromDB: data.now,
      });
    })
    .catch(function (error) {
      console.error("ERROR:", error);
      // If there’s an error, send a 500 response and do not call res.render
      res.status(500).send("Error querying the database");
    });
});

module.exports = router;
```

The code above sets up a simple Express app with a route handler for the home page. It uses the `pg-promise` library to connect to a Postgres database and runs a query to fetch the current time from the database using `SELECT NOW()`. Upon receiving the data, it renders the index view with the fetched time, sending it to the client along with a title.

If an error occurs during the database query, the code catches the error, logs it, and sends a 500 status response to the client, indicating that there was an issue querying the database.

The page is only rendered after successfully receiving the database response to ensure proper handling of the data.

4. Open the `views/index.pug` file, and update it to display the `timeFromDB` value on the page.

```html
extends layout block content h1= title p Welcome to #{title} p This is the time
retrieved from the database: p #{timeFromDB}
```

5. Run the app again to see your changes in action!

### Prepare Express App for Deployment

In the `routes/index.js` file, replace the hardcoded Postgres database URL with an environment variable:

```js
...
const db = pgp(process.env.DATABASE_URL);
...
```

This allows the app to dynamically pull the correct database configuration from Railway during deployment.

## Deploy the Express App to Railway

Railway offers multiple ways to deploy your Express app, depending on your setup and preference.

### One-Click Deploy From a Template

If you’re looking for the fastest way to get started with Express, Pug and connected to a Postgres database, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/BC51z6)

For Express API, here's another template you can begin with:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/Y6zLKF)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=express" target="_blank">variety of Express app templates</a> created by the community.

### Deploy From the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Express app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Add a Postgres Database Service**:
   - Run `railway add -d postgres`.
   - Hit **Enter** to add it to your project.
   - A database service will be added to your Railway project.
4. **Add a Service and Environment Variable**:

   - Run `railway add`.
   - Select `Empty Service` from the list of options.
   - In the `Enter a service name` prompt, enter `app-service`.
   - In the `Enter a variable` prompt, enter `DATABASE_URL=${{Postgres.DATABASE_URL}}`.
     - The value, `${{Postgres.DATABASE_URL}}`, references the URL of your new Postgres database. Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).

   **Note:** Explore the [Railway CLI reference](/reference/cli-api#add) for a variety of options.

5. **Deploy the Application**:
   - Run `railway up` to deploy your app.
     - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
   - Once the deployment is complete, we can proceed to generate a domain for the app service.
6. **Set Up a Public URL**:
   - Run `railway domain` to generate a public URL for your app.
   - Visit the new URL to see your app live in action!

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731505753/express_on_railway.png"
alt="screenshot of the deployed Express service"
layout="responsive"
width={2194} height={1652} quality={100} />

### Deploy From a GitHub Repo

To deploy an Express app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables and Provision a Database Service**:
   - Click **Add Variables**, but hold off on adding anything just yet. First, proceed with the next step.
   - Right-click on the Railway project canvas or click the **Create** button, then select **Database** and choose **Add PostgreSQL**.
     - This will create and deploy a new PostgreSQL database for your project.
   - Once the database is deployed, you can return to adding the necessary environment variables:
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
4. **Deploy the App Service**:
   - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:

   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it's a Node.js app via Railpack](https://railpack.com/languages/node).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the Express app's root directory.
2. Add the content below to the `Dockerfile`:

   ```bash
   # Use the Node official image
   # https://hub.docker.com/_/node
   FROM node:lts

   # Create and change to the app directory.
   WORKDIR /app

   # Copy local code to the container image
   COPY . ./

   # Install packages
   RUN npm ci

   # Serve the app
   CMD ["npm", "run", "start"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Express apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
