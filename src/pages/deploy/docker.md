---
title: Dockerfiles
---

## Dockerfiles

We will look for and use a `Dockerfile` at the project root if it exists.

If you need to use the environment variables that Railway injects at build time,
you must specify them in the Dockerfile with

```
ARG EnvironmentVariable
```