---
title: Deploy a NestJS App
description: Learn how to deploy a NestJS app to Railway with this step-by-step guide. It covers quick setup, database integration, one-click deploys and other deployment strategies.
---

[Nest](https://nestjs.com) is a modern Node.js framework designed to create efficient, reliable, and scalable server-side applications. Built on top of powerful HTTP server frameworks, it uses Express as the default but also offers seamless support for Fastify for enhanced performance and flexibility.

This guide covers how to deploy a Nest app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's go ahead and create a Nest app!

## Create a Nest App

**Note:** If you already have a Nest app locally or on GitHub, you can skip this step and go straight to the [Deploy Nest App to Railway](#deploy-the-nest-app-to-railway).

To create a new Nest app, ensure that you have [Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) and [NestJS](https://docs.nestjs.com/#installation) installed on your machine.

Run the following command in your terminal to create a new Nest app:

```bash
nest new helloworld
```

A new Nest app will be provisioned for you in the `helloworld` directory.

### Run the Nest App locally

Next, start the app locally by running the following command:

```bash
npm run start
```

Launch your browser and navigate to `http://localhost:3000` to view the app.

If you'd prefer to run the app on a different port, simply use the command `PORT=8080 npm run start` in the terminal.

Afterward, you can access the app at `http://localhost:8080`.

### Add and Configure Database

**Note:** We will be using Postgres for this app. If you don’t have it installed locally, you can either [install it](https://www.postgresql.org/download) or use a different Node.js database package of your choice.

1. Create a database named `nestjshelloworld_dev`.

2. Install the following packages:

```bash
npm i @nestjs/typeorm typeorm pg
```

- typeorm is an ORM library for Typescript and JavaScript.
- pg is for communicating with Postgres database.

3. Open the `src/app.module.ts` file and modify the content to the code below:

```js
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "username",
      password: "password",
      database: "nestjshelloworld_dev",
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Start the app using the command, `npm run start:dev`. The code above tries to connect to the database once the app is started. If any of the credentials are wrong, you will see a warning stating that the app can't connect to the database.

4. Open `src/app.service.ts` file and modify the content to return `Hello World, Welcome to Railway!`.

```js
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World, Welcome to Railway!";
  }
}
```

5. Run the app again to see your changes in action!

### Prepare NestJS App for deployment

In the `src/app.module.ts` file, replace the hardcoded Postgres database credentials with environment variables:

```js
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

This allows the app to dynamically pull the correct database configuration from Railway during deployment.

## Deploy the Nest App to Railway

Railway offers multiple ways to deploy your Nest app, depending on your setup and preference.

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started with Nest connected to a Postgres database, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/nvnuEH)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=nest" target="_blank">variety of Nest app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Nest app directory.
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
   - In the `Enter a variable` prompt, enter
     - `DB_DATABASE=${{Postgres.PGDATABASE}}`.
     - `DB_USERNAME=${{Postgres.PGUSER}}`
     - `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
     - `DB_HOST=${{Postgres.PGHOST}}`
     - The Postgres values references the credentials of your new Postgres database. Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).

   **Note:** Explore the [Railway CLI reference](/reference/cli-api#add) for a variety of options.

5. **Deploy the Application**:
   - Run `railway up` to deploy your app.
     - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
   - Once the deployment is complete, we can proceed to generate a domain for the app service.
6. **Set Up a Public URL**:
   - Run `railway domain` to generate a public URL for your app.
   - Visit the new URL to see your app live in action!

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1732547945/docs/quick-start/nest_on_railway.png"
alt="screenshot of the deployed Nest service"
layout="responsive"
width={2069} height={2017} quality={100} />

### Deploy from a GitHub Repo

To deploy a Nest app to Railway directly from GitHub, follow the steps below:

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
     - `DB_DATABASE=${{Postgres.PGDATABASE}}`.
     - `DB_USERNAME=${{Postgres.PGUSER}}`
     - `DB_PASSWORD=${{Postgres.PGPASSWORD}}`
     - `DB_HOST=${{Postgres.PGHOST}}`
     - The Postgres values references the credentials of your new Postgres database. Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
4. **Deploy the App Service**:
   - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:

   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s a Node.js app via Nixpacks](https://nixpacks.com/docs/providers/node).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the Nest app's root directory.
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
   CMD ["npm", "run", "start:prod"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Nest apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
