---
title: Set up a Tailscale Subnet Router
description: Learn how to access a private network on Railway by using a Tailscale Subnet Router.
---

## What is a Subnet router?

> A subnet router is a device within your tailnet that you use as a gateway that advertises routes for other devices that you want to connect to your tailnet without installing the Tailscale client.

*Source: <a href="https://tailscale.com/kb/1019/subnets" target="_blank">Subnet routers</a> Via Tailscale's Documentation*

In the context of Railway, The "other devices" are the services within a project.

## About this Tutorial

This tutorial will help you connect to your database via the private network without you having to use public endpoints.

Since Railway doesn't currently offer a native way to access the <a href="https://docs.railway.com/reference/private-networking" target="_blank">private network</a> from our local environment, we can use a Tailscale Subnet Router to accomplish this.

Deploying Tailscale as a subnet router into our project means that we can access the `railway.internal` private domains from any device connected to our tailnet.

This tutorial aims to provide a simple step-by-step guide on setting up everything needed so that we can access the private domains of our services.

**Objectives**

In this tutorial, you'll learn how to do the following: -

- Generate an Auth Key.
- Set up split DNS.
- Deploy the Tailscale Subnet Router template.
- Approve the private network subnet.
- (Bonus) Connect to Postgres locally via the private domain.

**Prerequisites**

This guide assumes you are familiar with the concepts of Private Network, for a quick explainer check out our <a href="/guides/private-networking" target="_blank">guide</a> and <a href="/reference/private-networking" target="_blank">reference</a> page.

**In Railway -**

