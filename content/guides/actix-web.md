---
title: Deploy an Actix Web App
description: Learn how to deploy an Actix Web app to Railway with this step-by-step guide. It covers quick setup, Dockerfile and other deployment strategies.
date: "2026-03-30"
tags:
  - deployment
  - actix-web
  - rust
  - backend
topic: frameworks
---

<a href="https://actix.rs" target="_blank">Actix Web</a> is a powerful, pragmatic, and fast web framework for Rust.

This guide covers how to deploy an Actix Web app on Railway in three ways:

1. [From a GitHub repository](#deploy-from-a-github-repo).
2. [Using the CLI](#deploy-from-the-cli).
3. [Using a Dockerfile](#use-a-dockerfile).

**Note:** You can also choose from a variety of <a href="https://railway.com/templates?q=actix" target="_blank">Actix Web templates</a> created by the community.

## Deploy from a GitHub repo

To deploy an Actix Web app on Railway directly from GitHub, follow the steps below:

1. Create a <a href="https://railway.com/new" target="_blank">New Project.</a>
2. Click **Deploy from GitHub repo**.
3. Select your Actix Web GitHub repo.
   - Railway requires a valid GitHub account to be linked. If your Railway account isn't associated with one, you will be prompted to link it.
4. Click **Deploy Now**.

Once the deployment is successful, a Railway [service](/services) will be created for you. By default, this service will not be publicly accessible.

To set up a publicly accessible URL for the service, navigate to the **Networking** section in the [Settings](/overview/the-basics#service-settings) tab of your new service and click on [Generate Domain](/networking/public-networking#railway-provided-domain).

**Note:** Railpack auto-detects Rust apps and builds them automatically. Learn more about <a href="https://railpack.com/languages/rust" target="_blank">Rust support in Railpack</a>.

## Deploy from the CLI

1. <a href="/guides/cli#installing-the-cli" target="_blank">Install</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate with the CLI.</a>
2. `cd` into your Actix Web app directory.
   - You can skip this step if you are already in the app directory.
3. Run `railway init` within the app directory to create a new project.
4. Run `railway up` to deploy.
   - The CLI will now scan, compress and upload your Actix Web app files to Railway's backend for deployment.

## Use a Dockerfile

1. Create a `Dockerfile` in the app's root directory.
2. Add the content below to the `Dockerfile`:

   ```docker
   FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
   WORKDIR /app

   FROM chef AS planner
   COPY . ./
   RUN cargo chef prepare --recipe-path recipe.json

   FROM chef AS builder
   COPY --from=planner /app/recipe.json recipe.json
   RUN cargo chef cook --release --recipe-path recipe.json
   COPY . ./
   RUN cargo build --release

   CMD ["./target/release/app"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/builds/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

## Next steps

Explore these resources to learn more about Railway:

- [Add a Database Service](/databases/build-a-database-service)
- [Monitor your app](/observability)
- [Running a Cron Job](/cron-jobs)
