---
title: Deploy Caddy
description: Learn how to deploy Caddy on Railway with one-click templates or CLI. This guide covers how to choose plugins, and configure static sites and reverse proxies.
date: "2026-03-20"
tags:
  - deployment
  - caddy
  - go
  - proxy
  - file server
  - backend
  - frontend
topic: integrations
---

[Caddy](https://caddyserver.com) is a powerful, extensible, open-source web server written in Go. It is best known for its [automatic HTTPS](https://caddyserver.com/docs/automatic-https) capabilities, simple configuration via the [Caddyfile](https://caddyserver.com/docs/caddyfile), and a rich plugin ecosystem.

Whether you need a static file server, a reverse proxy, or a custom build with additional modules, Railway is a great way to deploy Caddy. Railway's platform is an effortless way to deploy Caddy with plugins, without needing to build it yourself.

First, this guide will show you how to deploy Caddy in a way of your choosing. Then, you will learn how to customize the deployment to your needs.

## Deploying Caddy

Choose one of these ways to deploy Caddy on Railway:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [Deploy using the CLI](#deploy-from-the-cli).

### [One-click deploy from a template](#one-click-deploy-from-a-template)

The fastest way to get Caddy running on Railway is to use the official template.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/caddy)

On the deployment screen, click **Deploy Now**. If you'd like to include any Caddy plugins at this stage, click **Configure** and enter the Go module paths of the plugins you want, separated by spaces, in the `CADDY_PLUGINS` variable, for example:

```
github.com/caddy-dns/cloudflare github.com/mholt/caddy-ratelimit
```

You can browse the list of known, available plugins on the [Caddy Download page](https://caddyserver.com/download). Once you're happy with the configuration, click **Save Config**, then click **Deploy**.

After deployment finishes, click the generated URL in your project to visit your new Caddy server. You should see a welcome page confirming it is live.

It is highly recommended that [you eject from the template after deployment](/templates/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account so you can customize the configuration.

### [Deploy from the CLI](#deploy-from-the-cli)

1. **Install the Railway CLI**:
   - [Install the CLI](/guides/cli#installing-the-cli) and [authenticate it](/guides/cli#authenticating-with-the-cli) using your Railway account.

2. **Clone the template repository**:

   ```bash
   git clone https://github.com/caddyserver/caddy-railway.git my-caddy
   cd my-caddy
   ```

3. **Initialize a Railway Project**:
   - Run the command below in your Caddy project directory.

   ```bash
   railway init
   ```

   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.

4. **Deploy the Application**:
   - Run `railway up` to deploy your app.
     - This command will scan, compress, and upload your app's files to Railway. You'll see real-time deployment logs in your terminal.
   - Once the deployment is complete, proceed to generate a domain for the app service.

5. **Set Up a Public URL**:
   - Run `railway domain` to generate a public URL for your app.
   - Visit the new URL to see your app live in action!

## [Customize the deployment](#customize-the-deployment)

Once deployed, there are two main ways you'll want to customize your Caddy service: changing the configuration and adding/removing plugins.

Changing the configuration is done by committing changes of the `Caddyfile` to your repository and pushing. [Learn how to write a Caddyfile.](https://caddyserver.com/docs/caddyfile)

Adding and removing plugins is done by changing the `CADDY_PLUGINS` variable in your Railway project, then redeploying.

The following sections describe some common ways Caddy is configured on Railway.

### [Serving a static site](#serving-a-static-site)

Place your HTML, CSS, and other static assets in the `www` directory of your repository. The initial `Caddyfile` already points Caddy's `file_server` at `/www`, so simply committing your files and pushing will redeploy with your content served. There may be no need to change your Caddyfile, as long as it contains something like the following:

```caddyfile
root ./www
file_server
```

### [Using Caddy as a reverse proxy](#using-caddy-as-a-reverse-proxy)

Caddy is often used to proxy to other services in Railway projects using [private networking](/networking/private-networking). Update your `Caddyfile` to proxy traffic to the internal hostname of your upstream service:

```caddyfile
{
   # Global options

   # If you use hostnames or IP addresses as site addresses in the Caddyfile,
   # be sure to disable auto-HTTPS since Railway does that for you:
   # auto_https off
}

:8080

reverse_proxy my-app.railway.internal:3000
```

Because Railway terminates TLS before traffic reaches Caddy, you should add `auto_https off` in the global options block when using site addresses with hostnames, to prevent Caddy from attempting to manage certificates itself.


## [Environment variables](#environment-variables)

The following environment variable is supported by the Caddy Railway template:

| Name | Description | Example |
|------|-------------|---------|
| `CADDY_PLUGINS` | Space-separated list of Caddy plugin Go module paths to include in the build | `github.com/caddy-dns/cloudflare github.com/mholt/caddy-ratelimit` |

## [Notes on TLS and HTTPS](#notes-on-tls-and-https)

Railway terminates TLS at the edge before traffic reaches your Caddy service, so Caddy operates behind a proxy and is not directly internet-facing. As a result:

- You do **not** need Caddy to manage certificates. Railway handles this for you.
- If your `Caddyfile` uses explicit site addresses (e.g., hostnames), add `auto_https off` in the global options block to prevent Caddy from trying to obtain certificates unnecessarily.
- Caddy's port in the `Caddyfile` should match the `PORT` environment variable Railway injects, or simply listen on `:8080` which is the default exposed by the template.

## [Next steps](#next-steps)

You can make the most of Railway with these other resources:

* [Caddyfile documentation](https://caddyserver.com/docs/caddyfile)
* [Private networking between services](/networking/private-networking)
* [Monitor your app](/observability)
* [Add a custom domain](/networking/domains)