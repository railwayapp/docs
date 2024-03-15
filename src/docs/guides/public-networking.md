---
title: Public Networking
---

Public Networking refers to exposing your application to the internet, to be accessible from the public network.

## Port Variable

An essential part of connecting your service to the internet, is properly handling the `PORT` variable.

The easiest way to get up and running is by using the Railway-provided port.

### Railway-provided port

As long as you have not defined a `PORT` variable, Railway will provide and expose one for you.

To have your application use the Railway-provided port, you should ensure it is listening on `0.0.0.0:$PORT`, where `PORT` is the Railway-provided environment variable.

**Examples**
```python
# python web server
if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
```

```javascript
// node web server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

```

### User-defined port

If you prefer to explicitly set a port, you *must* set the `PORT` variable in your service variables to the port on which your service is listening.

For information on how to configure variables, see the [Variables guide](/guides/variables).

## Railway-Provided Domain

Railway services don't obtain a domain automatically, but it is easy to set one up.

To assign a domain to your service, go to your service's settings, find the Networking -> Public Networking section, and choose `Generate Domain`.

#### Automated prompt

If Railway detects that a deployed service is listening correctly (as described above), you will see a prompt on the service tile in the canvas, and within the service panel.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1654560212/docs/add-domain_prffyh.png"
alt="Screenshot of adding Service Domain"
layout="responsive"
width={1396} height={628} quality={80} />

Simply follow the prompts to generate a domain and your app will be exposed to the internet.

**Don't see the Generate Domain Button?**

If you have previously assigned a TCP Proxy to your service, you will not see the `Generate Domain` option.  You must remove the TCP Proxy (click the Trashcan icon), then you can add a domain.

## Custom Domains

Custom domains can be added to a Railway service and environment.

