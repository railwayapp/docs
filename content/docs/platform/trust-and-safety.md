---
title: "Trust and safety"
description: "What you can run on Railway, how abuse is handled, and what restrictions mean for your workspace."
---

Railway's approach to trust and safety aims to protect users and infrastructure
while keeping legitimate workloads running. When restrictions are necessary,
you should understand why they happened, what they affect, and what you can do
next.

## What isn't allowed

In practical terms, you must not use Railway for:

- Spam, including unsolicited bulk email or messages
- Phishing, impersonation, payment fraud, or other scams
- Malware, botnets, DDoS attacks, or unauthorized access to systems
- Cryptocurrency mining
- Torrenting or distributing unauthorized copies of software or media
- Any illegal activity
- Issuing illegitimate chargebacks or disputing Railway payments for rendered services

The Acceptable Use Policy also prohibits operating proxies or anonymization
services, reselling compute resources, evading usage or billing limits, and
running bots or scrapers that violate applicable terms of service.

You're responsible for what you host and how your applications are used. These
examples summarize the rules, but don't replace the
<a href="https://railway.com/legal/acceptable-use" target="_blank">Acceptable Use Policy</a>
or <a href="https://railway.com/legal/terms" target="_blank">Terms of Service</a>.

<Banner variant="info">
If you're unsure whether your workload is permitted, ask through
<a href="https://station.railway.com/new" target="_blank">Central Station</a> or email
[abuse@railway.com](mailto:abuse@railway.com) before deploying.
</Banner>

## How Railway evaluates abuse

Railway uses automated detection and reviews abuse reports to identify
suspected policy violations. Reports can come from users, rights holders, and
security organizations.

The aim is to stop the abuse with the narrowest effective action while avoiding
unnecessary disruption to legitimate workloads. For example, action against a
compromised service can be limited to that service rather than the entire
workspace.

### Report abuse or infringement

Report suspected abuse or trademark infringement to
[abuse@railway.com](mailto:abuse@railway.com). Include the affected URLs and a
description of the issue.

If you own copyrighted material or represent its owner, you can
<a href="https://railway.com/abuse/dmca" target="_blank">submit a DMCA takedown notice</a>.

## How restrictions affect your workspace

A restriction can affect an individual service or domain, a particular feature,
or an entire workspace. Railway may ban workspaces for serious or repeated
violations of its Terms of Service.

Depending on the restriction, Railway may limit certain actions, prevent new
resources or deployments, or take running services offline. The restriction
details explain what's affected.

## What happens after a restriction

By default, Railway sends you an email and an in-app notification whenever a
resource is restricted.

Review the <a href="https://railway.com/workspace/restrictions" target="_blank">restrictions page in your dashboard</a>
to understand the recorded reason, affected resources, and consequences.
Available next steps depend on the restriction.

Some restrictions require an approved appeal before they can be lifted. Others
have a specific resolution, such as upgrading to a paid plan.

After a restriction is lifted, you may need to redeploy any services that were
stopped.

### Submitting an appeal

If you believe a restriction was applied in error, use the appeal option in your
dashboard when it's available. Restrictions remain in effect while an appeal is
reviewed.

A useful appeal explains what your workload does, addresses the stated reason
for the restriction, and describes any changes you've made. Follow the
[guidance for asking for help](/platform/support#how-to-ask-for-help): include
relevant resource IDs, logs, and code links where applicable. Check that your
claims match what happened, and remove secrets or unrelated personal details
before submitting.

You can generally appeal a restriction once, and the appeal decision is final.
Not every restriction can be appealed. Follow the resolution instructions shown
in your dashboard.
