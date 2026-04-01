---
title: Deploy a Ktor App
description: Learn how to deploy a Ktor app to Railway with this step-by-step guide. It covers quick setup, CLI deploys, Dockerfile and other deployment strategies.
date: "2026-03-30"
tags:
  - deployment
  - ktor
  - kotlin
  - backend
topic: frameworks
---

<a href="https://ktor.io" target="_blank">Ktor</a> is an asynchronous framework for creating connected applications in Kotlin, built by JetBrains.

**Note:** There is no official Railway template for Ktor yet. You can check the community for <a href="https://railway.com/templates?q=ktor" target="_blank">Ktor templates</a>.

This guide covers how to deploy a Ktor app on Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

## Deploy from a GitHub repo

To deploy a Ktor app on Railway directly from GitHub, follow the steps below:

1. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
2. Click **Deploy from GitHub repo**.
3. Select your Ktor GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
4. Click **Deploy Now**.

Railway uses <a href="https://railpack.com/languages/java" target="_blank">Railpack</a> to detect and build Gradle projects automatically.

**Note:** Your Ktor app needs to bind to `0.0.0.0` and read the port from the `PORT` environment variable. You can do this in `application.conf`:

```
ktor {
    deployment {
        port = ${?PORT}
        port = 8080
    }
}
```

Or programmatically:

```kotlin
embeddedServer(Netty, port = System.getenv("PORT")?.toInt() ?: 8080)
```

Once the deployment is successful, a Railway [service](/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/networking/public-networking#railway-provided-domain).

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. `cd` into your Ktor project directory.
   - You can skip this step if you are already in your app directory.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.
   - The CLI will now scan, compress and upload your Ktor app files to Railway's backend for deployment.

## Use a Dockerfile

1. Create a `Dockerfile` in your Ktor app's root directory.
2. Add the content below to the `Dockerfile`:

   ```docker
   FROM gradle:8-jdk21 AS build
   WORKDIR /app
   COPY . ./
   RUN gradle buildFatJar --no-daemon

   FROM eclipse-temurin:21-jre-alpine
   WORKDIR /app
   COPY --from=build /app/build/libs/*-all.jar app.jar
   ENTRYPOINT ["java", "-jar", "app.jar"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
