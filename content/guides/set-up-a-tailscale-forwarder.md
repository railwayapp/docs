---
title: Set up a Tailscale Forwarder
description: Learn how to access services on your private network on Railway by using a Tailscale Forwarder.
date: "2026-08-03"
tags:
  - networking
  - tailscale
  - vpn
topic: integrations
---

## What is the Tailscale Forwarder?

The Tailscale Forwarder is a lightweight TCP proxy that joins your tailnet as a machine and forwards traffic from ports on that machine to services on your Railway <a href="/networking/private-networking" target="_blank">private network</a>.

In practice, this means any device connected to your tailnet can reach your Railway services — like databases — through the forwarder, without those services ever being exposed to the public internet.

<Banner variant="info">
The Tailscale Forwarder template replaces the deprecated Tailscale Subnet Router template. The subnet router advertised Railway's entire <code>fd12::/16</code> private network range as a single subnet route, and since every Railway environment uses that same range, only a single subnet router could be used per tailnet.
</Banner>

## About this tutorial

This tutorial will help you connect to your database via the private network without you having to use public endpoints.

For occasional access from your own machine, the Railway CLI can open a temporary tunnel to a private database with `railway connect <service> --tunnel-only`. A Tailscale Forwarder is the right tool when you need a permanent route into the <a href="/networking/private-networking" target="_blank">private network</a> — constant traffic, multiple services, or access from every device on your tailnet.

Deploying the Tailscale Forwarder into your project means that you can access your services' private ports from any device connected to your tailnet, by connecting to the forwarder's machine name.

This tutorial aims to provide a simple step-by-step guide on setting up everything needed so that you can access your services over the private network.

**Objectives**

In this tutorial, you'll learn how to do the following: -

- Generate a reusable Auth Key.
- Enable MagicDNS.
- Deploy the Tailscale Forwarder template.
- (Bonus) Connect to Postgres locally through the forwarder.

**Prerequisites**

This guide assumes you are familiar with the concepts of Private Network, for a quick explainer check out the <a href="/networking/private-networking" target="_blank">guide</a> and <a href="/networking/private-networking" target="_blank">reference</a> page.

**In Railway -**

