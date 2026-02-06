---
title: railway dev
description: Run Railway services locally.
---

Run your Railway services locally using Docker Compose, with automatic environment variable injection and HTTPS support.

**Note:** This is an experimental feature. The API may change without notice.

## Usage

```bash
railway dev [COMMAND] [OPTIONS]
```

## Aliases

- `railway develop`

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `up` | Start services (default) |
| `down` | Stop services |
| `clean` | Stop services and remove volumes/data |
| `configure` | Configure local code services |

## Examples

### Start local development

```bash
railway dev
```

Starts image-based services (databases, etc.) via Docker Compose and prompts you to configure code-based services.

### Start with verbose output

```bash
railway dev --verbose
```

### Stop services

```bash
railway dev down
```

### Clean up (remove data)

```bash
railway dev clean
```

### Configure Code services

```bash
railway dev configure
```

Interactively configure how your code services run locally (command, directory, port).

## Options for `up`

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment to use |
| `-o, --output <PATH>` | Output path for docker-compose.yml |
| `--dry-run` | Generate docker-compose.yml without starting |
| `--no-https` | Disable HTTPS and pretty URLs |
| `-v, --verbose` | Show verbose domain replacement info |
| `--no-tui` | Disable TUI, stream logs to stdout |

## Options for `configure`

| Flag | Description |
|------|-------------|
| `--service <SERVICE>` | Specific service to configure (by name) |
| `--remove [SERVICE]` | Remove configuration for a service (optionally specify service name) |

### Configure examples

Configure a specific service:

```bash
railway dev configure --service backend
```

Remove configuration for all services:

```bash
railway dev configure --remove
```

Remove configuration for a specific service:

```bash
railway dev configure --remove backend
```

## Requirements

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose
- [mkcert](https://github.com/FiloSottile/mkcert) (optional, for HTTPS support)

## How it works

1. Fetches environment configuration from Railway
2. Generates a `docker-compose.yml` for image-based services (databases, etc.)
3. Starts containers with proper environment variables
4. Optionally runs code services locally with injected environment variables
5. Sets up a Caddy reverse proxy for HTTPS (if mkcert is available)

## Related

- [railway run](/cli/run)
- [railway shell](/cli/shell)
