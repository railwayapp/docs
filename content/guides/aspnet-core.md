---
title: Deploy an ASP.NET Core App
description: Learn how to deploy an ASP.NET Core app to Railway with this step-by-step guide. It covers deployment from GitHub, the CLI, and using a Dockerfile.
date: "2026-03-30"
tags:
  - deployment
  - aspnet-core
  - csharp
  - backend
topic: frameworks
---

<a href="https://dotnet.microsoft.com/apps/aspnet" target="_blank">ASP.NET Core</a> is a cross-platform framework for building web applications and APIs with C# and .NET.

This guide covers how to deploy an ASP.NET Core app on Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

**Note:** [Railpack](/builds/railpack) does not yet support .NET, so a Dockerfile is required for all deployment methods.

You can also explore <a href="https://railway.com/templates?q=dotnet" target="_blank">.NET templates</a> created by the community.

## Deploy from a GitHub repo

To deploy an ASP.NET Core app on Railway directly from GitHub, follow the steps below:

1. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
2. Click **Deploy from GitHub repo**.
3. Select your GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
4. Click **Deploy Now**.

**Note:** ASP.NET Core apps require a `Dockerfile` for deployment on Railway, since [Railpack](/builds/railpack) does not yet support .NET.

Once the deployment is successful, a Railway [service](/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/networking/public-networking#railway-provided-domain).

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. `cd` into your ASP.NET Core app directory.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.
   - The CLI will now scan, compress and upload your app files to Railway's backend for deployment.

**Note:** ASP.NET Core apps require a `Dockerfile` for deployment on Railway, since [Railpack](/builds/railpack) does not yet support .NET.

## Use a Dockerfile

1. `cd` into your ASP.NET Core app directory.
2. Create a `Dockerfile` in the app's root directory.
3. Add the content below to the `Dockerfile`:

   ```docker
   FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
   WORKDIR /app

   COPY *.csproj ./
   RUN dotnet restore

   COPY . ./
   RUN dotnet publish -c Release -o out

   FROM mcr.microsoft.com/dotnet/aspnet:9.0
   WORKDIR /app
   COPY --from=build /app/out ./

   ENTRYPOINT ["dotnet", "App.dll"]
   ```

   **Note:** Replace `App.dll` with the actual assembly name of your project (e.g., `MyWebApp.dll`).

4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

### Port configuration

ASP.NET Core apps need to bind to `0.0.0.0` and read the `PORT` environment variable. By default, Kestrel binds to `localhost`, which will not work on Railway.

Set the `ASPNETCORE_URLS` environment variable in your Railway service settings:

```
ASPNETCORE_URLS=http://+:${PORT}
```

Alternatively, configure the port in your `Program.cs`:

```csharp
builder.WebHost.UseUrls($"http://0.0.0.0:{Environment.GetEnvironmentVariable("PORT") ?? "8080"}");
```

## Next steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
