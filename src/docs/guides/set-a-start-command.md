---
title: Set a Start Command
---

A start command is the process used to run a Deployment's code, for example `python main.py` or `npm run start`.

Railway automatically configures the start command based on the code being
deployed, see [Build and Start Commands](/reference/build-and-start-commands) for more details

If your code uses a Dockerfile, the start command defaults to the `ENTRYPOINT` and/or `CMD` defined in the Dockerfile.

## Configure the Start Command

When necessary, start commands may be overridden, like for advanced use-cases such as deploying multiple projects from a single [monorepo](/how-to/deploy-a-monorepo).

When specifying a start command, the behavior of the image depends on type of build:
- **Dockerfile**: the start command overrides the Docker image's ENTRYPOINT in [exec form](https://docs.docker.com/engine/reference/builder/#exec-form-entrypoint-example)
- **Buildpack**: the start command is inserted as a [buildpack launch process](https://buildpacks.io/docs/app-developer-guide/run-an-app/#user-provided-shell-process)

<Image
src="https://res.cloudinary.com/railway/image/upload/v1637798815/docs/custom-start-command_a8vcxs.png"
alt="Screenshot of custom start command configuration"
layout="intrinsic"
width={1302} height={408} quality={80} />