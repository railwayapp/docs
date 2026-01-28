---
title: Add a Pre-Deploy Command
description: Learn how to execute commands between building and deploying your application.
---

Pre-deploy commands execute between building and deploying your application, handling tasks like database migrations or data seeding before your application runs.
They execute within your private network and have access to your application's environment variables.

If your command fails, it will not be retried and the deployment will not proceed.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1736533539/docs/pre-deploy-command_sp1zqh.png"
alt="Screenshot of pre-deploy command configuration"
layout="intrinsic"
width={1494} height={644} quality={80} />

For pre-deploy commands to work correctly, ensure that:

- It exits with a status code of `0` to indicate success or non-zero to indicate failure.
- It runs in a reasonable amount of time. It will occupy a slot in your build queue.
- It does not rely on the application running.
- It has the dependencies it needs to run installed in the application image.
- It does not attempt to read or write data to the volume or filesystem, that should instead be done as part of the start command.

<Banner variant="warning">Pre-deploy commands execute in a separate container from your application. Changes to the filesystem are not persisted and [volumes](/reference/volumes) are not mounted.</Banner>
