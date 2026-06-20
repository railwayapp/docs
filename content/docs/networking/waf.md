---
title: WAF
description: Protect your Railway service from malicious traffic at the edge with Railway's web application firewall (WAF).
---

Railway's web application firewall (WAF) runs at the [edge](/networking/edge-networking), in front of your service. It provides Under Attack Mode, an on-demand defense against DDoS attacks and bot floods, with more to come.

The WAF works independently of [CDN caching](/networking/cdn), so you can use it whether or not your service caches responses.

## Under Attack Mode

Under Attack Mode defends a service that's under a DDoS or a flood of bot traffic. While it's on, Railway shows each new visitor a browser check before any request reaches your service. Legitimate visitors pass it once and continue normally, and the attack traffic is stopped before it reaches you.

It's built for active incidents rather than always-on protection: every new visitor must pass the check, and non-browser traffic is turned away (see [What it blocks](#what-it-blocks)).

### Enable Under Attack Mode

Turn Under Attack Mode on from the settings of the service you need to protect:

1. Open the service you want to protect and go to its **Settings**.
2. In the **Edge** section, find **Under Attack Mode**.
3. Pick how long it should stay on, then click **Activate**.

It takes effect across Railway's global network within ~20 seconds.

Set it to run until you turn it off, or to expire on its own after 1, 3, 12, or 24 hours. While it's on, the **Edge** section shows that it's active, with the time remaining. Click **Deactivate** to turn it off early. Visitors who already passed the check aren't affected.

You can also enable Under Attack Mode from the CLI:

```bash
railway waf under-attack enable --service web
railway waf under-attack enable --service web --duration 1h
railway waf under-attack status --service web
railway waf under-attack disable --service web
```

### What it blocks

While Under Attack Mode is on, a CAPTCHA-style browser check guards your service:

- **Web browsers** pass it once, then browse normally.
- **Non-browser traffic** is blocked, including the bots and scripts driving the attack.

### Protecting a site and its API

To protect a site and the API it calls, enable Under Attack Mode on the site first, then on the API.

Clearance from the browser check is scoped to your whole domain. Once a visitor passes the check on your site, the edge admits that browser across the rest of your domain, so requests to `api.example.com` also pass without a second check.

| Site | API | Clearance shared? |
| ---- | --- | ----------------- |
| `example.com` | `api.example.com` | Yes |
| `web.example.com` | `api.example.com` | Yes |
| `example.com` | `api.acme.com` | No, different root domains |
| `app.up.railway.app` | `api.up.railway.app` | No, Railway domains are isolated |

Two other details apply to this setup:

- The check is only shown to browser navigations (a `GET` request whose `Accept` header includes `text/html`). API calls and other non-navigation requests are turned away instead, so protecting a domain that serves only an API blocks all of its traffic.
- Under Attack Mode is set per service, the same as [CDN caching](/networking/cdn).

## Related documentation

- [CDN](/networking/cdn) - Cache static assets and HTML at the edge
- [Edge networking](/networking/edge-networking) - How Railway routes requests to the nearest edge location
- [Public networking](/networking/public-networking) - Expose your services to the internet
- [Domains](/networking/domains) - Configure Railway-provided and custom domains
- [railway waf](/cli/waf) - Manage WAF protection from the CLI
