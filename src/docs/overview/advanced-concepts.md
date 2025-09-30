---
title: Advanced Usage
description: A guide that outlines the advanced concepts of Railway.
---

This document outlines the more advanced concepts of Railway. It covers things like build and deploy options, networking, integrations, and observability.

## Build and Deploy Options

Out of the box, many defaults are applied to builds and deployments. However, there are several ways to tailor things to your project spec.

### Build Options

Railway uses <a href="https://railpack.com" target="_blank">Railpack</a> to build and deploy your code with zero configuration. When your needs require adjustments to the defaults, we make it easy to configure things like install, build, and start commands.

### Deploy Options

Deployments are created with some default options that can be overridden. Some of the options available are -

- **Replicas**: By default, your deployment will go out with a single instance. With replicas, you have the ability to scale up your deployment instances.
- **Deployment Region**: Deployments by default are pushed to your [preferred region](https://railway.com/workspace).
- **Scheduled Executions**: Your deployment will be run once by default. If the service is intended to be a scheduled task of sorts, you can create a cron schedule.
- **App Sleep**: Services are serverful and always-on. You can control this behavior, to spin down resources when they're not being used, by enabling App Sleep.

## Networking

Networking can be tricky and time-consuming. We wanted to provide the best-in-class experience when it came to wiring things up. There are two basic ways we accomplish this.

### Private Networking

Private Networking is a feature within Railway that will open network communication through a IPv6 wireguard mesh only accessible to your Railway services within a project.

All projects have private networking enabled and services are assigned a DNS name under the `railway.internal` domain. This DNS name resolves to the internal IPv6 address of the services in a project.

### Railway-Provided Domains

With the click of a button, Railway will expose your service to the internet and provide you with a domain. In order to make this work, you must configure your application appropriately to ensure we know the port it is listening on. Instructions for how to do this can be found in the [Public Networking guide](/guides/public-networking).

#### Custom Domains

If you have a custom domain, you can easily add it to your Railway service.

## Integration Tools

A <a href="https://docs.railway.com/guides/cli" target="_blank">CLI</a> and an <a href="https://docs.railway.com/guides/public-api" target="_blank">API</a> are available to wire your Railway projects into any workflow.

### CLI

The Railway Command Line Interface (CLI) lets you interact with your Railway project from the command line, allowing you to do things like:

- Trigger deployments programmatically.
- Run services locally using environment variables from your Railway project.
- Create new Railway projects from the Terminal.
- Deploy <a href="https://docs.railway.com/reference/templates" target="_blank">templates</a>.

### Public API

The Railway <a href="https://docs.railway.com/guides/public-api" target="_blank">public API</a> is built with GraphQL and is the same API that powers the Railway dashboard. Similar to the CLI, you can interact with your Railway project programmatically by communicating with the API.

## Environments

Railway environments give you an isolated instance of all databases and services in a project. You can use them to

- Have development environments for each team member that are identical to the production environment
- Have separate staging and production environments

Within a service and environment, you can specify which branch to auto-deploy to that environment when a change is merged.

## Observability

Any build or deployment logs emitted to standard output or standard error `( eg. console.log(...))` are captured by Railway so you can view or search for it later.

### Service Logs

Logs for a specific service deployment are available from a service's view in your project, useful when debugging build or deployment failures.

### Centralized Logs

Logs for all of the services in a project can be viewed together in our Observability tool within a project. This is useful for debugging more general problems that may span multiple services.
