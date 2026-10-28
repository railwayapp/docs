---
title: Security
description: What Railway encrypts and isolates, who can access what, and where the audit reports are.
---

This page describes the security controls Railway provides, what each one covers, and where to find the audit evidence behind them.

Railway runs customer workloads on hardware it owns and operates. The servers, the private network, the build system, and the dashboard are built and run by Railway.

Audit reports and policies are on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The HIPAA BAA, the DPA, and EU DORA documents are covered on the [Compliance](/enterprise/compliance) page.

## Encryption at rest and in transit

All data Railway stores is encrypted at rest with AES-256, in every region. This includes [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables. Railway manages the encryption keys.

Encryption at rest protects data on disk. It doesn't protect against an attacker who obtains Railway's own credentials, because Railway decrypts your variables to provide them to your containers. The controls for that case are described under isolation, access control, and Railway's own security practices.

Environment variables are also envelope encrypted. The keys that protect them are themselves encrypted under a key Railway holds separately, so a single leaked key doesn't expose every variable. Railway decrypts a variable only to provide it to a build or a running container. In the dashboard and the API, project Viewers can't see variable values. Admins and Members can, unless the variable is sealed.

In transit, public endpoints require HTTPS with TLS 1.2 or 1.3. Plain HTTP requests are redirected, and Railway issues and renews certificates automatically. See [specs and limits](/networking/public-networking/specs-and-limits). Traffic between services in the same environment uses the [private network](/networking/private-networking), which is encrypted with WireGuard and doesn't leave Railway's infrastructure. A database that only your own services connect to doesn't need a public endpoint.

### Sealed variables

Sealing a variable makes its value write-only. A sealed value is still provided to builds and deployments, but it isn't shown in the dashboard, can't be retrieved through the API, and isn't returned by `railway variables` or `railway run`. Sealed variables can't be unsealed and aren't copied into PR environments, duplicated environments or services, or external integrations. See [sealed variables](/variables#sealed-variables).

Sealing prevents a value from being read back through Railway, including by Railway support. It doesn't change how Railway stores the value, and code running in your container can still read it. To store a value Railway can't decrypt, encrypt it in your application before storing it and keep the key elsewhere.

Related guides:

- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)
- [Use an external secrets manager](/guides/external-secrets-manager)
- [Managing secrets on Railway](/guides/managing-secrets-on-railway)

## Isolation

Each environment has its own network namespace. Services in different projects, or in different environments of the same project, can't reach each other over the private network. See [how private networking works](/networking/private-networking/how-it-works).

Each build runs in its own single-tenant environment on Railway's build infrastructure. [Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets) explains how to keep secrets out of your image. Enterprise workspaces can run on [Railway-managed dedicated hosts](/enterprise#hosting-options).

Railway staff don't modify your application without your permission through an approved communication channel. When a HIPAA BAA is in effect, Railway staff can no longer directly access your running workloads. Railway may remove workloads that violate the [acceptable use policy](/platform/trust-and-safety).

## Network protection and rate limits

