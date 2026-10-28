---
title: Security
description: Encryption, isolation, audit evidence, and incident disclosure for workloads on Railway.
---

Railway runs customer workloads on its own hardware, Railway Metal, in [four regions](/deployments/regions). Audit reports and policies for the controls on this page are on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The HIPAA BAA, the DPA, and EU DORA documents are covered on the [Compliance](/enterprise/compliance) page.

## Encryption

Data is encrypted at rest with AES-256 and in transit with TLS, and Railway manages the keys at both layers.

### At rest

The Trust Center's Encryption-at-rest control isn't scoped to a product or a plan, so it applies to [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables. The control states:

> All data at rest within Railway's systems is encrypted using AES 256, providing robust protection against unauthorized access and ensuring data confidentiality.

Encryption and key management happen on Railway-operated infrastructure, below the level your workload can see or configure.

### Environment variables

Stored variables are envelope encrypted, which means each value is protected by its own data key instead of one platform-wide key. Railway decrypts a variable when it provides it to a build or a running container. In the dashboard and the API, project Viewers can't see variable values, and other roles can, unless the variable is sealed.

### In transit

Public endpoints require HTTPS and support TLS 1.2 and TLS 1.3, with plain HTTP redirected and certificates issued and renewed for you (see [public networking specs and limits](/networking/public-networking/specs-and-limits)). Traffic between services in the same environment travels over the [private network](/networking/private-networking), which is encrypted with WireGuard inside Railway's infrastructure, so a database that only your own services use can run without a public endpoint.

## Sealed variables

Sealing a variable makes it write-only and permanent. A sealed value can't be unsealed, isn't shown in the dashboard, can't be retrieved through the API, and is omitted by `railway variables` and `railway run`. Railway also doesn't copy sealed values into PR environments or duplicated environments and services, and doesn't sync them to external integrations. [Sealed variables](/variables#sealed-variables) covers how to seal and update one.

The running container still receives a sealed value, because your application needs it there. Sealing protects the value from being read back through Railway. It doesn't protect it from someone who can open a shell on the container or deploy code to the service, and [Environment RBAC](/enterprise/environment-rbac) is the control that narrows that group on a restricted environment.

Related guides:

- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)
- [Use an external secrets manager](/guides/external-secrets-manager)
- [Managing secrets on Railway](/guides/managing-secrets-on-railway)

## Isolation

Each environment gets its own network namespace, so services in different projects or environments can't reach each other over the private network. The namespace enforces this, with no application configuration involved. [How private networking works](/networking/private-networking/how-it-works) has the details.

Each build runs in its own single-tenant environment on Railway's builder infrastructure, and build-time secrets are handled separately from runtime secrets ([Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets)). Enterprise workspaces can also run on [Railway-managed dedicated hosts](/enterprise#hosting-options) when shared compute isn't acceptable.

Railway staff don't modify your application without your permission through an approved support channel, though Railway can remove a workload that violates the [acceptable use policy](/platform/trust-and-safety). When a HIPAA BAA is in effect, staff lose direct access to your running workloads.

## Access to your workspace

Sign-in is through email, OAuth providers, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account, and workspace admins can [require it for every member](/access/two-factor-enforcement). Beyond sign-in, these controls narrow who can reach what in a workspace.

