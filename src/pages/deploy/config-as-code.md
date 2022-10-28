---
title: Config as Code
---

<PriorityBoardingBanner />

Railway supports defining the configuration for a single deployment in a file
alongside your code. By default, we will look for a `railway.toml` or
`railway.json` file. Everything in the build and deploy sections of the service
settings page can be specified in this configuration file.

When a new deploy is triggered, Railway will look for any config files in your
code and combine these values with the settings from the dashboard. The
resulting build and deploy config will be used **only for the current deploy**.
The settings in the dashboard will not be updated with the settings defined in
code. Configuration defined in code will always override values from the
dashboard.

## Example

These configuration examples are equivalent.

### Toml

In a `railway.toml` file

```toml
[build]
builder = "nixpacks"
buildCommand = "echo building!"

[deploy]
startCommand = "echo starting!"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "never"
```

### Json

In a `railway.json` file

```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "echo building!"
  },
  "deploy": {
    "startCommand": "echo starting!",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "never"
  }
}
```

## Config Source Location

On the deployment details page, all of the settings that a deploy went out with are shown. For settings that comes from a configuration file, there is a little file icon. Hovering over the icon will show exactly what part of the file the values originated from.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666388941/docs/details-page-config-tooltip_jvy1qu.png"
alt="Screenshot of Deployment Details Pane"
layout="responsive"
width={948} height={419} quality={100} />

## Configurable Settings

Everything in the build and deploy sections of the service settings can be configured. The settings are...

### [Builder](/deploy/builds)

Set the builder for the deployment

```toml
[build]
builder = "nixpacks"
```

The available values are

- nixpacks
- dockerfile
- heroku
- paketo

### [Build command](/deploy/builds#build-command)

Build command to pass to the Nixpacks builder

```toml
[build]
buildCommand = "echo building"
```

### [Watch Patterns](/deploy/builds#watch-paths)

Array of patterns used to conditionally trigger deploys

```toml
[build]
watchPatterns = ["src/**"]
```

### [Dockerfile Path](/deploy/dockerfiles)

Location of non-standard Dockerfile path

```toml
[build]
dockerfilePath = "Dockerfile.backend"
```

### [Start Command](/deploy/deployments#start-command)

The command to run when starting the container

```toml
[deploy]
startCommand = "echo starting"
```

### [Healthcheck Path](/deploy/healthchecks)

Path to check after starting your deployment to ensure it is healthy

```toml
[deploy]
healthcheckPath = "/health"
```

### [Healthcheck Timeout](/deploy/healthchecks#timeout)

Number of seconds to wait for the healthcheck path to become healthy

```toml
[deploy]
healthcheckTimeout = 300
```

### [Restart Policy Type](/deploy/deployments#configurable-restart-policy)

How to handle the deployment crashing

```toml
[deploy]
restartPolicyType = "never"
```

The available values are

- never
- on_failure
- always

### Restart Policy Max Retries

The number of times to restart if the restart type is `on_failure`

```toml
[deploy]
restartPolicyMaxRetries = 5
```

## Custom Config File

You can use a custom config file by setting it on the service settings page. The file is relative to your app source.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666387423/docs/config-file-path_xvq4xj.png"
alt="Screenshot of Rollback Menu"
layout="responsive"
width={621} height={204} quality={100} />

## Environment Overrides

Configuration can be overriden for a specific environment by nesting it in an
`environments.[name]` block.

When resolving the settings for a deployment, Railway will use this priority order

1. Environment specific config in code
2. Base config in code
3. Service settings

The following example changes the start command just in the production
environment.

In a `railway.toml` file

```toml
[environments.production.deploy]
startCommand = "echo starting production!"
```

In a `railway.json` file

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

Deploys for all pull requests can be configured using a special `pr` environment. This configuration is applied only to deploys that belong to an ephemeral environment. When resolving the settings for a PR deployment, the following priority order is used:

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
