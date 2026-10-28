---
title: Security
description: How Railway protects your code, data, and credentials, and what evidence you can hand to an auditor.
---

Railway runs on its own hardware. The servers, the network, the build system, and the dashboard are all Railway's, so there's no other cloud provider between you and the people responsible for keeping your data safe. This page covers what that gets you: encryption on everything stored, isolation between projects, the access controls a security review asks about, published audit reports, and a public record of how Railway handles incidents.

Audit reports and policies live on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. The HIPAA BAA, the DPA, and EU DORA documents are on the [Compliance](/enterprise/compliance) page.

## Encryption at rest and in transit

Everything Railway stores for you is encrypted at rest with AES-256, in every region. That includes [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables. Railway manages the encryption and the keys, so there's nothing to configure.

Environment variables get a second layer on top of that. They're envelope encrypted: the keys that protect them are themselves encrypted under a key Railway holds separately, so no single key protects every value on the platform. Railway decrypts a variable when it provides it to a build or a running container. In the dashboard and the API, project Viewers can't see variable values. Admins and Members can, unless the variable is sealed.

In transit, public endpoints require HTTPS with TLS 1.2 or 1.3. Plain HTTP is redirected, and Railway issues and renews certificates for you ([specs and limits](/networking/public-networking/specs-and-limits)). Traffic between your services goes over the [private network](/networking/private-networking), which is encrypted with WireGuard and stays inside Railway's infrastructure. A database that only your own services talk to can run without a public endpoint.

### Sealed variables

Seal a variable when its value should be written once and never read back. A sealed value still reaches your builds and containers, but the dashboard doesn't show it, the API doesn't return it, and `railway variables` and `railway run` leave it out. It can't be unsealed, and Railway doesn't copy it into PR environments, duplicated environments or services, or external integrations. [Sealed variables](/variables#sealed-variables) covers how to seal and update one.

Sealing stops a value from being read back through Railway. It doesn't hide the value from code running in the container, so for production credentials, pair it with the access controls below.

Related guides:

- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)
- [Use an external secrets manager](/guides/external-secrets-manager)
- [Managing secrets on Railway](/guides/managing-secrets-on-railway)

## Isolation between projects, environments, and builds

Each environment has its own network namespace. Services in different projects, or in different environments of the same project, can't reach each other over the private network, and that holds without any configuration on your side. [How private networking works](/networking/private-networking/how-it-works) has the details.

Each build runs in its own single-tenant environment on Railway's builder infrastructure. Build-time secrets are handled separately from runtime secrets ([Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets)). Workloads that need their own hardware can run on [Railway-managed dedicated hosts](/enterprise#hosting-options) on Enterprise.

Railway staff don't change your application without your permission through an approved communication channel. When a HIPAA BAA is in effect, staff lose direct access to your running workloads. Railway does remove workloads that violate the [acceptable use policy](/platform/trust-and-safety).

## Access control: SSO, RBAC, and audit logs

Sign-in is through email, OAuth providers, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account, and on Pro and above, workspace admins can [require it for every member](/access/two-factor-enforcement). The controls below decide who can reach what once they're in.

| Control | What it does | Plan |
| --- | --- | --- |
| [SAML SSO](/enterprise/saml) | Routes sign-in through your identity provider | Enterprise |
| [Access groups](/enterprise/access-groups) | Scopes members to specific projects | Enterprise |
| [Environment RBAC](/enterprise/environment-rbac) | Limits variables, logs, and configuration in a restricted environment to Admins | Enterprise |
| [Guardrails](/enterprise/guardrails) | Stops non-admins from creating public domains or TCP proxies, and limits deployments to approved GitHub organizations | Enterprise |
| [Project tokens](/integrations/api#creating-a-token) | Binds a token to one project and one environment | All plans |

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry. Pull them into your own tooling through the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api). Audit logs cover activity in your workspace. Railway's internal systems are logged separately.

## Railway's own security practices

The technical and organizational measures Railway commits to are in Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a>. Connections to production are encrypted. Staff access requires strong authentication, including 2FA and a password manager. Employees sign NDAs and pass background checks before they get access, and they complete security awareness training every year.

Railway reviews its policies and controls at least annually and uses Drata to test them continuously. Platform components run secure default configurations and are patched regularly, and event logging covers every component of the platform. Railway maintains an incident response plan, a business continuity plan, and a disaster recovery plan, and tests backups and restores on an ongoing basis.

An independent firm runs a penetration test of the platform every year, and the report is on the Trust Center. Third-party vendors scan the platform for vulnerabilities every quarter. For the managed database images Railway maintains, Railway ships the security patches. Vulnerabilities in Railway itself go to the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> or <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a>.

## SOC 2, HIPAA, and GDPR on Railway

You don't need to run your own servers to pass a SOC 2 audit. Railway's SOC 2 Type II report covers the infrastructure your application runs on, and the Trust Center is where you and your auditor collect it. The SOC 3 report is a public download. The other reports open once you request access.

| Framework | Evidence |
| --- | --- |
| SOC 2 Type II | Full report on the Trust Center |
| SOC 3 | Public download on the Trust Center |
| HIPAA | HIPAA report on the Trust Center, BAA on Enterprise |
| GDPR | <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a>, signed self-service |
| EU-US and Swiss-US Data Privacy Frameworks | Listed on the Trust Center and the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Third-party report on the Trust Center |

For HIPAA workloads, Railway follows a shared responsibility model and signs a BAA with Enterprise customers. For GDPR, the DPA covers Article 28 obligations, including breach notification, and the <a href="https://railway.com/legal/subprocessors" target="_blank">subprocessor list</a> is public. The [Compliance](/enterprise/compliance) page has the BAA terms, the DPA signing link, and the EU DORA documents.

## Data residency

Pick a region when you create a service, and the service and its volumes run there. EU West is in Amsterdam, and the rest are on the [regions](/deployments/regions) page. Railway's primary processing operations take place in the United States, and the DPA sets out the transfer mechanisms for personal data that moves there. Deleting your account purges or anonymizes your customer data and content. The <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> covers the rest, and privacy questions go to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response and breach notification

Railway monitors its infrastructure around the clock and classifies every incident by severity. [Incident management](/platform/incident-management) describes the levels and the retrospective process. High severity incidents get public communications, and Enterprise customers receive a root cause analysis.

Availability incidents go on the <a href="https://status.railway.com" target="_blank">status page</a> as soon as Railway is aware of them. For a personal data breach, the DPA commits Railway to inform you without undue delay and to help you meet your own obligations to regulators and data subjects. Affected customers are notified by email. The <a href="https://blog.railway.com/engineering" target="_blank">engineering blog</a> and the <a href="https://railway.com/changelog" target="_blank">changelog</a> carry the public disclosure, and Enterprise customers get their root cause analysis in their shared Slack channel. For questions about your own workspace, use the [Help Station](/platform/support).

Security incidents that affect customers get a written report with a UTC timeline, the scope of impact, and the actions Railway took. Both incidents in 2026 have one.

- <a href="https://blog.railway.com/p/incident-report-march-30-2026-authenticated-user-data-cached" target="_blank">March 30, 2026: authenticated user data cached by the CDN</a>
- <a href="https://blog.railway.com/p/preliminary-report-october-security-incident" target="_blank">October 21, 2026: unauthorized access to internal systems and decryption of environment variables</a>

The October 2026 report is preliminary, with dated updates until the final report replaces it, and it sets out what was and wasn't accessed, the actions you need to take, and an FAQ. In that incident, Railway notified the upstream providers of exposed credentials before the public disclosure so they could revoke affected keys, which is why some customers heard from a provider first. If you stored credentials on Railway before October 21, 2026, and haven't rotated them since, follow the <a href="https://railway.com/changelog/2026-10-23-october-21-security-incident" target="_blank">changelog entry</a>.

## Frequently asked questions

The short versions. Each section above has the detail.

### Is Railway SOC 2 compliant?

Yes. Railway has a SOC 2 Type II report and a SOC 3 report from an independent auditor, both on the Trust Center. The SOC 3 is a public download.

### Does Railway encrypt environment variables?

Yes. Variables are encrypted at rest with AES-256 and envelope encrypted on top, so no single key protects every value. Railway decrypts a variable when it provides it to your build or container.

### Can Railway staff read my variables?

Staff don't change your application without your permission through an approved communication channel, and under a HIPAA BAA they can't access running workloads at all. A sealed value can't be read back through the dashboard or the API by you or by Railway support. If you lose one, set a replacement.

### Can I run HIPAA workloads on Railway?

Yes, on Enterprise with a BAA in effect. Railway covers the infrastructure under a shared responsibility model, you cover your application's handling of PHI, and staff lose direct access to your running workloads once the BAA is signed.

### Can I keep my data in the EU?

Services and volumes in the EU West region run in Amsterdam. Railway's primary processing operations are in the United States, and the DPA covers the transfer mechanisms.

### How will I hear about a security incident?

Availability incidents are on the status page as soon as Railway knows about them. Security incidents that affect customers are disclosed on the engineering blog and the changelog, with email to affected customers. For a personal data breach, the DPA commits Railway to inform you without undue delay.

### What changed after the October 2026 incident?

Railway rolled every internal credential, revoked all API tokens and sessions, rolled all storage bucket credentials, rebuilt its infrastructure tooling from validated source, added the ability to mass-revoke application permissions, and moved builds onto a single-tenant builder generation. The preliminary report lists the actions and is updated until the final report is published.
