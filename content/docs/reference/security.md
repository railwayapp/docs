---
title: Security
description: How Railway protects your code, data, and credentials, which certifications it holds, and how it responds to and reports security incidents.
---

This page is the reference for Railway's security posture. It covers how your data and credentials are encrypted, how workloads are isolated, which access controls you can turn on, which audit reports you can retain as evidence, and what happens when Railway has a security incident.

Audit reports, policies, and control descriptions live on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. Certification details, the HIPAA BAA, and the DPA are on the [Compliance](/enterprise/compliance) page. Incident history is on the <a href="https://status.railway.com" target="_blank">status page</a>.

## At a glance

- All data Railway stores at rest is encrypted with AES-256. All traffic in transit uses TLS, and traffic between your services uses WireGuard.
- Environment variables are envelope encrypted at rest. You can seal any variable so its value is never readable from the dashboard or the API.
- Private networks are isolated per project and per environment. Builds run on single-tenant builder infrastructure.
- Railway is SOC 2 Type II and SOC 3 audited, offers a HIPAA BAA on Enterprise, provides a GDPR DPA, and is certified under the EU-US and Swiss-US Data Privacy Frameworks.
- Security incidents are disclosed on the status page, the blog, the changelog, and by email, with a written incident report that is updated until the investigation closes.

## Encryption

Railway encrypts customer data at rest and in transit, and manages the keys on your behalf.

### Data at rest

