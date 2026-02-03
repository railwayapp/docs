---
title: CLI
description: Learn how to install and use the Railway CLI to manage your projects.
---

The Railway Command Line Interface (CLI) lets you interact with your Railway projects from the command line.

<Image src="https://res.cloudinary.com/railway/image/upload/v1645060494/docs/CLIexample_fiflvb.gif"
alt="GIF of the CLI in Action"
layout="intrinsic"
width={800} height={468} quality={100} />

## Installing the CLI

The Railway CLI can be installed via Homebrew, npm, Scoop, or directly from the source.

### Homebrew (macOS)

```bash
brew install railway
```

### npm (macOS, Linux, Windows)

```bash
npm i -g @railway/cli
```

Requires Node.js version 16 or higher.

### Shell script (macOS, Linux, Windows via WSL)

```bash
bash <(curl -fsSL cli.new)
```

On Windows, use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) with a Bash shell.

### Scoop (Windows)

```ps1
scoop install railway
```

### Pre-built binaries

Download [pre-built binaries](https://github.com/railwayapp/cli/releases/latest) from the [GitHub repository](https://github.com/railwayapp/cli).

### From source

Build from source using the instructions in the [GitHub repository](https://github.com/railwayapp/cli#from-source).

## Authentication

Before using the CLI, authenticate with your Railway account:

```bash
railway login
```

For environments without a browser (e.g., SSH sessions), use browserless login:

```bash
railway login --browserless
```

### Tokens

For CI/CD pipelines, set environment variables instead of interactive login:

- **Project Token**: Set `RAILWAY_TOKEN` for project-level actions
- **Account/Team Token**: Set `RAILWAY_API_TOKEN` for account-level actions

```bash
RAILWAY_TOKEN=xxx railway up
```

See [Tokens](/integrations/api#project-token) for more information.

## Available commands

### Authentication

```bash
railway login                   # Login to Railway
railway login --browserless     # Login without browser
railway logout                  # Logout from Railway
railway whoami                  # Show current user
```

[login](/cli/login) · [logout](/cli/logout) · [whoami](/cli/whoami)

### Project management

```bash
railway init                    # Create a new project
railway link                    # Link to existing project
railway unlink                  # Unlink current directory
railway list                    # List all projects
railway status                  # Show project info
railway open                    # Open in browser
```

[init](/cli/init) · [link](/cli/link) · [unlink](/cli/unlink) · [list](/cli/list) · [status](/cli/status) · [open](/cli/open) · [project](/cli/project)

### Deployment

```bash
railway up                      # Deploy current directory
railway up --detach             # Deploy without streaming logs
railway deploy --template postgres # Deploy a template
railway redeploy                # Redeploy latest deployment
railway restart                 # Restart a service
railway down                    # Remove latest deployment
```

[up](/cli/up) · [deploy](/cli/deploy) · [redeploy](/cli/redeploy) · [restart](/cli/restart) · [down](/cli/down) · [Deploying Guide](/cli/deploying)

### Services

```bash
railway add                     # Add a service (interactive)
railway add --database postgres # Add PostgreSQL
railway add --repo user/repo    # Add from GitHub repo
railway service                 # Link a service
railway scale                   # Scale a service
railway delete                  # Delete a project
```

[add](/cli/add) · [service](/cli/service) · [scale](/cli/scale) · [delete](/cli/delete)

### Variables

```bash
railway variable list           # List variables
railway variable set KEY=value  # Set a variable
railway variable delete KEY     # Delete a variable
```

[variable](/cli/variable)

### Environments

```bash
railway environment             # Switch environment (interactive)
railway environment new staging # Create new environment
railway environment delete dev  # Delete an environment
```

[environment](/cli/environment)

### Local development

```bash
railway run npm start           # Run command with Railway env vars
railway shell                   # Open shell with Railway env vars
railway dev                     # Run services locally with Docker
```

[run](/cli/run) · [shell](/cli/shell) · [dev](/cli/dev)

### Logs & debugging

```bash
railway logs                    # Stream deployment logs
railway logs --build            # View build logs
railway logs -n 100             # View last 100 lines
railway ssh                     # SSH into service container
railway connect                 # Connect to database shell
```

[logs](/cli/logs) · [ssh](/cli/ssh) · [connect](/cli/connect)

### Networking

```bash
railway domain                  # Generate Railway domain
railway domain example.com      # Add custom domain
```

[domain](/cli/domain)

### Volumes

```bash
railway volume list             # List volumes
railway volume add              # Add a volume
railway volume delete           # Delete a volume
```

[volume](/cli/volume)

### Functions

```bash
railway functions list          # List functions
railway functions new           # Create a function
railway functions push          # Push function changes
```

[functions](/cli/functions)

### Utilities

```bash
railway completion bash         # Generate shell completions
railway docs                    # Open documentation
railway upgrade                 # Upgrade CLI
```

[completion](/cli/completion) · [docs](/cli/docs) · [upgrade](/cli/upgrade) · [starship](/cli/starship)

## Global options

These flags are available across multiple commands:

| Flag | Description |
|------|-------------|
| `-s, --service` | Target service (name or ID) |
| `-e, --environment` | Target environment (name or ID) |
| `--json` | Output in JSON format |
| `-y, --yes` | Skip confirmation prompts |
| `-h, --help` | Display help information |
| `-V, --version` | Display CLI version |

See [Global Options](/cli/global-options) for more details.

## SSH

The Railway CLI enables you to start a shell session inside your deployed Railway services:

```bash
railway ssh
```

Copy the exact command from the Railway dashboard by right-clicking on a service and selecting "Copy SSH Command".

See [railway ssh](/cli/ssh) for more details.

## Contributing

Our CLI is open source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on our [GitHub Repo](https://github.com/railwayapp/cli).
