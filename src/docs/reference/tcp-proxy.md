---
title: TCP Proxy
---

Proxy TCP traffic to a service by creating a TCP proxy. 

## How it works

Enabling TCP Proxy on a service requires specification of a port to which the traffic should be proxied.  Railway then generates a domain and proxy port, and all traffic sent to `domain:port` will be proxied to the service. 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694217808/docs/screenshot-2023-09-08-20.02.55_hhxn0a.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={700} height={225} quality={100} />

#### Load Balancing 

Currently we use a random load balancing strategy for TCP traffic.

## Use Cases

TCP Proxy is useful for services that don't support HTTP, such as databases.

## Support

For more information on how to set it up, refer to the TCP Proxy section of the [Public Networking guide](/guides/public-networking#tcp-proxying).