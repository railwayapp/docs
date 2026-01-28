---
title: CLI
description: Learn how to install and use the Railway CLI to manage your projects.
---

The Railway Command Line Interface (CLI) lets you interact with your Railway project from the command line.

<Image src="https://res.cloudinary.com/railway/image/upload/v1645060494/docs/CLIexample_fiflvb.gif"
alt="GIF of the CLI in Action"
layout="intrinsic"
width={800} height={468} quality={100} />

## Installing the CLI

The Railway CLI can be installed via Homebrew, npm, Scoop, or directly from the source.

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

On Windows, you should use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) with a Bash shell.

### Scoop (Windows)

In a PowerShell terminal, enter the following command:

```ps1
scoop install railway
```

This installs a native Windows binary (`.exe`). To learn more about Scoop, see [https://scoop.sh/](https://scoop.sh/).

### Pre-built Binaries

We publish [pre-built binaries](https://github.com/railwayapp/cli/releases/latest) on our [GitHub repository](https://github.com/railwayapp/cli) that you can download and use directly.

### From Source

The Railway CLI is an open source project on [GitHub](https://github.com/railwayapp/cli). You can build a binary [from source](https://github.com/railwayapp/cli#from-source) if you wish.

## Authenticating With the CLI

Before you can use the Railway CLI, you must authenticate the CLI to your Railway account:

```bash
railway login
```

This command opens a new tab in your default browser to the [https://railway.com](https://railway.com) authentication page. Follow the instructions to complete the authentication process.

### Manual Login

You can also authenticate manually using a Pairing Code. This can be useful if you're authenticating the CLI inside an environment without a browser (e.g. SSH sessions).

Use the `--browserless` flag to authenticate manually:

```bash
railway login --browserless
```

### Tokens

In situations where user input or interaction isn't possible, such as in CI/CD pipelines, you can set either the `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN` environment variable, based on your specific requirements as detailed below.

A [Project Token](/public-api#project-token) is set via the `RAILWAY_TOKEN` environment variable.

An [Account](/public-api#team-tokens-and-account-tokens) or [Team](/public-api#team-tokens-and-account-tokens) Token is set via the `RAILWAY_API_TOKEN` environment variable.

**Note:** You can only use one type of token at a time. If both are set, the `RAILWAY_TOKEN` variable will take precedence.

#### Project Tokens

You can use [Project Tokens](/public-api#project-token) to authenticate project-level actions.

Project Tokens allow the CLI to access all the project-level actions in the environment set when the token was created.

Some actions you can perform with a project token include -

- Deploying code - `railway up`
- Redeploying a deployment - `railway redeploy`
- Viewing build and deployment logs - `railway logs`

Some actions you **cannot** perform with a project token include -

- Creating a new project - `railway init`
- Printing information about the user - `railway whoami`
- Linking to another workspace - `railway link`

Use the token by setting the `RAILWAY_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX railway up
```

#### Account Tokens

Account Tokens come in two types - Personal Account Tokens and Team Tokens.

You can use Account Tokens to authenticate all CLI actions across all workspaces.

However, you can only use Team tokens to authenticate actions on projects within the workspace the token was scoped to when it was created.

Some actions you can perform with a personal account token include -

- Creating a new project - `railway init`
- Printing information about the user - `railway whoami`

Some actions you **cannot** perform with Team Token include -

- Printing information about the user - `railway whoami`
- Linking to another workspace - `railway link`

Use the token by setting the `RAILWAY_API_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_API_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX railway whoami
```

## Common Examples

Below are some of the most commonly used CLI commands.

### Link to a Project

To associate a project and environment with your current directory:

```bash
railway link
```

This prompts you to select a team, project, and environment to associate with your current directory. Any future commands will be run against this project and environment.

### Link to a Service

Associate a service in a project and environment with your current directory:

```bash
railway service
```

### Create a Project

Create a new project directly from the command line.

```bash
railway init
```

This prompts you to name your project and select a team to create the project in.

### Local Development

Run code locally with the same environment variables as your Railway project.

```bash
railway run <cmd>
```

For example, to run your Node.js project with your remote environment variables:

```bash
railway run npm start
```

### Local Shell

Open a new local shell with Railway environment variables. Similar to `railway run` but opens a new shell.

```bash
railway shell
```

### Environments

Projects might have multiple environments, but by default the CLI links to the `production` environment. You can change the linked environment with the `environment` command.

```bash
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

Provision database services for a project.

```bash
railway add
```

Prompts you to select one or more databases to provision for your project.

### Logout

```bash
railway logout
```

## SSH

The Railway CLI enables you to start a shell session inside your deployed Railway services. This command is useful for:

- **Debugging and development**: Live debugging production issues, running ad-hoc commands, accessing language REPLs, and comparing environments to identify discrepancies.
- **Database operations**: Executing migrations and rollbacks, running recovery operations, importing database dumps, and managing job queues.
- **System administration**: Inspecting log files, monitoring service status, examining file systems, troubleshooting network issues, and modifying application-level configurations within the container.
- **Framework-specific tasks**: Accessing Rails console, Django shell, or NestJS CLI for model inspection, database queries, and large-scale data operations.
- **Content and asset management**: Verifying asset deployment, debugging file uploads, and troubleshooting static asset issues.

Note that this command differs from `railway run` and `railway shell`, which pull environment variables and execute commands locally.

### Prerequisites

Ensure you have the necessary setup in place:

1. **The Railway CLI installed** on your local machine.
2. **Logged in with your Railway account** using `railway login`.

### Usage

You can copy the exact command directly from the Railway dashboard:

1. Navigate to your project in the Railway dashboard.
2. Right-click on the service you want to connect to.
3. Select "Copy SSH Command" from the dropdown menu.

![image.png](https://res.cloudinary.com/railway/image/upload/v1752862935/copy-ssh-command.png)

This generates a complete command with all necessary IDs. Here's an example:

```bash
railway ssh --project=de609d2a-d70b-4457-8cb2-f1ce1410f779 --environment=f5bdd2a8-e2d1-4405-b814-eaa24fb9f7e8 --service=3ba723f0-5a20-44e1-9cff-7acd021d0a45
```

This command establishes a shell session with your running service container. You'll be dropped into either `/bin/bash` or `/bin/sh`, depending on what's available in your container.

Alternatively, you can run `railway link`, followed by `railway ssh` to achieve the same result.

The CLI also supports single command execution:

```bash
railway ssh -- ls
```

### How it Works

Railway SSH does **not** use the standard SSH protocol (sshd). Instead, it establishes connections via a custom protocol built on top of websockets.

This approach provides several advantages:

- No need to configure SSH daemons in your containers.
- Secure communication through Railway's existing authentication.
- Works with any container that has a shell available.

This approach is secure by design:

- No SSH daemon exposed publicly on your containers.
- All communication goes through Railway's authenticated infrastructure.
- Services remain isolated from direct internet access.
- Uses Railway's existing security and access control mechanisms.

### Limitations and Workarounds

**File Transfer Limitations**

Railway SSH does not support traditional file transfer methods:

- No SCP (Secure Copy Protocol) support
- No sFTP (SSH File Transfer Protocol)
- No direct file download/upload capabilities

File transfer workarounds:

- **Connect volume to file explorer service**: Deploy a simple file browser service that mounts the same volume.
- **Use CURL for file uploads**: From within the SSH session, upload files to external services.
- **Create temporary secure endpoints**: Modify your application to include a temporary, secured endpoint.

**SSH Protocol Limitations**

- **No SSH tunneling**: Cannot create secure tunnels through the SSH connection.
- **No port forwarding**: Cannot forward ports from the remote container to your local machine.
- **No IDE integration**: Cannot use VS Code's Remote-SSH extension or similar tools.

**For private service access**: Use [Tailscale subnet router](/guides/set-up-a-tailscale-subnet-router) to create secure network access to your Railway services.

**Container and Image Limitations**

- **Scratch images**: Containers built from scratch images typically don't include shell programs.
- **Minimal containers**: Some optimized container images may not include common debugging tools.

### SSH Best Practices

- **Use SSH for debugging only**: Avoid making permanent changes through SSH sessions.
- **Limit sensitive operations**: Avoid storing sensitive data or credentials in ways that might be exposed during SSH sessions.
- **Monitor SSH usage**: Regularly review who has SSH access to your services.
- **Temporary access patterns**: Consider SSH access for debugging and investigation rather than routine administrative tasks.

## Command Reference

Below is the complete reference for all CLI commands.

### add

Add a service to your project.

```txt
railway add [OPTIONS]

Options:
  -d, --database <DATABASE>   The name of the database to add [postgres, mysql, redis, mongo]
  -s, --service [<SERVICE>]   The name of the service to create
  -r, --repo <REPO>           The repo to link to the service
  -i, --image <IMAGE>         The docker image to link to the service
  -v, --variables <VARIABLES> Environment variable pairs to set
      --json                  Output in JSON format
```

### completion

Generate shell completions for bash, elvish, fish, powershell, or zsh.

```txt
railway completion <SHELL>
```

### connect

Connect to a database's shell (psql for Postgres, mongosh for MongoDB, etc.).

```txt
railway connect [SERVICE_NAME]

Options:
  -e, --environment <ENVIRONMENT>  Environment to pull variables from
```

Requires the appropriate database client installed in your `$PATH`.

### deploy

Deploy a template into your project.

```txt
railway deploy [OPTIONS]

Options:
  -t, --template <TEMPLATE>  The code of the template to deploy
  -v, --variable <VARIABLE>  Environment variable pairs for the template
```

### domain

Add a custom domain or generate a Railway-provided domain for a service.

```txt
railway domain [DOMAIN]

Options:
  -p, --port <PORT>        The port to connect to the domain
  -s, --service <SERVICE>  The service to generate the domain for
```

### docs

Open Railway Documentation in the default browser.

```txt
railway docs
```

### down

Remove the most recent deployment.

```txt
railway down

Options:
  -y, --yes  Skip confirmation dialog
```

### environment

Create, delete, edit, or link an environment.

```txt
railway environment [ENVIRONMENT] [COMMAND]

Commands:
  link    Link an environment to the current project
  new     Create a new environment
  delete  Delete an environment
  edit    Edit an environment's configuration
```

### init

Create a new project.

```txt
railway init

Options:
  -n, --name <NAME>          Project name
  -w, --workspace <NAME|ID>  Workspace to create the project in
```

### link

Associate existing project with current directory.

```txt
railway link

Options:
  -e, --environment <ENVIRONMENT>  Environment to link to
  -p, --project <PROJECT>          Project to link to
  -s, --service <SERVICE>          Service to link to
  -t, --team <TEAM>                Team to link to
```

### list

List all projects in your Railway account.

```txt
railway list
```

### login

Login to your Railway account.

```txt
railway login

Options:
  -b, --browserless  Browserless login
```

### logout

Logout of your Railway account.

```txt
railway logout
```

### logs

View logs for the most recent deployment.

```txt
railway logs

Options:
  -d, --deployment  Show deployment logs
  -b, --build       Show build logs
```

### open

Open your project dashboard in the browser.

```txt
railway open
```

### run

Run a local command using variables from the active environment.

```txt
railway run [ARGS]...

Options:
  -s, --service <SERVICE>          Service to pull variables from
  -e, --environment <ENVIRONMENT>  Environment to pull variables from
```

### service

Link a service to the current project.

```txt
railway service [SERVICE]
```

### shell

Open a local subshell with Railway variables available.

```txt
railway shell

Options:
  -s, --service <SERVICE>  Service to pull variables from
```

### ssh

Connect to a service via SSH.

```txt
railway ssh [COMMAND]...

Options:
  -p, --project <PROJECT>      Project to connect to
  -s, --service <SERVICE>      Service to connect to
  -e, --environment <ENVIRONMENT>  Environment to connect to
  -d, --deployment-instance <ID>   Deployment instance ID to connect to
```

### status

Show information about the current project.

```txt
railway status
```

### unlink

Disassociate project from current directory.

```txt
railway unlink

Options:
  -s, --service  Unlink a service
```

### up

Upload and deploy project from the current directory.

```txt
railway up [PATH]

Options:
  -d, --detach                     Don't attach to the log stream
  -c, --ci                         Only stream build logs and exit after done
  -s, --service <SERVICE>          Service to deploy to
  -e, --environment <ENVIRONMENT>  Environment to deploy to
      --no-gitignore               Don't ignore paths from .gitignore
      --verbose                    Verbose output
```

### variables

Show or set variables for active environment.

```txt
railway variables

Options:
  -s, --service <SERVICE>          Service to show/set variables for
  -e, --environment <ENVIRONMENT>  Environment to show/set variables for
  -k, --kv                         Show variables in KV format
      --set <SET>                  Set environment variable pairs
```

### whoami

Get the current logged in user.

```txt
railway whoami
```

### volume

Manage project volumes.

```txt
railway volume <COMMAND>

Commands:
  list    List volumes
  add     Add a new volume
  delete  Delete a volume
  update  Update a volume
  detach  Detach a volume from a service
  attach  Attach a volume to a service
```

### redeploy

Redeploy the latest deployment of a service.

```txt
railway redeploy

Options:
  -s, --service <SERVICE>  Service to redeploy
  -y, --yes                Skip confirmation dialog
```

## Contributing

Our CLI is open source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on our [GitHub Repo](https://github.com/railwayapp/cli).