Railway Metal is built to mitigate attacks at network layer 4 and below. At the edge, every public domain is limited to 10,000 concurrent connections, around 11,000 HTTP requests per second, and 10,000 requests per connection. See [rate limits](/networking/public-networking/specs-and-limits#rate-limits). These limits protect against layer 7 attacks, but they may not always be enough to stop a service from becoming overwhelmed.

[Under Attack Mode](/networking/waf) defends a service that's under a DDoS or a flood of bot traffic. While it's on, Railway shows each new visitor a browser check before any request reaches your service. It's set per service. To protect a site and the API it calls, enable it on the site first, then on the API.

Databases and other internal services don't need a public endpoint. Connect to them over the private network, and use a [TCP proxy](/networking/tcp-proxy) only when a client outside Railway has to reach them. [Lock down a production project](/guides/lock-down-production-project) covers removing public exposure, scoping tokens, sealing secrets, and restricting who can change production.

## Access control

You can sign in with email, an OAuth provider, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account. On Pro and above, workspace admins can [require it for every member](/access/two-factor-enforcement).

| Control | What it does | Plan |
| --- | --- | --- |
| [SAML SSO](/enterprise/saml) | Routes sign-in through your identity provider | Enterprise |
| [Access groups](/enterprise/access-groups) | Scopes members to specific projects | Enterprise |
| [Environment RBAC](/enterprise/environment-rbac) | Limits variables, logs, and configuration in a restricted environment to Admins | Enterprise |
| [Guardrails](/enterprise/guardrails) | Prevents non-admins from creating public domains or TCP proxies, and limits deployments to approved GitHub organizations | Enterprise |
| [Project tokens](/integrations/api#creating-a-token) | Binds a token to one project and one environment | All plans |

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry. You can export them through the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api).

**Note:** Audit logs cover activity by people and tokens in your workspace. They don't record access by Railway's internal systems.

## Backups and retention

[Volume backups](/volumes/backups) can be created manually or on a schedule. Daily backups are kept for 6 days, weekly backups for 27 days, and monthly backups for 89 days. Restoring a backup creates a fresh volume and leaves the previous volume in your project, unmounted. Wiping a volume deletes all of its backups.

[Point-in-time recovery](/volumes/point-in-time-recovery) for PostgreSQL and MySQL archives continuously to a storage bucket and restores to a timestamp as a brand-new service. The restore window is about 4 weeks for PostgreSQL and 7 days for MySQL. Backups and archives are encrypted at rest.

Railway retains deployment images after a deployment is removed so you can roll back, and retains logs for a period that depends on your plan.

| Plan | Image retention | Log retention |
| --- | --- | --- |
| Free and Trial | 24 hours | 3 days (Free), 7 days (Trial) |
| Hobby | 72 hours | 7 days |
| Pro | 120 hours | 30 days |
| Enterprise | 360 hours | Up to 90 days |

For longer log retention, forward logs to a third-party tool. See [Connect a third-party observability tool](/guides/third-party-observability). When you delete your account, Railway purges or anonymizes your data.

## Railway's own security practices

The technical and organizational measures Railway commits to are listed in Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a>. Production access requires 2FA and uses encrypted connections. Employees sign an NDA and pass a background check before getting access, and complete security awareness training every year. Railway reviews its policies and controls at least annually and tests them continuously against SOC 2. Backups and restores are tested on an ongoing basis.

An independent firm performs a penetration test of the platform every year. The report is on the Trust Center. Third-party vendors scan the platform for vulnerabilities every quarter, and the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> accepts reports at any time. Railway ships security patches for the managed database images it maintains.

## Audit reports and compliance

Railway's SOC 2 Type II report covers the infrastructure your services run on. The SOC 3 report can be downloaded from the Trust Center without signing in. The SOC 2 report, the HIPAA report, and the penetration test report are available after you request access.

| Report | Where |
| --- | --- |
| SOC 2 Type II | Trust Center, request access |
| SOC 3 | Trust Center, public download |
| HIPAA | Trust Center, request access. BAA available on Enterprise |
| GDPR | <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a>, signed self-service |
| EU-US and Swiss-US Data Privacy Frameworks | Trust Center and the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Trust Center, request access |

A SOC 2 report describes the controls an auditor observed over a period. It's evidence that the controls exist and operate, not a substitute for your own review.

On Enterprise, Railway signs a BAA for HIPAA workloads and covers the infrastructure side of the shared responsibility model. The DPA covers GDPR processor obligations, including breach notification. The <a href="https://railway.com/legal/subprocessors" target="_blank">subprocessor list</a> is public. See [Compliance](/enterprise/compliance) for the BAA terms, the DPA signing link, and the EU DORA documents.

## Data residency

A service and its volumes run in the [region](/deployments/regions) you select when you create it. EU West Metal is in Amsterdam. Railway's own processing happens in the United States, including the systems that hold your project configuration and environment variables, regardless of the region your services run in. The DPA sets out the transfer mechanisms for personal data. Card payments are processed by Stripe. For anything else, see the <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> or write to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response and breach notification

Railway classifies incidents by severity. [Incident management](/platform/incident-management) describes the severity levels and the retrospective process. High severity incidents get public communications. Enterprise customers receive a root cause analysis in their shared Slack channel.

Availability incidents are posted on the <a href="https://status.railway.com" target="_blank">status page</a> while they're in progress. Security incidents that affect customers are disclosed on the <a href="https://blog.railway.com/engineering" target="_blank">engineering blog</a> and the <a href="https://railway.com/changelog" target="_blank">changelog</a>, and affected customers are notified by email. For a personal data breach, the DPA commits Railway to inform you without undue delay and to assist with your own notifications to regulators and data subjects. For questions about your own workspace, use the [Help Station](/platform/support).

Security incidents that affect customers get a written report on the engineering blog. A report includes a UTC timeline, the scope of impact, the actions you need to take, and the actions Railway took. While an investigation is still running, the report is published as preliminary and updated with dated entries until the final version replaces it.

## Shared responsibility

Railway secures the infrastructure. You secure what you deploy on it.

| Railway | You |
| --- | --- |
| Hardware, hosts, and the operating system under your containers | Your image, its dependencies, and your application code |
| The private network, TLS termination, and the edge | Which services get a public domain or a TCP proxy |
| The build system, the dashboard, the API, and the CLI | Workspace membership, roles, and the tokens you use in CI |
| Security patches for the managed database images | Major database version upgrades, and enabling backups, point-in-time recovery, and high availability |
| Encrypting stored data and managing the keys | The secrets you store, how often you rotate them, and which ones you seal |
| Detecting and disclosing platform incidents | The data you store and your legal basis for processing it |

These guides cover the customer side:

- [Lock down a production project](/guides/lock-down-production-project)
- [Production readiness checklist](/overview/production-readiness-checklist)
- [Isolate staging and production](/guides/isolate-staging-production)
- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)

