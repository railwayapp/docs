---
title: Build and Start Commands
---

Railway uses [Nixpacks](/reference/nixpacks) to build and deploy your code with zero configuration.  Build and Start commands are automatically detected when an image is built and deployed to a [service](/reference/services) in Railway.

If necessary, build and start commands can be manually configured.

## How it Works

Overrides are exposed in the service configuration to enable customizing the Build and Start commands.  When an override is configured, Railway uses the commands specified to build and start the service.

#### Build Command

The command to build the service, for example `yarn run build`. Override the detected build command by setting a value in your service settings.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664564851/docs/build-command_vhuify.png"
alt="Screenshot of Railway Build Command"
layout="responsive"
width={745} height={238} quality={80} />

#### Start Command

Railway automatically configures the start command based on the code being deployed.  

If your code uses a [Dockerfile](/reference/dockerfiles), the start command defaults to the `ENTRYPOINT` and/or `CMD` defined in the Dockerfile.

Override the detected start command by setting a value in your service settings.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />

## Support

For more information on how to configure builds, check out the [Builds](/guides/builds) guide section.

For more information on how to configure a service's deployment lifecycle, like the Start command, check out the [Deployments](/guides/deployments) guide section.