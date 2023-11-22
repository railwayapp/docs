---
title: Dockerfiles
---

Use a Dockerfile to instruct Railway how to build and deploy your service.

## How it works

When building and deploying your service, Railway will look for and use a `Dockerfile` at the service's root if it exists.

Railway notifies you when it's using the `Dockerfile` in the build process with the following message in the logs:
```shell
==========================
Using detected Dockerfile!
==========================
```

For more information, refer to the guide on [how to use Dockerfiles](/how-to/build-from-a-dockerfile)