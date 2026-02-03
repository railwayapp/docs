---
title: Domains
description: Learn how to configure public and private domains for your Railway services.
---

Railway provides two types of domain resolution for your services: **public domains** for internet access and **private domains** for internal service-to-service communication.

## Public domains

Public domains expose your services to the internet. Railway offers two options:

- **Railway-provided domains** - Auto-generated `*.up.railway.app` domains for quick setup
- **Custom domains** - Bring your own domain with automatic SSL certificate provisioning

### Railway-provided domains

Railway services don't obtain a domain automatically, but it is easy to set one up.

To assign a domain to your service, go to your service's settings, find the Networking -> Public Networking section, and choose `Generate Domain`.

#### Automated prompt

If Railway detects that a deployed service is listening correctly, you will see a prompt on the service tile in the canvas, and within the service panel.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1654560212/docs/add-domain_prffyh.png"
alt="Screenshot of adding Service Domain"
layout="responsive"
width={1396} height={628} quality={80} />

Simply follow the prompts to generate a domain and your app will be exposed to the internet.

**Don't see the Generate Domain Button?**

If you have previously assigned a TCP Proxy to your service, you will not see the `Generate Domain` option. You must remove the TCP Proxy (click the Trashcan icon), then you can add a domain.

### Custom domains

Custom domains can be added to a Railway service and once setup we will automatically issue an SSL certificate for you.

