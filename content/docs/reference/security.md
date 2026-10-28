---
title: Security
description: How Railway keeps your code, data, and credentials safe, how to pass SOC 2 and HIPAA audits on Railway, and how Railway responds when something goes wrong.
---

Railway owns the whole stack your application runs on, from its own servers in [four regions](/deployments/regions) up to the deploy workflow. That changes what security means on a platform. There's no cloud provider in the middle to hand responsibility to, so the team that builds Railway is the team that secures it, and the controls on this page come with every workload rather than as an add-on you assemble yourself.

The result is a platform you can bring to an auditor. Your data is encrypted at rest and in transit, your projects and environments are isolated from each other, access is governed by roles you control, and the evidence is published: SOC 2 Type II and SOC 3 reports, a HIPAA report, a third-party penetration test, and the policies behind them, all on the <a href="https://trust.railway.com" target="_blank">Trust Center</a>. When Railway has a security incident, you hear about it from Railway, in writing, with a timeline.

## Encrypting secrets and customer data

Everything Railway stores for you is encrypted at rest with AES-256, in every region: [volumes](/volumes), [volume backups](/volumes/backups), [point-in-time recovery archives](/volumes/point-in-time-recovery), [storage buckets](/storage-buckets), and environment variables. Railway manages the encryption and the keys end to end, so there's nothing for you to configure and nothing your application has to carry.

Environment variables get a further layer. They're envelope encrypted, which means the keys that protect them are themselves encrypted under a key Railway holds separately, rather than one platform-wide key protecting everything. Railway decrypts a variable only when it provides it to a build or a running container. Project Viewers can't see variable values in the dashboard or the API. Admins and Members can, unless the variable is sealed.

In transit, public endpoints require HTTPS with TLS 1.2 or 1.3, plain HTTP is redirected, and certificates are issued and renewed for you ([specs and limits](/networking/public-networking/specs-and-limits)). Traffic between your services crosses the [private network](/networking/private-networking), encrypted with WireGuard inside Railway's infrastructure, so a database that only your own services use can run with no public endpoint at all.

### Sealed variables

