---
title: The Basics
---

This document outlines the core concepts of Railway, providing foundational knowledge of the basic buiding blocks you'll work with in the platform, i.e. -

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_Accounts -> Dashboard -> Projects -> Services -> Variables_

## Accounts

Railway Accounts are how a user interacts with the Railway platform.  Users are only allowed one account per person. 

We offer two ways to sign up, via GitHub Oath or email.

## Dashboard

The Dashboard in Railway is like your mission control.  Within a Dashboard, you have a birdseye view of all projects you have created in Railway.

Dashboards contain workspaces that represent scoped views of your personal projects and, if applicable, your team projects.

## Projects

A project represents a capsule for composing infrastructure in Railway.  You can think of a project as an application stack, a service group, or even a collection of service groups.

Services within a project are automatically joined to a [private network]() scoped to that project.  That's right.

## Services

A Railway service is a deployment target for your deployment source.  Deployment sources can be code repositories or Docker Images.  Once you create a service and choose a source, Railway will analyze the source, build a Docker image (if the source is a code repository), and deploy it to the service.

Out of the box, your service is deployed with a set of default configurations which can be overriden as needed.
>(it would be awesome to list the defaults in a table somewhere, like in reference).  then we could be like [see the list of defaults here]()

## Variables

Variables provide a powerful way to manage configuration and secrets across services in Railway.

You can configure variables scoped to services or to projects to be shared amongst all services in a project.

## What Next?

If you've read enough for now and are ready to get started, we suggest checking out either of these two resources next:
- [Quick Start guide](/quick-start) to deploy a To Do app from a [template]().
- [How To section](/how-to/overview) for a piecemeal approach.

If you want to go deeper, click the Next button below to head to the next section - [Advanced Concepts](/overview/advanced-concepts).