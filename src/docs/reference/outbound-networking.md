---
title: Outbound Networking
description: Learn about outbound networking features and email delivery options on Railway.
---

Outbound Networking refers to traffic flowing from your Railway services to external destinations on the internet.

## Email Delivery

SMTP is only available on the Pro plan and above.

Free, Trial, and Hobby plans must use transactional email services with HTTPS APIs. SMTP is disabled on these plans to prevent spam and abuse. However, even when SMTP is available, we recommend transactional email services with HTTPS APIs for all plans due to their enhanced features and analytics.

<Banner variant="info">Upon upgrading to Pro, please re-deploy your service that needs to use SMTP for the changes to take effect.</Banner>

### Email Service Examples

Here are examples of transactional email services you can use:

**Note:** These services are required for Free, Trial, and Hobby plans since outbound SMTP is disabled.

- [Resend](https://resend.com/features/email-api) - **Railway's recommended approach**
- [SendGrid](https://sendgrid.com/en-us/solutions/email-api)
- [Mailgun](https://www.mailgun.com/products/send/)
- [Postmark](https://postmarkapp.com/email-api)

These services provide detailed analytics and robust APIs designed for modern applications. They also work on all Railway plans since they use HTTPS instead of SMTP.

### Debugging SMTP Issues

If you are experiencing issues with SMTP on the Pro plan, please the follow 
the steps below to help us diagnose the problem:

1. First, ensure that you have tried re-deploying your service

2. SSH into your service using the [Railway CLI](/reference/cli-api#ssh):

<Image
src="https://res.cloudinary.com/railway/image/upload/v1757952518/docs/smtp-copy-ssh_qtczce.png"
alt="Screenshot of SSH into your service"
layout="responsive"
width={767} height={729} quality={100} />

3. Copy-paste this command and change the `SMTP_HOST` to the host you're trying to connect to:

```bash
SMTP_HOST="$REPLACE_THIS_WITH_YOUR_SMTP_HOST" bash -c '
for port in 25 465 587 2525; do
  timeout 1 bash -c "</dev/tcp/$SMTP_HOST/$port" 2>/dev/null && \
    echo "$SMTP_HOST port $port reachable" || \
    echo "$SMTP_HOST port $port unreachable"
done
'
```

4. Execute the command. You should see output similar to this:

```
smtp.yourhost.com port 25 reachable
smtp.yourhost.com port 465 reachable
smtp.yourhost.com port 587 reachable
smtp.yourhost.com port 2525 reachable
```

Example: 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1757952876/docs/smtp-exec-cmd_ytqx7u.png"
alt="Screenshot of executing debug command"
layout="responsive"
width={767} height={729} quality={100} />

Replace `smtp.resend.com` above with your SMTP host.

5. If any of the ports are unreachable, please contact your email provider to 
ensure that they are not blocking connections from Railway's IPs. Port 2525 is
a non-standard SMTP port that may be blocked on popular email providers, so
2525 being unreachable is not an issue

6. Otherwise, please reach out to us at [Central Station](https://station.railway.com)
and share the output of the command for further assistance

## Static Outbound IPs

Railway offers [Static Outbound IPs](/reference/static-outbound-ips) for Pro plan customers who need consistent IP addresses for firewall whitelisting or third-party integrations.

## Related Features

- [Static Outbound IPs](/reference/static-outbound-ips) - Assign permanent outbound IP addresses
- [Private Networking](/reference/private-networking) - Internal service communication
- [Public Networking](/reference/public-networking) - Inbound traffic to your services
