---
title: Sync Secrets from an External Secrets Manager
description: Keep Doppler, Infisical, or Vault as your source of truth and push secrets into Railway variables with the Public API, a sync script, or a vendor integration.
date: "2026-07-29"
tags:
  - secrets
  - variables
  - integrations
  - security
topic: integrations
---

## Overview

A secrets sync is a one-way pipeline: your secrets manager (Doppler, Infisical, HashiCorp Vault, or similar) holds the canonical values, and a sync process writes those values into Railway variables. Those variables are all your services ever see: they never talk to the secrets manager at runtime, and they read plain environment variables the same way they would if you had typed the values into the dashboard.

The split matters because Railway injects variables into builds and deployments automatically. Once a value lands in Railway, reference variables, per-environment scoping, and PR environments all work with it. On the other side of that split, the external manager adds a single source of truth across clouds, rotation policies, and audit logs.

Railway does not require an external secrets manager: service, shared, and sealed variables cover most teams already. Reach for a sync instead when secrets already live somewhere else, when one manager feeds multiple platforms, or when compliance requires centralized rotation and audit.

## Choose a sync strategy

There are three ways to get external secrets into Railway, in increasing order of control:

1. **Vendor integration.** Doppler maintains a Railway integration that syncs a Doppler config to a Railway environment automatically. Zero code, but you follow the vendor's mapping rules.
2. **Sync script against the Public API.** Export from the manager's CLI, push with the `variableCollectionUpsert` mutation. Full control over mapping, works with any manager, runs anywhere: CI, a laptop, or a Railway cron service.
3. **Fetch at boot.** The service pulls secrets from the manager when the process starts. No sync step, but now every service needs manager credentials and network access to it, and a manager outage blocks deploys. Use this only when values must never rest outside the manager.

The rest of this guide covers options 1 and 2. Default to option 2; it is portable across managers.

## Use the Doppler integration

Doppler's integration syncs a Doppler project and config to a Railway project, environment, and optional service. Set it up from the Doppler dashboard; instructions live in the Doppler docs at `docs.doppler.com/docs/railway`. After the initial sync, changes you save in Doppler propagate to Railway automatically.

