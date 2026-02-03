---
title: Global Options
description: Flags available across multiple Railway CLI commands.
---

Global options are flags that can be used with multiple Railway CLI commands.

## Service

The `--service` option, shorthand `-s`, specifies which service to target. You can use either the service name or service ID.

```bash
railway logs --service backend
railway up --service api
railway variable list -s my-service
```

## Environment

The `--environment` option, shorthand `-e`, specifies which environment to target. You can use either the environment name or environment ID.

```bash
railway logs --environment staging
railway up --environment production
railway variable list -e dev
```

## JSON output

The `--json` option outputs results in JSON format, useful for scripting and automation.

```bash
railway status --json
railway variable list --json
railway logs --json
```

## Skip confirmation

The `--yes` option, shorthand `-y`, skips confirmation prompts. Use this in scripts or CI/CD pipelines where interactive input isn't possible.

```bash
railway down --yes
railway redeploy -y
railway environment delete staging --yes
```

## Help

The `--help` option, shorthand `-h`, displays help information for any command.

```bash
railway --help
railway up --help
railway logs -h
```

## Version

The `--version` option displays the current Railway CLI version.

```bash
railway --version
```
