---
title: Security
description: Railway's security posture including encryption, isolation, and access control.
---
Railway runs customer workloads on hardware it owns and operates. Data is encrypted at rest and in transit, builds run in single-tenant environments, and the platform is SOC 2 Type II compliant.

Audit reports and policies can be found on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The HIPAA BAA, the DPA, and EU DORA documents are covered more in the [Compliance](/enterprise/compliance) page.

## Shared responsibility

Railway runs and secures the hardware we own and operate to run customer workloads. The servers, the private network, the build system, and the dashboard are built and run on [Railway Metal](/platform/railway-metal).

Additionally, we expose features (outlined below) to help our customers run applications securely.

## How Railway secures the platform

### Encryption at rest and in transit

All data stored on Railway is encrypted at rest with AES-256 in every region. Encryption at rest protects data on disk. This includes [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and [environment variables](/variables). Railway manages the encryption keys.

Additionally, environment variables are envelope encrypted. The keys that protect them are themselves encrypted under a key Railway holds separately, so a single leaked key doesn't expose every variable. Railway decrypts a variable only to provide it to a build or a running container.

In transit, public endpoints require HTTPS with TLS 1.2 or 1.3. Plain HTTP requests are redirected, and Railway issues and renews certificates automatically. See also: [specs and limits](/networking/public-networking/specs-and-limits). Between services in the same environment, traffic is over the [private network](/networking/private-networking), which is encrypted with WireGuard. A database that only services within the project connect to does not need a public endpoint.

### Isolation of environments and builds

Each environment has its own network namespace. Services in different projects, or in different environments of the same project, can't reach each other over the private network. See [how private networking works](/networking/private-networking/how-it-works).

Each build runs in its own single-tenant environment on Railway's build infrastructure. Additionally, enterprise workspaces can run on [Railway-managed dedicated hosts](/enterprise#hosting-options).

### Network protection and rate limits

Railway Metal is built to mitigate attacks at network layer 4 and below. At the edge, every public domain is limited to 10,000 concurrent connections, around 11,000 HTTP requests per second, and 10,000 requests per connection. Network protection falls at the CDN layer, which secures the broader network including customer workloads. See also: [rate limits](/networking/public-networking/specs-and-limits#rate-limits).

### Railway's own security practices

The technical and organizational measures Railway commits to are listed in Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a>. Access to production systems requires MFA and uses encrypted connections. Railway logs events across all components of the platform and reviews anomalies. Controls are tested continuously through automated compliance tooling, and policies can be provided to Enterprise customers on request.

An independent firm performs a penetration test of the platform every quarter, with the report found in the Trust Center. Third-party vendors scan the platform for vulnerabilities every quarter, and the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> accepts reports at any time. Railway ships security patches for the managed database images it maintains.

### Data residency

A service and its volumes run in the [region](/deployments/regions) you select when you create it. Railway's own processing primarily happens in the United States, except for EU customers where data stays within EU regions. The DPA sets out more detailed transfer mechanisms. For anything else, see the <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> or write to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

### Image and log retention

Railway retains deployment images after a deployment is removed so you can roll back, and retains logs for a period that depends on your plan.

| Plan | Image retention | Log retention |
| --- | --- | --- |
| Trial | 24 hours | 7 days |
| Free | 24 hours | 3 days |
| Hobby | 72 hours | 7 days |
| Pro | 120 hours | 30 days |
| Enterprise | 360 hours | Up to 90 days |

For longer log retention, we suggest forwarding logs to a third-party tool. See [Connect a third-party observability tool](/guides/third-party-observability).

### Incident response

Railway classifies incidents by severity. [Incident management](/platform/incident-management) describes the severity levels and the retrospective process. Enterprise customers receive further support in a shared Slack channel.

The support and engineering teams maintain a 24/7 rotated on-call schedule, to ensure coverage any time of day across critical parts of the platform. Paging occurs via both automated and manual systems detecting anomalies.

Availability incidents are posted on the <a href="https://status.railway.com" target="_blank">status page</a> while they're in progress. If a security incident does occur, it is disclosed to customers as early as it is safe to do so. Security incidents that affect customers are posted on the <a href="https://blog.railway.com/engineering" target="_blank">blog</a>, and affected customers are notified by email. For a data breach, the DPA commits Railway to inform you without undue delay and to assist with your own notifications to regulators and data subjects. For questions about your own workspace, use the [Help Station](/platform/support).

## Features for securing your project

### Sealed variables

Sealing a variable makes its value write-only. A sealed value is still provided to builds and deployments, but it isn't shown in the dashboard, can't be retrieved through the API, and isn't returned by `railway variables` or `railway run`. Sealed variables can't be unsealed and aren't copied into PR environments, duplicated environments or services, or external integrations. See also: [sealed variables](/variables#sealed-variables). [Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets) explains how to keep secrets out of your image.

Related guides:

- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)
- [Use an external secrets manager](/guides/external-secrets-manager)
- [Managing secrets on Railway](/guides/managing-secrets-on-railway)

### Public endpoint protection

[Under Attack Mode](/networking/waf) defends a service that's under a DDoS or a flood of bot traffic. While it's on, Railway shows each new visitor a browser check before any request reaches your service. It's set per service. To protect a site and the API it calls, enable it on the site first, then on the API.

Databases and other internal services don't need a public endpoint. Connect to them over the private network, and use a [TCP proxy](/networking/tcp-proxy) only when a client outside Railway has to reach them. [Lock down a production project](/guides/lock-down-production-project) covers removing public exposure, scoping tokens, sealing secrets, and restricting who can change production.

### Access control

You can sign in with email, an OAuth provider, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account. On Pro and above, workspace admins can [require it for every member](/access/two-factor-enforcement).

| Control | What it does | Plan |
| --- | --- | --- |
| [SAML SSO](/enterprise/saml) | Routes sign-in through your identity provider | Enterprise |
| [Access groups](/enterprise/access-groups) | Scopes members to specific projects | Enterprise |
| [Environment RBAC](/enterprise/environment-rbac) | Limits variables, logs, and configuration in a restricted environment to Admins | Enterprise |
| [Guardrails](/enterprise/guardrails) | Prevents non-admins from creating public domains or TCP proxies, and limits deployments to approved GitHub organizations | Enterprise |
| [Project tokens](/integrations/api#creating-a-token) | Binds a token to one project and one environment | All plans |

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry. You can export them through the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api).

### Backups and recovery

[Volume backups](/volumes/backups) can be created manually or on a schedule. Daily backups are kept for 6 days, weekly backups for 27 days, and monthly backups for 89 days. Restoring a backup creates a fresh volume and leaves the previous volume in your project, unmounted. Wiping a volume deletes all of its backups.

[Point-in-time recovery](/volumes/point-in-time-recovery) for PostgreSQL and MySQL archives continuously to a storage bucket and restores to a timestamp as a brand-new service. The restore window is about 4 weeks for PostgreSQL and 7 days for MySQL. Backups and archives are encrypted at rest.

These guides cover the features above step-by-step:

- [Lock down a production project](/guides/lock-down-production-project)
- [Production readiness checklist](/overview/production-readiness-checklist)
- [Isolate staging and production](/guides/isolate-staging-production)
- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)

