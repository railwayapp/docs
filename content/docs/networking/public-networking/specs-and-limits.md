---
title: Specs & Limits
description: Technical specifications and rate limits for Railway's public networking.
---

_This information is subject to change at any time._

## Technical specifications

| Category                 | Key Information                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DNS/Domain Names**     | - Support for domains, subdomains, and wildcard domains.<br/>- Subdomains and wildcards cannot overlap (`foo.hello.com` cannot exist with `*.hello.com` unless owned by the same service).<br/>- Root domains need a DNS provider with ALIAS records or CNAME flattening.<br/>- Unicode domains should be PUNYcode encoded.<br/>- Non-public/internal domain names are not supported.                                                          |
| **Certificate Issuance** | - Railway attempts to issue a certificate for **up to 72 hours** after domain creation before failing.<br/>- Certificates are expected to be issued within an hour.                                                                                                                                                                                                                                                                            |
| **TLS**                  | - Support for TLS 1.2 and TLS 1.3 with specific cipher sets.<br/>- Certificates are valid for 90 days and renewed when 30 days of validity remain.                                                                                                                                                                                                                                                                                                               |
| **Edge Traffic**         | - Support for HTTP/1.1.<br/>- Support for websockets over HTTP/1.1.<br/>- Proxy Keep-Alive timeout of 60 seconds (1 minute).<br/>- Max 32 KB Combined Header Size<br/>- Max duration of 15 minutes for HTTP requests.                                                                                                                                                                                                                          |
| **Request Headers**      | - `X-Real-IP` for identifying client's remote IP.<br/>- `X-Forwarded-Proto` always indicates `https`.<br/>- `X-Forwarded-Host` for identifying the original host header.<br/>- `X-Railway-Edge` for identifying the edge region that handled the request.<br/>- `X-Request-Start` for identifying the time the request was received (Unix milliseconds timestamp).<br/>- `X-Railway-Request-Id` for correlating requests against network logs. |
| **Requests**             | - Inbound traffic must be TLS-encrypted<br/>- HTTP GET requests to port 80 are redirected to HTTPS.<br/>- HTTP POST requests to port 80 are redirected to HTTPS as GET requests.<br/>- SNI is required for correct certificate matching.                                                                                                                                                                                                       |

## Rate limits

To ensure the integrity and performance of our network, we enforce the following limits for all services.

| Category                    | Limit                         | Description                                               |
| --------------------------- | ----------------------------- | --------------------------------------------------------- |
| **Maximum Connections**     | 10,000 concurrent connections | The number of concurrent connections.                     |
| **HTTP Requests/Sec**       | 11,000~ RPS                   | The number of HTTP requests to a given domain per second. |
| **Requests Per Connection** | 10,000 requests               | The number of requests each connection can make.          |

If your application requires higher limits, please don't hesitate to reach out to us at [team@railway.com](mailto:team@railway.com).

## Traffic types

We currently support HTTP and HTTP2 traffic from the internet to your services.

All traffic must be HTTPS and use TLS 1.2 or above, and TLS SNI is mandatory for requests.

- Plain HTTP GET requests will be redirected to HTTPS with a `301` response.
- Plain HTTP POST requests will be converted to GET requests.

For services that require TCP traffic, like databases, we also have [TCP Proxy](/networking/tcp-proxy) support.

## SSL certificates

We provide LetsEncrypt SSL certificates using RSA 2048bit keys. Certificates are valid for 90 days and are automatically renewed 2 months into their life.

Certificate issuance should happen within an hour of your DNS being updated with the values we provide.

For proxied domains (Cloudflare orange cloud), we may not always be able to issue a certificate for the domain, but Cloudflare to Railway traffic will be encrypted with TLS using our default `*.up.railway.app` certificate.

## Ddos protection

Railway Metal infrastructure is built to mitigate attacks at network layer 4 and below, however we do not provide protection on the application layer. If you need WAF functionality, we recommend using Cloudflare alongside Railway.
