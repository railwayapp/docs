---
title: railway bucket
description: Manage project buckets.
---

Manage storage buckets for your project.

## Usage

```bash
railway bucket <COMMAND> [OPTIONS]
```

### Global options

| Flag | Description |
|------|-------------|
| `-e, --environment <ENV>` | Environment name or ID |
| `-b, --bucket <BUCKET>` | Bucket name or ID (used by `delete`, `info`, `credentials`, `rename`) |

```bash
railway bucket -b my-bucket -e production info
```

### Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| [`list`](#list-buckets) | `ls` | List buckets |
| [`create`](#create-a-bucket) | `add`, `new` | Create a new bucket |
| [`delete`](#delete-a-bucket) | `remove`, `rm` | Delete a bucket |
| [`info`](#show-bucket-info) | | Show bucket details |
| [`credentials`](#show-or-reset-credentials) | | Show or reset S3-compatible credentials |
| [`rename`](#rename-a-bucket) | | Rename a bucket |

## List buckets

List all buckets deployed in the current environment.

```bash
railway bucket list
```

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

Default output:

```plaintext
my-bucket
another-bucket
```

With `--json`:

```json
[
  {
    "id": "bucket-id",
    "name": "my-bucket"
  },
  {
    "id": "another-bucket-id",
    "name": "another-bucket"
  }
]
```

## Create a bucket

Create a new bucket and deploy it to the target environment. An optional name can be passed as a positional argument; if omitted, the API assigns a default.

```bash
railway bucket create my-bucket --region sjc
```

| Flag | Description |
|------|-------------|
| `-r, --region <REGION>` | Bucket region. Prompted interactively if omitted. |
| `--json` | Output in JSON format |

Available regions:

| Code | Location |
|------|----------|
| `sjc` | US West, California |
| `iad` | US East, Virginia |
| `ams` | EU West, Amsterdam |
| `sin` | Asia Pacific, Singapore |

Default output:

```plaintext
Created bucket my-bucket (sjc)
```

If the environment has unmerged [staged changes](/deployments/staged-changes), the operation is staged instead of committed directly. This applies to `create`, `delete`, and any other config-patching subcommand:

```plaintext
Created bucket my-bucket (sjc) and staged it for production (use 'railway environment edit' to commit)
```

With `--json`:

```json
{
  "id": "bucket-id",
  "name": "my-bucket",
  "region": "sjc",
  "staged": false,
  "committed": true
}
```

## Delete a bucket

Delete a bucket from the target environment. Requires confirmation unless `--yes` is passed.

```bash
railway bucket delete
railway bucket delete --yes
```

| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation |
| `--2fa-code <CODE>` | 2FA code for verification |
| `--json` | Output in JSON format |

Default output:

```plaintext
Deleted bucket my-bucket
```

If the environment has unmerged [staged changes](/deployments/staged-changes), the deletion is staged instead of committed directly:

```plaintext
Staged deletion of bucket my-bucket for production (use 'railway environment edit' to commit)
```

With `--json`:

```json
{
  "id": "bucket-id",
  "name": "my-bucket",
  "staged": false,
  "committed": true
}
```

## Show bucket info

Display bucket instance details including storage size, object count, and region.

```bash
railway bucket info
```

| Flag | Description |
|------|-------------|
| `--json` | Output in JSON format |

Default output:

```plaintext
Name:          my-bucket
Bucket ID:     bucket-id
Environment:   production
Region:        sjc
Storage:       1.2 GB
Objects:       3,456
```

With `--json`:

```json
{
  "id": "bucket-id",
  "name": "my-bucket",
  "environmentId": "environment-id",
  "environment": "production",
  "region": "sjc",
  "storageBytes": 1200000000,
  "storage": "1.2 GB",
  "objects": 3456
}
```

## Show or reset credentials

Display S3-compatible credentials for the selected bucket. The default output uses `AWS_*=value` lines suitable for `eval` or piping into `.env` files. Pass `--reset` to invalidate existing credentials and generate new ones.

```bash
railway bucket credentials
railway bucket credentials --reset --yes
```

| Flag | Description |
|------|-------------|
| `--reset` | Reset S3 credentials (invalidates existing credentials) |
| `-y, --yes` | Skip confirmation when resetting (requires `--reset`) |
| `--2fa-code <CODE>` | 2FA code for verification when resetting (requires `--reset`) |
| `--json` | Output in JSON format |

Default output:

```plaintext
AWS_ENDPOINT_URL=https://storage.railway.app
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=my-bucket-abc123
AWS_DEFAULT_REGION=auto
AWS_S3_URL_STYLE=virtual
```

When `--reset` is used without `--json`, only a confirmation message is printed:

```plaintext
Credentials reset for my-bucket
```

To view the new credentials after resetting, run `railway bucket credentials` again or use `--reset --json`.

With `--json` (both with and without `--reset`):

```json
{
  "endpoint": "https://storage.railway.app",
  "accessKeyId": "your-access-key",
  "secretAccessKey": "your-secret-key",
  "bucketName": "my-bucket-abc123",
  "region": "auto",
  "urlStyle": "virtual"
}
```

## Rename a bucket

Rename a bucket. Prompts for the new name interactively, or accepts `--name`.

```bash
railway bucket rename
railway bucket rename --name new-name
```

| Flag | Description |
|------|-------------|
| `-n, --name <NAME>` | New bucket name. Prompted interactively if omitted. |
| `--json` | Output in JSON format |

Default output:

```plaintext
Renamed my-bucket -> new-name
```

With `--json`:

```json
{
  "id": "bucket-id",
  "name": "new-name"
}
```

## Related

- [Storage buckets](/storage-buckets)
