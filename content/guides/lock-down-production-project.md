---
title: Lock Down a Production Railway Project
description: Harden a production Railway project with Under Attack Mode, private networking, scoped API tokens, sealed variables, and workspace-level access controls.
date: 2026-07-29
tags:
  - security
  - networking
  - variables
  - tokens
topic: infrastructure
---

Locking down a production project means reducing what an attacker can reach and what a leaked credential can do. On Railway that comes down to five controls: keep internal services off the public internet, turn on Under Attack Mode when traffic floods hit, scope every API token to the smallest surface that works, seal production secrets so they cannot be read back, and restrict who in your workspace can change production.

None of these require new infrastructure. They are settings on the project you already have. This guide walks through each one in the order you should apply them.

## Remove public exposure from internal services

Every service with a public domain is attack surface. Databases, workers, queues, and internal APIs rarely need one.

Services in the same project and environment can reach each other over [private networking](/networking/private-networking) without public exposure, over encrypted WireGuard tunnels that never leave Railway's network. Each one gets an internal DNS name:

```
<service-name>.railway.internal
```

So a service named `api` is reachable from its siblings at `http://api.railway.internal:PORT`, where `PORT` is the port your app listens on. Private networking is isolated per environment: services in `production` cannot reach services in `staging`, and services in other projects cannot reach yours at all.

To lock down an internal service:

1. Open the service and go to **Settings**.
2. Under **Networking**, delete any public domain the service does not need.
3. Update callers to use the `<service-name>.railway.internal` hostname instead of the public URL.

Use [reference variables](/variables#reference-variables) so the internal URL never gets hardcoded:

```
BACKEND_URL=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:8080
```

After this step, the only services with public domains should be the ones end users hit: typically a frontend and a public API.

## Turn on Under Attack Mode during a DDoS

Railway's [web application firewall (WAF)](/networking/waf) runs at the edge, in front of your service. Its main control is Under Attack Mode, an on-demand defense against DDoS attacks and bot floods.

While Under Attack Mode is on, every new visitor sees a browser check before any request reaches your service. Real browsers pass it once and continue normally. Non-browser traffic, including the bots and scripts driving the attack, is blocked at the edge. That's why it fits active incidents, not always-on protection.

Enable it from the dashboard:

1. Open the service under attack and go to its **Settings**.
2. In the **Edge** section, find **Under Attack Mode**.
3. Pick a duration (1, 3, 12, or 24 hours, or until you turn it off), then click **Activate**.

It takes effect across Railway's global network within about 20 seconds. Or use the CLI:

```bash
railway waf under-attack enable --service web --duration 1h
railway waf under-attack status --service web
railway waf under-attack disable --service web
```

Two details matter for real deployments:

- **Protecting a site and its API together.** Clearance from the browser check is scoped to your whole domain. Enable Under Attack Mode on the site first, then on the API. Once a visitor passes the check on `example.com`, requests to `api.example.com` also pass without a second check. This only works within one root domain; `*.up.railway.app` subdomains are isolated from each other.
- **API-only domains.** The check is only shown to browser navigations. A domain that serves only an API will have all of its traffic blocked while Under Attack Mode is on, so do not enable it on a standalone API that non-browser clients call directly.

## Scope API tokens to the smallest surface

A leaked token is only as dangerous as its scope. Railway has three [token types](/integrations/api#creating-a-token), and production automation should almost never use the broadest one.

| Token type | Scope | Use for |
| ---------- | ----- | ------- |
| Account token | Everything you can access, across all workspaces | Personal scripts on your own machine only |
| Workspace token | One workspace | Team CI/CD, shared automation |
| Project token | One environment in one project | Deployments, service-specific automation |

For a production deploy pipeline, use a project token. It is scoped to a single environment within a single project, so a compromise of your CI system exposes one environment, not your whole account. Create it from the tokens page in your project settings, then authenticate with the `Project-Access-Token` header:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Project-Access-Token: <PROJECT_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { projectToken { projectId environmentId } }"}'
```

Workspace tokens are created from the [tokens page](https://railway.com/account/tokens) in your account settings by selecting a workspace. They can access all of that workspace's resources but nothing personal and nothing in other workspaces. The third option, an account token (created with "No workspace" selected), suits local, personal use only. Never put one in shared CI.

Store whichever token you use as a [sealed variable](#seal-production-secrets) or in your CI provider's secret store, never in the repository.

## Seal production secrets

[Sealed variables](/variables#sealed-variables) make a secret write-only. Railway still provides the value to builds and deployments, but it is never visible in the UI and cannot be retrieved through the API. If a dashboard session or an API token leaks, sealed values stay unreadable.

To seal an existing variable, open the 3-dot menu next to it in the service's **Variables** tab and choose **Seal**.

Sealing is permanent and has constraints to plan around:

- Sealed variables cannot be un-sealed. You can edit the value from the 3-dot menu, but you can never read the current value back.
- The values are not provided by `railway variables` or `railway run` in the CLI.
- They are not copied into PR environments, duplicated environments, or duplicated services, and they are not synced to external integrations.

That last point is a feature for production: a preview environment spun up from a pull request never receives your sealed production credentials. Give preview environments their own non-sealed test credentials for anything they need to boot.

When rotating, verify the new credential works before revoking the old one, because you cannot read a sealed value back. See [rotate credentials without downtime](/guides/rotate-credentials-zero-downtime) for the full rotation flow.

## Restrict who can change production

Infrastructure settings only help if account access is locked down too.

**Enforce 2FA for the workspace.** Workspace admins on the Pro plan and above can require every member to have two-factor authentication enabled before accessing the workspace. Toggle **Require 2FA** in your workspace's People settings. Members without 2FA are prompted to set it up before they can touch any workspace resource. See [2FA enforcement](/access/two-factor-enforcement).

**Use the least-privileged project role.** [Project members](/projects/project-members) have three roles: Owner (full administration of the project), Editor (can deploy, change project settings, and add Editor or Viewer members, but cannot do destructive actions like deleting services or the project), and Viewer (read only, cannot deploy and cannot see environment variables). Default teammates to Viewer, move them to Editor when they need to deploy, and reserve Owner for the people who administer the project.

**Gate deploys from unlinked GitHub users.** If someone pushes to a connected branch without a linked Railway account, Railway does not deploy the push automatically. It creates a [deployment approval](/services#approving-a-deployment) on the service, and a project member must click **Approve** before the commit deploys.

**Wait for CI before deploying.** Enable [Wait for CI](/deployments/github-autodeploys#wait-for-ci) so Railway waits for your GitHub workflows to pass before starting a deployment. A failing test suite then blocks the deploy instead of racing it.

## Lockdown checklist

Run through this list on any project serving production traffic:

- Public domains removed from every service except user-facing ones
- Internal traffic moved to `<service-name>.railway.internal` over [private networking](/networking/private-networking)
- Under Attack Mode tested once so you know the flow before an incident
- CI uses a project token, not an account token
- Production credentials sealed, with separate test credentials for preview environments
- 2FA enforcement on for the workspace
- Members hold the least-privileged role that lets them do their job
- Wait for CI enabled on the production service

For hardening beyond security, including health checks, restart policies, and observability, work through the [production readiness checklist](/overview/production-readiness-checklist).

## Next steps

- [Manage secrets on Railway](/guides/managing-secrets-on-railway)
- [Rotate credentials without downtime](/guides/rotate-credentials-zero-downtime)
- [Private networking](/networking/private-networking)
- [WAF and Under Attack Mode](/networking/waf)
