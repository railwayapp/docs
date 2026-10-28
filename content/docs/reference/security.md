---
title: Security
description: How Railway encrypts and isolates customer data, which audit reports it publishes, and how it discloses security incidents.
---

Railway runs customer workloads on its own hardware, Railway Metal, in [four regions](/deployments/regions). This page describes the controls that protect code, data, and credentials on that infrastructure, where to find the audit evidence behind them, and what Railway does when something goes wrong.

The audit reports and policies referenced here are on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The HIPAA BAA, the DPA, and EU DORA documents are covered on the [Compliance](/enterprise/compliance) page.

## Encryption

Data is encrypted at rest with AES-256 and in transit with TLS. Railway manages the keys.

### At rest

The Trust Center publishes the Encryption-at-rest control. It isn't scoped to a product or plan, so it covers [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables alike. Quote it directly when a questionnaire asks:

> All data at rest within Railway's systems is encrypted using AES 256, providing robust protection against unauthorized access and ensuring data confidentiality.

Encryption and key management happen on Railway-operated infrastructure. Neither is visible to, or configurable from, your workload.

### Environment variables

Variables are stored encrypted and envelope encrypted, so each stored value has its own data key rather than sharing one platform-wide key. Railway decrypts a variable to provide it to a build or a running container. In the dashboard and the API, project Viewers can't see variable values; other roles can, unless the variable is sealed.

### In transit

Public endpoints require HTTPS and support TLS 1.2 and TLS 1.3. Plain HTTP requests are redirected, and certificates are issued and renewed for you. See [public networking specs and limits](/networking/public-networking/specs-and-limits).

Traffic between services in the same environment travels over the [private network](/networking/private-networking), which is encrypted with WireGuard and never leaves Railway's infrastructure. A database that only your own services talk to doesn't need a public endpoint.

## Sealed variables

Sealing a variable makes it write-only. A sealed value is provided to builds and deployments but is never shown in the dashboard and can't be retrieved through the API. It can't be unsealed, isn't returned by `railway variables` or `railway run`, isn't copied into PR environments or duplicated environments and services, and isn't synced to external integrations. See [sealed variables](/variables#sealed-variables) for how to seal and update one.

A sealed value still reaches the running container, because your application needs it there. [Environment RBAC](/enterprise/environment-rbac) limits who can open a shell on, or deploy to, a restricted environment.

Rotating a credential means changing the variable and redeploying. [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime) covers the dual-key overlap. If your secrets already live in Doppler, Infisical, or Vault, [sync them in](/guides/external-secrets-manager) instead of maintaining two copies. [Managing secrets on Railway](/guides/managing-secrets-on-railway) walks through the full set of variable types.

## Isolation

Projects and environments are isolated from each other. Each environment gets its own network namespace. Services in different projects, or in different environments of the same project, can't reach each other over the private network, and the infrastructure enforces that boundary rather than your application config. See [how private networking works](/networking/private-networking/how-it-works).

Builds run on Railway's fourth-generation builder infrastructure, where each build gets a single-tenant environment. Build-time secrets are handled separately from runtime secrets; [Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets) explains the difference.

