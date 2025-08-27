---
title: Outbound Networking
description: Learn about outbound networking features and email delivery options on Railway.
---

Outbound Networking refers to traffic flowing from your Railway services to external destinations on the internet.

## Email Delivery

SMTP is only available on the Pro plan and above, while Free, Trial, and Hobby plans must use transactional email services with HTTPS APIs (SMTP is disabled on these plans to prevent spam and abuse). However, even when SMTP is available, we recommend transactional email services with HTTPS APIs for all plans due to their enhanced features and analytics.

### Email Service Examples

Here are examples of transactional email services you can use:

**Note:** These services are required for Free, Trial, and Hobby plans since outbound SMTP is disabled.

- [Resend](https://resend.com/features/email-api) - **Railway's recommended approach**
- [SendGrid](https://sendgrid.com/en-us/solutions/email-api)
- [Mailgun](https://www.mailgun.com/products/send/)
- [Postmark](https://postmarkapp.com/email-api)

These services provide detailed analytics and robust APIs designed for modern applications. They also work on all Railway plans since they use HTTPS instead of SMTP.

## Static Outbound IPs

Railway offers [Static Outbound IPs](/reference/static-outbound-ips) for Pro plan customers who need consistent IP addresses for firewall whitelisting or third-party integrations.

## Related Features

- [Static Outbound IPs](/reference/static-outbound-ips) - Assign permanent outbound IP addresses
- [Private Networking](/reference/private-networking) - Internal service communication
- [Public Networking](/reference/public-networking) - Inbound traffic to your services