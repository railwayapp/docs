---
title: Rotate API Keys and Database Credentials Without Downtime
description: Use the dual-key overlap pattern, staged redeploys, and reference variables to rotate secrets on Railway with zero downtime.
date: "2026-07-29"
tags:
  - secrets
  - variables
  - security
  - deployments
topic: infrastructure
---

Credential rotation means replacing a secret with a new one and revoking the old one. The zero-downtime version has one rule: at no point may a running service hold a credential that has already been revoked. You get that with an overlap window: a period where the old and new credentials are both valid. Issue the new credential, move your services onto it, verify, then revoke the old one. Never the other way around.

Building that overlap on Railway comes down to three mechanics: how variable changes propagate through staged changes, how to make the redeploy itself zero-downtime, and how to rotate third-party API keys and database passwords with the dual-key overlap pattern. For how to store secrets in the first place, see [Managing Secrets on Railway](/guides/managing-secrets-on-railway).

## How variable changes apply on Railway

Rotation on Railway is a variable update plus a redeploy, so it helps to know exactly when each happens.

Adding, updating, or removing a variable creates a set of [staged changes](/deployments/staged-changes). Nothing hits your running services until you click **Deploy** on the changeset. When you do, every affected service is redeployed with the new values. This is what makes batch rotation safe: you can update five variables across three services, review the diff in one place, and apply everything in a single deploy.

Two useful variations:

- **Commit without redeploying.** Hold `Alt` while clicking **Deploy** to commit the staged changes without triggering a redeploy. The new values apply on the next deploy of each service.
- **From the CLI**, `railway variable set` sets the variable and triggers a redeploy. Pass `--skip-deploys` to skip the redeploy:

```bash
railway variable set API_KEY=new-value --service backend --skip-deploys
```

Containers read environment variables only at startup, so a variable change never restarts a running container by itself; the new value only exists inside the new deployment. That is the property the rest of this guide builds on.

## Make the redeploy itself zero-downtime

A rotation forces a redeploy, so the redeploy must not drop traffic. Two settings control this.

**Configure a healthcheck.** Set a healthcheck path in your service settings. When a healthcheck is configured, Railway queries the endpoint until it returns HTTP `200`, and only then makes the new deployment active and the old one inactive. Without a healthcheck, there is no guarantee the new container is ready before it starts receiving traffic. See [Healthchecks](/deployments/healthchecks).

Your healthcheck should verify the new credential works. If the endpoint checks a database connection, a deploy with a bad `DATABASE_URL` fails its healthcheck and the old deployment keeps serving, so the rotation fails safe.

**Configure overlap and draining.** By default Railway keeps one deployment per service and stops the old one once the new one is live. Two settings on the service let the versions overlap:

- `RAILWAY_DEPLOYMENT_OVERLAP_SECONDS` keeps the previous deployment active for a window after the new one goes live (default `0`).
- `RAILWAY_DEPLOYMENT_DRAINING_SECONDS` controls how long the old deployment gets between SIGTERM and SIGKILL, so in-flight requests finish (default `0`).