For values that should be written once and never read back, seal them. A sealed value still reaches your builds and containers, but it isn't shown in the dashboard, can't be retrieved through the API, and is omitted by `railway variables` and `railway run`. It can't be unsealed, and Railway doesn't copy it into PR environments, duplicated environments or services, or external integrations. [Sealed variables](/variables#sealed-variables) covers how to seal and update one.

Sealing protects a value from being read back through Railway. It doesn't hide the value from code running in the container, so pair it with the access controls below for environments that hold production credentials.

Related guides:

- [Rotate credentials with zero downtime](/guides/rotate-credentials-zero-downtime)
- [Use an external secrets manager](/guides/external-secrets-manager)
- [Managing secrets on Railway](/guides/managing-secrets-on-railway)

## Isolation between projects, environments, and builds

Each environment has its own network namespace. Services in different projects, or in different environments of the same project, can't reach each other over the private network, and the namespace enforces that without any configuration on your side. [How private networking works](/networking/private-networking/how-it-works) has the details.

Builds get the same treatment. Each build runs in its own single-tenant environment on Railway's builder infrastructure, and build-time secrets are handled separately from runtime secrets ([Build-time vs runtime secrets](/guides/build-time-vs-runtime-secrets)). For workloads that need their own hardware, Enterprise workspaces can run on [Railway-managed dedicated hosts](/enterprise#hosting-options).

Railway staff don't change your application without your permission through an approved communication channel, and when a HIPAA BAA is in effect, staff lose direct access to your running workloads. Railway does remove workloads that violate the [acceptable use policy](/platform/trust-and-safety).

## Role-based access for your team

Sign-in is through email, OAuth providers, or SAML on Enterprise. [Multi-factor authentication](/access/multi-factor-authentication) with an authenticator app or a passkey is available on every account, and workspace admins on Pro and above can [require it for every member](/access/two-factor-enforcement). From there, these controls decide who can reach what.

| Control | What it does | Plan |
| --- | --- | --- |
| [SAML SSO](/enterprise/saml) | Routes sign-in through your identity provider | Enterprise |
| [Access groups](/enterprise/access-groups) | Scopes members to specific projects | Enterprise |
| [Environment RBAC](/enterprise/environment-rbac) | Limits variables, logs, and configuration in a restricted environment to Admins | Enterprise |
| [Guardrails](/enterprise/guardrails) | Stops non-admins from creating public domains or TCP proxies, and limits deployments to approved GitHub organizations | Enterprise |
| [Project tokens](/integrations/api#creating-a-token) | Binds a token to one project and one environment | All plans |

[Audit logs](/enterprise/audit-logs) record who changed what in a workspace, with the actor and a timestamp on each entry, and you can pull them into your own tooling through the [`auditLogs` GraphQL query](/enterprise/audit-logs#exporting-audit-logs-via-the-api). They record activity in your workspace. Railway's internal systems are logged separately.

## How Railway secures itself

The technical and organizational measures Railway commits to are published in Exhibit C of the <a href="https://railway.com/legal/dpa" target="_blank">DPA</a>. Connections to production are encrypted and staff access requires strong authentication, including 2FA and a password manager. Employees sign NDAs and pass background checks before they get access, and complete security awareness training every year. Railway reviews its policies and controls at least annually, uses Drata to test controls continuously, patches platform components regularly, logs events across every component of the platform, and keeps incident response, business continuity, and disaster recovery plans with backups and restores tested on an ongoing basis.

An independent firm performs penetration tests of the platform, and the report is on the Trust Center. Vulnerabilities in Railway itself go to the <a href="https://railway.com/bug-bounty" target="_blank">bug bounty program</a> or <a href="mailto:bugbounty@railway.com">bugbounty@railway.com</a>. For the managed database images Railway maintains, Railway ships the security patches.

## Passing SOC 2, HIPAA, and GDPR audits on Railway

You don't need to run your own servers to hit SOC 2. Railway's own SOC 2 Type II report covers the infrastructure your application runs on, and the Trust Center is where you and your auditor collect it. The SOC 3 report is a public download, and the remaining reports open after you request access.

| Framework | Evidence |
| --- | --- |
| SOC 2 Type II | Full report on the Trust Center |
| SOC 3 | Public download on the Trust Center |
| HIPAA | HIPAA report on the Trust Center, BAA on Enterprise |
| GDPR | <a href="https://railway.com/legal/dpa" target="_blank">Data Processing Agreement</a>, signed self-service |
| EU-US and Swiss-US Data Privacy Frameworks | Listed on the Trust Center and the <a href="https://www.dataprivacyframework.gov/list" target="_blank">DPF participant list</a> |
| Penetration test | Third-party report on the Trust Center |

For HIPAA workloads, Railway follows a shared responsibility model and signs a BAA with Enterprise customers. For GDPR, the DPA covers Article 28 obligations, including breach notification, and the <a href="https://railway.com/legal/subprocessors" target="_blank">subprocessor list</a> is public. The [Compliance](/enterprise/compliance) page has the BAA terms, the DPA signing link, and the EU DORA documents.

## EU data residency

Pick the region when you create a service and your service and its volumes run there. EU West is in Amsterdam, and the other regions are listed on the [regions](/deployments/regions) page. Railway's primary processing operations take place in the United States, and the DPA sets out the transfer mechanisms for personal data that moves there. Deleting your account purges or anonymizes your customer data and content. The <a href="https://railway.com/legal/privacy" target="_blank">Privacy Policy</a> covers the rest, and privacy questions go to <a href="mailto:privacy@railway.com">privacy@railway.com</a>.

## Incident response and breach notification

Railway monitors its infrastructure continuously and classifies every incident by severity. [Incident management](/platform/incident-management) describes the levels and the retrospective process. High severity incidents get public communications, and Enterprise customers receive a root cause analysis.

Availability incidents go on the <a href="https://status.railway.com" target="_blank">status page</a> as soon as Railway is aware of them. For a personal data breach, the DPA commits Railway to inform you without undue delay and to help you meet your own obligations to regulators and data subjects. Affected customers are notified by email, the <a href="https://blog.railway.com/engineering" target="_blank">engineering blog</a> and the <a href="https://railway.com/changelog" target="_blank">changelog</a> carry the public disclosure, and Enterprise customers get their root cause analysis through their shared Slack channel. For questions about your own workspace, use the [Help Station](/platform/support).

Railway attempts to publish a report for each security incident with customer impact, and both incidents to date have one. A report carries a UTC timeline, the scope of impact, and the actions Railway took.

- <a href="https://blog.railway.com/p/incident-report-march-30-2026-authenticated-user-data-cached" target="_blank">March 30, 2026: authenticated user data cached by the CDN</a>
- <a href="https://blog.railway.com/p/preliminary-report-october-security-incident" target="_blank">October 21, 2026: unauthorized access to internal systems and decryption of environment variables</a>

The October 2026 report is a preliminary report with dated updates until the final report replaces it. It also sets out what was and wasn't accessed, the actions you need to take, and an FAQ. In that incident, Railway notified the upstream providers of exposed credentials before the public disclosure so they could revoke affected keys, which is why some customers heard from a provider before they heard from Railway. If you stored credentials on Railway before October 21, 2026, and haven't rotated them since, follow the <a href="https://railway.com/changelog/2026-10-23-october-21-security-incident" target="_blank">changelog entry</a>.

## Frequently asked questions

Short answers to the questions security reviewers ask most, with the detail in the sections above.

### Is Railway SOC 2 compliant?

Yes. Railway has a SOC 2 Type II report and a SOC 3 report from an independent auditor, both on the Trust Center, and the SOC 3 is a public download.

### Does Railway encrypt environment variables?

Yes, at rest with AES-256 and with envelope encryption on top, so no single platform-wide key protects every value. Railway decrypts a variable only when it provides it to your build or container.

### Can Railway staff read my variables?

Staff don't change your application without your permission through an approved communication channel, and under a HIPAA BAA they can't access running workloads at all. A sealed value can't be read back through the dashboard or the API by you or by Railway support, so if you lose one, set a replacement value.

### Can I run HIPAA workloads on Railway?

Yes, on Enterprise with a BAA in effect. Railway follows a shared responsibility model: Railway covers the infrastructure, you cover your application's handling of PHI, and staff lose direct access to your running workloads once the BAA is signed.

### Can I keep my data in the EU?

Services and volumes in the EU West region run in Amsterdam. Railway's primary processing operations are in the United States, and the DPA covers the transfer mechanisms.

### How will I hear about a security incident?

Availability incidents are on the status page as soon as Railway knows about them. Security incidents with customer impact are disclosed on the engineering blog and the changelog, with email to affected customers, and the DPA commits Railway to inform you of a personal data breach without undue delay.

### What changed after the October 2026 incident?

Railway rolled every internal credential, revoked all API tokens and sessions, rolled all storage bucket credentials, rebuilt its infrastructure tooling from validated source, added the ability to mass-revoke application permissions, and moved builds onto a single-tenant builder generation. The preliminary report lists the actions taken and is updated until the final report is published.
