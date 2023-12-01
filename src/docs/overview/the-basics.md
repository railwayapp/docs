---
title: The Basics
---

This document outlines the core concepts of Railway, providing foundational knowledge of the basic buiding blocks you'll work with in the platform.

## Projects

A project represents a capsule for composing infrastructure in Railway.  You can think of a project as an application stack, a service group, or even a collection of service groups.

Services within a project are automatically joined to a [private network](/reference/private-networking) scoped to that project.  That's right.

## Services

A Railway service is a deployment target for your deployment source.  Deployment sources can be code repositories or Docker Images.  Once you create a service and choose a source, Railway will analyze the source, build a Docker image (if the source is a code repository), and deploy it to the service.

Out of the box, your service is deployed with a set of default configurations which can be overriden as needed.

## Variables

Variables provide a powerful way to manage configuration and secrets across services in Railway.

You can configure variables scoped to services or to projects to be shared amongst all services in a project.

## What Next?

If you've read enough for now and are ready to get started, we suggest checking out either of these two resources next:
- [Quick Start guide](/quick-start) to deploy a To Do app from a [template](/reference/templates).
- [Guides section](/guides/foundations) to dive into how things work.

If you want to go deeper, click the Next button below to head to the next section - [Advanced Concepts](/overview/advanced-concepts).