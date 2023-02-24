---
title: CLI
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645060494/docs/CLIexample_fiflvb.gif"
alt="GIF of the CLI in Action"
layout="intrinsic"
width={800} height={468} quality={100} />

The Railway command line interface (CLI) connects your code to your Railway project from the command line.

The Railway CLI allows you to

- Create new Railway projects from the terminal
- Link to an existing Railway project
- Pull down environment variables to run your project locally
- Open an interactive shell to a database within a project

## Install

Install with [Brew](https://brew.sh), [NPM](https://www.npmjs.com/package/@railway/cli) or [Scoop](https://scoop.sh).

### Homebrew

```bash
brew install railway
```

### NPM

```bash
npm i -g @railway/cli
```

You need to have => 16.x version of Nodejs installed.

### Shell Script

```bash
curl -fsSL https://railway.app/install.sh | sh
```

### Scoop

Use this method if you prefer to interact with Railway using a native Windows binary. In a PowerShell terminal enter the following command:

```ps1
scoop install railway
```

For additional documentation on Scoop, see [here](https://scoop-docs.vercel.app/).

### Source

You can also download the [prebuilt binary directly](https://github.com/railwayapp/cli/releases/latest) or [build from source](https://github.com/railwayapp/cli#from-source).

## Login

Login to your Railway account. Opens a browser tab which authenticates into an existing Railway session.

```bash
railway login
```

If there are any issues with Browser based login you can use the `--browserless` flag to authenticate.

### Project Token

You can use Project tokens to authenticate in environments that prevent you to authenticate with browsers such as CI environments.

Project tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway run`.

```bash
RAILWAY_TOKEN=XXXX railway run
```

## Link to a Project

Link to an existing Project under your Railway account or team.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/railway-link_juslvt.png"
alt="Screenshot of Railway"
layout="intrinsic"
width={389} height={116} quality={80} />

```bash
railway link
```

Pick from the list projects you have. You can also type to filter the list.

You can optionally pass the project ID as an argument to link to a specific project.

```bash
railway link <project-id>
```

## Link to a Service

Once you have linked to a project, if you have multiple services: you can link to a specific service within that project. Linking to a service will allow you to run commands against that service's variables and deploy to that service. using `up`

````bash

```bash
railway service
````

## Create a Project

Create a new project directly from the command line.

```bash
railway init
```

## Local Development

Run code inside your Railway environment. We connect your code to your
infrastructure hosted on Railway by injecting environment variables.

```bash
railway run <cmd>
```

For example, to run your node project with Railway's variables:

```bash
railway run npm start
```

If you have a Dockerfile in your project directory, you can just run
`railway run` with no arguments to build and run the Dockerfile.

## Local Shell

Open an interactive subshell loaded with your project's environment variables. This allows you to run commands locally that use the same environment variables as your Railway project.

```bash
railway shell
```

## Environments

Projects might have multiple environments, by default the CLI points to the `production` environment. If you'd like to use a different set of environment variables and a different deployment environment you can change the setting by:

```bash
railway environment
```

## Deploy

Deploy the linked project directory (if running from a subdirectory, the project root is still deployed).

```bash
# Show project logs
railway up
```

If there are multiple services within your project, the CLI will prompt you for a service to deploy to.

## Add Database Service

Provision a database service for a project. The CLI will prompt you

```bash
railway add
```

## Variables

Sometimes you need to access environment variables in your project. You can pull down the environment variables for a project with the `variables` command.

```bash
railway variables
```

Railway outputs a table of environment variables that are tied to your project or service.

## Scripting

Commands with the Railway CLI have a `--json` flag that will output the result of the command as JSON.

```bash
railway link --json
```

This is useful for scripting like piping the output of one command into another.

Commands on the Railway CLI have positional arguments and flags. Positional arguments are required and flags are optional. Flags are prefixed with `--` and can have a value or be a boolean flag.

```bash
railway link <project-id> --json
```

## Logout

```bash
railway logout
```

## Contributing

Our CLI is Open Source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on our [GitHub Repo](https://github.com/railwayapp/cli).

[You can see our documentation of the CLI API here.](/reference/cli-api)
