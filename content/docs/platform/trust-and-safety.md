---
title: "Trust and safety"
description: "What you can run on Railway, how abuse is handled, and what restrictions mean for your workspace."
---

Railway's approach to trust and safety aims to protect users and infrastructure
while keeping legitimate workloads running. When Railway restricts your
resources, it explains what happened, what's affected, and what you can do next.

## What isn't allowed

In practical terms, you must not use Railway for:

<Collapse slug="multi-accounting" title="Multi-accounting or ban evasion">
Creating additional accounts to reuse the Trial plan, or to keep using Railway
after an account or workspace was banned.
</Collapse>

<Collapse slug="crypto-mining" title="Cryptocurrency mining">
Running cryptocurrency miners on Railway, including miners bundled inside
another application.
</Collapse>

<Collapse slug="proxies" title="Proxies, VPNs, or virtual desktops">
Operating proxies, VPNs, anonymization services, or remote desktops for personal
or professional browsing, including proxyware that resells bandwidth. Reverse
proxies and private networking tools that serve your own Railway services, such
as Caddy or Tailscale, are allowed.
</Collapse>

<Collapse slug="phishing-and-fraud" title="Phishing, impersonation, payment fraud, or other scams">
Deceiving people to steal credentials, money, or personal information. Examples
include fake login pages, card testing, impersonating a brand or person, and
fake investment, crypto, or job schemes.
</Collapse>

<Collapse slug="malware-and-network-abuse" title="Malware, botnets, DDoS attacks, or unauthorized access to systems">
Distributing malware, running botnet command-and-control servers, launching DDoS
attacks or port floods, or spoofing network or email identities. This also
covers scanning or accessing systems you don't own or aren't authorized to test.
</Collapse>

<Collapse slug="spam" title="Spam, including unsolicited bulk email or messages">
Sending unsolicited bulk messages through any channel, including email, SMS,
and chat platforms. This includes services on Railway that power spam sent from
somewhere else.
</Collapse>

<Collapse slug="torrenting-and-piracy" title="Torrenting or distributing unauthorized copies of software or media">
Downloading, seeding, or indexing torrents of any kind. Hosting or distributing
software, media, or other material without the rights holder's permission is
also prohibited.
</Collapse>

<Collapse slug="payment-disputes" title="Illegitimate chargebacks or disputes for legitimate Railway usage">
Filing a chargeback or payment dispute for usage you incurred and were billed
for correctly. If you think a charge is wrong,
[contact support](/platform/support) before disputing it with your bank.
</Collapse>

<Collapse slug="harassment" title="Harassment, threats, or intimidation">
Content or services used to harass, threaten, or intimidate a person or group,
such as publishing someone's private information to target them.
</Collapse>

<Collapse slug="non-consensual-intimate-imagery" title="Non-consensual intimate imagery">
Creating, hosting, or distributing intimate images of someone without their
consent. This includes AI-generated or digitally altered images.
</Collapse>

<Collapse slug="harm-to-minors" title="Content or activity that exploits or harms minors">
Any content or activity that sexualizes, exploits, or endangers minors,
including child sexual abuse material (CSAM).
</Collapse>

<Collapse slug="illegal-activity" title="Any illegal activity">
Anything that violates applicable law. Examples include selling illegal drugs or
pharmaceuticals, trading stolen data, and promoting terrorism, violent
extremism, or human trafficking.
</Collapse>

The Acceptable Use Policy also prohibits reselling compute resources, evading
usage or billing limits, and running bots or scrapers that violate applicable
terms of service.

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

### What happens when Railway detects abuse

Railway either restricts the affected resources or bans the workspace.

A restriction limits part of what you can do, such as deploying a service or
managing a domain. You keep access to your dashboard, where you can see what's
restricted and what to do next.

A ban is reserved for serious or repeated violations of the Terms of Service.
It blocks access to your account and takes every service in the workspace
offline.

## How restrictions affect your workspace

A restriction can affect an individual service or domain, a particular feature,
or an entire workspace.

Depending on the restriction, Railway may limit certain actions, prevent new
resources or deployments, or take running services offline. The restriction
details explain what's affected.

## What happens after a restriction

Most restrictions follow the same path from notification to resolution.

<Steps>
  <Step title="Check your notifications">
    By default, Railway sends you an email and an in-app notification whenever a resource is restricted.
  </Step>
  <Step title="Review the restriction">
    The <a href="https://railway.com/workspace/restrictions" target="_blank">restrictions page in your dashboard</a> shows the recorded reason, affected resources, and consequences.
  </Step>
  <Step title="Resolve or appeal the restriction">
    Some restrictions have a specific resolution, such as upgrading to a paid plan. Others require an approved [appeal](#submit-an-appeal) before they can be lifted.
  </Step>
  <Step title="Redeploy stopped services">
    After a restriction is lifted, you may need to redeploy any services that were stopped.
  </Step>
</Steps>

<Banner variant="warning">
If your account is banned, you only see the **Account suspended** page when you
sign in. That page shows the recorded reason and, when available, the option
to appeal.
</Banner>

### Submit an appeal

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

## Report abuse or infringement

Report suspected abuse or trademark infringement to
[abuse@railway.com](mailto:abuse@railway.com). Include the affected URLs and a
description of the issue.

If you own copyrighted material or represent its owner, you can
<a href="https://railway.com/abuse/dmca" target="_blank">submit a DMCA takedown notice</a>.
