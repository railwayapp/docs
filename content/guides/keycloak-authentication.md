---
title: Self-Host Keycloak for Authentication
description: Deploy Keycloak on Railway with a Postgres database, an admin account, and a public domain. Configure a realm and an OIDC client for your applications.
date: "2026-07-29"
tags:
  - keycloak
  - authentication
  - self-hosted
  - postgres
topic: integrations
---

[Keycloak](https://www.keycloak.org) is an open-source identity and access management server. It provides login pages, user management, single sign-on, and social login through standard protocols: OpenID Connect, OAuth 2.0, and SAML 2.0. Your applications delegate authentication to Keycloak instead of implementing it themselves.

This guide deploys Keycloak on Railway from the official Docker image, backed by a Postgres database. Postgres holds all realms, users, clients, and sessions, so the Keycloak service itself is stateless and needs no volume.

## What you will set up

- A Keycloak instance from the official Docker image, running in production mode
- A Postgres database for all Keycloak state
- A public domain with TLS for the admin console and login pages
- A realm and an OIDC client your applications can authenticate against

## One-click deploy from a template

Railway has a Keycloak template that provisions Keycloak and Postgres together:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/keycloak)

After deploying, open the service domain, log in with the bootstrap admin credentials from the service variables, and skip to [Create a realm and client](#create-a-realm-and-client).

If you prefer manual setup, continue below.

## Deploy manually

### 1. Create the project and database

1. Create a new [project](/projects) on Railway.
2. Add a Postgres database: click **+ New**, then **Database**, then **PostgreSQL**.

Keycloak supports Postgres directly, so do not run it against the embedded dev database in production; that database is not durable across deploys.

### 2. Deploy the Keycloak Docker image

1. Click **+ New**, then **Docker Image**.
2. Enter `quay.io/keycloak/keycloak:26.3` as the image name.
3. In the service **Settings**, set the custom start command to:

```
/opt/keycloak/bin/kc.sh start
```

`start` runs Keycloak in production mode. The default `start-dev` command is for local development only.

### 3. Configure environment variables

Add the following variables to the Keycloak service. The `${{Postgres.*}}` entries are [reference variables](/variables) that resolve to your database's credentials. The database connection uses [private networking](/networking/private-networking), so traffic between Keycloak and Postgres never leaves your project.

| Variable | Value |
| --- | --- |
| `KC_DB` | `postgres` |
| `KC_DB_URL` | `jdbc:postgresql://${{Postgres.RAILWAY_PRIVATE_DOMAIN}}:5432/${{Postgres.PGDATABASE}}` |
| `KC_DB_USERNAME` | `${{Postgres.PGUSER}}` |
| `KC_DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `KC_BOOTSTRAP_ADMIN_USERNAME` | `admin` |
| `KC_BOOTSTRAP_ADMIN_PASSWORD` | A strong random password |
| `KC_HTTP_ENABLED` | `true` |
| `KC_PROXY_HEADERS` | `xforwarded` |
| `KC_HEALTH_ENABLED` | `true` |

Two of these need explanation:

- `KC_HTTP_ENABLED=true` and `KC_PROXY_HEADERS=xforwarded` tell Keycloak it is running behind a TLS-terminating proxy. Railway terminates TLS at the edge and forwards plain HTTP to your container with `X-Forwarded-*` headers. Without these settings, production mode refuses HTTP connections.
- `KC_BOOTSTRAP_ADMIN_*` creates a temporary admin account on first startup. After first login, create a permanent admin user in the master realm and remove these variables.

### 4. Generate a domain and set the hostname

1. In the Keycloak service **Settings**, under **Networking**, click **Generate Domain**. Keycloak listens on port 8080; select it as the [target port](/networking/domains/working-with-domains) if prompted.
2. Add one more variable, using the domain you just generated:

| Variable | Value |
| --- | --- |
| `KC_HOSTNAME` | `https://your-keycloak.up.railway.app` |

Keycloak uses `KC_HOSTNAME` to build issuer URLs, redirect URLs, and admin console links. It must match the public domain exactly, including the `https://` scheme. If you later [add a custom domain](/networking/domains/working-with-domains), update `KC_HOSTNAME` to match.

After the deploy completes, open the domain and log in to the admin console with your bootstrap credentials.

### 5. Configure a healthcheck for zero-downtime deploys

Keycloak serves its health endpoints on a separate management port, 9000, not on the main HTTP port. Railway healthchecks probe the port in the `PORT` variable, so point it at the management port:

1. Add a service variable `PORT` with the value `9000`. Keycloak ignores `PORT` (it configures its listener with `KC_HTTP_PORT`), so this only affects the healthcheck. Public traffic still reaches port 8080 through the domain's target port.
2. In the service **Settings**, set the [healthcheck path](/deployments/healthchecks) to `/health/ready`.

With the healthcheck configured, Railway keeps the old deployment serving traffic until the new one reports ready.

## Create a realm and client

A realm is an isolated set of users, credentials, and clients. Keep the built-in `master` realm for Keycloak administration and create a separate realm for your applications.

1. In the admin console, open the realm dropdown in the top left and click **Create realm**. Name it, for example, `myapp`.
2. Go to **Clients**, then **Create client**. Set the client ID (for example `web-app`), keep the type **OpenID Connect**, and click **Next**.
3. Enable **Standard flow** for browser-based login. Click **Next**, then set **Valid redirect URIs** to your application's callback URL (for example `https://myapp.up.railway.app/auth/callback`) and **Web origins** to your application's origin.
4. Go to **Users**, then **Create new user**, and set a password under the **Credentials** tab.

Your realm now exposes a standard OIDC discovery document:

```
https://your-keycloak.up.railway.app/realms/myapp/.well-known/openid-configuration
```

Any OIDC library can configure itself from this URL. It lists the authorization, token, userinfo, and JWKS endpoints.

## Test the token endpoint

To verify the deployment end to end, create a client with **Client authentication** enabled and **Service accounts roles** checked (a confidential client), copy its secret from the **Credentials** tab, then request a token:

```bash
curl -s -X POST \
  "https://your-keycloak.up.railway.app/realms/myapp/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=my-service" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

A JSON response containing `access_token` confirms Keycloak, Postgres, and the public domain are wired correctly.

## Connect applications inside the same project

Services in the same Railway environment can reach Keycloak over private networking at `keycloak.railway.internal:8080` (the name matches your service name). This is useful for backend token validation because the traffic stays inside the project.

Keep the issuer consistent: tokens are issued with the public `KC_HOSTNAME` URL in the `iss` claim. If a backend fetches the discovery document over the internal hostname, most OIDC libraries will reject tokens because the issuer does not match. So the simplest reliable setup uses the public domain everywhere and reserves the internal hostname for non-OIDC calls such as the admin REST API.

## Sizing and production notes

A few points matter once real users depend on this deployment:

- Keycloak runs on the JVM. Expect a baseline of several hundred MB of memory; 1 GB is a reasonable starting allocation for small deployments. Railway bills that memory by actual usage (per MB per minute), so an idle instance costs less than its limit.
- All state lives in Postgres, so redeploys, image upgrades, and restarts do not lose users or sessions Keycloak persists there.
- Pin the image to a specific version (as this guide does with `26.3`) and upgrade deliberately. Keycloak upgrades run database migrations on startup.
- Remove the `KC_BOOTSTRAP_ADMIN_*` variables after creating a permanent admin account.

## Next steps

- [Handle frontend authentication patterns](/guides/frontend-authentication): Where tokens live and how SPAs, SSR apps, and static sites differ.
- [Private networking](/networking/private-networking): How service-to-service traffic works inside a project.
- [Configure healthchecks](/deployments/healthchecks): Zero-downtime deploy behavior in detail.
- [Manage secrets on Railway](/guides/managing-secrets-on-railway): Keep the admin password and client secrets out of your code.
