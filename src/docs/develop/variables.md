---
title: Variables
---

Variables provide a powerful way to manage configuration and secrets across services in Railway.

When defined, they are made available to your application as environment variables in the following scenarios:

- The build process for each service deployment.
- The running service deployment.
- The command invoked by `railway run <COMMAND>`
- The local shell via `railway shell`

In Railway, there is also a notion of configuration variables which allow you to control the behavior of the platform.


## Service variables

Define variables scoped to individual services by navigating to a service's "Variables" tab.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2026/v1678820924/docs/CleanShot_2023-03-14_at_12.07.44_2x_rpesxd.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2026} height={933} quality={100} />

Click on `New Variable` to enter your new variable into a form field or use the `RAW Editor`.

### Raw Editor

If you already have a `.env` file, or simply prefer to edit text, the Raw Editor can be used to edit variables in either `.env` or `.json` format.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2000/v1678821397/docs/CleanShot_2023-03-14_at_12.15.56_2x_ankjja.png"
alt="Screenshot of Raw Editor"
layout="responsive"
width={1954} height={1303} quality={100} />

## Shared Variables

Shared variables help reduce duplication of variables across multiple services within the same project.  They are defined at the project environment level and can be added in Project Settings > Shared Variables.

<Image src="https://res.cloudinary.com/railway/image/upload/v1669678393/docs/shared-variables-settings_vchmzn.png"
alt="Screenshot of Shared Variables Settings"
layout="responsive"
width={2402} height={1388} quality={100} />

To use a shared variable, either click the Share button and select the desired services,
or visit the Variables tab within the service itself and click "Shared Variable".

<Image src="https://res.cloudinary.com/railway/image/upload/v1667332192/docs/shared-variables-picker_ryjble.png"
alt="Screenshot of Shared Variables Picker"
layout="responsive"
width={1784} height={1168} quality={100} />

