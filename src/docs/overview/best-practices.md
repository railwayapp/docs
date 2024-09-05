---
title: Best Practices
---

Railway is a highly versatile platform, offering various ways to use it, though some may be less optimal than others for most use cases. the topics here aim to help you maximize the platform's potential.

## Use Private networking

Private networking allows services within a project to communicate internally without the need to expose them publicly.

The private network has no egress fees, allowing you to avoid service-to-service egress costs when communicating with a database or other services within the same project.

## Deploying related Services into the same Project

It can be all too easy to create a new project each time you deploy a database or service, but there are a few reasons to keep related services within the same project.

- **Private networking** - The private network is scoped to a single environment within a project, having all related services within a single project will allow you to use private networking for faster networking along with no egress fees for service to service communication.

- **Project clutter** - Deploying a new service or database as an entire project will quickly become overwhelming and clutter your dashboard.

## Use Reference variables

Reference variables allow you to reference to another variable, either within the current service or from another service in the same project.

This is recommended over copying and pasting variables you need to access in another service, for example.

Using reference variables ensures your variable values are always in sync. Changed your TCP proxy? The variable updates. Changed your backend hostname? The variable updates.

For examples on how to use reference variables, please see our [reference variable guide](/guides/variables#reference-variables).

