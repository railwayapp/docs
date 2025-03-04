---
title: Builds
description: Understand Railway's build concepts.
---

Let's customize the build process.

Railway will build and deploy your code with zero configuration, but we make it easy to override this behavior as needed. Now that you're warmed up, let's take a look at how you can adjust how your services are built.

The goal of this section is to guide you through the various ways to customize the build process.

#### Build Concepts

|                         |                                                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nixpacks**            | <a href="https://nixpacks.com/docs" target="_blank">Nixpacks</a> takes a source directory and produces an OCI compliant image that can be deployed anywhere. It is the default buildpack used when you deploy on Railway. |
| **Railpack**            | <a href="https://railpack.com" target="_blank">Railpack</a> is a new builder developed by Railway that produces smaller image sizes and supports all versions of packages. Currently in beta.                             |
| **Build Configuration** | Railway provides several ways to configure the build process to produce the desired result. If necessary, you have control over the build command, which root directory to build from, when to trigger a build, etc.      |
| **Dockerfiles**         | Dockerfiles welcome! If you already have a build defined in a Dockerfile within your code repository, Railway will automatically use it to build your service.                                                            |

The following pages will guide you through how to interact with these controls.
