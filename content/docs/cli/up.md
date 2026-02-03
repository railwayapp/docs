---
title: railway up
description: Upload and deploy project from the current directory.
---

Upload and deploy your project from the current directory to Railway.

**Note:** This command uploads and deploys your local code. To deploy pre-built templates (like databases), use [railway deploy](/cli/deploy) instead.

## Usage

```bash
railway up [PATH] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-d, --detach` | Don't attach to the log stream |
| `-c, --ci` | Stream build logs only, then exit (CI mode) |
| `-s, --service <SERVICE>` | Service to deploy to (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to deploy to (defaults to linked environment) |
| `-p, --project <ID>` | Project ID to deploy to (defaults to linked project) |
| `--no-gitignore` | Don't ignore paths from .gitignore |
| `--path-as-root` | Use the path argument as the archive root |
| `--verbose` | Verbose output |
| `--json` | Output logs in JSON format (implies CI mode) |

## Examples

### Basic deploy

```bash
railway up
```

Compresses and uploads the current directory, then streams build and deployment logs.

### Deploy in detached mode

```bash
railway up --detach
```

Uploads the project and returns immediately without streaming logs.

### Deploy to specific service

```bash
railway up --service backend
```

### Deploy to specific environment

```bash
railway up --environment staging
```

### CI/CD mode

```bash
railway up --ci
```

Streams build logs only and exits when the build completes. Useful for CI/CD pipelines.

### Deploy a subdirectory

```bash
railway up ./backend
```

## File handling

By default, `railway up`:
- Respects your `.gitignore` file
- Respects `.railwayignore` file (Railway-specific ignore patterns)
- Ignores `.git` and `node_modules` directories

Use `--no-gitignore` to include files that would normally be ignored.

## Exit codes

- `0` - Deployment succeeded
- `1` - Deployment failed or crashed

## Related

- [railway redeploy](/cli/redeploy)
- [railway logs](/cli/logs)
- [Deploying with the CLI](/cli/deploying)
