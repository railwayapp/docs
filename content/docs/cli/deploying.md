---
title: Deploying with the CLI
description: Learn how to deploy your applications to Railway using the CLI.
---

The Railway CLI provides deployment capabilities for both local development workflows and automated CI/CD pipelines.

## Quick Deploy

The simplest way to deploy is with `railway up`:

```bash
# Link to your project first (if not already linked)
railway link

# Deploy the current directory
railway up
```

This command scans, compresses, and uploads your app's files to Railway. You'll see real-time deployment logs in your terminal.

Railway will build your code using [Railpack](/builds/railpack) or your [Dockerfile](/builds/dockerfiles), then deploy it.

## Deployment Modes

### Attached Mode (Default)

By default, `railway up` streams build and deployment logs to your terminal:

```bash
railway up
```

This is useful for watching the build process and catching errors immediately.

### Detached Mode

Use `-d` or `--detach` to return immediately after uploading:

```bash
railway up -d
```

The deployment continues in the background. Check status in the dashboard or with `railway logs`.

### CI Mode

Use `-c` or `--ci` to stream only build logs and exit when the build completes:

```bash
railway up --ci
```

This is ideal for CI/CD pipelines where you want to see the build output but don't need to wait for deployment logs. Use `--json` to output logs in JSON format (also implies CI mode).

## Targeting Services and Environments

### Deploy to a Specific Service

If your project has multiple services, the CLI will prompt you to choose. You can also specify directly:

```bash
railway up --service my-api
```

### Deploy to a Specific Environment

```bash
railway up --environment staging
```

### Deploy to a Specific Project

Use `-p` or `--project` to deploy to a project without linking:

```bash
railway up --project <project-id> --environment production
```

**Note:** When using `--project`, the `--environment` flag is required.

## CI/CD Integration

### Using Project Tokens

For automated deployments, use a [Project Token](/public-api#project-token) instead of interactive login. Project tokens are scoped to a specific environment and can only perform deployment-related actions.

```bash
RAILWAY_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX railway up
```

Some actions you can perform with a project token:
- Deploying code - `railway up`
- Redeploying a deployment - `railway redeploy`
- Viewing build and deployment logs - `railway logs`

### GitHub Actions

Railway makes deployment status available to GitHub, so you can trigger actions after deployments complete.

#### Post-Deployment Actions

Use the `deployment_status` event to run commands after Railway deploys your app:

```yaml
name: Post-Deployment Actions

on:
  deployment_status:
    states: [success]

jobs:
  post-deploy:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Run post-deploy actions
        if: github.event.deployment.environment == 'production'
        run: |
          echo "Production deployment succeeded"
          # Add your post-deploy commands here
```

See the [GitHub Actions Post-Deploy guide](/guides/github-actions-post-deploy) for more details.

#### PR Environments with GitHub Actions

Create Railway environments automatically for pull requests:

```yaml
name: Manage PR environments (Railway)

on:
  pull_request:
    types: [opened, closed]

env:
  RAILWAY_API_TOKEN: ${{ secrets.RAILWAY_API_TOKEN }}
  LINK_PROJECT_ID: "your-project-id"
  DUPLICATE_FROM_ID: "environment-to-duplicate"

jobs:
  pr_opened:
    if: github.event.action == 'opened'
    runs-on: ubuntu-latest
    container: ghcr.io/railwayapp/cli:latest
    steps:
      - name: Link to project
        run: railway link --project ${{ env.LINK_PROJECT_ID }} --environment ${{ env.DUPLICATE_FROM_ID }}
      - name: Create Railway Environment for PR
        run: railway environment new pr-${{ github.event.pull_request.number }} --copy ${{ env.DUPLICATE_FROM_ID }}

  pr_closed:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    container: ghcr.io/railwayapp/cli:latest
    steps:
      - name: Link to project
        run: railway link --project ${{ env.LINK_PROJECT_ID }} --environment ${{ env.DUPLICATE_FROM_ID }}
      - name: Delete Railway Environment for PR
        run: railway environment delete pr-${{ github.event.pull_request.number }} || true
```

**Note:** If you are using a team project, ensure the token is scoped to your account, not a workspace.

See the [GitHub Actions PR Environment guide](/guides/github-actions-pr-environment) for the complete setup.

## Redeploying

Redeploy the current deployment without uploading new code:

```bash
railway redeploy
```

This is useful for:
- Applying environment variable changes
- Restarting a crashed service
- Triggering a fresh build with the same code

## Deploying a Specific Path

You can specify a path to deploy:

```bash
railway up ./backend
```

By default, Railway uses your project root as the archive base. Use `--path-as-root` to use the specified path as the archive root instead:

```bash
railway up ./backend --path-as-root
```

When running `railway up` from a subdirectory without a path argument, Railway still deploys from the project root. To deploy only a specific directory permanently, configure a [root directory](/builds/monorepo#root-directory) in your service settings.

## Ignoring Files

By default, Railway respects your `.gitignore` file. To include ignored files in your deployment:

```bash
railway up --no-gitignore
```

## Verbose Output

For debugging deployment issues:

```bash
railway up --verbose
```

## Related

- [CLI Reference](/cli) - Complete CLI command documentation
- [GitHub Autodeploys](/deployments/github-autodeploys) - Automatic deployments from GitHub
- [GitHub Actions Post-Deploy](/guides/github-actions-post-deploy) - Run actions after deployment
- [GitHub Actions PR Environment](/guides/github-actions-pr-environment) - Create environments for PRs
