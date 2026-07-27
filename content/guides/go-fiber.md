---
title: Deploy a Go Fiber App
description: Learn how to deploy a Go Fiber app to Railway with this step-by-step guide. It covers quick setup, one-click deploys, Dockerfile and other deployment strategies.
date: "2026-03-30"
tags:
  - deployment
  - fiber
  - go
  - backend
topic: frameworks
---

<a href="https://gofiber.io" target="_blank">Fiber</a> is an Express-inspired web framework for Go, built on top of Fasthttp for high performance.

This guide covers how to deploy a Fiber app on Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

## One-click deploy from a template

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/go-fiber)

It is highly recommended that [you eject from the template after deployment](/templates/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=fiber" target="_blank">variety of Fiber app templates</a> created by the community.

## Deploy from a GitHub repo

To deploy a Fiber app on Railway directly from GitHub, follow the steps below:

1. Fork the basic <a href="https://github.com/railwayapp-templates/go-fiber" target="_blank">Go Fiber GitHub repo</a>.
   - If you already have a GitHub repo you want to deploy, you can skip this step.
2. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
3. Click **Deploy from GitHub repo**.
4. Select the `go-fiber` or your own GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
5. Click **Deploy Now**.

Once the deployment is successful, a Railway [service](/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/networking/public-networking#railway-provided-domain).

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. Clone the forked <a href="https://github.com/railwayapp-templates/go-fiber" target="_blank">Go Fiber GitHub repo</a> and `cd` into the directory.
   - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.
   - The CLI will now scan, compress and upload your Fiber app files to Railway's backend for deployment.

## Use a Dockerfile

1. Clone the forked `go-fiber` repo and `cd` into the directory.
   - You can skip this step if you already have an app directory or repo on your machine that you want to deploy.
2. Create a `Dockerfile` in the `go-fiber` or app's root directory.
3. Add the content below to the `Dockerfile`:

   ```docker
   # Use the Go 1.23 alpine official image
   # https://hub.docker.com/_/golang
   FROM golang:1.23-alpine

   # Create and change to the app directory.
   WORKDIR /app

   # Copy go mod and sum files
   COPY go.mod go.sum ./

   # Copy local code to the container image.
   COPY . ./

   # Install project dependencies
   RUN go mod download

   # Build the app
   RUN go build -o app

   # Run the service on container startup.
   ENTRYPOINT ["./app"]
   ```

4. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next steps

Explore these resources to learn more about Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
