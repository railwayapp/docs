---
title: TCP Proxy
---

Proxy TCP traffic to your service by creating a TCP proxy. 

## How it works

When you enable TCP Proxy on a service, you specify the port to which you want traffic proxied.  Railway then generates a domain and port for you to use, and all traffic sent to `domain:port` will be proxied to your service. 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1694217808/docs/screenshot-2023-09-08-20.02.55_hhxn0a.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={700} height={225} quality={100} />

This is useful for services that don't support HTTP, such as databases.

### Load Balancing 

Currently we use a random load balancing strategy for TCP traffic.

## Support

For more information on how to set it up, refer to the guide on [how to expose your app](/how-to/exposing-your-app#tcp-proxying).