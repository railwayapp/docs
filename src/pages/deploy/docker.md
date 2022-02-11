---
title: Dockerfiles
---

## Dockerfiles

We will look for and use a `Dockerfile` at the service's root if it exists.

Railway notifies you when it's using the `Dockerfile` in the build process with the following message in the logs

```shell
==========================
Using detected Dockerfile!
==========================
```

If you have a Dockerfile in your project directory, you can use `railway run`
with no arguments to build and run your Dockerfile.

## Environment Variables

If you need to use the environment variables that Railway injects at build time,
you must specify them in the Dockerfile with

```
ARG EnvironmentVariable
```

Be sure to declare your environment variables at the start of the `Dockerfile`.

### Docker Compose

We sadly do not support docker compose at the moment. Thank you for the understanding