1. Navigate to the [Settings tab](/overview/the-basics#service-settings) of your desired [service](/overview/the-basics#services).

2. Click `+ Custom Domain` in the Public Networking section of Settings

3. Type in the custom domain (wildcard domains are supported, [see below](#wildcard-domains) for more details)

   You will be provided with a CNAME domain to use, e.g., `g05ns7.up.railway.app`.

4. In your DNS provider (Cloudflare, DNSimple, Namecheap, etc), create a CNAME record with the CNAME value provided by Railway.

5. Wait for Railway to verify your domain. When verified, you will see a green check mark next to the domain(s) -

   <Image
   src="https://res.cloudinary.com/railway/image/upload/v1654563209/docs/domains_uhchsu.png"
   alt="Screenshot of Custom Domain"
   layout="responsive"
   width={1338} height={808} quality={80} />

   You will also see a `Cloudflare proxy detected` message if we have detected that you are using Cloudflare.

   **Note:** Changes to DNS settings may take up to 72 hours to propagate worldwide.

#### Important considerations

- Freenom domains are not allowed and not supported.
- The Trial Plan is limited to 1 custom domain. It is therefore not possible to use both `yourdomain.com` and `www.yourdomain.com` as these are considered two distinct custom domains.
- The [Hobby Plan](/pricing/plans) is limited to 2 custom domains per service.
- The [Pro Plan](/pricing/plans) is limited to 20 domains per service by default. This limit can be increased for Pro users on request, simply reach out to us via a [private thread](/platform/support#private-threads).

### Wildcard domains

Wildcard domains allow for flexible subdomain management. There are a few important things to know when using them -

- Ensure that the CNAME record for `authorize.railwaydns.net` is not proxied by your provider (eg: Cloudflare). This is required for the verification process to work.

- Wildcards cannot be nested (e.g., \*.\*.yourdomain.com).

- Wildcards can be used for any subdomain level (e.g., `*.example.com` or `*.subdomain.example.com`).

#### Subdomains

E.g. `*.example.com`

- Make sure [Universal SSL is enabled](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/).

- Enable [Full SSL/TLS encryption](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/#full-or-full-strict-encryption-mode).

- Add CNAME records for the wildcard subdomain.

#### Nested subdomains

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

#### Wildcard domains on Cloudflare

If you have a wildcard domain on Cloudflare, you must:

- Turn off Cloudflare proxying on the `_acme-challenge` record (disable the orange cloud)

- Enable Cloudflare's [Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/enable-universal-ssl/)

### Target ports

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

### Adding a root domain

When adding a root or apex domain to your Railway service, you must ensure that you add the appropriate DNS record to the domain within your DNS provider. At this time, Railway supports <a href="https://developers.cloudflare.com/dns/cname-flattening/" target="_blank">CNAME Flattening</a> and dynamic ALIAS records.

**Additional context**

Generally, direct CNAME records at the root or apex level are incompatible with DNS standards (which assert that you should use an "A" or "AAAA" record). However, given the dynamic nature of the modern web and PaaS providers like Railway, some DNS providers have incorporated workarounds enabling CNAME-like records to be associated with root domains.
_Check out <a href="https://www.ietf.org/rfc/rfc1912.txt#:~:text=root%20zone%20data).-,2.4%20CNAME%20records,-A%20CNAME%20record" target="_blank">RFC 1912</a> if you're interested in digging into this topic._

**Choosing the correct record type**

The type of record to create is entirely dependent on your DNS provider. Here are some examples -

- <a href="https://developers.cloudflare.com/dns/zone-setups/partial-setup" target="_blank">Cloudflare CNAME</a> - Simply set up a CNAME record for your root domain in Cloudflare, and they take care of the rest under the hood. Refer to <a href="https://support.cloudflare.com/hc/en-us/articles/205893698-Configure-Cloudflare-and-Heroku-over-HTTPS" target="_blank">this guide</a> for more detailed instructions.
- <a href="https://support.dnsimple.com/articles/domain-apex-heroku/" target="_blank">DNSimple ALIAS</a> - Set up a dynamic ALIAS in DNSimple for your root domain.
- <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/" target="_blank">Namecheap CNAME</a> - Set up a CNAME in Namecheap for your root domain.
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

### Adding a root domain with www subdomain to Cloudflare

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

### SSL certificates

Once a custom domain has been correctly configured, Railway will automatically generate and apply a Let's Encrypt certificate. This means that any custom domain on Railway will automatically be accessible via `https://`.

We provide LetsEncrypt SSL certificates using RSA 2048bit keys. Certificates are valid for 90 days and are automatically renewed when 30 days of validity remain.

Certificate issuance should happen within an hour of your DNS being updated with the values we provide.

For proxied domains (Cloudflare orange cloud), we may not always be able to issue a certificate for the domain, but Cloudflare to Railway traffic will be encrypted with TLS using the default Railway `*.up.railway.app` certificate.

#### External SSL certificates

We currently do not support external SSL certificates since we provision one for you.

### Cloudflare configuration

If you have proxying enabled on Cloudflare (the orange cloud), you MUST set your SSL/TLS settings to **Full** -- Full (Strict) **will not work as intended**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1631917785/docs/cloudflare_zgeycj.png"
alt="Screenshot of Custom Domain"
layout="responsive"
width={1205} height={901} quality={80} />

If proxying is not enabled, Cloudflare will not associate the domain with your Railway project. In this case, you will encounter the following error message:

```
ERR_TOO_MANY_REDIRECTS
```

Also note that if proxying is enabled, you can NOT use a domain deeper than a first level subdomain without Cloudflare's Advanced Certificate Manager. For example, anything falling under \*.yourdomain.com can be proxied through Cloudflare without issue, however if you have a custom domain under \*.subdomain.yourdomain.com, you MUST disable Cloudflare Proxying and set the CNAME record to DNS Only (the grey cloud), unless you have Cloudflare's Advanced Certificate Manager.

---

## Private domains

Private domains enable service-to-service communication within Railway's [private network](/networking/private-networking). Every service automatically gets an internal DNS name under the `railway.internal` domain.

### How private DNS works

By default, all projects have private networking enabled and services will get a DNS name in the format:

```
<service-name>.railway.internal
```

For example, if you have a service called `api`, its internal hostname would be `api.railway.internal`.

For new environments (created after October 16, 2025), this DNS name resolves to both internal IPv4 and IPv6 addresses. [Legacy environments](/networking/private-networking#legacy-environments) resolve to IPv6 only.

### Using private domains

To communicate with a service over the private network, use the internal hostname and the port on which the service is listening:

```javascript
// Example: Frontend service calling an API service
app.get("/fetch-data", async (req, res) => {
  axios.get("http://api.railway.internal:3000/data").then(response => {
    res.json(response.data);
  });
});
```

**Note:** Use `http` (not `https`) for internal communication - traffic stays within the private network.

### Using reference variables

You can use [reference variables](/variables#reference-variables) to dynamically reference another service's private domain:

```bash
BACKEND_URL=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}
```

Then in your code:

```javascript
app.get("/fetch-data", async (req, res) => {
  axios.get(`${process.env.BACKEND_URL}/data`).then(response => {
    res.json(response.data);
  });
});
```

### Changing the service name

Within the service settings, you can change the service name which updates the DNS name, e.g., `api-1.railway.internal` → `api-2.railway.internal`.

The root of the domain, `railway.internal`, is static and **cannot** be changed.

### Private domain scope

The private network exists in the context of a project and environment:

- Services in one project/environment **cannot** communicate with services in another project/environment over the private network.
- Client-side requests from browsers **cannot** reach the private network - they must go through a public domain.

For complete information on configuring services for private networking, see the [Private Networking guide](/networking/private-networking).

## Troubleshooting

Having trouble with your domain configuration? Check out the [Troubleshooting guide](/troubleshooting) or reach out on the <a href="https://discord.gg/railway" target="_blank">Railway Discord</a>.