## Contacts

Support requests go through the [Help Station](/platform/support). The addresses below are for the specific cases listed.

| For | Contact |
| --- | --- |
| A vulnerability in Railway | <a href="https://railway.com/bug-bounty" target="_blank">Bug bounty program</a> or <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a> |
| Abuse hosted on Railway | <a href="mailto:abuse@railway.com">abuse@railway.com</a> |
| Privacy and data requests | <a href="mailto:privacy@railway.com">privacy@railway.com</a> |
| Audit evidence | <a href="https://trust.railway.com" target="_blank">Trust Center</a> |
| Live incidents | <a href="https://status.railway.com" target="_blank">status.railway.com</a> |

## Frequently asked questions

Short answers to common security review questions. The sections above have the detail.

### Is Railway SOC 2 compliant?

Yes. Railway has a SOC 2 Type II report and a SOC 3 report from an independent auditor. Both are on the Trust Center, and the SOC 3 is a public download.

### Does Railway encrypt environment variables?

Yes. Variables are encrypted at rest with AES-256 and envelope encrypted on top. Railway decrypts a variable to provide it to your build or container.

### Can Railway read my variables?

Railway's systems can decrypt any unsealed variable, because that's how it's provided to your container. That access is restricted and logged. Sealing a variable hides it from the dashboard, the API, the CLI, and Railway support, but Railway still decrypts it to run your service. To store a value Railway can't decrypt, encrypt it in your application first.

### Can I run HIPAA workloads on Railway?

Yes, on Enterprise with a BAA in effect. Railway covers the infrastructure under a shared responsibility model, and you cover your application's handling of PHI. Once the BAA is signed, Railway staff can no longer directly access your running workloads.

### Can I keep my data in the EU?

Services and volumes in EU West Metal run in Amsterdam. Railway's own processing, including the systems that hold your environment variables, is in the United States. If your residency requirement covers configuration and secrets as well as workload data, Railway doesn't meet it.

### How will I hear about a security incident?

Availability incidents are posted on the status page. Security incidents that affect customers are disclosed on the engineering blog and the changelog, and affected customers are notified by email.
