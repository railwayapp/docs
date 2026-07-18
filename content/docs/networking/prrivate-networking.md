---
title: Private Networking
description: Secure service-to-service communication within your Railway project.
---

Private networking enables secure communication between services within your Railway project without exposing traffic to the public internet. Services communicate over encrypted Wireguard tunnels using internal DNS.

## Key features

- **Zero Configuration** - Services automatically discover each other via internal DNS
- **Encrypted Traffic** - All inter-service communication uses Wireguard encryption
- **No Public Exposure** - Traffic stays within Railway's private network
- **Environment Isolation** - Each environment has its own isolated network

## Learn more

| Topic | Description |
| ----- | ----------- |
| [**How It Works**](/networking/private-networking/how-it-works) | Technical deep-dive into Railway's private networking architecture, including Wireguard tunnels, internal DNS, and IPv6 addressing. |
| [**Library Configuration**](/networking/private-networking/library-configuration) | Configure your application libraries and frameworks to work with private networking. |

## Quick start

To connect services privately:

1. Deploy multiple services to the same project environment
2. Reference other services using their internal DNS name: `SERVICE_NAME.railway.internal`
3. No port exposure or configuration required

For example, if you have a service named `api`, other services can reach it at:
```
http://api.railway.internal:PORT
```

See [How It Works](/networking/private-networking/how-it-works) for complete details on DNS resolution and network architecture.