Adding a shared variables to a service creates a [Reference Variable](/develop/variables#reference-variables) in the service.

## Reference Variables

Variables can be defined to reference variables in other services or to reference shared variables.  This is useful for ease of maintenace and security, allowing you to set a variable in a single place, wherever it makes the most sense.

Reference variables use Railway's [template syntax](/develop/variables#template-syntax) using a specific format - `${{NAMESPACE.VAR}}` - where `NAMESPACE` can either be a service's name or the value `shared` (depending on where the variable is defined that you need to access) and `VAR` is the variable name.

When using reference variables, you also have access to [Railway-provided variables](/develop/variables#railway-provided-variables).

### Example Scenarios

Here are some example scenarios to help clarify reference variable usage and syntax.

#### Referencing a Shared variable -
- You have a shared variable defined in your project called `API_KEY`, and you need to make the API key available to a service.  Go to the service's variables tab, and add a variable with the following value:
  - `API_KEY=${{shared.API_KEY}}`

#### Referencing another service's variables -
- You have a variable set on your database service called `DATABASE_URL` which contains the connection string to connect to the database.  The database service name is **Clickhouse**.

  You need to make this connection string available to another service in the project.  Go to the service's variables that needs the connection string and add a variable with the following value:
  - `DATABASE_URL=${{ Clickhouse.DATABASE_URL }}`

- Your frontend service needs to make requests to your backend.  You do not want to hardcode the backend URL in your frontend code.  Go to your frontend service settings and add the Railway-provided variable for the backend URL -
  - `API_URL=https://${{ backend.RAILWAY_PUBLIC_DOMAIN }}`

### Autocomplete Dropdown

The Railway dashboard also provides an autocomplete dropdown in both the name and
value fields to help create reference variables.

<Image src="https://res.cloudinary.com/railway/image/upload/v1699559731/docs/referenceVars_klvijr.gif"
alt="Screenshot of Variables Pane"
layout="responsive"
width={1108} height={1050} quality={100} />

## Multiline Variables

Variables can span multiple lines. Press `Control + Enter` (`Cmd + Enter` on Mac) in the variable value input field to add a newline, or simply type a newline in the Raw Editor.

## Template Syntax

Railway's templating syntax gives you flexibility in managing variables.  You can combine additional text or even other variables, to construct the values that you need.

```plaintext
DOMAIN=${{shared.DOMAIN}}
GRAPHQL_PATH=/v1/gql
GRAPHQL_ENDPOINT=https://${{DOMAIN}}/${{GRAPHQL_PATH}}
```

The example above illustrates a pattern of maintaining a Shared variable called `DOMAIN` and using that plus a Service variable to construct an endpoint.



## Using Variables in your services

Variables are made available at runtime as environment variables.  In order to use them in your code, simply use the package appropriate for your language to retrieve environment variables.

For example, in a node app -

```node
process.env.VARIABLE_NAME
```

#### Local development

Using the Railway CLI, you can run your code locally with the environment variables configured in your Railway project.  Check out the [CLI docs](/develop/cli#local-development) for the appropriate commands.

## Railway-Provided Variables

Railway provides the following additional system environment variables to all
builds and deployments.

| Name                           | Description                                                                                      |
|--------------------------------|--------------------------------------------------------------------------------------------------|
| `RAILWAY_PUBLIC_DOMAIN`        | The public service or customer domain, of the form `example.up.railway.app`                      |
| `RAILWAY_PRIVATE_DOMAIN`       | The private DNS name of the service.                                                             |
| `RAILWAY_TCP_PROXY_DOMAIN`     | (Beta-only; see [TCP Proxying](/deploy/exposing-your-app#tcp-proxying) for details) The public TCP proxy domain for the service, if applicable. Example: `roundhouse.proxy.rlwy.net` |
| `RAILWAY_TCP_PROXY_PORT`       | (Beta-only; see [TCP Proxying](/deploy/exposing-your-app#tcp-proxying) for details) The external port for the TCP Proxy, if applicable. Example: `11105`                             |
| `RAILWAY_TCP_APPLICATION_PORT` | (Beta-only; see [TCP Proxying](/deploy/exposing-your-app#tcp-proxying) for details) The internal port for the TCP Proxy, if applicable. Example: `25565`                             |
| `RAILWAY_PROJECT_NAME`         | The project name the service belongs to.                                                         |
| `RAILWAY_PROJECT_ID`           | The project id the service belongs to.                                                           |
| `RAILWAY_ENVIRONMENT_NAME`     | The environment name of the service instance.                                                    |
| `RAILWAY_ENVIRONMENT_ID`       | The environment id of the service instance.                                                      |
| `RAILWAY_SERVICE_NAME`         | The service name.                                                                                |
| `RAILWAY_SERVICE_ID`           | The service id.                                                                                  |
| `RAILWAY_REPLICA_ID`           | The replica ID for the deployment.                                                               |
| `RAILWAY_DEPLOYMENT_ID`        | The ID for the deployment.                                                                       |
| `RAILWAY_SNAPSHOT_ID`          | The snapshot ID for the deployment.                                                              |
| `RAILWAY_VOLUME_NAME`          | The name of the attached volume, if any. Example: `foobar`                                       |
| `RAILWAY_VOLUME_MOUNT_PATH`    | The mount path of the attached volume, if any. Example: `/data`                                  |

### Git Variables

These variables are provided if the deploy originated from a GitHub trigger.

| Name                         | Description                                                                                                                                                                                          |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `RAILWAY_GIT_COMMIT_SHA`     | The git [SHA](https://docs.github.com/en/github/getting-started-with-github/github-glossary#commit) of the commit that triggered the deployment. Example: `d0beb8f5c55b36df7d674d55965a23b8d54ad69b` |
| `RAILWAY_GIT_AUTHOR`         | The user of the commit that triggered the deployment. Example: `gschier`                                                                                                                             |
| `RAILWAY_GIT_BRANCH`         | The branch that triggered the deployment. Example: `main`                                                                                                                                            |
| `RAILWAY_GIT_REPO_NAME`      | The name of the repository that triggered the deployment. Example: `myproject`                                                                                                                       |
| `RAILWAY_GIT_REPO_OWNER`     | The name of the repository owner that triggered the deployment. Example: `mycompany`                                                                                                                 |
| `RAILWAY_GIT_COMMIT_MESSAGE` | The message of the commit that triggered the deployment. Example: `Fixed a few bugs`                                                                                                                 |

### User-Provided Configuration Variables

Users can use the following environment variables to configure Railway's behaviour.

| Name                                 | Description                                                                                                                                          |
|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `RAILWAY_DEPLOYMENT_OVERLAP_SECONDS` | How long the old deploy will overlap with the newest one being deployed, its default value is `20`. Example: `0`                                     |
| `RAILWAY_DOCKERFILE_PATH`            | The path to the Dockerfile to be used by the service, its default value is `Dockerfile`. Example: `Railway.dockerfile`                               |
| `NIXPACKS_CONFIG_FILE`               | The path to the Nixpacks configuration file relative to the root of the app, its default value is `nixpacks.toml`. Example: `frontend.nixpacks.toml` |
| `RAILWAY_HEALTHCHECK_TIMEOUT_SEC`    | The timeout length (in seconds) of healthchecks. Example: `300`                                                                                      |

## Import Variables from Heroku

You can import variables from an existing Heroku app using the command palette
on the service variables page. After connecting your Heroku account you can
select any of your Heroku apps and the config variables will be added to the current service and environment.

<Image src="/images/connect-heroku-account.png"
alt="Screenshot of connect Heroku account modal"
layout="responsive"
width={521} height={404} quality={100} />

## Service Discovery

You can reference other services' public URL via a service variable.

Use `RAILWAY_SERVICE_{ServiceName}_URL` to get the public URL of a service within your project. 

For example, if you have a service named `Backend API`, you can reference it from another service by using `RAILWAY_SERVICE_BACKEND_API_URL`.