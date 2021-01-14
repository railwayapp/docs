---
title: Builds
---

## Buildpacks

Railway uses [Cloudnative Buildpacks](https://buildpacks.io/) to attempt to
build and deploy with zero configuration. Currently we support the following
languages out of the box

- NodeJS
- Python
- Go
- Ruby
- Java 

If you have a language that you want us to support, please don't hesitate to
[reach out](https://discord.gg/xAm2w6g) and let us know.

## Dockerfiles

We will look for and use a `Dockerfile` at the project root if it exists.