Both can also be set in [config as code](/config-as-code/reference#overlap-seconds). Details in [Deployment Teardown](/deployments/deployment-teardown).

One caveat: services with an attached volume cannot run two deployments at once, so a redeploy of a volume-backed service always has a small window of downtime. This is why the database rotation flow below never redeploys the database service itself.

## Rotate a third-party API key

The dual-key overlap pattern for a provider key (Stripe, SendGrid, OpenAI, and so on):

1. **Issue the new key** in the provider's dashboard. Most providers let multiple keys coexist; both keys are now valid.
2. **Update the variable on Railway.** In the service's Variables tab, edit `API_KEY` to the new value, or use the CLI:

   ```bash
   railway variable set STRIPE_SECRET_KEY=sk_live_new... --service backend
   ```

3. **Deploy the staged change.** The service redeploys with the new key. With a healthcheck configured, the old deployment keeps serving until the new one passes.
4. **Verify.** Check deploy logs and confirm requests to the provider succeed from the new deployment.
5. **Revoke the old key** at the provider. Only do this after the new deployment is active and verified. Any lingering old container is past its draining window by then.

The old key stays valid through steps 2 to 4, so the deployment cutover happens while both keys work. There is no moment where a live container holds a dead key.

### Handle providers that allow only one active key

Some providers invalidate the old key the instant you generate a new one. You cannot get a true overlap from the provider, but you can build one in your application: accept a primary and a secondary key, and fall back when the primary is rejected.

```js
// apiKeys.js
const KEYS = [process.env.API_KEY_PRIMARY, process.env.API_KEY_SECONDARY].filter(Boolean);

export async function providerFetch(url, options = {}) {
  let lastResponse;
  for (const key of KEYS) {
    lastResponse = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${key}` },
    });
    // Retry with the next key only on auth failures.
    if (lastResponse.status !== 401 && lastResponse.status !== 403) {
      return lastResponse;
    }
  }
  return lastResponse;
}
```

The rotation flow becomes: set `API_KEY_SECONDARY` to the current key and deploy, regenerate the key at the provider, set `API_KEY_PRIMARY` to the new value and deploy. During the gap between regeneration and the redeploy, running containers fail on the stale primary and succeed on the secondary. Once the new deployment is verified, clear `API_KEY_SECONDARY`.

## Use reference variables so one update fans out

If three services use the same key, do not paste it into each one. Store it once as a project-level shared variable and reference it from each service:

```
API_KEY=${{ shared.API_KEY }}
```

Rotation is then a single edit. Update the shared variable in Project Settings, and the staged changeset covers every service that references it. One deploy moves every consumer to the new key together, so no service is left running on the old key when you revoke it. See [Reference variables](/variables#reference-variables).

The same syntax works across services, which matters for databases: app services should consume `DATABASE_URL=${{ Postgres.DATABASE_URL }}` rather than a pasted connection string, so a credential change on the database service propagates to every consumer.

## Rotate a database password

Rotating a database credential has an extra step: the variable on Railway and the actual password inside the database engine must change together. The safe order uses a second database role as the overlap.

Using Railway's [PostgreSQL](/databases/postgresql) template as the example:

1. **Create a new role** with the same privileges, alongside the existing one. Connect with `railway connect` and run:

   ```sql
   CREATE ROLE app_v2 WITH LOGIN PASSWORD 'new-strong-password';
   GRANT ALL PRIVILEGES ON DATABASE railway TO app_v2;
   GRANT ALL ON SCHEMA public TO app_v2;
   GRANT ALL ON ALL TABLES IN SCHEMA public TO app_v2;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_v2;
   ```

   Both roles can now log in. This is your overlap window.

2. **Update the connection variables on your app services** to use `app_v2`. If your apps reference the database's `DATABASE_URL`, update the database service's `PGUSER` and `PGPASSWORD` (and `DATABASE_URL` if it is not composed from them) with `--skip-deploys`, so the database service itself is not restarted:

   ```bash
   railway variable set PGUSER=app_v2 PGPASSWORD=new-strong-password --service Postgres --skip-deploys
   ```

   The database engine does not read these variables after initialization; they exist so other services can reference them. Skipping the deploy also avoids restarting a volume-backed service, which always costs a few seconds of downtime.

3. **Redeploy the app services.** Each one comes up connecting as `app_v2`, passes its healthcheck, and takes over. Old containers keep their existing connections as the old role until they are torn down.

4. **Verify, then remove the old role:**

   ```sql
   REASSIGN OWNED BY app_v1 TO app_v2;
   DROP ROLE app_v1;
   ```

If you cannot create a second role, the fallback is `ALTER USER ... PASSWORD` on the existing role. Established connections survive a password change, so running containers keep working until their pools open new connections. Change the password, immediately update the variables, and redeploy the app services. This gives a short window where a reconnect can fail, so prefer the dual-role pattern for production.

## Rotating sealed variables

[Sealed variables](/variables#sealed-variables) hide a value from the UI and API after you set it, which is a good default for production credentials; the Raw Editor can't touch them either. They rotate fine: edit the value from the variable's 3-dot menu and deploy. You cannot read the current value back, so verify the new credential works before revoking the old one.

## Rotation checklist

- A healthcheck is configured on every service that consumes the credential, and it exercises the credential.
- The new credential is issued and valid before any variable changes.
- Every consumer uses a reference variable, so one update covers all of them.
- The staged changeset is reviewed and deployed in one batch.
- The new deployments are active and verified before the old credential is revoked.
- The old credential is revoked at the source: provider dashboard or `DROP ROLE`.

## Next steps

- [Managing Secrets on Railway](/guides/managing-secrets-on-railway)
- [Healthchecks](/deployments/healthchecks)
- [Staged Changes](/deployments/staged-changes)
- [Variables](/variables)
