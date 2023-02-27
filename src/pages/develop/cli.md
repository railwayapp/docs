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

Pick from the list projects you have.

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

For example, to run your node project with Railway:

```bash
railway run npm start
```

If you have a Dockerfile in your project directory, you can just run
`railway run` with no arguments to build and run the Dockerfile.

## Local Shell

Open an interactive subshell loaded with your project's environment variables.

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

# Return immediately after uploading
railway up --detach
```

If there are multiple services within your project, the CLI will prompt you for a service to deploy to.

## Add Database Service

Provision a database service for a project.

```bash
railway add
```

## Connect to Database

Open an interactive shell to a database directly in the CLI.

```bash
railway connect
```

## Logout

```bash
railway logout
```

## Contributing

Our CLI is Open Source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on our [GitHub Repo](https://github.com/railwayapp/cli).

[You can see our documentation of the CLI API here.](/reference/cli-api)

## CLI v3 (Rust CLI)

<PriorityBoardingBanner />

The Railway CLI is currently undergoing a rewrite to improve the user experience and make it easier to maintain. The biggest change is that the new v3 CLI will use the new [Public API](/reference/public-api/) rather than undocumented routes. 

The new CLI is written in Rust and is currently in Priority Boarding. You can find the new CLI and installation instructions [here](https://github.com/railwayapp/cliv3). (Script coming soon.)

### What's New in CLI v3?

- The new CLI is written in Rust and is much faster than the previous version
- The new CLI has additional flags such as `--json` to output data in JSON format for scripting
- The new CLI has interactive search for services + projects to link to
- The new CLI now displays information about your data in cleaner, more readable tables
- New commands:
    - `railway service` helper command to link to a project's service
    - `railway add` now allows you to connect
    - `railway generate` now will generate a service domain for you without the need to connect to
    - `railway logs` now opens a direct websocket connection to the logs API and will stream logs in real time

- Added the `--json` flag to output data in JSON format for scripting
- CLI commands now allow you to explicitly specify the project and environment you want to use via flags. For example, `railway up --projectId <project-id> --environmentId <environment-id>`

### CLI v3 Deprecations
- Undocumented commands such as `railway protect` and `railway shell` will be removed. We are re-thinking how we want to handle these features and will be adding them back in the future
- `railway variables add` will no longer give you the option to add a secret. We are re-thinking how we want to handle the secret flow within the CLI now since the addition of [Shared Variables](/develop/variables#shared-variables)
- `railway down` will be sunset as we are looking into better ways to handle deployments and scaling
- `railway version` is being removed in favor of using `-V` or `--version` flags.
- `railway build` is being removed in favor of using `railway variables` to output a local .env file (also the name was confusing)
- `railway init` will no longer allow you to deploy a new Project with a Template. We have since re-worked the flow and realized that the Template deploy flow is best served in the dashboard

## Timeline

We hope to get the new CLI into our CLI offical release pipeline on **Friday 3 March 2023**. 

After this date, all _new_ installations from `npm`, `brew`, and the shell will install (v3.x.x).

We plan to deprecate the v2 CLI and the API routes it depends on in the future. The goal is to transition the CLI before fully transitioning the API routes.

We will be updating this page with more information as we get closer to the release date.
