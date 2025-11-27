---
title: Private Networking
description: Learn everything about private networking on Railway.
---

Private Networking refers to a feature within Railway that enables private communication between services in a project and environment. This is helpful for situations where you want to have a public gateway for your API but leave internal communication private.

## How it works

Under the hood, Railway is using encrypted Wireguard tunnels to create a private mesh network between all services within an environment. This allows traffic to route between services without exposing ports publicly.

**Note: You cannot use private networking to communicate with services in other environments.**

### Internal DNS

Every service in a project and environment gets an internal DNS name under the `railway.internal` domain that resolves to the internal IP addresses of the service.

This allows communication between services in an environment without exposing any ports publicly. Any valid IPv6 or IPv4 traffic is allowed, UDP, TCP and HTTP.

<Image src="https://res.cloudinary.com/railway/image/upload/v1686946888/docs/CleanShot_2023-06-16_at_16.21.08_2x_lgp9ne.png"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={1310} height={420} quality={100} />

## Caveats

During the feature development process we found a few caveats that you should be aware of:

- Private networking is not available during the build phase.
- Private networking does not function between [environments](/reference/environments).
- [Legacy environments](#legacy-environments) (created before October 16th, 2025) only support IPv6 addresses.

## Legacy Environments

Environments created before October 16th, 2025 are considered legacy environments and only support IPv6 addressing for private networking.

<div style={{marginTop: '1.5em'}}>
<Banner variant="info">
Railway will migrate all legacy environments to support both IPv4 and IPv6 addressing at a later date.
</Banner>
</div>

If you want to utilize private networking in a legacy environment, you will need to configure your service to bind to `::` (the IPv6 all-interfaces address). See [this guide](/guides/private-networking) for more information on configuring your listener. This will continue to work after your environment receives IPv4 support.

## Support

For information on how to use Private Networking, check out [this guide](/guides/private-networking).
