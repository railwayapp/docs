---
title: Security
description: What Railway encrypts and isolates, who can access what, where the audit reports are, and what happened in 2026.
---

Railway runs customer workloads on hardware it owns and operates. The servers, the private network, the build system, and the dashboard are Railway's, so the controls on this page are Railway's own rather than a cloud provider's passed through.

Railway had a serious security incident in October 2026. An attacker reached internal systems and decrypted environment variables for a subset of workspaces. It's covered below alongside everything else, because a security page that skips it isn't worth reading.

Audit reports and policies are on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The HIPAA BAA, the DPA, and EU DORA documents are on the [Compliance](/enterprise/compliance) page.

## Encryption at rest and in transit

Everything Railway stores for you is encrypted at rest with AES-256, in every region: [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables. Railway manages the keys.

Encryption at rest protects data on disk. It doesn't protect against an attacker who obtains Railway's own credentials, because Railway has to decrypt your variables to put them in your containers. That's what happened in October 2026, and the controls that matter for that case are in the sections on isolation, access, and Railway's own practices.

Environment variables get a second layer. They're envelope encrypted, so the keys that protect them are themselves encrypted under a key Railway holds separately, and a single leaked key doesn't expose every variable. That design is why the October 2026 incident was bounded to at most 1.85% of workspaces (about 100,000) rather than all of them. Railway decrypts a variable only to hand it to a build or a running container. In the dashboard and the API, Viewers can't see values, and Admins and Members can unless the variable is sealed.

In transit, public endpoints require HTTPS with TLS 1.2 or 1.3. Plain HTTP is redirected, and Railway issues and renews certificates for you ([specs and limits](/networking/public-networking/specs-and-limits)). Traffic between your services goes over the [private network](/networking/private-networking), which is encrypted with WireGuard and stays inside Railway's infrastructure. A database that only your own services talk to can run without a public endpoint, and after October 2026, it should.

### Sealed variables

Seal a variable when its value should be written once and never read back through Railway. A sealed value still reaches your builds and containers, but you can't read it back through the dashboard, the API, or the CLI. It can't be unsealed, and Railway doesn't copy it into PR environments, duplicated environments or services, or external integrations. [Sealed variables](/variables#sealed-variables) covers how to seal and update one.

Sealing only stops the value being read back through Railway, including by Railway support. It doesn't change how Railway stores the value, and code in your container can still read it. A secret that Railway must never be able to decrypt has to be encrypted by you before it's stored, with the key kept somewhere else.

Three guides cover the day-to-day of secrets on Railway:

- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)
- [Use an external secrets manager](/guides/external-secrets-manager)
- [Manage secrets on Railway](/guides/managing-secrets-on-railway)

## Isolation

Each environment has its own network namespace. Services in different projects, or in different environments of the same project, can't reach each other over the private network. [How private networking works](/networking/private-networking/how-it-works) has the details.

Each build runs in its own single-tenant environment on Railway's builders, and [Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets) covers keeping secrets out of your image. Railway moved to single-tenant builders in October 2026, ahead of schedule, after the multi-tenant build infrastructure they replaced was the attacker's entry point in that month's incident. Workloads that need their own hardware can run on [Railway-managed dedicated hosts](/enterprise#hosting-options) on Enterprise.

Railway staff don't modify your application unless you ask them to through a support channel, and when a HIPAA BAA is in effect, they lose direct access to your running workloads. The exception is workloads that violate the [acceptable use policy](/platform/trust-and-safety), which Railway removes.

## Access control

Sign-in is through email, OAuth providers, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account, and on Pro and above, workspace admins can [require it for every member](/access/two-factor-enforcement). The controls below decide who can reach what once they're in.

| Control | What it does | Plan |
| --- | --- | --- |
| [SAML SSO](/enterprise/saml) | Routes sign-in through your identity provider | Enterprise |
| [Access groups](/enterprise/access-groups) | Scopes members to specific projects | Enterprise |
| [Environment RBAC](/enterprise/environment-rbac) | Limits variables, logs, and configuration in a restricted environment to Admins | Enterprise |
| [Guardrails](/enterprise/guardrails) | Stops non-admins from creating public domains or TCP proxies, and limits deployments to approved GitHub organizations | Enterprise |
| [Project tokens](/integrations/api#creating-a-token) | Binds a token to one project and one environment | All plans |

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry, and the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api) pulls them into your own tooling. They cover activity by people and tokens in your workspace, not access by Railway's internal systems, so they can't tell you whether a Railway-side incident touched your variables. The incident report and direct notification are the record for that.

## Railway's own security practices

Railway's staff controls are in Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a>. The short version: production access needs 2FA and goes over encrypted connections, every employee signs an NDA, passes a background check, and does security training each year, and controls are tested continuously against SOC 2 with policies reviewed yearly. Railway tests restores, not only backups.

An independent firm pen-tests Railway every year (the report is on the Trust Center), vulnerability scans by outside vendors run quarterly, and the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> runs continuously, with reports to <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a>. Railway patches the managed database images it ships.

