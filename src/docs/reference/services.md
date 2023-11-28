---
title: Services
---

A Railway service is a deployment target.  Under the hood, services are containers deployed from an image.

Each service keeps a log of [deployment attempts](/reference/deployments) and [performance metrics](/reference/metrics). 

[Variables](/reference/variables), source references (e.g. GitHub repository URI), and relevant [start and build commands](/reference/build-and-start-commands) are also stored in the service, among other configuration.

## Types of Services

#### Persistent services

Services that are always running.  Examples include web applications, backend APIs, message queues, database services, etc.

#### Scheduled jobs

Services that are run until completion, on a defined schedule, also called Cron Jobs.

## Service Source

A service source can be any of the following - Docker Image, Github or Local repository.

If a [Dockerfile](/reference/dockerfiles) is found within the source repository, Railway will automatically use it to build an image for the service.

#### Docker Image

Services can be deployed directly from a Docker image from Docker Hub or Github Container Registry.

#### Github Repository

Services can be connected to a GitHub repo and automatically deployed on each commit.

#### Local Repository

Services can be deployed from a local machine by using the [Railway CLI](/reference/cli-api).  

## Templates

A [template](/reference/templates) is a pre-configured group of services. A template can be used to start a project or to expand an existing project.

## Constraints

- Service names have a max length of 32 characters.