---
title: TCP Proxy
description: Learn how to proxy TCP traffic to a service by creating a TCP proxy on Railway.
---

Proxy TCP traffic to a service by creating a TCP proxy.

## How it works

Enabling TCP Proxy on a service requires specification of a port to which the traffic should be proxied. Railway then generates a domain and proxy port, and all traffic sent to `domain:port` will be proxied to the service.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743194081/docs/tcp-proxy_edctub.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={1200} height={822} quality={100} />

#### Load Balancing

Currently we use a random load balancing strategy for TCP traffic.

## Use Cases

TCP Proxy is useful for services that don't support HTTP, such as databases.

## Support

For more information on how to set it up, refer to the TCP Proxy section of the [Public Networking guide](/guides/public-networking#tcp-proxying).
