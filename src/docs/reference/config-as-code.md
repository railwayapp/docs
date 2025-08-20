---
title: Config as Code
description: Learn how to manage and deploy apps on Railway using config as code with toml and json files.
---

Railway supports defining the configuration for a single deployment in a file
alongside your code. By default, we will look for a `railway.toml` or
`railway.json` file.

Everything in the build and deploy sections of the service
settings can be specified in this configuration file.

## How does it work?

When a new deployment is triggered, Railway will look for any config files in your
code and combine these values with the settings from the dashboard.

The resulting build and deploy config will be used **only for the current deployment**.

The settings in the dashboard will not be updated with the settings defined in
code.

Configuration defined in code will always override values from the
dashboard.

## Config Source Location

On the deployment details page, all the settings that a deployment went out with are shown. For settings that come from a configuration file, there is a little file icon. Hovering over the icon will show exactly what part of the file the values originated from.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743195106/docs/configuration_emrjth.png"
alt="Screenshot of Deployment Details Pane"
layout="responsive"
width={1200} height={631} quality={100} />

## Configurable Settings

### Specify the Builder

Set the builder for the deployment.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  }
}
```

Possible values are:

- `NIXPACKS`
- `DOCKERFILE`

Note: Railway will always build with a Dockerfile if it finds one. To build with nixpacks, you can remove or rename the Dockerfile.

Read more about Builds [here](/guides/builds).

### Watch Patterns

Array of patterns used to conditionally trigger a deploys.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "watchPatterns": ["src/**"]
  }
}
```

Read more about watch patterns [here](/guides/build-configuration#configure-watch-paths).

### Build Command

Build command to pass to the Nixpacks builder.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "buildCommand": "yarn run build"
  }
}
```

This field can be set to `null`.

Read more about the build command [here](/reference/build-and-start-commands#build-command).

### Dockerfile Path

Location of non-standard Dockerfile.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "dockerfilePath": "Dockerfile.backend"
  }
}
```

This field can be set to `null`.

More about building from a Dockerfile [here](/reference/dockerfiles).

### Nixpacks Config Path

Location of a non-standard [Nixpacks](https://nixpacks.com/docs/configuration/file) config file.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "nixpacksConfigPath": "backend_nixpacks.toml"
  }
}
```

This field can be set to `null`.

### Nixpacks Plan

Full nixpacks plan. See [the Nixpacks documentation](https://nixpacks.com/docs/configuration/file) for more info.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "nixpacksPlan": {
      "providers": ["python", "node"],
      "phases": {
        "install": {
          "dependsOn": ["setup"],
          "cmds": ["npm ci"]
        }
      }
    }
  }
}
```

This field can be set to `null`.

You can also define specific options as follows.

In this example, we are adding ffmpeg to the setup phase.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "nixpacksPlan": {
      "phases": {
        "setup": {
          "nixPkgs": ["...", "ffmpeg"]
        }
      }
    }
  }
}
```

#### Custom Install Command

Use nixpacksPlan to configure a custom install command.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "nixpacksPlan": {
      "phases": {
        "install": {
          "dependsOn": ["setup"],
          "cmds": ["npm install --legacy-peer-deps"]
        }
      }
    }
  }
}
```

### Nixpacks Version

EXPERIMENTAL: USE AT YOUR OWN RISK!.

Version of Nixpacks to use. Must be a valid Nixpacks version.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "nixpacksVersion": "1.29.1"
  }
}
```

This field can be set to `null`.

You can also use the `NIXPACKS_VERSION` [configuration variable](https://docs.railway.com/reference/variables#user-provided-configuration-variables) to set the Nixpacks version.

### Start Command

The command to run when starting the container.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "node index.js"
  }
}
```

This field can be set to `null`.

Read more about the start command [here](/reference/build-and-start-commands#start-command).

### Pre-deploy Command

The command to run before starting the container.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "preDeployCommand": ["npm run db:migrate"]
  }
}
```

This field can be omitted.

Read more about the pre-deploy command [here](/guides/pre-deploy-command).

### Multi-region Configuration

Horizontal scaling across multiple regions, with two replicas in each region.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "multiRegionConfig": {
      "us-west2": {
        "numReplicas": 2
      },
      "us-east4-eqdc4a": {
        "numReplicas": 2
      },
      "europe-west4-drams3a": {
        "numReplicas": 2
      },
      "asia-southeast1-eqsg3a": {
        "numReplicas": 2
      }
    }
  }
}
```

This field can be set to `null`.

Read more about horizontal scaling with multiple regions [here](/reference/scaling#multi-region-replicas).

### Healthcheck Path

Path to check after starting your deployment to ensure it is healthy.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "healthcheckPath": "/health"
  }
}
```

This field can be set to `null`.

Read more about the healthcheck path [here](/reference/healthchecks).

### Healthcheck Timeout

Number of seconds to wait for the healthcheck path to become healthy.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

This field can be set to `null`.

Read more about the healthcheck timeout [here](/reference/healthchecks).

### Restart Policy Type

How to handle the deployment crashing.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "restartPolicyType": "ALWAYS"
  }
}
```

Possible values are:

- `ON_FAILURE`
- `ALWAYS`
- `NEVER`

Read more about the Restart policy [here](/guides/restart-policy).

### Restart Policy Max Retries

Set the max number of retries for the restart policy.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "restartPolicyType": "ALWAYS",
    "restartPolicyMaxRetries": 5
  }
}
```

This field can be set to `null`.

Read more about the Restart policy [here](/guides/restart-policy).

### Cron Schedule

[Cron schedule](/reference/cron-jobs) of the deployed service.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "cronSchedule": "*/15 * * * *"
  }
}
```

This field can be set to `null`.

### Setting Environment Overrides

Configuration can be overridden for a specific environment by nesting it in a
`environments.[name]` block.

When resolving the settings for a deployment, Railway will use this priority order:

1. Environment specific config in code
2. Base config in code
3. Service settings

The following example changes the start command just in the production
environment.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "environments": {
    "staging": {
      "deploy": {
        "startCommand": "npm run staging"
      }
    }
  }
}
```

#### PR Environment Overrides

Deployments for pull requests can be configured using a special `pr` environment. This configuration is applied only to deploys that belong to an ephemeral environment. When resolving the settings for a PR deployment, the following priority order is used:

1. Environment with the name of the ephemeral environment
2. Environment with the hardcoded name "pr"
3. Base environment of the pull request
4. Base config as code
5. Service settings

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "environments": {
    "pr": {
      "deploy": {
        "startCommand": "npm run pr"
      }
    }
  }
}
```

### Configuring a Build provider with Nixpacks

To define a build provider ahead of time, create a `nixpacks.toml` file and configure it like so:

```toml
providers = ["...", "python"]
```

### Deployment Teardown

You can configure [Deployment Teardown](/guides/deployment-teardown) settings to tune the behavior of zero downtime deployments on Railway.

#### Overlap Seconds

Time in seconds that the previous deploy will overlap with the newest one being deployed. Read more about the deployment's lifecycle [here](/reference/deployments).

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "overlapSeconds": "60"
  }
}
```

This field can be set to `null`.

#### Draining Seconds

The time in seconds between when the previous deploy is sent a SIGTERM to the time it is sent a SIGKILL. Read more about the deployment's lifecycle [here](/reference/deployments).

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "drainingSeconds": "10"
  }
}
```

This field can be set to `null`.
