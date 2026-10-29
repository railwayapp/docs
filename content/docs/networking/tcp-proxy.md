---
title: TCP Proxy
description: Learn how to proxy TCP traffic to a service on Railway.
---

TCP Proxy enables you to expose non-HTTP services to the internet or make them accessible across your private network. This is useful for services like databases, game servers, or any application that communicates over raw TCP.

## How it works

Enabling TCP Proxy on a service requires specification of a port to which the traffic should be proxied. Railway then generates a domain and proxy port, and all traffic sent to `domain:port` will be proxied to the service.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743194081/docs/tcp-proxy_edctub.png"
alt="Screenshot of TCP proxy configuration"
layout="responsive"
width={1200} height={822} quality={100} />

## Setting up TCP proxy

To create a TCP proxy:

1. Navigate to your service's Settings
2. Find the Networking section
3. Click on TCP Proxy
4. Enter the internal port your service listens on
5. Railway will generate a proxy domain and port (e.g., `shuttle.proxy.rlwy.net:15140`)

## Load balancing

Incoming traffic will be distributed across all replicas in the closest region using a random load balancing algorithm.

## Use cases

TCP Proxy is commonly used for:

- **Databases** - Expose PostgreSQL, MySQL, Redis, or other databases for external access
- **Game servers** - Allow players to connect directly via TCP
- **Custom protocols** - Any service using a non-HTTP protocol
- **IoT devices** - Connect devices that communicate over raw TCP

## Unused database proxies

Railway removed the TCP proxy from databases that received no public traffic other than automated port scans for 30 days. An unused public port on a database is still a target for attackers, and the dashboard no longer needs one to connect.

If one of your databases was affected, every member of its workspace received an email and a dashboard notification naming the database and its old address. Nothing was redeployed and private networking was not changed. The database's public URL variable (for example `DATABASE_PUBLIC_URL`) was removed along with the proxy, since it no longer resolved.

To connect without a public port:

- Run `railway connect` from the [CLI](/cli). Without a TCP proxy it opens a tunnel over SSH.
- Run `railway connect <service> --tunnel-only` to point a client such as TablePlus or DBeaver at the tunnel.
- Connect from another service in the same environment over [Private Networking](/networking/private-networking).

To restore public access, open the database service's Settings, find Public Networking, add a TCP proxy on the database's port, and deploy the staged change. Railway assigns a new domain and port and recreates the public URL variable. Update any client that had the old address saved.

## Using a custom domain for TCP proxying

You can use your own domain instead of Railway's provided TCP proxy domain.

To set this up:

1. Create a TCP proxy in your service settings. Railway will provide you with a proxy domain and port (e.g., `shuttle.proxy.rlwy.net:15140`).

2. In your DNS provider, create a CNAME record pointing to the Railway-provided TCP proxy domain (without the port).

   For example, if Railway provides `shuttle.proxy.rlwy.net:15140`:
   - **Name**: `db.yourdomain.com` (or your preferred subdomain)
   - **Target**: `shuttle.proxy.rlwy.net`

3. Connect to your service using your custom domain with the Railway-provided port (e.g., `db.yourdomain.com:15140`).

**Note:** The port number is provided by Railway and must be used when connecting. Only the hostname is replaced with your custom domain.

**Caveats:**
- If using Cloudflare, proxying must be disabled (DNS only, grey cloud).
- If your client validates or looks for a specific hostname in the connection, it may fail when using a custom domain.

## Using HTTP and TCP together

Railway supports exposing both HTTP and TCP over public networking in a single service. If you have a domain assigned, you will still see the option to enable TCP Proxy, and vice-versa.

## TCP with private networking

TCP Proxy can also be used in conjunction with [Private Networking](/networking/private-networking) for internal service-to-service communication. Services within the same project or environment can communicate over TCP using internal DNS names without exposing traffic to the public internet.

## Troubleshooting

Having issues with your TCP proxy? Check out the [Troubleshooting guide](/troubleshooting) or reach out on [Central Station](https://station.railway.com).