- Have all the services you plan on connecting to via the tailnet, listening on `::` (all interfaces).

  This is necessary because the forwarder will communicate with your services over Railway's private network.

  All database services already do this but for information on configuring your service to listen on `::`, see [here](/networking/private-networking#service-configuration).

**In Tailscale -**

- Have an account.

  You can sign up <a href="https://login.tailscale.com/start" target="_blank">here</a> - For what this template achieves you do not need a paid plan.

- Have the Tailscale app installed on your computer.

  You can find the downloads for your OS <a href="https://tailscale.com/download" target="_blank">here</a>.

## 1. Getting an auth key

The Auth key will authenticate the Tailscale machine that you'll deploy into your Railway project in a later step.

- Head over to the [Keys](https://login.tailscale.com/admin/settings/keys) page located within the settings menu on the Tailscale dashboard.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/keys_page_vohahp.png"
alt="screenshot of the tailscale settings page"
layout="intrinsic"
width={1261} height={772} quality={100} />

- Click **Generate auth key**.

  Put in a description and enable the **Reusable** option, leaving all other settings as the default.

  A reusable key lets the forwarder register itself again whenever it starts without existing state — for example, when you deploy a forwarder into another environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/generate_auth_key_oxqr8m.png"
alt="screenshot of the generate auth key modal in tailscale"
layout="intrinsic"
width={602} height={855} quality={100} />

- Click **Generate key**.

  Tailscale will now show you the newly generated auth key, **be sure to copy it down**.

- Click **Done**.

## 2. Enable MagicDNS

MagicDNS lets devices on your tailnet resolve the forwarder by its machine name, giving you a stable hostname to connect to.

- Open the <a href="https://login.tailscale.com/admin/dns" target="_blank">DNS</a> page.

- Under the **Tailnet DNS** header, make sure **MagicDNS** is enabled.

  MagicDNS is enabled by default on new tailnets, so there's a good chance you don't need to change anything here.

- On the device you'll be connecting from, make sure the Tailscale app is set to use Tailscale's DNS resolver (**Use Tailscale DNS** in the app's settings). Without it, your computer won't be able to resolve the forwarder's machine name.

## 3. Deploy the Tailscale Forwarder

This will be the gateway into your environment's private network.

- Open the project that contains the services you want to access privately.

  For this tutorial, you will deploy the forwarder into a project with a Postgres database service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349122/docs/tutorials/tailscale-subnet-router/project_with_postgres_x19ggr.png"
alt="screenshot of a project canvas on railway showing a single postgres service"
layout="intrinsic"
width={1363} height={817} quality={100} />

- In the top right of the project canvas, click **Create** → Choose **Template**.

- Search for the <a href="https://railway.com/deploy/tailscale-forwarder" target="_blank">Tailscale Forwarder</a> template and select it.

- A ghost service will appear, asking you to configure the template's variables -

  - **TS_AUTHKEY** - Paste in your reusable Auth Key from earlier.

  - **CONNECTION_MAPPING_1** - The port forwarding rule, in the format `<source port>:<target host>:<target port>`.

    For this tutorial's Postgres example, use `5432:postgres.railway.internal:5432` - this forwards port `5432` on the forwarder to the database's private domain and port.

- Click **Deploy Template**

This template will start to deploy and once deployed it will register itself as a machine in your tailnet, you can see it in the <a href="https://login.tailscale.com/admin/machines" target="_blank">Machines dashboard</a>.

The machine name is derived automatically from your project, environment, and service names, e.g. `my-project-production-tailscale-forwarder` - you'll use this name to connect in the next step.

The template also deploys with a volume attached, which persists the forwarder's Tailscale state (it sets `TS_EPHEMERAL=false`) so that restarts and redeploys keep the same machine identity instead of registering duplicate machines in your tailnet.

Unlike the previous subnet router setup, there are no subnet routes to approve.

**Forwarding more services**

To reach additional services through the same forwarder, add more `CONNECTION_MAPPING_[n]` variables (`CONNECTION_MAPPING_2`, `CONNECTION_MAPPING_3`, and so on) to the forwarder service, each with a unique source port.

**HTTPS forwarding**

For HTTP services, you can prefix a mapping with `https:` (e.g. `https:8080:my-service.railway.internal:8080`) to have the forwarder terminate TLS with a certificate for its machine name. This requires <a href="https://tailscale.com/kb/1153/enabling-https" target="_blank">HTTPS</a> to be enabled on your tailnet in addition to MagicDNS.

**That is it for all the configurations needed, you can now reach any mapped service through the forwarder's machine name from any device connected to your tailnet!**

## 4. Connecting to a service on the private network (bonus)

This tutorial has used Postgres as an example service, so let's finally connect to it through the forwarder!

Rather than connecting to the `railway.internal` private domain directly - those domains only resolve inside your environment - you connect to the forwarder's machine name and the source port from your connection mapping, e.g. -

```txt
postgresql://postgres:<PGPASSWORD>@my-project-production-tailscale-forwarder:5432/railway
```

You can use any database GUI tool you prefer, or none at all, since your setup allows you to connect to the database over the private network using any software.

Example: Your `prisma migrate deploy` or `python manage.py migrate` commands will now work locally using the forwarder's hostname, without the need to use the public host and port for the database.

**Additional Resources**

This tutorial explains how to set up a Tailscale Forwarder on Railway but does not delve into all the terminology and settings related to Tailscale.

We recommend reviewing the following Tailscale documentation:

- [Auth keys](https://tailscale.com/kb/1085/auth-keys)
- [MagicDNS](https://tailscale.com/kb/1081/magicdns)
- [Machine names](https://tailscale.com/kb/1098/machine-names)
- [Enabling HTTPS](https://tailscale.com/kb/1153/enabling-https)
- [Tailscale FAQ](https://tailscale.com/kb/1366/faq)

You can also check out the forwarder's <a href="https://github.com/brody192/tailscale-forwarder" target="_blank">source repository</a> for the full list of supported configuration options.