The integration needs a Railway API token to act on your behalf. Create one from the [tokens page](https://railway.com/account/tokens). Prefer a workspace token over an account token: it is scoped to a single workspace and can be revoked without breaking your personal access.

For other managers, including Infisical and Vault, check the vendor's own documentation for a Railway integration, or use the sync script in the next section; it works with any manager whose CLI can export secrets as JSON.

## Sync with the Public API

Railway's Public API is GraphQL at `https://backboard.railway.com/graphql/v2`. The `variableCollectionUpsert` mutation writes many variables in one call, which makes a sync script short.

### Step 1: create a token and collect IDs

Create a workspace token from the [tokens page](https://railway.com/account/tokens). You also need the project ID, environment ID, and service ID you are syncing into. All three appear in the URL when you open a service in the dashboard, or you can query them via the API.

### Step 2: export from your manager

Each manager's CLI can emit secrets as JSON:

```bash
# Doppler: flat JSON object of KEY: value
doppler secrets download --no-file --format json > secrets.json

# Infisical
infisical export --format=json > secrets.json

# Vault KV v2: unwrap the nested data field with jq
vault kv get -format=json secret/myapp | jq '.data.data' > secrets.json
```

Each command produces the same shape, a flat object:

```json
{
  "DATABASE_URL": "postgres://...",
  "STRIPE_SECRET_KEY": "sk_live_..."
}
```

### Step 3: push to Railway

The script below reads that JSON from stdin and upserts every key into one Railway service and environment. It uses Node's built-in `fetch`, so there is nothing to install; it runs on Node 18 or later.

```javascript
// sync-secrets.js
// Usage: cat secrets.json | node sync-secrets.js
const RAILWAY_API = "https://backboard.railway.com/graphql/v2";

const token = process.env.RAILWAY_API_TOKEN;
const projectId = process.env.RAILWAY_PROJECT_ID;
const environmentId = process.env.RAILWAY_ENVIRONMENT_ID;
const serviceId = process.env.RAILWAY_SERVICE_ID;

if (!token || !projectId || !environmentId || !serviceId) {
  console.error(
    "Set RAILWAY_API_TOKEN, RAILWAY_PROJECT_ID, RAILWAY_ENVIRONMENT_ID, RAILWAY_SERVICE_ID"
  );
  process.exit(1);
}

async function readStdin() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main() {
  const secrets = JSON.parse(await readStdin());
  const keys = Object.keys(secrets);
  if (keys.length === 0) {
    console.error("No secrets found on stdin, refusing to sync.");
    process.exit(1);
  }

  const query = `
    mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
      variableCollectionUpsert(input: $input)
    }
  `;

  const res = await fetch(RAILWAY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          projectId,
          environmentId,
          serviceId,
          variables: secrets,
          // Set to false (or remove) to redeploy immediately on change.
          skipDeploys: true,
        },
      },
    }),
  });

  const body = await res.json();
  if (body.errors) {
    console.error("Sync failed:", JSON.stringify(body.errors, null, 2));
    process.exit(1);
  }
  console.log(`Synced ${keys.length} variables to service ${serviceId}.`);
}

main();
```

Run it:

```bash
export RAILWAY_API_TOKEN=...
export RAILWAY_PROJECT_ID=...
export RAILWAY_ENVIRONMENT_ID=...
export RAILWAY_SERVICE_ID=...

doppler secrets download --no-file --format json | node sync-secrets.js
```

To write shared variables for the whole environment instead of one service, omit `serviceId` from the input.

### Deploys and the replace flag

Two input fields change the blast radius of a sync:

- `skipDeploys` (default `false`): by default Railway redeploys the service after a variable change. The script sets `skipDeploys: true` so a scheduled sync does not restart your app every run. Trigger a deploy yourself when you rotate something that must take effect now.
- `replace` (default `false`): with `replace: true`, Railway deletes every variable not present in the payload. That turns the sync into a mirror, which is usually what you want for a dedicated sync, but it will also delete variables you set by hand in the dashboard, including Railway reference variables. Leave it off unless the manager owns every variable on the service.

## Run the sync on a schedule

A sync script fits a Railway cron service: a service that runs your start command on a crontab schedule, does its work, and exits.

1. Deploy the script as its own service in the same project.
2. Set the start command to the pipeline, for example `sh -c "doppler secrets download --no-file --format json | node sync-secrets.js"`.
3. Set the four `RAILWAY_*` variables plus your manager's credentials (for example `DOPPLER_TOKEN`) on the cron service.
4. In service settings, set a cron schedule such as `0 * * * *` for hourly.

Schedules run in UTC, and the process must exit cleanly when done: if a previous run is still alive when the next one is due, Railway skips the new run rather than terminating the old one. A sync that finishes in seconds won't hit this, but do not leave connections open.

If you already run CI, a scheduled GitHub Actions workflow that runs the same pipeline works just as well. The script only needs the token and IDs.

## Things to know

- **Sealed variables are excluded from sync in one direction.** Railway never returns sealed values through the API or `railway run`, so nothing can export them out of Railway. Syncing *into* Railway is unaffected.
- **One environment at a time.** Variables are scoped per environment. Map manager configs to Railway environments one to one (Doppler `prd` to Railway `production`, `stg` to `staging`) and run the sync once per pair.
- **PR environments inherit.** New PR environments copy variables from the base environment, so synced values show up in previews without extra work.
- **Local development does not need the manager.** `railway run npm start` injects your service's Railway variables into a local process, so teammates can develop against synced values without manager credentials.
- **Keep the token narrow.** A workspace token can touch every project in the workspace. If the sync only serves one environment, a project token is tighter still; note that project tokens authenticate with the `Project-Access-Token` header instead of `Authorization: Bearer`.

## Next steps

- [Managing secrets on Railway](/guides/managing-secrets-on-railway) covers the native options: service, shared, reference, and sealed variables.
- [Manage variables with the Public API](/integrations/api/manage-variables) documents every variable query and mutation used here.
- [Cron jobs](/cron-jobs) explains schedules, UTC timing, and the skip behavior for overlapping runs.
- [Variables](/variables) is the reference for how Railway injects variables into builds and deployments.
