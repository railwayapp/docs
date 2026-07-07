---
title: Guardrails
description: Enforce workspace-level policies that restrict public networking and deployment sources.
---

<Banner variant="info">
Guardrails are available on eligible [committed spend plans](/pricing/committed-spend). <a href="https://railway.com/enterprise" target="_blank">Contact us</a> to learn more.
</Banner>

Guardrails are workspace-level policies that restrict what members can do across every project in the workspace. A workspace admin toggles a policy once, and Railway enforces it in the dashboard and at the API level without any per-project configuration.

Three policies are available:

| Policy | What it restricts | Applies to |
|--------|-------------------|------------|
| Restrict generate domain | Generating `*.railway.app` service domains | Non-admin members |
| Restrict TCP proxy | Creating public TCP proxies | Non-admin members |
| Restrict deployments to approved sources | Deploying from sources outside approved GitHub organizations | All members, including admins |

## Restrict public networking

Rolling Railway out to a large team means trusting that developers won't accidentally expose internal services to the public internet. The two public networking policies remove that risk:

- **Restrict generate domain** prevents non-admin members from generating public `*.railway.app` domains on their services
- **Restrict TCP proxy** prevents non-admin members from creating public TCP proxies

Workspace admins retain full access, so they can still generate domains and create TCP proxies where needed. Non-admin members see a banner in the service's networking settings explaining the restriction, and requests through the API are rejected.

While a policy is enabled, Railway also skips automatic generation for everyone, including admins:

- Services created from a template don't automatically get a service domain or TCP proxy
- New environments don't auto-generate service domains

Custom domains aren't restricted, and services remain reachable over [private networking](/networking/private-networking), so internal traffic between services is unaffected.

## Restrict deployment sources

The **Restrict deployments to approved sources** policy blocks any deployment whose source can't be verified against an allowlist of approved GitHub organizations. Unlike the public networking policies, it applies to every workspace member, including admins. This makes it a hard boundary for the whole workspace rather than a per-role restriction.

When the policy is enabled:

- Deployments from repositories owned by an approved GitHub organization work normally
- Deployments from any other repository are blocked, including personal repositories
- CLI deploys with `railway up`, Docker image deploys, function services, and template deploys are blocked, because their source can't be verified against a GitHub organization
- Official Railway database templates (such as PostgreSQL, MySQL, Redis, and MongoDB) remain deployable

Railway enforces the policy when a deployment is created, when a service is created with a source, and when a service's source changes. Disconnecting a source from a service is always allowed. In the dashboard, the template, Docker image, and function options are disabled while the policy is active.

Railway matches repositories against the allowlist by GitHub organization ID rather than name, so renaming a GitHub organization doesn't break the policy.

**Note:** Enabling the policy doesn't affect existing deployments. Enforcement applies to new deployments, new services, and service source changes.

## Configure guardrails

Guardrails are managed in workspace settings. Only workspace admins can view or change policies.

1. Navigate to your workspace settings and open **Guardrails**.
2. Toggle **Restrict generate domain** or **Restrict TCP proxy** to enable either public networking policy.
3. To restrict deployment sources, click **Add GitHub organization** under **Approved sources** and add an organization.
4. Toggle **Restrict deployments to approved sources** on.

The organization picker only lists GitHub organizations where Railway's GitHub app is installed and you're an organization admin.

The deployment source policy requires at least one approved organization before you can enable it, and the last approved organization can't be removed while the policy is enabled. Disable the policy first if you need to clear the allowlist.

Enabling or disabling a policy and updating the allowlist are recorded in the workspace [audit logs](/enterprise/audit-logs).

## Related

- [Committed spend plans](/pricing/committed-spend)
- [Audit logs](/enterprise/audit-logs)
- [Environment RBAC](/enterprise/environment-rbac)
- [Public networking](/networking/public-networking)
- [TCP proxy](/networking/tcp-proxy)
