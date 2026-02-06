---
title: Build & Deploy
description: Learn how to build, configure, and deploy your applications on Railway with services, environments, variables, and more.
---

Railway supports three types of compute: persistent services for long-running processes like web apps and APIs, cron jobs for scheduled tasks, and functions for single-file TypeScript code.

Configure your services with variables to manage secrets and configuration values, and organize them across environments to support different stages of your workflow. From there, control how your code is built and deployed.

## Compute primitives

| Topic | Description |
| ----- | ----------- |
| [**Services**](/services) | Long-running processes like web apps, APIs, and background workers. |
| [**Cron Jobs**](/cron-jobs) | Scheduled tasks that run on a defined cadence and exit on completion. |
| [**Functions**](/functions) | Single-file TypeScript code deployed directly from the canvas. |

## Configuration

| Topic | Description |
| ----- | ----------- |
| [**Environments**](/environments) | Manage different stages of your workflow with static and ephemeral environments. |
| [**Variables**](/variables) | Manage configuration values and secrets for your services. |
| [**Config as Code**](/config-as-code) | Define your Railway configuration in code with `railway.toml`. |

## Builds

| Topic | Description |
| ----- | ----------- |
| [**Builds**](/builds) | Understand how Railway builds your applications. |
| [**Build Configuration**](/builds/build-configuration) | Configure build settings for your services. |
| [**Dockerfiles**](/builds/dockerfiles) | Use Dockerfiles to define custom build processes. |
| [**Railpack**](/builds/railpack) | Railway's next-generation build system. |
| [**Nixpacks**](/builds/nixpacks) | The Nixpacks build system. |

## Deployments

| Topic | Description |
| ----- | ----------- |
| [**Deployments**](/deployments) | Understand the deployment lifecycle on Railway. |
| [**GitHub Autodeploys**](/deployments/github-autodeploys) | Automatically deploy when you push to GitHub. |
| [**Healthchecks**](/deployments/healthchecks) | Configure healthchecks to ensure your services are running correctly. |
| [**Scaling**](/deployments/scaling) | Scale your services horizontally and vertically. |
| [**Regions**](/deployments/regions) | Deploy to specific regions around the world. |
