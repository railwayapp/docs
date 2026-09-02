---
title: Railway Domains
description: Purchase and manage domains directly within Railway.
---

You can search, purchase, and manage domains without leaving Railway. DNS is auto-configured, WHOIS privacy is included, and auto-renewal is on by default.

## Search for a domain

Navigate to [railway.com/domains](https://railway.com/domains) or click **Buy a Domain** from a service's networking settings.

- Real-time search shows availability and pricing
- Describe what you're building to get AI-powered domain suggestions
- Over 250 TLDs available (`.com`, `.io`, `.dev`, `.app`, `.ai`, `.co`, and more)

## Purchase a domain

Select a domain, confirm the price, and purchase with your existing payment method.

- Domains are registered for one year (some TLDs like `.ai` require a two-year minimum)
- WHOIS privacy enabled by default
- Auto-renewal enabled by default
- Railway is listed as the registrant contact and handles all registry communications on your behalf
- When purchased from a service, the domain is automatically attached and configured

## Manage domains

View all purchased domains at [railway.com/workspace/domains](https://railway.com/workspace/domains).

- Expiry/renewal dates, attached services, and payment status
- Toggle auto-renewal (workspace admins)
- Connect a domain to a service or subdomain at any time

## DNS

By default, Railway fully manages DNS for purchased domains through its own nameservers, so pointing a domain at a Railway service needs no manual configuration. Open a domain from [railway.com/workspace/domains](https://railway.com/workspace/domains) to view its nameservers and DNS records.

### Nameservers

When a domain uses Railway's nameservers, the **Nameservers** section shows "Railway is managing DNS for this domain" and Railway maintains the zone for you.

To host DNS with an external provider instead — for example, to use Cloudflare's proxy/WAF, Amazon Route 53, or another third-party DNS host — a workspace admin can delegate the domain to that provider **without transferring it out of Railway**:

1. Open the domain from [railway.com/workspace/domains](https://railway.com/workspace/domains).
2. In the **Nameservers** section, click **Use Custom Nameservers**.
3. Enter the nameserver hostnames your DNS provider gave you (most providers give you two; up to four are supported), then save.

To return to Railway-managed DNS at any time, click **Reset to Railway**.

<Banner variant="warning">
While a domain is delegated to an external provider, Railway no longer controls its zone, which changes how you attach it to a service and manage its records.
</Banner>

Specifically, while custom nameservers are in use:

- The one-click **Add a custom domain** flow no longer lists this domain in service settings. You can still attach it using the [standard custom domain flow](/networking/domains/working-with-domains#custom-domains) — add the domain on your service, then create the `CNAME`/`ALIAS` records Railway provides at your external DNS host.
- The **DNS records** section no longer lists records. It shows "DNS records are managed at your external provider" and the add-record button is disabled, so manage records at your provider instead.

Only workspace admins can change a domain's nameservers, and only while the domain is active.

### DNS records

While Railway manages your nameservers, the **DNS records** section lists every DNS record for the domain, and admins can add, edit, and remove records directly. If you delegate the domain to an external provider with [custom nameservers](#nameservers), the section stops listing records and instead shows "DNS records are managed at your external provider" with the add-record button disabled.

## Transfer a domain to another registrar

Workspace admins can transfer a Railway-purchased domain to another registrar directly from the domain's detail page. Transferring out **requires two-factor authentication (2FA)** and is available only on active domains.

<Banner variant="info">
If you only need Cloudflare's proxy/WAF or DNS hosted elsewhere, you don't need to transfer your domain out — use [custom nameservers](#nameservers) instead.
</Banner>

### 60-day transfer lock

ICANN places a 60-day lock on every newly registered or newly transferred domain, so a Railway-purchased domain can't be transferred out until 60 days after it was registered. This is an ICANN policy that Railway cannot waive or expedite.

Until the domain is eligible, the **Transfer to Another Registrar** section shows the date it becomes eligible, in your local timezone.

### Start a transfer

Once the domain is eligible, a workspace admin can start the transfer:

1. Open the domain from [railway.com/workspace/domains](https://railway.com/workspace/domains) and find the **Transfer to Another Registrar** section.
2. Click **Get Transfer Code**. A confirmation dialog explains that starting the transfer unlocks the domain at the registrar, turns off auto-renewal, and provides a transfer authorization (EPP) code.
3. Confirm and complete 2FA.
4. Copy the **EPP/auth code** and paste it at your new registrar to start the transfer there.

After you start a transfer:

- **Most transfers complete in 5-7 days.** The transfer is carried out by the gaining registrar, not Railway.
- **Auto-renewal is turned off**, so you won't be billed again at the end of the current term.
- **If you lose the code**, return to this section and click **Get Transfer Code** again — it returns the same code.
- **Make sure before you start — transfers are final.** Once started, a transfer won't be undone; the domain moves to your new registrar, where you'll manage it from then on.

## Email forwarding

Forward mail sent to an address on your Railway-purchased domain to an inbox you already use. Railway doesn't create a mailbox and doesn't store your mail. It relays each message to the destination you choose.

Open a domain from [railway.com/workspace/domains](https://railway.com/workspace/domains) and find the **Email Forwarding** section, next to **DNS records**. Only workspace admins can add, edit, and remove addresses.

1. Click **Add Address**.
2. Enter the address to forward, such as `hello`, and the destination inbox it should reach.
3. Click **Send Test Email** on the address to confirm it arrives.

Enabling forwarding adds seven DNS records to the domain apex, six mail exchange records and one sender policy record, which appear alongside your other [DNS records](#dns-records). Forwarding delivers only while those records are in place, so Railway warns you before a DNS change that would break it: a mail exchange record for another provider is refused while forwarding addresses exist, deleting the mail exchange records stops forwarding, and delegating the domain to [custom nameservers](#nameservers) stops delivery.

### Before you rely on forwarding

Forwarding hands each message to an inbox you already own, which shapes what it can do:

- Replies come from the destination inbox and show that address, not the address the mail was sent to.
- Spam isn't filtered on the way through. The destination inbox applies its own filtering, so check its spam folder.
- Messages with attachments over 10 MB may fail to arrive.
- Each address forwards to one destination. Catch-all and wildcard addresses aren't supported.
- Mail sent from the destination inbox to the forwarded address isn't forwarded back, so test with **Send Test Email** rather than emailing yourself.

### Address limits

Each domain can have a limited number of forwarding addresses, set by your workspace plan:

| Trial | Free | Hobby | Pro | Enterprise |
| --- | --- | --- | --- | --- |
| 1 | 1 | 5 | 25 | 25 |

The limit counts per domain and applies when you add an address. A domain that's over its limit keeps forwarding every address it has, and you can still edit and remove them, but Railway refuses new ones. Enterprise limits can be raised on request.

### When forwarding isn't available

Railway offers forwarding only on domains whose mail records it can manage. The **Email Forwarding** section shows guidance instead of a form when:

- The domain already sends or receives mail through another provider. Set forwarding up with that provider, because adding it in Railway would break your existing setup.
- DNS is delegated to [custom nameservers](#nameservers). Set forwarding up at that provider, or reset to Railway's nameservers first.

## Billing

Domain subscriptions are separate from your workspace subscription.

- Priced at cost, rounded to dollar
- First-year price may differ from the renewal price
- You receive a notification before an upcoming renewal
- Auto-renewal charges approximately 30 days before expiration
- If payment fails, Railway retries up to three times before the domain expires

## FAQ

Common questions about Railway Domains.

<Collapse title="Can I transfer a domain between workspaces?">
Not yet. This capability is planned.
</Collapse>

<Collapse title="Can I transfer a domain out of Railway?">
Yes. Workspace admins can transfer a Railway-purchased domain to another registrar from the domain's detail page (2FA required). A domain can't be transferred until 60 days after registration, per ICANN policy. See [Transfer a domain to another registrar](#transfer-a-domain-to-another-registrar).
</Collapse>

<Collapse title="Can I transfer a domain into Railway?">
No. Railway doesn't support transferring in a domain registered with another registrar. To use a domain you own elsewhere, add it to your service as a [custom domain](/networking/domains/working-with-domains#custom-domains) — it stays registered where it is.
</Collapse>

<Collapse title="Can I use Cloudflare or another DNS provider with my domain?">
Yes. Workspace admins can point a Railway-purchased domain at an external DNS provider with [custom nameservers](#nameservers), without transferring the domain out. While custom nameservers are in use, the one-click custom domain flow is disabled and DNS records are managed at your external provider instead of in Railway.
</Collapse>

<Collapse title="Can I get email on my domain?">
Railway can forward mail sent to an address on your domain to an inbox you already use. It doesn't host mailboxes, so you can't read mail in Railway or send from the forwarded address. See [Email forwarding](#email-forwarding).
</Collapse>

<Collapse title="Which TLDs are available?">
Over 250 popular TLDs. No restricted or country-code TLDs requiring local presence.
</Collapse>

<Collapse title="Can I buy a domain without attaching it to a service?">
Yes. Purchase a domain and connect it to a service later.
</Collapse>

<Collapse title="What happens if renewal payment fails?">
Railway retries payment up to three times before the domain expires.
</Collapse>

<Collapse title="Can I manually configure DNS records?">
Yes, while Railway manages your nameservers you can add or remove any DNS record for the domain. If you switch to [custom nameservers](#nameservers), manage records at your external provider instead.
</Collapse>

<Collapse title="Who is the registrant contact for my domain?">
Railway is listed as the registrant contact. We handle all registry and ICANN communications on your behalf.
</Collapse>
