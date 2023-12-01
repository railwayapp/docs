---
title: Dockerfiles
---

Use a Dockerfile to instruct Railway how to build a service.

## How it works

When building a service, Railway will look for and use a `Dockerfile` at the root of the source directory.

Railway notifies you when it's using the `Dockerfile` in the build process with the following message in the logs:
```shell
==========================
Using detected Dockerfile!
==========================
```

## Support

For more information, refer to the guide on [how to use Dockerfiles](/guides/dockerfiles).