| Control | What it does | Plan |
| --- | --- | --- |
| [SAML SSO](/enterprise/saml) | Routes sign-in through your identity provider | Enterprise |
| [Access groups](/enterprise/access-groups) | Scopes members to specific projects | Enterprise |
| [Environment RBAC](/enterprise/environment-rbac) | Restricts a sensitive environment to Admins | Enterprise |
| [Guardrails](/enterprise/guardrails) | Adds approval rules and an approved-source list for deployments | Enterprise |
| [Project tokens](/integrations/api#creating-a-token) | Binds a token to one project and one environment | All plans |

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry. They record activity in your workspace rather than inside Railway's own systems, and you can pull them into your own tooling through the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api).

## How Railway secures its own operations

Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a> is the published list of Railway's technical and organizational measures. Connections to production systems are encrypted, and staff access requires strong authentication including 2FA and a password manager. Employees sign NDAs and pass background checks before getting access, and complete security awareness training annually. Railway reviews its policies, procedures, and controls at least once a year and uses Drata to test controls continuously, patches platform components regularly, logs events across every component of the platform, and maintains incident response, business continuity, and disaster recovery plans with backups and restores tested on an ongoing basis.

An independent firm performs penetration tests of the platform, and the report is on the Trust Center. Vulnerabilities in Railway itself go to the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> or <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a>. For the managed database images Railway maintains, Railway ships the security patches.

## Certifications and audit evidence

Everything in this table is on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The control descriptions and the SOC 3 report are public, and the rest opens after you sign in with your Railway account email.

| Framework | Evidence |
| --- | --- |
| SOC 2 Type II | Full report (sign-in required) |
| SOC 3 | Public download |
| HIPAA | HIPAA report (sign-in required), BAA on Enterprise |
| GDPR | <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a> |
| EU-US and Swiss-US Data Privacy Frameworks | Listed on the Trust Center and the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Third-party report (sign-in required) |

The Trust Center also carries Railway's policy documents, including the Encryption Policy and the Backup Policy.

## Data processing

Railway's standard <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a> covers GDPR Article 28 obligations, including breach notification, and can be signed self-service from the [Compliance](/enterprise/compliance#gdpr-compliance---data-processing-agreement-dpa) page. The <a href="https://railway.com/legal/subprocessors" target="_blank">subprocessor list</a> is public.

Your services and their volumes run in the [region](/deployments/regions) you pick, while Railway's primary processing operations take place in the United States, and the DPA sets out the transfer mechanisms for personal data that moves there. Deleting your account purges or anonymizes your customer data and content. The <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> covers the rest, and privacy questions go to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response

[Incident management](/platform/incident-management) describes how Railway monitors for incidents, the severity levels, and how retrospectives work. High severity incidents get public communications, and Enterprise customers receive a root cause analysis.

### Incident notifications

Availability incidents go on the <a href="https://status.railway.com" target="_blank">status page</a> as soon as Railway is aware of them. For a personal data breach, the DPA commits Railway to inform you without undue delay and to help you meet your own obligations to regulators and data subjects.

Workspace admins are notified by email. The <a href="https://blog.railway.com/engineering" target="_blank">engineering blog</a> and the <a href="https://railway.com/changelog" target="_blank">changelog</a> carry the public disclosure, and Enterprise customers get their root cause analysis through their shared Slack channel. For questions about your own workspace, use the [Help Station](/platform/support).

When stored credentials may have been exposed, Railway notifies the upstream providers of those credentials so they can revoke affected keys. That notification can reach you through the provider before Railway's own disclosure does.

### Published incident reports

A security incident with customer impact gets a published report with a UTC timeline, the measured scope, what was accessed, and the actions for you and for Railway. A preliminary report goes out during the investigation and is updated until the final report replaces it.

- <a href="https://blog.railway.com/p/incident-report-march-30-2026-authenticated-user-data-cached" target="_blank">March 30, 2026: authenticated user data cached by the CDN</a>
- <a href="https://blog.railway.com/p/preliminary-report-october-security-incident" target="_blank">October 21, 2026: unauthorized access to internal systems and decryption of environment variables</a>

If your workspace predates October 21, 2026, and you haven't rotated the credentials stored on Railway since, follow the <a href="https://railway.com/changelog/2026-10-23-october-21-security-incident" target="_blank">changelog entry</a> for that incident.

## Frequently asked questions

Short answers to the questions security reviewers ask most, with the detail in the sections above.

### Is Railway SOC 2 compliant?

Railway has a SOC 2 Type II report and a SOC 3 report, both on the Trust Center, and the SOC 3 is a public download.

### Does Railway encrypt environment variables?

Yes, at rest under the AES-256 control above, and with envelope encryption so that each stored value has its own data key. Railway decrypts a variable when it provides it to your build or container.

### Can Railway staff read my variables?

Staff don't access your workloads or change your application without your permission through an approved support channel, and under a HIPAA BAA they can't access running workloads at all. A sealed value can't be read back through the dashboard or the API by you or by Railway support, so if you lose one, set a new value.