## Audit reports and compliance

Railway's SOC 2 Type II report covers the infrastructure your services run on. The SOC 3 report can be downloaded from the Trust Center without signing in. The SOC 2 report, the HIPAA report, and the penetration test report are available after you request access.

| Report | Where |
| --- | --- |
| SOC 2 Type II | Trust Center |
| SOC 3 | Trust Center |
| HIPAA | Trust Center |
| GDPR | <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a>, signed self-service |
| EU-US and Swiss-US Data Privacy Frameworks | Trust Center and the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Trust Center |

A SOC 2 report describes the controls an auditor observed over a period. It's evidence that the controls exist and operate, not a substitute for your own review.

On Enterprise, Railway signs a BAA for HIPAA workloads and covers the infrastructure side of the shared responsibility model. The DPA covers GDPR processor obligations, including breach notification. The <a href="https://railway.com/legal/subprocessors" target="_blank">subprocessor list</a> is public. See [Compliance](/enterprise/compliance) for the BAA terms, the DPA signing link, and the EU DORA documents.

## Contacts

Support requests go through [Railway Station](/platform/support). For specific cases:

| For | Contact |
| --- | --- |
| A vulnerability in Railway | <a href="https://railway.com/bug-bounty" target="_blank">Bug bounty program</a> or <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a> |
| Abuse reports | <a href="mailto:abuse@railway.com">abuse@railway.com</a> |
| Privacy and data requests | <a href="mailto:privacy@railway.com">privacy@railway.com</a> |
| Audit evidence | <a href="https://trust.railway.com" target="_blank">Trust Center</a> |
| Live incidents | <a href="https://status.railway.com" target="_blank">status.railway.com</a> |

## Frequently asked questions

### Is Railway SOC 2 compliant?

Yes. Railway has a SOC 2 Type II report and a SOC 3 report from an independent auditor. Both are on the Trust Center.

### Does Railway encrypt environment variables?

Yes. Variables are encrypted at rest with AES-256 and envelope encrypted on top. Railway decrypts a variable to provide it to your build or container.

### Can Railway read my variables?

Railway's systems can decrypt any unsealed variable, because that's how it's provided to your container. That access is restricted and logged. Sealing a variable hides it from the dashboard, the API, the CLI, and Railway support, but Railway still decrypts it to run your service. To store a value Railway can't decrypt, encrypt it in your application first.

### Is Railway GDPR compliant?

Yes. Railway processes personal data as a processor under GDPR. The DPA sets out the Article 28 terms and can be signed self-service from the [Compliance](/enterprise/compliance) page. Transfers to the United States are covered by the EU-US Data Privacy Framework and Standard Contractual Clauses, and you can run services in the EU West region.

### Can I run HIPAA workloads on Railway?

Yes, on Enterprise with a BAA in effect. Railway covers the infrastructure under a shared responsibility model, and you cover your application's handling of PHI. Once the BAA is signed, Railway staff can no longer directly access your running workloads.

### How will I hear about incidents?

Availability incidents are posted on the status page. Security incidents that affect customers are disclosed on the engineering blog, and affected customers are notified by email.

### Does Railway have a bug bounty program?

Yes. Vulnerabilities can be reported at any time through Railway's <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a>.

### How does Railway handle vulnerabilities?

Railway patches platform components on a regular schedule. Railway patches services affected by known vulnerabilities (CVEs) and redeploys them automatically, including managed database images. If a vulnerability is novel, we notify the security community and prepare for proper disclosure. If a security incident occurs, Railway notifies affected customers by email and publishes a report on the engineering blog, disclosing as much as it safely can while an investigation is still in progress.
