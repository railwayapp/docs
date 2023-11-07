---
title: CLI
---

<Image src="https://res.cloudinary.com/railway/image/upload/v1645060494/docs/CLIexample_fiflvb.gif"
alt="GIF of the CLI in Action"
layout="intrinsic"
width={800} height={468} quality={100} />

The Railway Command Line Interface (CLI) lets you interact with your
Railway project from the command line, allowing you to:
- Create new Railway projects from the Terminal
- Link a local project directory to an existing Railway project
- Run services locally using environment variables from your Railway project
- And more!

## Installation

The Railway CLI can be installed via:
- [Homebrew](https://brew.sh) for macOS
- [npm](https://www.npmjs.com/package/@railway/cli) for macOS, Linux, and Windows
- [Scoop](https://scoop.sh) for Windows as a native `.exe` binary
- Direct Shell Script
- Downloading pre-built binaries
- Building from source

### Homebrew (macOS)

In a Terminal, enter the following command:

```bash
brew install railway
```

### npm (macOS, Linux, Windows)

In a Terminal, enter the following command:
```bash
npm i -g @railway/cli
```

This requires version =>16 of [Node.js](https://nodejs.org/en/).

### Shell Script (macOS, Linux, Windows via WSL)

In a Terminal, enter the following command:
```bash
bash <(curl -fsSL cli.new)
```

On Windows, you should use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install)
with a Bash shell.

### Scoop (Windows)

In a PowerShell terminal, enter the following command:
```ps1
scoop install railway
```

This installs a native Windows binary (`.exe`). To learn more about Scoop,
see [https://scoop.sh/](https://scoop.sh/).

### Pre-built Binaries

We publish [pre-built binaries](https://github.com/railwayapp/cli/releases/latest)
on our [GitHub repository](https://github.com/railwayapp/cli) that you can
download and use directly.

### From Source

The Railway CLI is an open source project on [GitHub](https://github.com/railwayapp/cli).
You can build a binary [from source](https://github.com/railwayapp/cli#from-source)
if you wish.

## Authentication

Before you can use the Railway CLI, you must authenticate the CLI to your Railway account:
```bash
railway login
```

This command opens a new tab in your default browser to the [https://railway.app](https://railway.app)
authentication page. Follow the instructions to complete the authentication process.

### Manual Login

You can also authenticate manually using a Pairing Code. This can be useful if
you're authenticating the CLI inside an environment without a browser (e.g. SSH
sessions).

Use the `--browserless` flag to authenticate manually:
```bash
railway login --browserless
```

This will print a URL and a Pairing Code to the Terminal, which you can use to
authenticate your CLI session. Follow the instructions to complete the authentication
process.

### Project Tokens

You can use [Project Tokens](/deploy/integrations#project-tokens) to authenticate
in cases where user input/interaction is not possible, such as in CI/CD pipelines.

Project Tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_TOKEN=XXXX railway run
```

## Usage

### Link to a Project

To associate a project and environment with your current directory:

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917786/docs/railway-link_juslvt.png"
alt="Screenshot of Railway"
layout="intrinsic"
width={389} height={116} quality={80} />

```bash
# Link to a project
railway link
```

This prompts you to select a team, project, and environment to associate with
your current directory. Any future commands will be run against this project and environment.

### Link to a Service

Associate a service in a project and environment with your current directory:

```bash
# Link to a service
railway service
```

This links your current directory with the chosen service.

### Create a Project

Create a new project directly from the command line.

```bash
# Create a new project
railway init
```
This prompts you to name your project and select a team to create the project in.

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

Projects might have multiple environments, but by default the CLI links to the `production` environment.
You can change the linked environment with the `environment` command.

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

[You can see the full documentation of the CLI API here.](/reference/cli-api)
