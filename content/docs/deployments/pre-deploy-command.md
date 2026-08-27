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
- It runs in a reasonable amount of time — it occupies a slot in your build queue, and you can [cap how long it runs](#pre-deploy-timeout).
- It does not rely on the application running.
- It has the dependencies it needs to run installed in the application image.
- It does not attempt to read or write data to the volume or filesystem, that should instead be done as part of the start command.

<Banner variant="warning">Pre-deploy commands execute in a separate container from your application. Changes to the filesystem are not persisted and [volumes](/volumes) are not mounted.</Banner>

## Pre-deploy timeout

By default a pre-deploy command has no time limit. It runs until it exits, so a command that hangs — waiting on a lock, or on input that never arrives — will hold your deployment in progress rather than failing it.

Set **Pre-deploy Timeout** on the service settings page to cap how long the command can run. It accepts 1 to 3600 seconds (1 hour).

**The Pre-deploy Timeout field only appears once you have entered a pre-deploy command.** Adding an empty pre-deploy step is not enough — type the command first, and the timeout field appears beneath it. A timeout with no command does nothing, so it is not offered.

<Banner variant="info">Leaving the timeout empty keeps the default behavior: the command runs without a time limit.</Banner>

If the command is still running when the timeout expires, its container is removed and the deployment fails. With a 300-second timeout, that looks like:

```
Pre-deploy command timed out after 300 seconds
```

Choose a value with room to spare over your command's normal runtime — a migration that usually takes 30 seconds may take considerably longer against a larger database.

Clearing the pre-deploy command also clears its timeout.
