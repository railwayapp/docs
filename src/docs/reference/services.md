---
title: Services
description: Discover the different types of services available in your Railway projects.
---

A Railway service is a deployment target.  Under the hood, services are containers deployed from an image.

Each service keeps a log of [deployment attempts](/reference/deployments) and [performance metrics](/reference/metrics).

[Variables](/reference/variables), source references (e.g. GitHub repository URI), and relevant [start and build commands](/reference/build-and-start-commands) are also stored in the service, among other configuration.

## Types of Services

#### Persistent Services

Services that are always running.  Examples include web applications, backend APIs, message queues, database services, etc.

#### Scheduled Jobs

Services that are run until completion, on a defined schedule, also called [Cron Jobs](/reference/cron-jobs).

## Service Source

A service source can be any of the following - Docker Image, GitHub or Local repository.

If a [Dockerfile](/reference/dockerfiles) is found within the source repository, Railway will automatically use it to build an image for the service.

#### Docker Image

Services can be deployed directly from a Docker image from Docker Hub, GitHub Container Registry, GitLab Container Registry, or Quay.io.  The images can be public or private.

#### GitHub Repository

Services can be connected to a GitHub repo and automatically deployed on each commit.

#### Local Repository

Services can be deployed from a local machine by using the [Railway CLI](/reference/cli-api).

## Ephemeral Storage

Every service deployment has access to 10GB of ephemeral storage.  If a service deployment consumes more than 10GB, it can be forcefully stopped and redeployed.

If your service requires data to persist between deployments, or needs more than 10GB of storage, you should add a [volume](/reference/volumes).

## Templates

A [template](/reference/templates) is a pre-configured group of services. A template can be used to start a project or to expand an existing project.

## Constraints

- Service names have a max length of 32 characters.