All customer data Railway stores at rest is encrypted. This covers [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables. The Trust Center publishes this as the Encryption-at-rest control:

> All data at rest within Railway's systems is encrypted using AES 256, providing robust protection against unauthorized access and ensuring data confidentiality.

The control is not scoped to a product, feature, or plan. Encryption and key management are handled by Railway on Railway-operated infrastructure, and neither is exposed to or configurable from your workload. Railway doesn't offer customer-managed keys, bring-your-own-key, or per-workspace key isolation.

### Environment variables

Environment variables are stored encrypted and are decrypted only to provide them to your builds and deployments. Values are envelope encrypted, so each stored secret is protected by its own data key, and a single compromised key doesn't expose every variable on the platform.

For values you never want to read back, use [sealed variables](#sealed-variables).

### Data in transit

All inbound traffic to your public endpoints must use TLS. Plain HTTP requests are redirected to HTTPS, and certificates are issued and renewed automatically. See [public networking specs and limits](/networking/public-networking/specs-and-limits).

Traffic between services on the [private network](/networking/private-networking) is encrypted with WireGuard and never leaves Railway's infrastructure. The Trust Center publishes this as the Encryption-in-transit control.

## Secrets and variables

Railway gives you several ways to keep credentials out of source code and out of sight.

### Sealed variables

Sealing a variable makes its value write-only. A sealed value is provided to builds and deployments but is never shown in the dashboard and can't be retrieved through the API or the CLI. Sealed variables can't be unsealed, aren't copied into PR environments or duplicated environments and services, and aren't synced to external integrations. See [sealed variables](/variables#sealed-variables) for how to seal and update them.

### Rotation

A changed variable takes effect on the next deployment, so rotation is a redeploy, not a restart. For a dual-key overlap that avoids downtime, follow [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime). We recommend rotating provider keys on a schedule and immediately after any suspected exposure.

### External secrets managers

If your organization already runs Doppler, Infisical, or Vault, you can sync secrets into Railway instead of storing them twice. See [Use an external secrets manager](/guides/external-secrets-manager).

### Tokens for automation

[Project tokens](/integrations/api#creating-a-token) are scoped to one project and environment, so a leaked CI token can't reach the rest of your workspace. Account and workspace tokens are broader and belong only where a project token won't work. For the full set of controls, see [Managing secrets on Railway](/guides/managing-secrets-on-railway).

## Isolation and tenancy

Railway runs workloads on Railway Metal, its own bare-metal fleet, with cloud regions available for burst capacity.

### Network isolation

Each environment has its own isolated network namespace. Services in different projects can't communicate over the private network, and neither can services in different environments of the same project, such as production and staging. Network isolation is enforced at the infrastructure level, not by your application. See [how private networking works](/networking/private-networking/how-it-works).

### Build isolation

Builds run on Railway's fourth-generation builder infrastructure, where each build runs in a single-tenant environment. Build-time secrets are handled separately from runtime secrets; see [Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets).

### Dedicated hosts

Enterprise customers can run workloads on Railway-managed dedicated hosts for complete resource isolation. See [Enterprise hosting options](/enterprise#hosting-options).

### Staff access to your workloads

Railway may remove a workload that violates the [acceptable use policy](/platform/trust-and-safety), but a Railway team member never modifies your application without your permission through an approved support channel. When a HIPAA BAA is in effect, Railway staff can no longer directly access your running workloads.

## Access control

Workspace admins can enforce the following controls.

- [Two-factor authentication enforcement](/access/two-factor-enforcement) requires every workspace member to enable 2FA.
- [SAML SSO](/enterprise/saml) lets members sign in through your identity provider. Enterprise only.
- [Access groups](/enterprise/access-groups) scope members to the projects they need.
- [Environment RBAC](/enterprise/environment-rbac) restricts who can change sensitive environments such as production. Enterprise only.
- [Guardrails](/enterprise/guardrails) add approval and protection rules on top of RBAC.
- Workspace roles (Admin, Member, Viewer) apply on every plan.

### Audit logs

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace: projects, services, deployments, variables, integrations, and workspace settings, each with an actor and a timestamp. Workspace admins can review them from workspace settings. Audit logs record activity in your Railway account; they don't record activity inside Railway's internal systems.

## Platform protection

Railway Metal mitigates network-layer attacks, and the edge applies layer 7 limits on every public endpoint. You can turn on [Under Attack Mode](/networking/waf) when a service is being targeted. Expose databases only on the private network, and use [TCP proxying](/networking/tcp-proxy) only when a database must be reachable from outside Railway.

Railway redeploys managed database services onto a patched image when a vulnerability in the database image is confirmed, after taking a pre-patch volume snapshot.

### Testing your own services

You can run penetration tests and security assessments against the applications and services you own on Railway, including through a third-party tester, without pre-approval or advance notice. Keep testing scoped to your own services. Standard rate limits and DDoS protections still apply, so aggressive traffic can trigger automated mitigation. Testing Railway's shared infrastructure, dashboard, API, or other customers' workloads is out of scope.

### Reporting a vulnerability

Report vulnerabilities in Railway itself through the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> or by email to <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a>.

## Certifications and audit reports

Railway's certifications and the documents behind them are available on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The control descriptions and the SOC 3 report are public with no sign-in. The remaining reports are available after signing in with your Railway account email.

| Framework | Status | Evidence on the Trust Center |
| --- | --- | --- |
| SOC 2 Type II | Audited | SOC 2 Type II report (sign-in required) |
| SOC 3 | Audited | SOC 3 report (public download) |
| HIPAA | BAA available on Enterprise | HIPAA report (sign-in required) |
| GDPR | DPA available to all customers | DPA at <a href="https://railway.com/legal/dpa" target="_blank">railway.com/legal/dpa</a> |
| EU-US and Swiss-US Data Privacy Frameworks | Certified | Listed on the Trust Center |
| Penetration testing | Performed by an independent firm | Pentest report (sign-in required) |

Policy documents, including the Encryption Policy and Backup Policy, are listed in the Trust Center document section. For the HIPAA BAA terms, EU DORA documentation, and VAT details, see [Compliance](/enterprise/compliance).

## Data processing and privacy

- **Data Processing Agreement.** Railway's standard DPA covers GDPR Article 28 processor obligations, including breach notification. You can sign it self-service from the [Compliance](/enterprise/compliance#gdpr-compliance---data-processing-agreement-dpa) page or read it at <a href="https://railway.com/legal/dpa" target="_blank">railway.com/legal/dpa</a>.
- **Subprocessors.** The list of subprocessors is published at <a href="https://trust.railway.com/item/subprocessors" target="_blank">trust.railway.com/item/subprocessors</a>.
- **Data location.** The [deploy region](/deployments/regions) you pick controls where a service and its attached volumes run.
- **Privacy.** Railway's <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> describes how Railway handles personal data. Privacy questions go to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response and breach notification

Railway monitors its infrastructure around the clock and classifies every incident by severity. The [Incident management](/platform/incident-management) page describes the severity levels and the retrospective process. This section covers what you can expect from Railway when an incident affects you.

### What triggers a notice

- Any incident that affects platform availability is posted on the <a href="https://status.railway.com" target="_blank">status page</a> while it's in progress.
- Any incident in which customer data or stored credentials may have been accessed is disclosed publicly and communicated directly to the workspaces involved, in addition to the status page.
- When Railway determines that credentials stored on the platform may have been exposed, it notifies the upstream providers of those credentials so they can revoke affected keys, and does so before public disclosure if that limits harm.
- Incidents involving personal data are handled under the notification terms of the DPA.

### Where Railway communicates

| Channel | What it carries |
| --- | --- |
| <a href="https://status.railway.com" target="_blank">status.railway.com</a> | Live incident status and historical uptime |
| <a href="https://blog.railway.com/engineering" target="_blank">Engineering blog</a> | Security disclosures, incident reports, and remediation guides |
| [Changelog](https://railway.com/changelog) | A dated entry linking the report and listing required customer actions |
| Email | Direct notice to affected workspace admins and, for platform-wide incidents, to all users |
| [Help Station](/platform/support) | Questions about your own workspace |
| Shared Slack channels | Enterprise customers receive updates and a root cause analysis directly |

### What an incident report contains

Railway publishes a preliminary report while the investigation is in progress, updates it with dated entries, and follows it with a final report when forensics conclude. A report contains:

- A timeline of detection, containment, and recovery in UTC.
- The scope of impact, including how many workspaces were affected and how that number was determined.
- What was and was not accessed, stated separately for accounts, source code, environment variables, and running workloads.
- The actions you need to take, with step-by-step guides for each affected provider.
- The actions Railway took to contain the incident and to prevent recurrence.
- An FAQ answering the questions customers raised during the incident.

### October 2026 security incident

On October 21, 2026, Railway disclosed that an attacker had gained access to a subset of internal systems between October 20 at 13:58 UTC and October 22 at 03:32 UTC, and had decrypted environment variables for at most 1.85% of workspaces. Running deployments stayed online throughout. Builds and deployments were paused during containment. User accounts were not accessed. Railway notified upstream providers, revoked all API tokens and sessions, rolled every internal credential and all storage bucket credentials, and moved builds to single-tenant builder infrastructure.

If you signed up before October 21, 2026, and haven't rotated credentials stored on Railway since, do so now and redeploy the services that use them. The full account, including the timeline and the provider-specific rotation guides, is in the <a href="https://blog.railway.com/p/preliminary-report-october-security-incident" target="_blank">preliminary incident report</a> and the <a href="https://railway.com/changelog/2026-10-23-october-21-security-incident" target="_blank">changelog entry</a>.

## Frequently asked questions

### Is Railway SOC 2 compliant?

Yes. Railway is SOC 2 Type II and SOC 3 audited. The SOC 3 report is a public download on the Trust Center, and the SOC 2 Type II report is available after signing in with your Railway account email.

### Does Railway encrypt environment variables?

Yes. Variables are envelope encrypted at rest and decrypted only to provide them to builds and deployments. To keep a value from ever being readable in the dashboard or the API, seal it.

### Can I use my own encryption keys?

No. Railway manages encryption and key management on its own infrastructure. Customer-managed keys and per-workspace key isolation aren't offered.

### Where is my data stored?

A service and its volumes run in the [deploy region](/deployments/regions) you choose. Railway Metal is the primary infrastructure, with cloud regions available for burst capacity. The subprocessor list on the Trust Center names the providers involved.

### Can I run a penetration test against my application?

Yes. You can test services you own on Railway without pre-approval or advance notice. Keep tests scoped to your own services, and expect standard rate limits and DDoS protections to apply.

### How will I find out about a security incident?

Availability incidents appear on the status page. Incidents involving customer data or credentials are also disclosed on the engineering blog and the changelog, and affected workspace admins are emailed directly. Enterprise customers receive a root cause analysis.

### What should I prepare for a customer security review?

Point your reviewer at the Trust Center for the SOC 2 Type II report, the SOC 3 report, the pentest report, and the Encryption and Backup policies. Use this page for how encryption, isolation, and access control work, and the [Compliance](/enterprise/compliance) page for the BAA and DPA. The [Production readiness checklist](/overview/production-readiness-checklist) and [Lock down a production project](/guides/lock-down-production-project) cover the controls to turn on in your own project.
