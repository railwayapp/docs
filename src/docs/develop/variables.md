---
title: Variables
---

Service variables are provided whenever you build, deploy, or run `railway run`. When 
defined, they are made available to you application at runtime as environment variables.

Variables are made available in the following scenarios:

- The build process for each service deployment,
- The running service deployment, and
- The command invoked by `railway run <COMMAND>`.

## Defining Variables

Variables can be added via the Railway Dashboard by navigating to a service's "Variables" tab.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2026/v1678820924/docs/CleanShot_2023-03-14_at_12.07.44_2x_rpesxd.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2026} height={933} quality={100} />

You can view all variables for the current environment using the [Railway CLI](/develop/cli) with 
`railway variables` and change the environment with `railway environment`.

### Raw Editor 

If you already have a `.env` file, or simply prefer to edit text, the Raw Editor can be used to edit variables in either `.env` or `.json` format.

**_NOTE: If you initialize a new project from the CLI and an .env file is detected, Railway will prompt you to import it into your new project._**

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2000/v1678821397/docs/CleanShot_2023-03-14_at_12.15.56_2x_ankjja.png"
alt="Screenshot of Raw Editor"
layout="responsive"
width={1954} height={1303} quality={100} />

Variables can be defined as simple key/value pairs or as [Templated Variables](#templated-variables) (eg. `${{Postgres.DATABASE_URL}}`), 
which can dynamically reference other variables, shared variables, or plugin variables (more on this below).

### Multiline Variables

Variables can span multiple lines. Press `Control+Enter` (`cmd+Enter` on Mac) in the variable value input field to add a newline, or simply type a newline in the Raw Editor.

## Railway-Provided Variables

Railway provides the following additional system environment variables to all
builds and deployments.

| Name                              | Description                                                                                                                                                                                          |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `RAILWAY_STATIC_URL`              | The public domain, of the form `example.up.railway.app`                                                                                                                                              |
| `RAILWAY_GIT_COMMIT_SHA`          | The git [SHA](https://docs.github.com/en/github/getting-started-with-github/github-glossary#commit) of the commit that triggered the deployment. Example: `d0beb8f5c55b36df7d674d55965a23b8d54ad69b` |
| `RAILWAY_GIT_AUTHOR`              | The user of the commit that triggered the deployment. Example: `gschier`                                                                                                                             |
| `RAILWAY_GIT_BRANCH`              | The branch that triggered the deployment. Example: `main`                                                                                                                                            |
| `RAILWAY_GIT_REPO_NAME`           | The name of the repository that triggered the deployment. Example: `myproject`                                                                                                                       |
| `RAILWAY_GIT_REPO_OWNER`          | The name of the repository owner that triggered the deployment. Example: `mycompany`                                                                                                                 |
| `RAILWAY_GIT_COMMIT_MESSAGE`      | The message of the commit that triggered the deployment. Example: `Fixed a few bugs`                                                                                                                 |
| `RAILWAY_HEALTHCHECK_TIMEOUT_SEC` | The timeout length (in seconds) of healthchecks. Example: `300`                                                                                                                                      |
| `RAILWAY_ENVIRONMENT`             | The railway environment for the deployment. Example: `production`                                                                                                                                    |

## Reference Variables

Variables can use the `${{VAR}}` or `${{NAMESPACE.VAR}}` syntax to reference
other service variables, shared variables, or plugin variables. 

The Railway dashboard provides an autocomplete dropdown in both the name and 
value fields to help create these references.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2000/v1678823846/docs/CleanShot_2023-03-14_at_12.56.56_2x_mbb6hu.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2408} height={1150} quality={100} />

### Plugin Variables

Railway plugins offer a number variables that can be referenced by Railway services. To include a plugin variable,
create a reference to the variable using the `${{<PLUGIN_NAME>.<VARIABLE_NAME>}}` syntax.

```plaintext
DATABASE_URL=${{Postgres.DATABASE_URL}}
CACHE_HOST=${{Redis.REDISHOST}}
PRISMA_DB=${{Postgres.DATABASE_URL}}?connection_limit=100
```

**_NOTE: Railway's autocomplete will help create these references so you don't need to remember the exact syntax._**

### Shared Variables

Shared variables help reduce duplication of variables across multiple services within the same project. They are 
defined at the project environment level and can be added in Project Settings > Shared Variables.

<Image src="https://res.cloudinary.com/railway/image/upload/v1669678393/docs/shared-variables-settings_vchmzn.png"
alt="Screenshot of Shared Variables Settings"
layout="responsive"
width={2402} height={1388} quality={100} />

To use a shared variable, either click the Share button and select the desired services,
or visit the Variables tab within the service itself and click "Insert Shared Variable".

<Image src="https://res.cloudinary.com/railway/image/upload/v1667332192/docs/shared-variables-picker_ryjble.png"
alt="Screenshot of Shared Variables Picker"
layout="responsive"
width={1784} height={1168} quality={100} />

Under the hood, adding a shared variables to a service creates a new variable that references the shared variable using Railway's templating syntax (eg. `NAME=${{shared.NAME}}`).
This means that shared variables can be combined with additional text or even other variables, like the following examples illustrate.

```plaintext
DOMAIn           = ${{shared.DOMAIN}}
URL              = https://${{shared.DOMAIN}}
GRAPHQL_ENDPOINT = https://${{shared.DOMAIN}}/${{GRAPHQL_PATH}}
```

## Import Variables from Heroku

You can import variables from an existing Heroku app using the command palette
on the service variables page. After connecting your Heroku account you can
select any of your Heroku apps and the config variables will be added to the current service and environment.

<Image src="/images/connect-heroku-account.png"
alt="Screenshot of connect Heroku account modal"
layout="responsive"
width={521} height={404} quality={100} />