- Have all the services you plan on connecting to via the tailnet, listening on IPv6.

    This is necessary because the Tailscale tunnel will communicate with your services over Railway's IPv6-only private network.

    All database services already do this but for information on configuring your service to listen on IPv6, see [here](/guides/private-networking#listen-on-ipv6).

**In Tailscale -**

- Have an account.

    You can sign up <a href="https://login.tailscale.com/start" target="_blank">here</a> - For what this template achieves you do not need a paid plan.

- Have the Tailscale app installed on your computer.

    You can find the downloads for your OS <a href="https://tailscale.com/download" target="_blank">here</a>.

## 1. Getting an Auth Key

The Auth key will authenticate the Tailscale machine that we'll deploy into our Railway project in a later step.

- Head over to the [Keys](https://login.tailscale.com/admin/settings/keys) page located within the settings menu on the Tailscale dashboard.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/keys_page_vohahp.png"
alt="screenshot of the tailscale settings page"
layout="intrinsic"
width={1261} height={772} quality={100} />

- Click **Generate auth key**.

    Put in a description and leave all other settings as the default.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/generate_auth_key_oxqr8m.png"
alt="screenshot of the generate auth key modal in tailscale"
layout="intrinsic"
width={602} height={855} quality={100} />

- Click **Generate key**.

    Tailscale will now show you the newly generated auth key, **be sure to copy it down**.

- Click **Done**.

## 2. Configure Split DNS

Properly configuring our nameserver in Tailscale is essential for enabling local DNS lookups for our private domains.

- Open the <a href="https://login.tailscale.com/admin/dns" target="_blank">DNS</a> page.

- Under the **Nameservers** Header, click **Add Nameserver** → Click **Custom**.

    This is where we'll tell Tailscale how to route the DNS lookups for our `railway.internal` domains.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349122/docs/tutorials/tailscale-subnet-router/tailscale_nameservers_en8oma.png"
alt="screenshot of the nameservers dropdown in tailscale"
layout="intrinsic"
width={813} height={683} quality={100} />

- Enter `fd12::10` as the Nameserver.

    This DNS nameserver is used across all private networks in every environment and will handle our DNS queries for private domains.

- Enable the **Restrict to domain** option, AKA Split DNS.

- Enter in `railway.internal` as our domain.

    This makes sure only DNS lookups for our private domain are forwarded to the private DNS resolver.
    
<Image src="https://res.cloudinary.com/railway/image/upload/v1724349120/docs/tutorials/tailscale-subnet-router/add_nameserver_mlkk5y.png"
alt="screenshot of the add nameserver modal in tailscale"
layout="intrinsic"
width={602} height={572} quality={100} />

- Click **Save**.

## 3. Deploy the Tailscale Subnet Router

This will be the gateway into our environment's private network.

- Open the project that contains the services you want to access privately.

    For this tutorial, we will deploy the Subnet Router into a project with a Postgres database service.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349122/docs/tutorials/tailscale-subnet-router/project_with_postgres_x19ggr.png"
alt="screenshot of a project canvas on railway showing a single postgres service"
layout="intrinsic"
width={1363} height={817} quality={100} />

- In the top right of the project canvas, click **Create** → Choose **Template**.

- Search for the <a href="https://railway.com/template/tailscale" target="_blank">Tailscale Subnet Router</a> template.

    Choose the result that is published by **Railway Templates**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1743471191/docs/template-tailscale_ryph2o.png"
alt="screenshot of the choose a template modal showing the tailscale template within railway"
layout="intrinsic"
width={1200} height={634} quality={100} />

- A ghost service will appear, Paste in your Auth Key from earlier.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349120/docs/tutorials/tailscale-subnet-router/tailscale_subnet_router_ghost_jjyt2s.png"
alt="screenshot of the tailscale template asking for the auth key"
layout="intrinsic"
width={1363} height={817} quality={100} />

- Click **Deploy Template**

This template will start to deploy and once deployed it will register itself as a machine in your tailnet with the name automatically derived from the project's name and environment name.

## 4. Approve the Subnet

Our subnet router will advertise the private network's CIDR range but we will need to manually approve it.

- Head back over to our [Machines dashboard](https://login.tailscale.com/admin/machines).

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349122/docs/tutorials/tailscale-subnet-router/tailscale_machines_d3qcey.png"
alt="screenshot of the machine's dashboard in tailscale that is showing a subnet needs approving"
layout="intrinsic"
width={1261} height={560} quality={100} />

You will see your newly deployed machine with its name that was previously derived from the project and environment.

<div style={{'display': "inline-flex", 'align-items': "center"}}>
    <span style={{ "marginRight": "8px" }}>Notice the</span><strong style={{ "marginRight": "3px" }}>Subnets</strong>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    <span style={{ "marginLeft": "6px" }}>Info box under the machine name.</span>
</div>

- Click on the machine's 3-dot menu → **Edit route settings**.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349121/docs/tutorials/tailscale-subnet-router/machine_3_dot_menu_ygqktw.png"
alt="screenshot of the machines page in tailscale with the 3-dot menu open and edit route settings selected"
layout="intrinsic"
width={1320} height={593} quality={100} />

- Click the radio button on the `fd12::/16` to accept it.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349120/docs/tutorials/tailscale-subnet-router/edit_route_settings_tyna0n.png"
alt="screenshot of the edit route settings in tailscale showing our route being accepted"
layout="intrinsic"
width={602} height={526} quality={100} />

    This route covers the entire private networking range allowing us to access all services within the project.

- Click **Save**.

- Ensure that the **Use Tailscale subnets** option is enabled in your Tailscale client's Settings or Preferences menu.

**That is it for all the configurations needed, you can now call any service via its private domain and port just as if you were another service within the private network!**

## 5. Connecting To a Service On the Private Network (Bonus)

During this tutorial we have used Postgres as an example service, so let's finally connect to it via its private domain and port!

You can use any database GUI tool you prefer, or none at all, since our setup allows you to connect to the database over the private network using any software.

Example: Your `prisma migrate deploy` or `python manage.py migrate` commands will now work locally without the need to use the public host and port for the database.

<Image src="https://res.cloudinary.com/railway/image/upload/v1724349120/docs/tutorials/tailscale-subnet-router/dbgate_priv_net_mdjnlh.png"
alt="screenshot of dbgate showing that we have successfully connected to our database"
layout="intrinsic"
width={1316} height={506} quality={100} />

*Note the use of our private domain and port in the database URL.*

**Additional Resources**

This tutorial explains how to set up a Tailscale Subnet router on Railway but does not delve into all the terminology and settings related to Tailscale.

We recommend reviewing the following Tailscale documentation:

- [Subnet router](https://tailscale.com/kb/1019/subnets)
- [Auth keys](https://tailscale.com/kb/1085/auth-keys)
- [Machine names](https://tailscale.com/kb/1098/machine-names)
- [DNS](https://tailscale.com/kb/1054/dns?q=dns#use-dns-settings-in-the-admin-console)
- [Tailscale FAQ](https://tailscale.com/kb/1366/faq)
