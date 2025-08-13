---
title: Public Networking
description: Learn everything about public networking on Railway.
---

Public Networking refers to exposing your application to the internet, to be accessible from the public network.

## Port Variable

An essential part of connecting to your service from the internet, is properly handling the `PORT` variable.

The easiest way to get up and running is by using the Railway-provided port.

### Railway-provided port

As long as you have not defined a `PORT` variable, Railway will provide and expose one for you.

To have your application use the Railway-provided port, you should ensure it is listening on `0.0.0.0:$PORT`, where `PORT` is the Railway-provided environment variable.

**Examples** -

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

More information and examples for this can be found in the [Fixing Common Errors guide](/guides/fixing-common-errors).

**Note:** If your application needs to be accessible over both public and private networks, your application server must support dual stack binding. Most servers handle this automatically when listening on `::`, but some, like Uvicorn, do not.

### User-defined port

If you prefer to explicitly set a port, you can set the `PORT` variable in your service variables to the port on which your service is listening.

If your domain does not have a [target port set](/guides/public-networking#target-ports), Railway will direct incoming traffic to the port specified in the `PORT` variable, this is sometimes needed when creating a template.

For information on how to configure variables, see the [Variables guide](/guides/variables).

## Railway-Provided Domain

Railway services don't obtain a domain automatically, but it is easy to set one up.

To assign a domain to your service, go to your service's settings, find the Networking -> Public Networking section, and choose `Generate Domain`.

#### Automated Prompt

If Railway detects that a deployed service is listening correctly (as described above), you will see a prompt on the service tile in the canvas, and within the service panel.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1654560212/docs/add-domain_prffyh.png"
alt="Screenshot of adding Service Domain"
layout="responsive"
width={1396} height={628} quality={80} />

Simply follow the prompts to generate a domain and your app will be exposed to the internet.

**Don't see the Generate Domain Button?**

If you have previously assigned a TCP Proxy to your service, you will not see the `Generate Domain` option. You must remove the TCP Proxy (click the Trashcan icon), then you can add a domain.

## Custom Domains

Custom domains can be added to a Railway service and once setup we will automatically issue an SSL certificate for you.

1. Navigate to the [Settings tab](/overview/the-basics#service-settings) of your desired [service](/overview/the-basics#services).

2. Click `+ Custom Domain` in the Public Networking section of Settings

3. Type in the custom domain (wildcard domains are supported, [see below](#wildcard-domains) for more details)

   You will be provided with a CNAME domain to use, e.g., `g05ns7.up.railway.app`.

4. In your DNS provider (Cloudflare, DNSimple, Namecheap, etc), create a CNAME record with the CNAME value provided by Railway.

5. Wait for Railway to verify your domain. When verified, you will see a greencheck mark next to the domain(s) -

   <Image
   src="https://res.cloudinary.com/railway/image/upload/v1654563209/docs/domains_uhchsu.png"
   alt="Screenshot of Custom Domain"
   layout="responsive"
   width={1338} height={808} quality={80} />

   You will also see a `Cloudflare proxy detected` message if we have detected that you are using Cloudflare.

   **Note:** Changes to DNS settings may take up to 72 hours to propagate worldwide.

**Important Considerations**

- Freenom domains are not allowed and not supported.
- The Trial Plan is limited to 1 custom domain. It is therefore not possible to use both `yourdomain.com` and `www.yourdomain.com` as these are considered two distinct custom domains.
- The [Hobby Plan](/reference/pricing#plans) is limited to 2 custom domains per service.
- The [Pro Plan]() is limited to 20 domains per service by default. This limit can be increased for Pro users on request, simply reach out to us via a [private thread](/reference/support#private-threads).

## Wildcard Domains

Wildcard domains allow for flexible subdomain management. There are a few important things to know when using them -

- Ensure that the CNAME record for `authorize.railwaydns.net` is not proxied by your provider (eg: Cloudflare). This is required for the verification process to work.

- Wildcards cannot be nested (e.g., \*.\*.yourdomain.com).

- Wildcards can be used for any subdomain level (e.g., `*.example.com` or `*.subdomain.example.com`).

### Subdomains

E.g. `*.example.com`

- Make sure [Universal SSL is enabled](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/).

- Enable [Full SSL/TLS encryption](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/#full-or-full-strict-encryption-mode).

- Add CNAME records for the wildcard subdomain.

### Nested Subdomains

E.g. `*.nested.example.com`

- [Disable Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/disable-universal-ssl/).

- Purchase Cloudflare's [Advanced Certificate Manager](https://developers.cloudflare.com/ssl/edge-certificates/advanced-certificate-manager/).

- Enable [Edge Certificates](https://developers.cloudflare.com/ssl/edge-certificates/).

- Enable [Full SSL/TLS encryption](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/#full-or-full-strict-encryption-mode).

- Add CNAME records for the wildcard nested subdomain.

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

- Enable Cloudflare's [Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/)

## Target Ports

Target Ports, or Magic Ports, correlate a single domain to a specific internal port that the application listens on, enabling you to expose multiple HTTP ports through the use of multiple domains.

Example -

`https://example.com/` → `:8080`

`https://management.example.com/` → `:9000`

When you first generate a Railway-provided domain, if your application listens on a single port, Railway's magic automatically detects and sets it as the domain's target port. If your app listens on multiple ports, you're provided with a list to choose from.

When you add a custom domain, you're given a list of ports to choose from, and the selected port will handle all traffic routed to the domain. You can also specify a custom port if needed.

These target ports inform Railway which public domain corresponds to each internal port, ensuring that traffic from a specific domain is correctly routed to your application.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743196226/docs/custom-domain_ulvgap.png"
alt="Screenshot of target port selection on a custom domain"
layout="intrinsic"
width={1200} height={1035}
quality={100} />

You can change the automatically detected or manually set port at any time by clicking the edit icon next to the domain.

## Adding a Custom Domain

When adding a root or apex domain to your Railway service, you must ensure that you add the appropriate DNS record to the domain within your DNS provider. At this time, Railway supports <a href="https://developers.cloudflare.com/dns/cname-flattening/" target="_blank">CNAME Flattening</a> and dynamic ALIAS records.

**Additional context**

Generally, direct CNAME records at the root or apex level are incompatible with DNS standards (which assert that you should use an "A" or "AAAA" record). However, given the dynamic nature of the modern web and PaaS providers like Railway, some DNS providers have incorporated workarounds enabling CNAME-like records to be associated with root domains.
_Check out <a href="https://www.ietf.org/rfc/rfc1912.txt#:~:text=root%20zone%20data).-,2.4%20CNAME%20records,-A%20CNAME%20record" target="_blank">RFC 1912</a> if you're interested in digging into this topic._

**Choosing the correct record type**

The type of record to create is entirely dependent on your DNS provider. Here are some examples -

- <a href="https://developers.cloudflare.com/dns/zone-setups/partial-setup" target="_blank">Cloudflare CNAME</a> - Simply set up a CNAME record for your root domain in Cloudflare, and they take care of the rest under the hood. Refer to <a href="https://support.cloudflare.com/hc/en-us/articles/205893698-Configure-Cloudflare-and-Heroku-over-HTTPS" target="_blank">this guide</a> for more detailed instructions.
- <a href="https://support.dnsimple.com/articles/domain-apex-heroku/" target="_blank">DNSimple ALIAS</a> - Set up an dynamic ALIAS in DNSimple for your root domain.
- <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/" target="_blank">Namecheap CNAME</a> - Set up an CNAME in Namecheap for your root domain.
- <a href="https://bunny.net/blog/how-aname-dns-records-affect-cdn-routing/" target="_blank">bunny.net</a> - Set up a ANAME in bunny.net for your root domain.

In contrast there are many nameservers that don't support CNAME flattening or dynamic ALIAS records -

- <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register-other-dns-service.html" target="_blank">AWS Route 53</a>
- <a href="https://support.hostinger.com/en/articles/1696789-how-to-change-nameservers-at-hostinger" target="_blank">Hostinger</a>
- <a href="https://www.godaddy.com/en-ca/help/edit-my-domain-nameservers-664" target="_blank">GoDaddy</a>
- <a href="https://www.namesilo.com/support/v2/articles/domain-manager/dns-manager" target="_blank">NameSilo</a>
- <a href="https://dns.he.net/" target="_blank">Hurricane Electric</a>
- <a href="https://support.squarespace.com/hc/en-us/articles/4404183898125-Nameservers-and-DNSSEC-for-Squarespace-managed-domains#toc-open-the-domain-s-advanced-settings" target="_blank">SquareSpace</a>

**Workaround - Changing your Domain's Nameservers**

If your DNS provider doesn't support CNAME Flattening or dynamic ALIAS records at the root, you can also change your domain's nameservers to point to Cloudflare's nameservers. This will allow you to use a CNAME record for the root domain. Follow the instructions listed on Cloudflare's documentation to <a href="https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/" target="_blank">change your nameservers</a>.

## Adding a Root Domain With www Subdomain to Cloudflare

If you want to add your root domain (e.g., `mydomain.com`) and the `www.` subdomain to Cloudflare and redirect all `www.` traffic to the root domain:

1. Create a Custom Domain in Railway for your root domain (e.g., `mydomain.com`). Copy the `value` field. This will be in the form: `abc123.up.railway.app`.
2. Add a `CNAME` DNS record to Cloudflare:
   - `Name` → `@`.
   - `Target` → the `value` field from Railway.
   - `Proxy status` → `on`, should display an orange cloud.
   - Note: Due to domain flattening, `Name` will automatically update to your root domain (e.g., `mydomain.com`).
3. Add another `CNAME` DNS record to Cloudflare:
   - `Name` → `www`.
   - `Target` → `@`
   - `Proxy status:` → on, should display an orange cloud.
   - Note: Cloudflare will automatically change the `Target` value to your root domain.
4. Enable Full SSL/TLS encryption in Cloudflare:
   - Go to your domain on Cloudflare.
   - Navigate to `SSL/TLS -> Overview`.
   - Select `Full`. **Not** `Full (Strict)` **Strict mode will not work as intended**.
5. Enable Universal SSL in Cloudflare:
   - Go to your domain on Cloudflare.
   - Navigate to `SSL/TLS -> Edge Certificates`.
   - Enable `Universal SSL`.
6. After doing this, you should see `Cloudflare proxy detected` on your Custom Domain in Railway with a green cloud.
7. Create a Bulk Redirect in Cloudflare:
   - Go to your [Cloudflare dashboard](https://dash.cloudflare.com/).
   - Navigate to `Bulk Redirects`.
   - Click `Create Bulk Redirect List`.
   - Give it a name, e.g., `www-redirect`.
   - Click `Or, manually add URL redirects`.
   - Add a `Source URL`: `https://www.mydomain.com`.
   - Add `Target URL`: `https://mydomain.com` with status `301`.
   - Tick all the parameter options: (`Preserve query string`, `Include subdomains`, `Subpath matching`, `Preserve path suffix`)
   - Click `Next`, then `Save and Deploy`.

**Note:** DNS changes may take some time to propagate. You may want to refresh your DNS cache by using commands like `ipconfig /flushdns` on Windows or `dscacheutil -flushcache` on macOS. Testing the URLs in an incognito window can also help verify changes.

## TCP Proxying

You can proxy TCP traffic to your service by creating a TCP proxy in the service settings. Enter the port that you want traffic proxied to, Railway will generate a domain and port for you to use. All traffic sent to `domain:port` will be proxied to your service. This is useful for services that don't support HTTP, such as databases.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743194081/docs/tcp-proxy_edctub.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={1200} height={822} quality={100} />

Incoming traffic will be distributed across all replicas in the closest region using a random algorithm.

## Using HTTP and TCP Together

Railway does support exposing both HTTP and TCP over public networking, in a single service. Therefore, if you have a domain assigned, you will still see the option to enable TCP Proxy, and vice-versa.

If you have a usecase that requires exposing both HTTP and TCP over public networking, in one service, <a href="https://station.railway.com/feedback" target="_blank">let us know</a>!

## Let's Encrypt SSL Certificates

Once a custom domain has been correctly configured, Railway will automatically
generate and apply a Let's Encrypt certificate. This means that any custom
domain on Railway will automatically be accessible
via `https://`.

### External SSL Certificates

We currently do not support external SSL certificates since we provision one for you.

## Provider Specific Instructions

If you have proxying enabled on Cloudflare (the orange cloud), you MUST set your
SSL/TLS settings to **Full** -- Full (Strict) **will not work as intended**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/cloudflare_zgeycj.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={1205} height={901} quality={80} />

If proxying is not enabled, Cloudflare will not associate the domain with your Railway project. In this case, you will encounter the following error message:

```
ERR_TOO_MANY_REDIRECTS
```

Also note that if proxying is enabled, you can NOT use a domain deeper than a first level subdomain without Cloudflare's Advanced Certificate Manager. For example, anything falling under \*.yourdomain.com can be proxied through Cloudflare without issue, however if you have a custom domain under \*.subdomain.yourdomain.com, you MUST disable Cloudflare Proxying and set the CNAME record to DNS Only (the grey cloud), unless you have Cloudflare's Advanced Certificate Manager.

## Support

Looking for the technical specs like timeouts, TLS information, rate limits etc? Check out the [Public Networking reference page](/reference/public-networking).

Having trouble connecting to your app from the internet? Check out the [Fixing Common Errors guide](/guides/fixing-common-errors) or reach out on our <a href="https://discord.gg/railway" target="_blank">Discord</a>.
