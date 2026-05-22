---
title: Static Outbound IPs
description: Learn how to enable static outbound IPs on Railway.
---

Static Outbound IPs allows customers on the Pro plan to assign permanent outbound IPv4 addresses to a service. These IP addresses will **always** be used for outbound traffic from any replicas running within the service. 

Traffic will be balanced over multiple IPs for high throughput and resiliency.

## Use cases

This feature may be useful to you if you're using a third-party service provider or firewall which requires you to whitelist which IP addresses your services will be connecting from, such as MongoDB Atlas.

The IPv4 addresses assigned to your service through this feature **cannot** be used to receive inbound traffic.

## Enabling static outbound IPs

Customers on the Pro plan can enable Static Outbound IPs for any service they wish.

1. Navigate to the Settings tab of your desired service
2. Toggle `Enable Static IPs` in the Networking section of Settings
3. You will be presented with IPv4 addresses tied to the region your service is deployed in
4. The Static IP will be used by your service after the next deploy

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1779459868/ha-static-ip-endabled_v5mhct.png"
  layout="responsive"
  alt="Static IPs"
  width={1528} height={1132} quality={80} />

## Update: HA Static Outbound IPs

Previously a service would be assigned a single IP. For improved throughput and resiliency services will now be assigned 3 IPs with outbound traffic load balanced over them.

If you have an existing single IP service, you can upgrade by clicking the `Enable HA Static IP` link under the `Enable Static IPs` toggle. Be aware that you will need to add the additional IPs to downstream services allowlists.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1779459868/ha-static-ips-migrate_gyvlmj.png"
  layout="responsive"
  alt="Static IPs Upgrade"
  width={1540} height={1052} quality={80} />

## Caveats

- There is no guarantee that the IPv4 addresses assigned to your service are dedicated. They may be shared with other customers.
- The IP addresses cannot be used for inbound traffic.
- If you wish to move your service to a different region, the IP addresses will change.
