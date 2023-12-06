---
title: Public Networking
---

Public Networking refers to communicating over the public internet to services in Railway.  Networking is one layer of development operations that we aim to make as simple as possible.

## How it Works

Railway can detect a deployed service is listening for traffic.  When detected, Railway will provide a public domain for your service with the click of a button.  The only thing you need to do, is properly handle the port assignment.  More on this in the [Public Networking guide](/guides/public-networking).

## Technical Specifications

**This information is subject to change at any time.*

| Category | Key Information |
|----------|-----------------|
| **DNS/Domain Names** | - Support for domains, subdomains, and wildcard domains.<br /> - Subdomains and wildcards cannot overlap (`foo.hello.com` cannot exist with `*.hello.com` unless owned by the same service).<br /> - Root domains need a DNS provider with ALIAS records or CNAME flattening.<br /> - Unicode domains should be PUNYcode encoded.<br /> - Non-public/internal domain names are not supported. |
| **Certificate Issuance** | - Raiway attempts to issue a certificate for **up to 72 hours** after domain creation before failing.<br /> - Certificates are expected to be issued within an hour. |
| **TLS** | - Support for TLS 1.2 and TLS 1.3 with specific ciphersets.<br /> - Certificates are valid for 90 days and renewed every 30 days.<br /> - Cloudflare Proxying does impact certificate issuance and support for wildcard domains. |
| **Edge Traffic** | - Support for HTTP/1.1 and HTTP/2.<br /> - Support for websockets over HTTP/1.1 (may be interrupted after 2-4hrs, clients should handle reconnect). <br /> - Idle timeout of 900 seconds.<br /> - Max 100 request headers.<br /> - Max 100 concurrent streams per HTTP2 connection.<br /> - Max duration of 5 minutes for HTTP requests. |
| **Request Headers** | - `X-Envoy-External-Address` or `X-Forwarded-For` for identifying client's remote IP.<br /> - `X-Forwarded-Proto` always indicates HTTPS.<br /> - `X-Request-Id` for correlating requests against network logs. |
| **Requests** | - Inbound traffic must be TLS-encrypted <br /> - HTTP GET requests to port 80 are redirected to HTTPS. <br /> - HTTP POST requests to port 80 are redirected to HTTPS as GET requests.|

## FAQ

<Collapse title="What type of traffic can I send to my services in Railway?">
We currently support HTTP and HTTP2 traffic from the internet to your services.

All traffic must be HTTPS and use TLS 1.2 or above, and TLS SNI is mandatory for requests.
  - Plain HTTP GET requests will be redirected to HTTPS with a `301` response.
  - Plain HTTP POST requests will be converted to GET requests.

For services that require TCP traffic, like databases, we also have a [TCP Proxy feature](/reference/tcp-proxy).
</Collapse>

<Collapse title="How does Railway handle SSL certificates?">
We provide LetsEncrypt SSL certificates using RSA 2048bit keys.  Certificates are valid for 90 days and are automatically renewed 2 months into their life.

Certificate issuance should happen within an hour of your DNS being updated with the values we provide.

For proxied domains (Cloudflare orange cloud), we may not always be able to issue a certificate for the domain, but Cloudflare to Railway traffic will be encrypted with TLS using our default `*.up.railway.app` certificate.
</Collapse>

<Collapse title="Does Railway protect my services against DDoS?">
We are unable to provide DDoS protection or WAFs at this time.
</Collapse>

<Collapse title="How do I handle forwarding traffic to my exposed port?">
To have traffic from the public internet properly forwarded to your service's exposed port, you must ensure that you are properly using the `PORT` environment variable made available to every service deployment.
- If your application is listening on an explictely defined port, you must define a `PORT` variable with the proper assignment in your service's [variables](/guides/variables).
- If you do not explicitely define the `PORT`, Railway provides one for you and exposes it during deployment.

More on this in the [Public Networking guide](/guides/public-networking).
</Collapse>