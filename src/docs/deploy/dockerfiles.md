---
title: Dockerfiles
---

We will look for and use a `Dockerfile` at the service's root if it exists.

Railway notifies you when it's using the `Dockerfile` in the build process with the following message in the logs:
```shell
==========================
Using detected Dockerfile!
==========================
```

### Custom Dockerfile Path

By default, we look for a file named `Dockerfile` in the directory.  If you want to use a custom filename, you have a couple of options - 

#### Set a Variable

In your [service variables](/develop/variables#defining-variables), set a variable named `RAILWAY_DOCKERFILE_PATH` to specify the path to the file.

For example, if your Dockerfile was called `Dockerfile.origin`, you would specify it like this:
```
RAILWAY_DOCKERFILE_PATH=Dockerfile.origin
```

#### Use Config as Code

Set your custom Dockerfile path using [config as code](/deploy/config-as-code#dockerfile-path).

For example, if you use a `railway.toml` file, you would specify your Dockerfile path like this:

```toml
[build]
dockerfilePath = "Dockerfile.backend"
```


### Using Variables at Build Time

If you need to use the environment variables that Railway injects at build time, which include [variables that you define](/develop/variables#defining-variables) and [Railway-provided variables](/develop/variables#railway-provided-variables), you must specify them in the Dockerfile using the `ARG` command.

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

### Docker Compose

Railway doesn't support docker compose at the moment.
