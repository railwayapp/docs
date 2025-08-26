---
title: Outbound Networking
description: Learn about outbound networking features and email delivery options on Railway.
---

Outbound Networking refers to traffic flowing from your Railway services to external destinations on the internet.

## Email Delivery

Railway blocks outbound SMTP traffic to prevent spam and abuse. For reliable email delivery from your applications, use dedicated transactional email services instead.

### Recommended Email Services

Use a transactional email service that provides HTTPS APIs such as:

- [Resend](https://resend.com/features/email-api) - **Railway's recommended approach**
- [SendGrid](https://sendgrid.com/en-us/solutions/email-api)
- [Mailgun](https://www.mailgun.com/products/send/)
- [Postmark](https://postmarkapp.com/email-api)

These services provide better deliverability, detailed analytics, and robust APIs designed for modern cloud applications.

## Static Outbound IPs

Railway offers [Static Outbound IPs](/reference/static-outbound-ips) for Pro plan customers who need consistent IP addresses for firewall whitelisting or third-party integrations.

## Related Features

- [Static Outbound IPs](/reference/static-outbound-ips) - Assign permanent outbound IP addresses
- [Private Networking](/reference/private-networking) - Internal service communication
- [Public Networking](/reference/public-networking) - Inbound traffic to your services