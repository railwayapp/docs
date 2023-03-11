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

Install with [Brew](https://brew.sh), [NPM](https://www.npmjs.com/package/@railway/cli), Shell Script, or [Scoop](https://scoop.sh).

### NPM (Linux, macOS, Windows)

```bash
npm i -g @railway/cli
```

You need to have => 16.x version of [Node.js](https://nodejs.org/en/) installed.

### Shell Script (Linux, macOS, Windows: Git Bash)

```bash
curl -fsSL cli.new | sh
```

### Homebrew (Linux, macOS)

```bash
brew install railway
```
*Note: This will install 2.x.x, we are working on restoring installs on Brew.*

### Scoop (Windows)

Use this method if you prefer to interact with Railway using a native Windows binary. In a PowerShell terminal enter the following command:

```ps1
scoop install railway
```

For additional documentation on Scoop, see [here](https://scoop.sh/).

### Source

You can also download the [prebuilt binary directly](https://github.com/railwayapp/cli/releases/latest) or [build from source](https://github.com/railwayapp/cli#from-source).

## Authentication

### Interactive Login

Login to your Railway account. This command opens a browser tab which authenticates into an existing Railway session.

```bash
railway login
```

If there are any issues with browser-based login you can use the `--browserless` flag to authenticate.

This will print a URL and a pairing code to the terminal which you can use to authenticate (useful for SSH sessions).


### Project Tokens

You can use Project Tokens to authenticate in cases where user input/interaction is not possible, such as in CI/CD pipelines.

Project tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_TOKEN=XXXX railway run
```
## Usage

### Link to a Project

Associate a project and environment with your current directory

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/railway-link_juslvt.png"
alt="Screenshot of Railway"
layout="intrinsic"
width={389} height={116} quality={80} />

```bash
# Link to a project
railway link
```
Prompts you to select a team, project, and environment to associate with your current directory. Any future commands will be run against this project and environment.


### Create a Project

Create a new project directly from the command line.

```bash
# Create a new project
railway init
```
Prompts you to name your project and select a team to create the project in.


### Local Development

Run code locally with the same environment variables as your Railway project.

```bash
# Run <cmd> locally with the same environment variables as your Railway project
railway run <cmd>
```

For example, to run your Node.js project with your remote environment variables:

```bash
# Run your Node.js project with your remote environment variables
railway run npm start
```

### Local Shell

Open a new shell with Railway environment variables. Similar to `railway run` but opens a new shell.

```bash
# Open a new shell with Railway environment variables
railway shell
```

### Environments

Projects might have multiple environments, but by default the CLI links to the `production` environment. You can change the linked environment with the `environment` command.

```bash
# Change the linked environment
railway environment
```

### Deploy

Deploy the linked project directory (if running from a subdirectory, the project root is still deployed).

```bash
# Show build logs
railway up

# Return immediately after uploading
railway up --detach
```

If there are multiple services within your project, the CLI will prompt you for a service to deploy to.

### Add Database Service

Provision plugins (databases) for a project.

```bash
railway add
```
Prompts you to select one or more plugins to provision for your project.

### Logout

```bash
railway logout
```

### Contributing

Our CLI is open source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on our [GitHub Repo](https://github.com/railwayapp/cli).

[You can see our documentation of the CLI API here.](/reference/cli-api)

## CLI v3 Changes

The Railway CLI recently underwent a rewrite to improve the user experience and make it easier to maintain. The biggest change is that the new v3 CLI will use the new [Public API](/reference/public-api/) rather than undocumented routes.

The new CLI is written in Rust and is currently available via all release channels.

### What's New?

- The new CLI is written in Rust and is much faster than the previous version
- The new CLI has interactive search for services + projects to link to
- The new CLI now displays information about your data in cleaner, more readable tables
- The new CLI has additional flags such as `--json` to output data in JSON format for scripting
- New commands:

  - `railway service` helper command to link to a project's service
  - `railway add` now allows you to provision multiple database types at once
  - `railway domain` now will generate a service domain
  - `railway logs` now opens a direct websocket connection to the logs API and will stream logs in real time

- Added the `--json` flag to output data in JSON format for scripting
- CLI commands now allow you to explicitly specify the project and environment you want to use via flags.

### Deprecations

- Undocumented commands such as `railway protect` and `railway shell` will be removed. We are re-thinking how we want to handle these features and will be adding them back in the future
- `railway variables add` will no longer give you the option to add a secret. We are re-thinking how we want to handle the secret flow within the CLI now since the addition of [Shared Variables](/develop/variables#shared-variables)
- `railway down` will be sunset as we are looking into better ways to handle deployments and scaling
- `railway version` is being removed in favor of using `-V` or `--version` flags.
- `railway build` is being removed in favor of using `railway variables` to output a local .env file (also the name was confusing)
- `railway init` will no longer allow you to deploy a new Project with a Template. We have since re-worked the flow and realized that the Template deploy flow is best served in the dashboard