Enterprise workspaces can run on [Railway-managed dedicated hosts](/enterprise#hosting-options) when shared compute isn't acceptable.

Railway staff don't modify your application without your permission through an approved support channel. Railway can remove a workload that violates the [acceptable use policy](/platform/trust-and-safety). When a HIPAA BAA is in effect, staff lose direct access to your running workloads.

## Access to your workspace

Sign-in is through email, OAuth providers, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account, and workspace admins can [require it for every member](/access/two-factor-enforcement).

Controls you can turn on:

- [SAML SSO](/enterprise/saml) routes sign-in through your identity provider (Enterprise)
- [Access groups](/enterprise/access-groups) scope members to specific projects
- [Environment RBAC](/enterprise/environment-rbac) restricts a sensitive environment to Admins (Enterprise)
- [Guardrails](/enterprise/guardrails) add approval rules and an approved-source list for deployments
- [Project tokens](/integrations/api#creating-a-token) are bound to one project and one environment, so a leaked CI token can't reach the rest of the workspace

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry. They cover your workspace's activity on Railway, not activity inside Railway's own systems. Pull entries through the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api) to keep a copy in your own systems.

## How Railway secures its own operations

The technical and organizational measures Railway commits to are published in Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a>. In short: connections to production systems are encrypted, strong authentication including 2FA and a password manager are mandated, and employees sign NDAs, pass background checks, and complete security awareness training every year. Policies, procedures, and controls are reviewed at least annually, and Railway uses Drata to test controls continuously. Platform components use secure default configurations and are patched regularly. Event logging covers all components of the platform. Railway maintains an incident response plan, a business continuity plan, and a disaster recovery plan, and tests backups and restores on an ongoing basis.

An independent firm performs penetration tests of the platform. The report is on the Trust Center. Vulnerabilities in Railway itself go to the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> or <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a>.

For the managed database images Railway maintains, Railway ships security patches for the image.

## Certifications and audit evidence

Everything in this table is on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The control descriptions and the SOC 3 report are public. The rest opens after you sign in with your Railway account email.

| Framework | Evidence |
| --- | --- |
| SOC 2 Type II | Full report, sign-in required |
| SOC 3 | Public download |
| HIPAA | HIPAA report, sign-in required. BAA available on Enterprise |
| GDPR | DPA at <a href="https://railway.com/legal/dpa" target="_blank">railway.com/legal/dpa</a> |
| EU-US and Swiss-US Data Privacy Frameworks | Listed on the Trust Center and on the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Third-party report, sign-in required |

The Trust Center also carries Railway's policy documents, including the Encryption Policy and Backup Policy.

## Data processing

Railway's standard [Data Processing Agreement](https://railway.com/legal/dpa) covers GDPR Article 28 obligations, including breach notification, and can be signed self-service from the [Compliance](/enterprise/compliance#gdpr-compliance---data-processing-agreement-dpa) page. Subprocessors are listed at <a href="https://railway.com/legal/subprocessors" target="_blank">railway.com/legal/subprocessors</a>.

Your services and their volumes run in the [region](/deployments/regions) you pick. Railway's primary processing operations take place in the United States, and the DPA sets out the transfer mechanisms for personal data that moves there. Deleting your account purges or anonymizes your customer data and content. The <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> covers the rest, and privacy questions go to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response

[Incident management](/platform/incident-management) describes how Railway monitors for incidents, how it classifies them, and how retrospectives work. Every High severity incident gets public communications. Enterprise customers receive a root cause analysis.

### How you hear about it

Availability incidents go on the <a href="https://status.railway.com" target="_blank">status page</a> as soon as Railway is aware of them. Where personal data is involved, the DPA commits Railway to inform you of a personal data breach without undue delay and to help you meet your own obligations to regulators and data subjects.

Direct notice goes by email to workspace admins. Public disclosure goes on the <a href="https://blog.railway.com/engineering" target="_blank">engineering blog</a> and the <a href="https://railway.com/changelog" target="_blank">changelog</a>. Questions about your own workspace go through the [Help Station](/platform/support).

When stored credentials may have been exposed, Railway also notifies the upstream providers of those credentials so they can revoke affected keys. In October 2026 that notice went out before the public disclosure, which is why some customers heard from a provider before they heard from Railway.

### Published incident reports

Railway publishes a report for a security incident with customer impact. A report carries a UTC timeline, the scope of impact, what was and wasn't accessed, the actions you need to take, the actions Railway took, and an FAQ. A preliminary report goes out while the investigation is still running and gets dated updates until the final report replaces it.

- <a href="https://blog.railway.com/p/incident-report-march-30-2026-authenticated-user-data-cached" target="_blank">March 30, 2026: authenticated user data cached by the CDN</a>
- <a href="https://blog.railway.com/p/preliminary-report-october-security-incident" target="_blank">October 21, 2026: unauthorized access to internal systems and decryption of environment variables</a>

In the October 2026 incident, an attacker had access to a subset of Railway's internal systems from October 20 at 13:58 UTC until October 22 at 03:32 UTC and decrypted environment variables for at most 1.85% of workspaces. User accounts weren't accessed. Running deployments stayed up; builds and deployments were paused during containment. Railway revoked every API token and session, rolled all internal credentials and all storage bucket credentials, and moved builds onto the single-tenant builder generation. If you created your workspace before October 21, 2026, and haven't rotated the credentials stored on Railway since, rotate them and redeploy the services that use them. The report links a rotation guide for each affected provider, and the <a href="https://railway.com/changelog/2026-10-23-october-21-security-incident" target="_blank">changelog entry</a> lists the four customer actions.

## Frequently asked questions

### Is Railway SOC 2 compliant?

Railway has a SOC 2 Type II report and a SOC 3 report, both on the Trust Center. The SOC 3 is a public download.

### Does Railway encrypt environment variables?

Variables are encrypted at rest under the AES-256 control above, and envelope encrypted so each value has its own data key. Railway decrypts a variable to provide it to your build or container, and shows it in the dashboard to roles other than Viewer unless it's sealed.

### Can Railway staff read my variables?

Staff don't access your workloads or modify your application without your permission through an approved support channel, and under a HIPAA BAA they can't access running workloads at all. A sealed variable is never shown in the dashboard and can't be retrieved through the API, which is also why support can't recover a sealed value you've lost.

### Where does my data live?

Services and volumes run in the region you choose: US West, US East, EU West, or Southeast Asia on Railway Metal. Railway's primary processing operations are in the United States.

### How will I hear about a breach?

Availability incidents are on the status page as soon as Railway knows about them. For a personal data breach, the DPA commits Railway to inform you without undue delay. Security incidents with customer impact are also disclosed on the engineering blog and the changelog, with email to affected workspace admins.
