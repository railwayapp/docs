---
title: Networking
---

## Private Networking
Refer to [this page](/reference/private-networking) for more information.

## Horizontal Scaling
Refer to [this page](/develop/services#horizontal-scaling-with-replicas) for more information.

## Cloudflare Load Balancer
Cloudflare offers an LB proxy that can be used to load balance between multiple Railway services. This is another great way to achieve horizontal scaling.

<Banner variant="warning">
  If your Cloudflare SSL mode is not set to `Full (Strict)`, you will experience a `ERR_TOO_MANY_REDIRECTS` error in your browser.
</Banner>

In order to set this up, there are a few prerequisites:
1. You must have a Cloudflare account
2. You must have a Custom Domain which is on Cloudflare
3. Your Cloudflare SSL mode must be set to `Full (Strict)`

Once you have met the prerequisites, you can follow the steps below:
1. Create a new Cloudflare Load Balancer
2. Create multiple Railway services (one for each instance of your app)
3. Add each instance's Generated Domain to an Origin Pool on the LB
4. Set the Host header for each origin to the Generated Domain: [Cloudflare Docs](https://developers.cloudflare.com/load-balancing/additional-options/override-http-host-headers/)
5. Visit the Load Balancer's DNS record and you should see your app!
