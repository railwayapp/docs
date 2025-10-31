---
title: Static Outbound IPs
description: Learn how to enable static outbound IPs on Railway.
---

Static Outbound IPs allows customers on the Pro plan to assign a permanent outbound IPv4 address to a service. This IP address will **always** be used for outbound traffic from any replicas running within the service.

## Use Cases

This feature may be useful to you if you're using a third-party service provider or firewall which requires you to whitelist which IP addresses your services will be connecting from, such as MongoDB Atlas.

The IPv4 address assigned to your service through this feature **cannot** be used to receive inbound traffic.

## Enabling Static Outbound IPs

Customers on the Pro plan can enable Static Outbound IPs for any service they wish.

1. Navigate to the Settings tab of your desired service
2. Toggle `Enable Static IPs` in the Networking section of Settings
3. You will be presented with an IPv4 address which is tied to the region your service is deployed in
4. The Static IP will be used by your service after the next deploy

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1716858865/docs/d6u20lrvxmlc8rfu91rx.png"
  layout="responsive"
  alt="Static IPs"
  width={1328} height={710} quality={80} />

## Caveats

- There is no guarantee that the IPv4 address assigned to your service is dedicated. It may be shared with other customers.
- The IP address cannot be used for inbound traffic.
- If you wish to move your service to a different region, the IP address will change.
