---
title: Build from a Dockerfile
---

We will look for and use a `Dockerfile` at the service's root if it exists.

Railway notifies you when it's using the `Dockerfile` in the build process with the following message in the logs:
```shell
==========================
Using detected Dockerfile!
==========================
```

## Custom Dockerfile Path

By default, we look for a file named `Dockerfile` in the root directory.  If you want to use a custom filename or path, you can set a variable defining the path.

In your [service variables](/develop/variables#defining-variables), set a variable named `RAILWAY_DOCKERFILE_PATH` to specify the path to the file.

For example, if your Dockerfile was called `Dockerfile.origin`, you would specify it like this:
```
RAILWAY_DOCKERFILE_PATH=Dockerfile.origin
```

If your Dockerfile is in another directory, specify it like this:

```
RAILWAY_DOCKERFILE_PATH=/build/Dockerfile
```

### Use Config as Code

You can also set your custom Dockerfile path using [config as code](/how-to/use-config-as-code#dockerfile-path).


## Using Variables at Build Time

If you need to use the environment variables that Railway injects at build time, which include [variables that you define](/how-to/use-variables#service-variables) and [Railway-provided variables](/how-to/use-variables#railway-provided-variables), you must specify them in the Dockerfile using the `ARG` command.

For example:
```dockerfile
# Specify the variable you need
ARG RAILWAY_SERVICE_NAME
# Use the varible
RUN echo $RAILWAY_SERVICE_NAME
```

Be sure to declare your environment variables in the stage they are required in:
```dockerfile
FROM node

ARG RAILWAY_ENVIRONMENT
```

## Docker Compose

Railway doesn't support docker compose at the moment.