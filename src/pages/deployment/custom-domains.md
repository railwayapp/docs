---
title: Custom Domains
---

Custom domains can be configured inside the Deployment -> Domains tab.

Each Railway environment will automatically be configured with a public Railway
domain, which looks like `*.up.railway.app`. This can be changed at any time if
a custom domain has not yet been configured.

## Add a Custom Domain

One or more custom domains can be added to a Railway project environment.

Here's how it works:

1. Select the environment and enter your domain name
2. Add the `CNAME` record to the DNS settings for your domain
3. Wait for Railway to verify your `CNAME` record

<NextImage src="/images/domain.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={2522} height={1718} quality={100} />

**NOTE!:** Changes to DNS settings may take up to 72 hours to propagate
worldwide.

## Let's Encrypt SSL Certificates

Once a custom domain has been correctly configured, Railway will automatically
generate and apply a Let's Encrypt certificate. This means that any custom
domain on Railway will automatically be accessible
via `https://`.

## Provider Specific Instructions

If you have proxying enabled on Cloudflare (the orange cloud), you MUST set your
SSL/TLS settings to full or above. Otherwise, Cloudflare will not be able to
connect to Railway.

<NextImage src="/images/cloudflare.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={1205} height={901} quality={100} />
