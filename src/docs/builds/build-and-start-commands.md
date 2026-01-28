---
title: Build and Start Commands
description: Learn how to configure build and start commands.
---

Railway uses [Railpack](/reference/railpack) to automatically detect and configure build and start commands when an image is built and deployed to a [service](/reference/services).

If necessary, build and start commands can be manually configured.

## How it Works

Overrides are exposed in the service configuration to enable customizing the Build and Start commands. When an override is configured, Railway uses the commands specified to build and start the service.

#### Build Command

The command to build the service, for example `yarn run build`. Override the detected build command by setting a value in your service settings.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192207/docs/build-command_bwdprb.png"
alt="Screenshot of Railway Build Command"
layout="responsive"
width={1200} height={373} quality={80} />

#### Start Command

Railway automatically configures the start command based on the code being deployed.

If your service deploys with a [Dockerfile](/reference/dockerfiles) or from an [image](/reference/services#docker-image), the start command defaults to the `ENTRYPOINT` and / or `CMD` defined in the Dockerfile.

Override the detected start command by setting a value in your service settings.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />

If you need to use environment variables in the start command for services deployed from a Dockerfile or image you will need to wrap your command in a shell -

```shell
/bin/sh -c "exec python main.py --port $PORT"
```

This is because commands ran in exec form do not support variable expansion.

## Support

For more information on how to configure builds, check out the [Builds](/guides/builds) guide section.

For more information on how to configure a service's deployment lifecycle, like the Start command, check out the [Deployments](/guides/deployments) guide section.
