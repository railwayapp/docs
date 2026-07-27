---
title: railway up
description: Upload and deploy project from the current directory.
---

Upload and deploy your project from the current directory to Railway.

If you aren't signed in, `railway up` signs you in first — or creates a Railway account on the fly — then continues with the deploy. If no project is linked, it can create a new project and service from the current directory. See [First run: sign up and deploy](#first-run-sign-up-and-deploy).

**Note:** This command uploads and deploys your local code. To deploy pre-built templates (like databases), use [railway deploy](/cli/deploy) instead.

## Usage

```bash
railway up [PATH] [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-d, --detach, --no-wait` | Don't attach to the log stream — start the deploy and return once the build is queued |
| `-y, --yes` | Accept all defaults — skip the sign-in confirmation and the project-name prompt when creating a new project |
| `--new` | Create a new project + service from this directory and deploy it, even if one is already linked |
| `--name <NAME>` | Name for a newly created project (defaults to the directory name) |
| `-w, --workspace <WORKSPACE>` | Workspace to create a new project in (auto-selected when you only have one) |
| `-c, --ci` | Stream build logs only, then exit (CI mode) |
| `-m, --message <MESSAGE>` | Message to attach to the deployment |
| `-s, --service <SERVICE>` | Service to deploy to (defaults to linked service) |
| `-e, --environment <ENV>` | Environment to deploy to (defaults to linked environment) |
| `-p, --project <ID>` | Project ID to deploy to (defaults to linked project) |
| `--no-gitignore` | Don't ignore paths from .gitignore |
| `--path-as-root` | Use the path argument as the archive root |
| `--verbose` | Verbose output |
| `--json` | Machine-readable output: build logs stream as NDJSON and the result is a single JSON object (implies CI mode) |

## First run: sign up and deploy

`railway up` is a complete on-ramp — you don't need to run `railway login` or create a project first.

- **Not signed in?** It opens a browser to sign you in. New accounts are created on the fly through the same flow — there is no separate signup step. On SSH or headless machines it prints a device code to complete sign-in from another device.
- **No project linked?** Right after a sign-up — or with `-y` — it creates a project and service from the current directory, links them, and deploys. If you're working interactively, it asks whether to create a new project, link an existing one, or cancel.
- **Scripts and CI never create projects implicitly.** A non-interactive run with no linked project fails with a structured `NOT_AUTHENTICATED` / no-project error instead of prompting or silently creating — set up auth with a [token](/cli/login#environment-variables) and link explicitly for automation.

When the deploy finishes, the CLI prints your project's dashboard link, and the public URL if the service has a domain (run [`railway domain`](/cli/domain) to add one — `up` never exposes a service publicly on its own).

## Examples

### Basic deploy

```bash
railway up
```

Compresses and uploads the current directory, then streams build and deployment logs.

### Sign up (or in) and deploy in one shot

```bash
railway up -y
```

Signs you in — creating an account if needed — then creates a project from the current directory and deploys it, skipping the surrounding prompts. This is the recommended form for agent-driven and scripted first runs.

### Deploy to a fresh project

```bash
railway up --new --name my-api
```

Creates a brand-new project + service from the current directory and deploys it, even if the directory is already linked to another project.

### Deploy in detached mode

```bash
railway up --detach
```

Uploads the project and returns once the build is **queued** — it does not wait for the deploy to finish. Poll for the outcome:

```bash
railway deployment list --json   # newest first; watch .status until SUCCESS / FAILED
```

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

- `0` - Deployment reached `SUCCESS` (or, with `--detach`, the build was queued)
- `1` - Deployment failed or crashed, or the run couldn't proceed (for example `NOT_AUTHENTICATED` in CI)

When attached, the exit code comes from the deployment's terminal status — a failing deploy exits `1` even if the log stream ends early.

## Related

- [railway login](/cli/login)
- [railway deployment](/cli/deployment)
- [railway domain](/cli/domain)
- [railway redeploy](/cli/redeploy)
- [railway logs](/cli/logs)
- [Deploying with the CLI](/cli/deploying)
