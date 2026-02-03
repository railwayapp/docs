---
title: Using the CLI
description: Learn how to install and use the Railway CLI to manage your projects.
---

The Railway Command Line Interface (CLI) lets you interact with your
Railway project from the command line.

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

## Authenticating With the CLI

Before you can use the Railway CLI, you must authenticate the CLI to your Railway account:

```bash
railway login
```

This command opens a new tab in your default browser to the [https://railway.com](https://railway.com)
authentication page. Follow the instructions to complete the authentication process.

### Manual Login

You can also authenticate manually using a Pairing Code. This can be useful if
you're authenticating the CLI inside an environment without a browser (e.g. SSH
sessions).

Use the `--browserless` flag to authenticate manually:

```bash
railway login --browserless
```

### Tokens

In situations where user input or interaction isn't possible, such as in CI/CD pipelines, you can set either the `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN` environment variable, based on your specific requirements as detailed below.

A [Project Token](/guides/public-api#project-token) is set via the `RAILWAY_TOKEN` environment variable.

An [Account](/guides/public-api#using-an-account-token) or [Workspace](/guides/public-api#using-a-workspace-token) Token is set via the `RAILWAY_API_TOKEN` environment variable.

**Note:** If both environment variables are set, `RAILWAY_TOKEN` takes precedence. This allows you to use a project token for specific deployments while having a broader account token configured.

#### Project Tokens

You can use [Project Tokens](/guides/public-api#project-token) to authenticate project-level actions within a single environment.

Project tokens are scoped to a specific environment within a project. If you need to perform actions across multiple environments, use an account or workspace token instead.

Some actions you can perform with a project token include:

- Deploying code - `railway up`
- Redeploying a deployment - `railway redeploy`
- Viewing build and deployment logs - `railway logs`

Some actions you **cannot** perform with a project token include:

- Creating a new project - `railway init`
- Printing information about the user - `railway whoami`
- Linking to another workspace - `railway link`

Use the token by setting the `RAILWAY_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX railway up
```

#### Account Tokens

You can use [Account Tokens](/guides/public-api#using-an-account-token) to authenticate all CLI actions across all your resources and workspaces. This is the broadest scope—all CLI commands are available with an account token.

Some actions you can **only** perform with an account token include:

- Printing information about the user - `railway whoami`
- Linking to projects in any of your workspaces - `railway link`

Use the token by setting the `RAILWAY_API_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_API_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX railway whoami
```

#### Workspace Tokens

You can use [Workspace Tokens](/guides/public-api#using-a-workspace-token) to authenticate CLI actions on projects within a specific workspace. Use this when you want to share a token with teammates without giving access to your other workspaces.

Some actions you **cannot** perform with a workspace token include:

- Printing information about the user - `railway whoami`
- Linking to projects outside the token's workspace - `railway link` (you can still link to other projects within the workspace)

Use the token by setting the `RAILWAY_API_TOKEN` environment variable and then running `railway <command>`.

```bash
RAILWAY_API_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX railway up
```

## Common Examples of CLI Usage

Below are some of the most commonly used CLI commands. Find a complete list of CLI commands in the [CLI API reference page](/reference/cli-api).

### Link to a Project

To associate a project and environment with your current directory:

<Image src="https://res.cloudinary.com/railway/image/upload/v1770156020/docs/railway-link-2026_dwz6mi.png"
alt="Screenshot of railway link command"
layout="intrinsic"
width={824} height={294} quality={80} />

```bash
# Link to a project
railway link
```

This prompts you to select a workspace, project, and environment to associate with
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

This prompts you to name your project and select a workspace to create the project in.

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

Open a new local shell with Railway environment variables. Similar to `railway run` but opens a new shell.

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

Note that this command differs from `railway run` and `railway shell`, which pull environment variables and execute commands locally

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

This generates a complete command with all necessary IDs. Here’s an example

```bash
railway ssh --project=de609d2a-d70b-4457-8cb2-f1ce1410f779 --environment=f5bdd2a8-e2d1-4405-b814-eaa24fb9f7e8 --service=3ba723f0-5a20-44e1-9cff-7acd021d0a45

```

This command establishes a shell session with your running service container. You'll be dropped into either `/bin/bash` or `/bin/sh`, depending on what's available in your container.

Alternatively, you can run `railway link`, followed by `railway ssh` to achieve the same result.

The CLI also supports single command execution. This enables you to run commands and get their output instantly and exit without staying in an interactive session. Here's an example:

```bash
railway ssh -- ls
```

### How it works

Railway SSH differs significantly from traditional SSH implementations. Understanding how it works helps explain its capabilities and limitations.

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

Understanding Railway SSH's limitations helps you plan appropriate workflows and implement effective workarounds for tasks that aren't directly supported.

**File Transfer Limitations**

Railway SSH does not support traditional file transfer methods:

- No SCP (Secure Copy Protocol) support for copying files between local and remote systems.
- No sFTP (SSH File Transfer Protocol) functionality for file management.
- No direct file download/upload capabilities through the SSH connection.

File transfer workarounds

- **Connect volume to file explorer service**: Deploy a simple file browser service that mounts the same volume as your main application. This provides web-based access to your files for download and upload operations.
- **Use CURL for file uploads**: From within the SSH session, upload files to external services:

```bash
# Upload file to a temporary file sharing service
curl -X POST -F "file=@database_dump.sql" https://file.io/

# Upload to cloud storage (example with AWS S3)
aws s3 cp database_dump.sql s3://your-bucket/backups/

# Upload via HTTP to your own endpoint
curl -X POST -F "file=@logfile.txt" https://your-app.com/admin/upload

```

- **Create temporary secure endpoints**: Modify your application to include a temporary, secured endpoint that serves specific files for download:

```jsx
// Express.js example
app.get("/admin/download/:filename", authenticateAdmin, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join("/app/data", filename);
  res.download(filePath);
});
```

**SSH Protocol Limitations**

Railway SSH **does not implement the standard SSH protocol**, which means:

- **No SSH tunneling**: Cannot create secure tunnels to access private services or databases through the SSH connection.
- **No port forwarding**: Cannot forward ports from the remote container to your local machine for accessing internal services.
- **No IDE integration**: Cannot use VS Code's Remote-SSH extension or similar tools that depend on the SSH protocol for remote development.

**For private service access**: Use [Tailscale subnet router](https://docs.railway.com/tutorials/set-up-a-tailscale-subnet-router) to create secure network access to your Railway services without exposing them publicly.

**Container and Image Limitations**

- **Scratch images**: Containers built from scratch images typically don't include shell programs (`/bin/bash` or `/bin/sh`), making SSH connections impossible. These minimal images are designed for security and size optimization but sacrifice interactive access.
- **Minimal containers**: Some optimized container images may not include common debugging tools, text editors, or system utilities that you might expect in a traditional server environment.

### Troubleshooting

When Railway SSH connections fail or behave unexpectedly, several common issues and solutions can help resolve the problems.

1. The service must be actively running for SSH connections to work. If your service is configured with "serverless mode" and has gone to sleep, you'll need to wake it up by sending a request before attempting to SSH.
2. Firewall or network restrictions: Corporate networks or restrictive firewalls may block WebSocket connections used by Railway SSH.

### Best Practices

- **Use SSH for debugging only**: Avoid making permanent changes through SSH sessions. Instead, implement changes in your application code and deploy them properly.
- **Limit sensitive operations**: While SSH provides powerful access, avoid storing sensitive data or credentials in ways that might be exposed during SSH sessions.
- **Monitor SSH usage**: Regularly review who has SSH access to your services and ensure permissions align with current team structure and responsibilities. Note that SSH usage is currently not displayed in the dashboard’s Activity tab.
- **Temporary access patterns**: Consider SSH access for debugging and investigation rather than routine administrative tasks, which should be automated through proper deployment processes.

### Contributing

Our CLI is open source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on our [GitHub Repo](https://github.com/railwayapp/cli).

[You can see the full documentation of the CLI API here.](/reference/cli-api)
