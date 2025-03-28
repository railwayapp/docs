---
title: Using Variables
description: Learn how to use variables and secrets across services on Railway.
---

Variables provide a way to manage configuration and secrets across services in Railway.

When defined, they are made available to your application as environment variables in the following scenarios:

- The build process for each service deployment.
- The running service deployment.
- The command invoked by `railway run <COMMAND>`
- The local shell via `railway shell`

In Railway, there is also a notion of configuration variables which allow you to control the behavior of the platform.

_Adding, updating, or removing variables, results in a set of [staged changes](/guides/staged-changes) that you must review and deploy, in order to apply them._

## Service Variables

Variables scoped to individual services can be defined by navigating to a service's "Variables" tab.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2026/v1678820924/docs/CleanShot_2023-03-14_at_12.07.44_2x_rpesxd.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2026} height={933} quality={100} />

#### Define a Service Variable

From a service's variables tab, click on `New Variable` to enter your variable into a form field, or use the `RAW Editor` to paste the contents of your `.env` or json-formatted file.

## Shared Variables

Shared variables help reduce duplication of variables across multiple services within the same project.

<Image src="https://res.cloudinary.com/railway/image/upload/v1669678393/docs/shared-variables-settings_vchmzn.png"
alt="Screenshot of Shared Variables Settings"
layout="responsive"
width={2402} height={1388} quality={100} />

#### Define a Shared Variable

From your Project Settings -> Shared Variables page, choose the Environment, enter the variable name and value, and click `Add`.

#### Use a Shared Variable

To use a shared variable, either click the Share button from the Project Settings -> Shared Variables menu and select the services with which to share, or visit the Variables tab within the service itself and click "Shared Variable".

Adding a shared variables to a service creates a [Reference Variable](/guides/variables#referencing-a-shared-variable) in the service.

## Reference Variables

Reference variables are those defined by referencing variables in other services, shared variables, or even variables in the same service.

When using reference variables, you also have access to [Railway-provided variables](#railway-provided-variables).

Railway's [template syntax](/reference/variables#template-syntax) is used when defining reference variables.

### Referencing a Shared Variable

Use the following syntax to reference a shared variable:

- `${{ shared.VARIABLE_KEY }}`

<Collapse slug="referencing-a-shared-variable-example" title="Example">
- You have a shared variable defined in your project called `API_KEY`, and you need to make the API key available to a service.  Go to the service's variables tab, and add a variable with the following value:
  - `API_KEY=${{shared.API_KEY}}`
</Collapse>

### Referencing Another Service's Variable

Use the following syntax to reference variables in another service:

- `${{SERVICE_NAME.VAR}}`

<Collapse slug="referencing-another-services-variable-example" title="Example">
- You have a variable set on your database service called `DATABASE_URL` which contains the connection string to connect to the database.  The database service name is **Clickhouse**.

- You need to make this connection string available to another service in the project. Go to the service's variables that needs the connection string and add a variable with the following value:

  - `DATABASE_URL=${{ Clickhouse.DATABASE_URL }}`

- Your frontend service needs to make requests to your backend. You do not want to hardcode the backend URL in your frontend code. Go to your frontend service settings and add the [Railway-provided variable](/develop/variables#railway-provided-variables) for the backend URL

  - `API_URL=https://${{ backend.RAILWAY_PUBLIC_DOMAIN }}`

</Collapse>

### Referencing Variables in the Same Service

Use the following syntax to reference variables in the same service:

- `${{ VARIABLE_NAME }}`

<Collapse slug="referencing-variables-in-the-same-service-example" title="Example">
- You have the variables needed to construct an API endpoint already defined in your service - `BASE_URL` and `AUTH_PATH` - and you would like to combine them to create a single variable.  Go to your service variables and add a new variable referencing other variables in the same service -
  - `AUTH_ENDPOINT=https://${{ BASE_URL }}/${{ AUTH_PATH }}`
</Collapse>

### Autocomplete Dropdown

The Railway dashboard provides an autocomplete dropdown in both the name and value fields to help create reference variables.

<Image src="https://res.cloudinary.com/railway/image/upload/c_scale,w_2000/v1678823846/docs/CleanShot_2023-03-14_at_12.56.56_2x_mbb6hu.png"
alt="Screenshot of Variables Pane"
layout="responsive"
width={2408} height={1150} quality={100} />

## Sealed Variables

<Banner variant="info">This feature is in beta. For questions or feedback, please use the <Link target="_blank" rel="noopener" className="underline" href="https://station.railway.com/feedback/sealed-variables-c1317d54">feedback thread</Link>.</Banner>

Railway provides the ability to seal variable values for extra security. When a variable is sealed, its value is provided to builds and deployments but is never visible in the UI nor can it be retrieved via the API.

### Sealing a Variable

To seal an existing variable, click the 3-dot menu on the right-side of the variable and choose the "Seal" option.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743199483/docs/seal_ky7w4s.png"
alt="Seal an existing variable"
layout="responsive"
width={1200} height={552} quality={100} />

### Updating a Sealed Variable

Sealed variables can be updated by clicking the edit option in the 3-dot menu just like normal variables but they cannot be updated via the Raw Editor.

### Caveats

Sealed variables are a security-first feature and with that come some constraints:

- Sealed variables cannot be un-sealed.
- Sealed variable values are not provided when using `railway variables` or `railway run` via the CLI.
- Sealed variables are not copied over when creating PR environments.
- Sealed variables are not copied when duplicating an environment.
- Sealed variables are not copied when duplicating a service.
- Sealed variables are not shown as part of the diff when syncing environment changes.
- Sealed variables are not synced with external integrations.

## Railway-provided Variables

Railway provides many variables to help with development operations. Some of the commonly used variables include -

- `RAILWAY_PUBLIC_DOMAIN`
- `RAILWAY_PRIVATE_DOMAIN`
- `RAILWAY_TCP_PROXY_PORT`

For an exhaustive list, please check out the [Variables Reference](/reference/variables#railway-provided-variables) page.

## Multiline Variables

Variables can span multiple lines. Press `Control + Enter` (`Cmd + Enter` on Mac) in the variable value input field to add a newline, or simply type a newline in the Raw Editor.

## Using Variables in Your Services

Variables are made available at runtime as environment variables. To use them in your application, simply use the interface appropriate for your language to retrieve environment variables.

For example, in a node app -

```node
process.env.VARIABLE_NAME;
```

#### Local Development

Using the Railway CLI, you can run your code locally with the environment variables configured in your Railway project.

- Ensure that you have the Railway CLI installed and linked to your project
- In your terminal, execute `railway run <run command>`
  -> for example, `railway run npm run dev`

Check out the [CLI guide](/guides/cli#local-development) for more information on using the CLI.

## Import Variables from Heroku

You can import variables from an existing Heroku app using the command palette
on the service variables page. After connecting your Heroku account you can
select any of your Heroku apps and the config variables will be added to the current service and environment.

<Image src="/images/connect-heroku-account.png"
alt="Screenshot of connect Heroku account modal"
layout="responsive"
width={521} height={404} quality={100} />

## Using Doppler for Secrets Management

Our friends at Doppler maintain an integration that makes it easy to sync your secrets in Doppler to your project(s) in Railway.

You can get instructions on how to use Doppler with Railway on the <a href="https://docs.doppler.com/docs/railway" target="_blank">Doppler Docs
integration</a>.