These controls were in place in October 2026 and an attacker still got in, so treat them as a floor. What Railway changed afterward is in the incident report and summarized in the [FAQ](#what-changed-after-the-october-2026-incident).

## Audit reports and compliance

Railway's SOC 2 Type II report covers the infrastructure your services run on. Download the SOC 3 from the Trust Center without signing in. The SOC 2, the HIPAA report, and the pen test report open once you request access.

| Report | Where |
| --- | --- |
| SOC 2 Type II | Trust Center, request access |
| SOC 3 | Trust Center, public download |
| HIPAA | Trust Center, request access. BAA on Enterprise |
| GDPR | <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a>, signed self-service |
| EU-US and Swiss-US Data Privacy Frameworks | Trust Center and the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Trust Center, request access |

A SOC 2 report describes the controls an auditor observed over a period. The October 2026 incident happened with those controls in place, so read it as evidence that the controls exist, not as the end of your review.

On Enterprise, Railway signs a BAA for HIPAA workloads and covers the infrastructure side of the shared responsibility model. The DPA is the GDPR contract: it includes breach notification, and the <a href="https://railway.com/legal/subprocessors" target="_blank">subprocessor list</a> is public. The [Compliance](/enterprise/compliance) page has the BAA terms, the DPA signing link, and the EU DORA documents.

## Data residency

Pick a region when you create a service and it runs there, volumes included. EU West Metal is in Amsterdam, and the rest are on the [regions](/deployments/regions) page. Railway's own processing happens in the United States, which includes the systems that hold your project configuration and environment variables, whatever region your services run in. The DPA sets out the transfer terms for personal data that crosses over. When you delete your account, Railway purges or anonymizes your data. For anything else, see the <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> or write to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response and breach notification

Railway classifies incidents by severity, and [Incident management](/platform/incident-management) describes the levels and the retrospective process. High-severity incidents get a public post. Enterprise customers get a root cause analysis in their shared Slack channel.

Availability incidents are posted on the <a href="https://status.railway.com" target="_blank">status page</a> while they're in progress. Security incidents that affect you are disclosed on the <a href="https://blog.railway.com/engineering" target="_blank">engineering blog</a> and the <a href="https://railway.com/changelog" target="_blank">changelog</a>, and affected customers get an email. For a personal data breach, the DPA commits Railway to tell you without undue delay and to help with your own notifications to regulators and users. For questions about your own workspace, use the [Help Station](/platform/support).

Security incidents that affect customers get a written report with a UTC timeline, the scope of impact, and the actions Railway took. The reports published so far:

- <a href="https://blog.railway.com/p/incident-report-march-30-2026-authenticated-user-data-cached" target="_blank">March 30, 2026: authenticated user data cached by the CDN</a>
- <a href="https://blog.railway.com/p/preliminary-report-october-security-incident" target="_blank">October 21, 2026: unauthorized access to internal systems and decryption of environment variables</a>

The October 2026 report is preliminary. It covers what was and wasn't accessed and what you need to do, with dated updates until the final forensic report replaces it. Two parts of that timeline drew the most criticism and deserve a straight answer here. Railway told upstream providers about exposed credentials about 11 hours before it told customers, so some people heard from GitHub or Anthropic first. Railway's reasoning was that it wanted the attacker out of the infrastructure before asking customers to rotate, so the replacements wouldn't be stolen too. And builds were paused while customers were being asked to rotate, which meant a rotated variable couldn't be deployed until builds came back. If you stored credentials on Railway before October 21, 2026, and haven't rotated them since, follow the <a href="https://railway.com/changelog/2026-10-23-october-21-security-incident" target="_blank">changelog entry</a>.

## Frequently asked questions

Short answers to the questions a security review asks. The sections above have the detail.

### Is Railway SOC 2 compliant?

Yes. Railway has a SOC 2 Type II report and a SOC 3 report from an independent auditor, both on the Trust Center, and the SOC 3 is a public download. The report didn't prevent the October 2026 incident, so read it as evidence of controls rather than a guarantee.

### Does Railway encrypt environment variables?

Yes, at rest with AES-256, with a second envelope layer for variables. Railway decrypts a variable to provide it to your build or container, which is also the path the October 2026 attacker used with stolen Railway credentials.

### Can Railway read my variables?

Railway's systems can decrypt any unsealed variable, because that's how it gets into your container. That access is restricted and logged. Sealing a variable hides it from the dashboard, the API, the CLI, and Railway support, but Railway still decrypts it to run your service. If you need a secret Railway can never decrypt, encrypt it yourself before storing it.

### Can I run HIPAA workloads on Railway?

Yes, on Enterprise with a BAA in effect. Railway covers the infrastructure under a shared responsibility model, you cover your application's handling of PHI, and staff lose direct access to your running workloads once the BAA is signed.

### Can I keep my data in the EU?

Your services and volumes in EU West Metal run in Amsterdam. Railway's own processing, including the systems that hold your environment variables, is in the United States. If your residency requirement covers configuration and secrets as well as workload data, Railway doesn't meet it today.

### How will I hear about a security incident?

Availability incidents go on the status page. Security incidents that affect you are disclosed on the engineering blog and the changelog, and affected customers get an email. In October 2026, the public disclosure came about 30 hours after detection.

### What changed after the October 2026 incident?

Railway rotated every internal credential and every storage bucket credential, and revoked all API tokens and sessions. It rebuilt its infrastructure tooling from verified source, moved builds onto single-tenant builders, and added a way to revoke application permissions in bulk. The preliminary report lists each action and is updated until the final report is published. That final report, including whether source code was accessed, is still pending.
