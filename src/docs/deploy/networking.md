---
title: Networking
---

> Private Networking and Horizontal Scaling will be available in the future, in the meantime, there are a few ways to achieve this.

## Cloudflare Load Balancer
Cloudflare offers an LB proxy that can be used to load balance between multiple Railway services. This is a great way to achieve horizontal scaling.

In order to set this up, there are a few prerequisites:
1. You must have a Cloudflare account
2. You must have a Custom Domain which is on Cloudflare
3. **Your Cloudflare SSL mode must be set to `Full (Strict)`**
   > This is very important

Once you have met the prerequisites, you can follow the steps below:
1. Create a new Cloudflare Load Balancer
2. Create multiple Railway services (one for each instance of your app)
3. Add each instance's Generated Domain to an Origin Pool on the LB
4. Set the Host header for each origin to the Generated Domain: [Cloudflare Docs](https://developers.cloudflare.com/load-balancing/additional-options/override-http-host-headers/)
5. Visit the Load Balancer's DNS record and you should see your app!