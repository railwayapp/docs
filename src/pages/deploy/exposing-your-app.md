---
title: Exposing Your App
---

Before your application can say hello, Railway needs to know what PORT to listen on to expose your application to the internet. Railway does try to do it's best to do this automatically for you however, there are cases when we can't.

You can configure your application to use the `PORT` environment variable by adding the `PORT` on your projects variables page. (Command + K or CTRL + K, depending on your keyboard/OS and type `Variables` or you can use the keyboard shortcut: `G` + `V` under your selected project)

**A Note on Listening IPs**: It's best for your application to listen on `0.0.0.0:$PORT`. While most things work with `127.0.0.1` and localhost, some do not (Django for example)

Each Railway environment will automatically be configured with a public Railway
domain, which looks like `*.up.railway.app`. This can be changed at any time if
a custom domain has not yet been configured.

## Add a Custom Domain

One or more custom domains can be added to a Railway project environment.

Here's how it works:

1. Select the environment and enter your domain name
2. Add the `CNAME` record to the DNS settings for your domain
3. Wait for Railway to verify your `CNAME` record

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/domain_sftsni.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={2522} height={1718} quality={80} />

**NOTE!:** Changes to DNS settings may take up to 72 hours to propagate
worldwide.

## Let's Encrypt SSL Certificates

Once a custom domain has been correctly configured, Railway will automatically
generate and apply a Let's Encrypt certificate. This means that any custom
domain on Railway will automatically be accessible
via `https://`.

## Provider Specific Instructions

If you have proxying enabled on Cloudflare (the orange cloud), you MUST set your
SSL/TLS settings to full or above.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/cloudflare_zgeycj.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={1205} height={901} quality={80} />

If proxying is not enabled, Cloudflare will not associate the domain with your Railway project with the following error.

```
ERR_TOO_MANY_REDIRECTS
```

### Redirecting a Root Domain from Google Domains

Some domain registrars don't fully support CNAME records like Google Domains. As a result - when you add an `@` record for a CNAME, Google Domains won't link it to the Railway project.

**Workaround 1 - Root Domain Forwarding**

In Google Domains, you can create a record to forward your domain root to the Railway project. You can do this by creating a CNAME in the Custom Records section pointing to www to `yourapp.yourrailwayproject.com`

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/gd-redirect_vhit07.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={1116} height={411} quality={80} />

Then, under the Synthetic Records section, you can configure a Subdomain forward - enter `@` in the subdomain and then `www.yourdomain.com` under the Destination URL entry.

Keep in mind, if Google's domain forwarding service is down, so is access to your project via that domain.

**Workaround 2 - Cloudflare Proxy**

You may also configure Cloudflare proxying for your domain to redirect your domain.

After a custom domain is added to the Railway project follow [the instructions listed on Cloudflare's documentation to configure the proxy.](https://support.cloudflare.com/hc/en-us/articles/205893698-Configure-Cloudflare-and-Heroku-over-HTTPS)
