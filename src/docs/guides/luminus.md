---
title: Deploy a Clojure Luminus App
description: Learn how to deploy your Clojure Luminus app to Railway with this step-by-step guide. It covers quick setup, database integration, one-click deploys and other deployment strategies.
---

[Luminus](https://luminusweb.com) is a Clojure micro-framework based on a set of lightweight libraries. It aims to provide a robust, scalable, and easy to use platform. With Luminus you can focus on developing your app the way you want without any distractions.

This guide covers how to deploy a Luminus app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Luminus app!

## Create a Luminus App

**Note:** If you already have a Luminus app locally or on GitHub, you can skip this step and go straight to the [Deploy Luminus App to Railway](#deploy-luminus-app-to-railway).

To create a new Luminus app, ensure that you have [JDK](https://www.oracle.com/java/technologies/downloads/) and [Leiningen](https://leiningen.org/#install) installed on your machine.

Run the following command in your terminal to create a new Luminus app with Postgres and a production ready server:

```bash
lein new luminus helloworld +postgres +immutant
```

A new Luminus app will be provisioned for you in the `helloworld` directory with support for PostgreSQL as the database and configures [Immutant](https://github.com/immutant/immutant) as the web server, which is production-ready and optimized for Clojure applications.

**Note:** If you use MySQL or another database, you can pass it as an option when trying to create a new app.

### Run the Luminus App Locally

Open `dev-config.edn` and add your Postgres database URL like so:

```clojure
 :database-url "postgresql://username:password@127.0.0.1:5432/helloworld_dev"
```

- `username:password` is your database user and password.
- `helloworld_dev` is the database you have created locally.

Next, run `lein run migrate` to run the database migrations.

Finally, run `lein run` to launch your app!

Open your browser and go to `http://localhost:3000` to see the app.

### Prepare Clojure Luminus App for Deployment

1. We need to add the `ceshire` library to our dependencies. `cheshire` is a popular JSON encoding/decoding library in Clojure.

Open your `project.clj` file and ensure you have the following under `:dependencies`:

```clojure
...
[cheshire "5.10.0"]
```

Run the command below in your terminal to ensure it is installed:

```bash
lein deps
```

2. Create a `nixpacks.toml` file in the root directory of the app.

The [nixpacks.toml file](https://nixpacks.com/docs/configuration/file) is a configuration file used by Nixpacks, a build system developed and used by Railway, to set up and deploy applications.

In this file, you can specify the instructions for various build and deployment phases, along with environment variables and package dependencies.

Add the following content to the file:

```toml
# nixpacks.toml

[start]
cmd = "java -jar $(find ./target -name '*.jar' ! -name '*SNAPSHOT*') migrate && java -jar $(find ./target -name '*.jar' ! -name '*SNAPSHOT*')"

```

Here, we are specifically instructing Nixpacks to use the following command to start the app.

The command searches for all `.jar` files in the `target` directory (where the standalone JAR file is located after the build), excludes any file with "SNAPSHOT" in its name, and passes the selected file to `java -jar` to run.

It starts by running the JAR file with the `migrate` option to apply database migrations. Once migrations are complete, it reruns the JAR file to launch the application.

## Deploy the Luminus App to Railway

Railway offers multiple ways to deploy your Clojure app, depending on your setup and preference.

### One-Click Deploy From a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/DsDYI2)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=clojure" target="_blank">variety of Clojure app templates</a> created by the community.

### Deploy From the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Luminus app directory.
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

<Image src="https://res.cloudinary.com/railway/image/upload/v1730897279/docs/quick-start/clojure_luminus_on_railway.png"
alt="screenshot of the deployed Clojure service"
layout="responsive"
width={2325} height={2187} quality={100} />

### Deploy From a GitHub Repo

To deploy a Clojure Luminus app to Railway directly from GitHub, follow the steps below:

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

   **Note:** During the deployment process, Railway will automatically [detect that it’s a Clojure app](https://nixpacks.com/docs/providers/clojure).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the Luminus app's root directory.
2. Add the content below to the `Dockerfile`:

   ```bash
   # Use the Clojure official image
   # https://hub.docker.com/_/clojure
   FROM clojure:temurin-23-lein-bookworm

   # Create and change to the app directory.
   WORKDIR /app

   # Copy local code to the container image.
   COPY . ./

   # Build the app.
   RUN lein uberjar

   # Run the app by dynamically finding the standalone JAR file in the target/uberjar directory
   CMD ["sh", "-c", "java -jar $(find target/uberjar -name '*.jar' ! -name '*SNAPSHOT*')"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Clojure apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