1. Navigate to the Settings tab of your desired service
2. Click `+ Custom Domain` in the Public Networking section of Settings
3. Type in the custom domain (wildcard domains are supported, [see below](#wildcard-domains) for more details)
4. In your DNS provider (Cloudflare, DNSimple, Namecheap, etc), update your domain's DNS settings by adding the appropriate DNS record(s) and associating it with the domain provided by Railway, e.g., `abc123.up.railway.app`
    - For subdomains, including "www", add a CNAME record
    - For root or apex domains, the record type will vary, [see below](#redirecting-a-root-domain) for more details
4. Wait for Railway to verify your record.  When verified, you will see a greencheck mark next to the domain(s) -

    <Image
    src="https://res.cloudinary.com/railway/image/upload/v1654563209/docs/domains_uhchsu.png"
    alt="Screenshot of Custom Domain"
    layout="responsive"
    width={1338} height={808} quality={80} />

Note that changes to DNS settings may take up to 72 hours to propagate worldwide.

**Important Considerations**
- Freenom domains are not allowed and not supported.
- The [Hobby Plan](/reference/pricing#plans) is limited to 2 custom domains per service.
- The [Pro Plan]() is limited to 10 domains per service by default.  This limit can be increased for Pro users on request, simply reach out to us at [team@railway.app](mailto:team@railway.app) or via [private thread](/reference/support#private-threads).

## Wildcard Domains

Wildcard domains allow for flexible subdomain management.  There are a few important things to know when using them:

1. Ensure that the CNAME record for `authorize.railwaydns.net` is not proxied by your provider (eg: Cloudflare). This is required for the verification process to work.
2. Wildcards can be used for any subdomain level (e.g., `*.yourdomain.com` or `*.subdomain.yourdomain.com`).
3. Wildcards cannot be nested (e.g., \*.\*.yourdomain.com).

When you add a wildcard domain, you will be provided with two domains for which you should add two CNAME records -

<Image
src="https://res.cloudinary.com/railway/image/upload/v1679693511/wildcard_domains_zdguqs.png"
alt="Screenshot of Wildcard Domain"
layout="responsive"
width={1048} height={842} quality={80} />

One record is for the wildcard domain, and one for the \_acme-challenge. The \_acme-challenge CNAME is required for Railway to issue the SSL Certificate for your domain.

### Wildcard Domains on Cloudflare

If you have a wildcard domain on Cloudflare, you must:

- Turn off Cloudflare proxying is on the `_acme-challenge` record (disable the orange cloud)

- Disable Cloudflare's [Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/disable-universal-ssl/)

    <Image
    src="https://res.cloudinary.com/railway/image/upload/v1709065556/docs/cf-disable-uni-ssl_rc0zje.png"
    alt="Screenshot of Disabling Cloudflare Universal SSL"
    layout="responsive"
    width={855} height={342} quality={80} />

## Redirecting a Root Domain

When adding a root or apex domain to your Railway service, you must ensure that you add the appropriate DNS record to the domain within your DNS provider.  At this time, Railway supports <a href="https://developers.cloudflare.com/dns/cname-flattening/" target="_blank">CNAME Flattening</a> and ALIAS records.

**Additional context**

Generally, direct CNAME records at the root or apex level are incompatible with DNS standards (which assert that you should use an "A" or "AAAA" record).  However, given the dynamic nature of the modern web and PaaS providers like Railway, some DNS providers have incorporated workarounds enabling CNAME-like records to be associated with root domains.
*Check out <a href="https://www.ietf.org/rfc/rfc1912.txt#:~:text=root%20zone%20data).-,2.4%20CNAME%20records,-A%20CNAME%20record" target="_blank">RFC 1912</a> if you're interested in digging into this topic.*

**Choosing the correct record type**

The type of record to create is entirely dependent on your DNS provider.  Here are some examples -

- <a href="https://developers.cloudflare.com/dns/zone-setups/partial-setup" target="_blank">Cloudflare CNAME</a> - Simply set up a CNAME record for your root domain in Cloudflare, and they take care of the rest under the hood.  Refer to <a href="https://support.cloudflare.com/hc/en-us/articles/205893698-Configure-Cloudflare-and-Heroku-over-HTTPS" target="_blank">this guide</a> for more detailed instructions.
- <a href="https://support.dnsimple.com/articles/domain-apex-heroku/" target="_blank">DNSimple ALIAS</a> - Set up an ALIAS in DNSimple for your root domain.
- <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/10128/2237/how-to-create-an-alias-record/" target="_blank">Namecheap ALIAS</a> - Set up an ALIAS in Namecheap for your root domain.

**Workaround - Changing your Domain's Nameservers**

If your DNS provider doesn't support CNAME Flattening or ALIAS records, you can also change your domain's nameservers to point to Cloudflare's nameservers. This will allow you to use a CNAME record for the root domain. Follow the instructions listed on Cloudflare's documentation to <a href="https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/" target="_blank">change your nameservers</a>.

## TCP Proxying

You can proxy TCP traffic to your service by creating a TCP proxy in the service settings. Enter the port that you want traffic proxied to, Railway will generate a domain and port for you to use. All traffic sent to `domain:port` will be proxied to your service. This is useful for services that don't support HTTP, such as databases.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694217808/docs/screenshot-2023-09-08-20.02.55_hhxn0a.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={700} height={225} quality={100} />

Currently we use a random load balancing strategy for TCP traffic.


## Let's Encrypt SSL Certificates

Once a custom domain has been correctly configured, Railway will automatically
generate and apply a Let's Encrypt certificate. This means that any custom
domain on Railway will automatically be accessible
via `https://`.

### External SSL Certificates

We currently do not support external SSL certificates since we provision one for you.

## Provider Specific Instructions

If you have proxying enabled on Cloudflare (the orange cloud), you MUST set your
SSL/TLS settings to full or above.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/cloudflare_zgeycj.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={1205} height={901} quality={80} />

If proxying is not enabled, Cloudflare will not associate the domain with your Railway project with the following error:

```
ERR_TOO_MANY_REDIRECTS
```

Also note that if proxying is enabled, you can NOT use a domain deeper than a first level subdomain without Cloudflare's Advanced Certificate Manager. For example, anything falling under \*.yourdomain.com can be proxied through Cloudflare without issue, however if you have a custom domain under \*.subdomain.yourdomain.com, you MUST disable Cloudflare Proxying and set the CNAME record to DNS Only (the grey cloud), unless you have Cloudflare's Advanced Certificate Manager.

## Support

Looking for the technical specs like timeouts, TLS information, rate limits etc?  Check out the [Public Networking reference page](/reference/public-networking).

Having trouble connecting to your app from the internet?  Check out the [Fixing Common Errors guide](/guides/fixing-common-errors) or reach out on our <a href="https://discord.gg/railway" target="_blank">Discord</a>.
