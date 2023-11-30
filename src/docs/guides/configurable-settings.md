---
title: Configurable Settings with Config as Code
---

Everything in the build and deploy sections of the service settings can be configured using config as code.

Explore the sections below for information on specific settings.


{/* codegen:start do not edit this comment */}
## Specify the Builder

Set the builder for the deployment.

```toml
[build]
builder = "NIXPACKS"
```

Possible values are:
- `NIXPACKS`
- `DOCKERFILE`

Note: Railway will always build with a Dockerfile if it finds one. To build with nixpacks, you can remove or rename the Dockerfile.

Read more about Builds [here](/how-to/configure-builds).


## Watch Patterns

Array of patterns used to conditionally trigger a deploys.

```toml
[build]
watchPatterns = ["src/**"]
```

Read more about watch patterns [here](/how-to/build-controls#configure-watch-paths).

## Build Command

Build command to pass to the Nixpacks builder.

```toml
[build]
buildCommand = "yarn run build"
```

This field can be set to `null`.

Read more about the build command [here](/how-to/build-controls#customize-the-build-command).

## Dockerfile Path

Location of non-standard Dockerfile.

```toml
[build]
dockerfilePath = "Dockerfile.backend"
```

This field can be set to `null`.

More about building from a Dockerfile [here](/how-to/build-from-a-dockerfile).

## Nixpacks Config Path

Location of a non-standard [Nixpacks](https://nixpacks.com/docs/configuration/file) config file.

```toml
[build]
nixpacksConfigPath = "nixpacks.toml"
```

This field can be set to `null`.

## Nixpacks Plan

Full nixpacks plan. See [the Nixpacks documentation](https://nixpacks.com/docs/configuration/file) for more info.

```toml
[build]
nixpacksPlan = "examples/node"
```

This field can be set to `null`.

You can also define specific options as follows.

```toml
[build.nixpacksPlan.phases.setup]
nixPkgs = ["...", "zlib"]
```

### Custom Install Command

Use nixpacksPlan to configure a custom install command.

```toml
[build.nixpacksPlan.phases.install]
dependsOn = ["setup"]
cmds = ["cd ../.. && yarn"]
```

## Nixpacks Version

EXPERIMENTAL: USE AT YOUR OWN RISK!.

Version of Nixpacks to use. Must be a valid Nixpacks version. 

```toml
[build]
nixpacksVersion = "1.13.0"
```

This field can be set to `null`.

## Start Command

The command to run when starting the container.

```toml
[deploy]
startCommand = "echo starting"
```

This field can be set to `null`.

Read more about the start command [here](/how-to/configure-deployment-lifecycle#configure-the-start-command).

## Number of Replicas

For horizontal scaling, the number of instances to run for the deployment.

```toml
[deploy]
numReplicas = 2
```

This field can be set to `null`.

Read more about horizontal scaling [here](/how-to/optimize-deployments#configure-horizontal-scaling).

## Healthcheck Path

Path to check after starting your deployment to ensure it is healthy.

```toml
[deploy]
healthcheckPath = "/health"
```

This field can be set to `null`.

Read more about the healthcheck path [here](/how-to/configure-deployment-lifecycle#configure-healthcheck-endpoint).

## Healthcheck Timeout

Number of seconds to wait for the healthcheck path to become healthy.

```toml
[deploy]
healthcheckTimeout = 300
```

This field can be set to `null`.

Read more about the healthcheck timeout [here](/how-to/configure-deployment-lifecycle#healthcheck-timeout).

## Restart Policy Type

How to handle the deployment crashing.

```toml
[deploy]
restartPolicyType = "ON_FAILURE"
```

Possible values are:
- `ON_FAILURE`
- `ALWAYS`
- `NEVER`

Read more about the Restart policy [here](/how-to/configure-deployment-lifecycle#restart-policy).

## Restart Policy Max Retries

Set the max number of retries for the restart policy.

```toml
[deploy]
restartPolicyMaxRetries = 5
```

This field can be set to `null`.

## Cron Schedule

[Cron schedule](/reference/cron-jobs) of the deployed service.

```toml
[deploy]
cronSchedule = "0 0 * * *"
```

This field can be set to `null`.

## Setting Environment Overrides

Configuration can be overridden for a specific environment by nesting it in a
`environments.[name]` block.

When resolving the settings for a deployment, Railway will use this priority order:
1. Environment specific config in code
2. Base config in code
3. Service settings

The following example changes the start command just in the production
environment.

In a `railway.toml` file:
```toml
[environments.production.deploy]
startCommand = "echo starting production!"
```

In a `railway.json` file:
```json
{
  "environments": {
    "production": {
      "deploy": {
        "startCommand": "echo starting production!"
      }
    }
  }
}
```

### PR Environment Overrides

Deployments for pull requests can be configured using a special `pr` environment. This configuration is applied only to deploys that belong to an ephemeral environment. When resolving the settings for a PR deployment, the following priority order is used:
1. Environment with the name of the ephemeral environment
2. Environment with the hardcoded name "pr"
3. Base environment of the pull request
4. Base config as code
5. Service settings

```json
{
  "environments": {
    "pr": {
      "deploy": {
        "startCommand": "echo 'start command for all pull requests!'"
      }
    }
  }
}
```


{/* codegen:end do not edit this comment */}

## Configuring a Build provider with Nixpacks

To define a build provider ahead of time, create a `nixpacks.toml` file and configure it like so:
```toml
providers = ["...", "python"]
```