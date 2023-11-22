---
title: Managing Variables
---

Variables provide a way to manage configuration and secrets across services in Railway.

When defined, they are made available to your application as environment variables in the following scenarios:

- The build process for each service deployment.
- The running service deployment.
- The command invoked by `railway run <COMMAND>`
- The local shell via `railway shell`

In Railway, there is also a notion of configuration variables which allow you to control the behavior of the platform.

## Service variables

Variables scoped to individual services can be defined by navigating to a service's "Variables" tab.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2026/v1678820924/docs/CleanShot_2023-03-14_at_12.07.44_2x_rpesxd.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2026} height={933} quality={100} />

#### Define a service variable
From a service's variables tab, click on `New Variable` to enter your variable into a form field, or use the `RAW Editor` to paste the contents of your `.env` or json-formatted file.

## Shared Variables

Shared variables help reduce duplication of variables across multiple services within the same project.  

<Image src="https://res.cloudinary.com/railway/image/upload/v1669678393/docs/shared-variables-settings_vchmzn.png"
alt="Screenshot of Shared Variables Settings"
layout="responsive"
width={2402} height={1388} quality={100} />

#### Define a shared variable
From your Project Settings -> Shared Variables page, choose the Environment, enter the variable name and value, and click `Add`.

#### Use a shared variable
To use a shared variable, either click the Share button from the Project Settings -> Shared Variables menu and select the services with which to share, or visit the Variables tab within the service itself and click "Shared Variable".

Adding a shared variables to a service creates a [Reference Variable](/reference/variables#reference-variables) in the service.

## Reference Variables

Reference variables are those defined by referencing variables in other services, shared variables, or even variables in the same service.

When using reference variables, you also have access to [Railway-provided variables](/how-to/variables#railway-provided-variables).

Railway's [template syntax](/reference/variables#template-syntax) is used when defining reference variables.

### Referencing a Shared variable

Use the following syntax to reference a shared variable: 
- `${{ shared.VARIABLE_KEY }}`

<Collapse title="Example">
- You have a shared variable defined in your project called `API_KEY`, and you need to make the API key available to a service.  Go to the service's variables tab, and add a variable with the following value:
  - `API_KEY=${{shared.API_KEY}}`
</Collapse>

### Referencing another service's variable

Use the following syntax to reference variables in another service: 
- `${{SERVICE_NAME.VAR}}`

<Collapse title="Examples">
- You have a variable set on your database service called `DATABASE_URL` which contains the connection string to connect to the database.  The database service name is **Clickhouse**.

  You need to make this connection string available to another service in the project.  Go to the service's variables that needs the connection string and add a variable with the following value:
  - `DATABASE_URL=${{ Clickhouse.DATABASE_URL }}`

- Your frontend service needs to make requests to your backend.  You do not want to hardcode the backend URL in your frontend code.  Go to your frontend service settings and add the [Railway-provided variable](/develop/variables#railway-provided-variables) for the backend URL -
  - `API_URL=https://${{ backend.RAILWAY_PUBLIC_DOMAIN }}`
</Collapse>

### Referencing variables in the same service

Use the following syntax to reference variables in the same service: 
- `${{ VARIABLE_NAME }}`

<Collapse title="Example">
- You have the variables needed to construct an API endpoint already defined in your service - `BASE_URL` and `AUTH_PATH` - and you would like to combine them to create a single variable.  Go to your service variables and add a new variable referencing other variables in the same service -
  - `AUTH_ENDPOINT=https://${{ BASE_URL }}/${{ AUTH_PATH }}`
</Collapse>

### Autocomplete Dropdown

The Railway dashboard provides an autocomplete dropdown in both the name and value fields to help create reference variables.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2000/v1678823846/docs/CleanShot_2023-03-14_at_12.56.56_2x_mbb6hu.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2408} height={1150} quality={100} />

## Railway-provided Variables

Railway provides many variables to help with development operations.  Some of the commonly used variables include - 

- `RAILWAY_PUBLIC_DOMAIN`
- `RAILWAY_PRIVATE_DOMAIN`
- `RAILWAY_TCP_PROXY_PORT`

For an exhaustive list, please check out the [Variables Reference](/reference/variables#railway-provided-variables) page.

## Multiline Variables

Variables can span multiple lines. Press `Control + Enter` (`Cmd + Enter` on Mac) in the variable value input field to add a newline, or simply type a newline in the Raw Editor.

## Using Variables in your services

Variables are made available at runtime as environment variables.  To use them in your application, simply use the interface appropriate for your language to retrieve environment variables.

For example, in a node app -

```node
process.env.VARIABLE_NAME
```

#### Local development

Using the Railway CLI, you can run your code locally with the environment variables configured in your Railway project.  Check out the [CLI docs](/develop/cli#local-development) for the appropriate commands.

## Import Variables from Heroku

You can import variables from an existing Heroku app using the command palette
on the service variables page. After connecting your Heroku account you can
select any of your Heroku apps and the config variables will be added to the current service and environment.

<Image src="/images/connect-heroku-account.png"
alt="Screenshot of connect Heroku account modal"
layout="responsive"
width={521} height={404} quality={100} />