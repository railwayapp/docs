---
title: How Private Networking Works
description: Technical deep-dive into Railway's private networking architecture.
---

Railway's private networking creates secure, isolated communication channels between services within a project environment, without exposing traffic to the public internet.

## Architecture overview

Under the hood, Railway uses encrypted Wireguard tunnels to create a private mesh network between all services within an environment. This allows traffic to route between services without exposing ports publicly.

```
┌─────────────────────────────────────────────────────┐
│                 Project Environment                  │
│                                                      │
│   ┌─────────┐    Wireguard    ┌─────────┐           │
│   │   API   │◄───Tunnels────►│ Worker  │           │
│   │ Service │                 │ Service │           │
│   └────┬────┘                 └────┬────┘           │
│        │                           │                │
│        │    ┌─────────────┐       │                │
│        └───►│  Database   │◄──────┘                │
│             │   Service   │                         │
│             └─────────────┘                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Internal DNS

Every service in a project and environment gets an internal DNS name under the `railway.internal` domain that resolves to the internal IP addresses of the service.

### DNS resolution

- **New environments** (created after October 16, 2025): DNS names resolve to both internal IPv4 and IPv6 addresses
- **Legacy environments**: DNS names resolve to IPv6 addresses only

The DNS name follows the pattern: `<service-name>.railway.internal`

For example, a service named `api` would be reachable at `api.railway.internal`.

### Supported traffic

Any valid IPv6 or IPv4 traffic is allowed over the private network, including:
- **TCP** - HTTP, databases, custom protocols
- **UDP** - Real-time applications, game servers
- **HTTP/HTTPS** - Web services, APIs

Note: When communicating internally, use `http://` rather than `https://` since traffic is already encrypted via Wireguard.

## Encryption & security

All traffic between services is encrypted using Wireguard, a modern VPN protocol known for its:

- **Strong encryption**: Uses state-of-the-art cryptography (ChaCha20, Curve25519, BLAKE2s)
- **Performance**: Minimal overhead compared to other VPN protocols
- **Simplicity**: Small attack surface with ~4,000 lines of code

Traffic never leaves Railway's infrastructure and is not exposed to the public internet.

## Network isolation

Private networks are isolated at the project and environment level:

- Services in **different projects** cannot communicate over the private network
- Services in **different environments** (e.g., production vs staging) cannot communicate over the private network
- Each environment has its own isolated network namespace

This isolation ensures that:
- Production and development environments remain separate
- Multi-tenant projects don't leak data between customers
- Security boundaries are enforced at the infrastructure level

## Build VS. Runtime

Private networking is only available at **runtime**, not during the build phase. This means:

- Build scripts cannot reach other services over the private network
- Database migrations that require internal connectivity should run as part of the start command, not the build
- Health checks and service discovery happen after deployment

## Performance characteristics

Private networking offers several performance advantages:

- **Lower latency**: Traffic stays within Railway's infrastructure
- **No public internet hops**: Direct service-to-service communication
- **No egress costs**: Internal traffic doesn't count toward egress billing

## Related

- [Private Networking Overview](/networking/private-networking) - Getting started with private networking
- [Domains](/networking/domains) - Configure public and private domains
- [Library Configuration](/networking/private-networking/library-configuration) - Configure libraries for dual-stack networking
