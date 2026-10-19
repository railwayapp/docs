---
title: Deploy a Remote MCP Server Over HTTPS
description: Deploy an existing MCP server, such as Playwright MCP, to a public HTTPS endpoint on Railway with object storage and bearer-token auth, and compare Railway against Render, Fly.io, Cloudflare, and AWS as a host.
date: "2026-10-19"
tags:
  - mcp
  - agents
  - hosting
  - ai
topic: ai
---

A remote MCP server gives AI assistants like Claude Code and Cursor access to tools and data over the internet. It uses the Model Context Protocol, an open standard, so one deployed server works with any compatible client. This guide shows you how to deploy a remote MCP server and compare the many available hosting options.

**Quick answer:**

1. Put the MCP server's code in a GitHub repo or local directory.
2. Deploy it to a host that supports its runtime and long streaming requests.
3. Add a bearer token or OAuth so only your clients can connect.
4. Generate a public HTTPS domain. Your endpoint is `https://your-domain/mcp`.
5. Add the URL and Authorization header to Claude Code or Cursor.

## What a remote MCP server needs to run

- **A code repository.** An MCP server is a self-contained application with its own dependencies and start command. The code can exist in a GitHub repository or on your machine.
- **A hosting service.** To host the MCP server on the internet, you need a hosting service that supports the runtime of the server such as Node.js or Python. If the server streams long-running responses, the platform also has to keep connections open long enough for them to finish.
- **A public HTTPS endpoint.** Once deployed, the server is reachable at an HTTPS URL ending in a fixed path, conventionally `/mcp`. This is the endpoint you give the client.
- **Authentication.** A public endpoint needs access control such as OAuth or a bearer token.
- **Persistent storage (optional).** Servers that store data between requests need somewhere to keep it, such as a database or an attached volume.

## Deploying to a public HTTPS endpoint

1. **Create a new project in Railway.** Select **Deploy from GitHub repo** and paste the URL of the MCP server's repository. For this example, we'll deploy a remote Playwright MCP server that lets an AI assistant control a web browser, saving screenshots and screen recordings as it goes. The repository URL is [github.com/jamesmurdza/playwright-mcp-server](https://github.com/jamesmurdza/playwright-mcp-server/). Alternatively, you can use the Railway CLI to deploy an MCP server from a local directory.

   <Image src="https://res.cloudinary.com/e99qzlgk/image/upload/v1792425535/deploy-github-repo_ljqxeg.png"
   alt="Dialog to deploy the jamesmurdza/playwright-mcp-server GitHub repository to a new Railway project"
   layout="responsive"
   width={496} height={314} quality={100} />

2. **Add additional services.** The Playwright MCP server supports connecting a file storage bucket to automatically store screenshots and screen recordings. To add one, click **Add** and select **Bucket**, then click **Deploy**.

   <Image src="https://res.cloudinary.com/e99qzlgk/image/upload/v1792425535/add-bucket-service_bqwrnj.png"
   alt="Service picker with Bucket selected after typing bucket into the search field"
   layout="responsive"
   width={499} height={197} quality={100} />

   In the **Credentials** tab of the bucket settings, click **Add to Service** and select the MCP server, which copies the bucket's connection details into the server as environment variables.

   <Image src="https://res.cloudinary.com/e99qzlgk/image/upload/v1792425535/bucket-credentials-add-to-service_xztvt5.png"
   alt="Bucket Credentials tab showing the Add to Service button and S3-compatible credentials"
   layout="responsive"
   width={884} height={456} quality={100} />

3. **Configure variables and secrets.** Depending on the server, there may be environment variables to set. The bucket's connection URLs were added in the previous step, but this server needs one more by hand. `MCP_API_KEY` is the bearer token the server requires on every request to `/mcp`. Without it, anyone with the public URL can drive the browser. Generate a random string and set it under **Variables**. Keep a copy to give to the client in the last step.
4. **Deploy the server.** Clicking **Deploy** applies the above changes and deploys the MCP server.

   <Image src="https://res.cloudinary.com/e99qzlgk/image/upload/v1792425535/apply-deploy-changes_njq4zt.png"
   alt="Apply 2 changes toolbar with the Deploy button"
   layout="responsive"
   width={528} height={152} quality={100} />

5. **Generate a public domain.** In **Settings**, select the **Networking** tab and click **Generate Domain**. Railway assigns a `*.up.railway.app` subdomain, handles HTTPS, and routes traffic to the service.

   <Image src="https://res.cloudinary.com/e99qzlgk/image/upload/v1792425535/generate-public-domain_rbmiep.png"
   alt="Service Settings Networking tab with the Generate Domain, Custom Domain, and TCP Proxy buttons"
   layout="responsive"
   width={911} height={526} quality={100} />

## Streamable HTTP

MCP servers use Streamable HTTP, which can stream progress updates while long-running work is still in progress. The client can display that progress in real time as it arrives.

Streamable HTTP requests are subject to the limits of the hosting platform. Railway allows [streaming requests up to 15 minutes](/networking/public-networking/specs-and-limits). For MCP, this means a single tool call can stream up to 15 minutes.

<Banner variant="warning">
Railway closes a request after 5 minutes if no data has been transferred in either direction.
</Banner>

In our Playwright example, the MCP server waits on browser actions like page loads and navigation, so streaming allows the client to show progress during those waits.

**Note:** Streamable HTTP has been MCP's HTTP transport since the 2025-03-26 revision, replacing the older HTTP+SSE transport, which is now deprecated. The 2026-07-28 revision made the protocol stateless, so each request stands alone and servers are easier to run with multiple replicas.

## Authentication

Without authentication, anyone who finds your server's URL can access its tools. Two common ways to restrict access are a bearer token and OAuth:

A bearer token is a shared secret that the client sends with every request. The server rejects requests without it, and the token is a secure value stored outside the repository. The Playwright server in this guide uses this approach.

OAuth has each user sign in through their browser instead of sharing one key. This lets you control and revoke access per user, and it works with clients that can't send custom headers. It requires more setup, since you need an authorization server, usually from an identity provider. Claude Code and Cursor both support it.

Use a bearer token for a server only you or a small team uses. Use OAuth if other people will connect to it.

## Connecting Claude Code and Cursor

A client needs the `/mcp` URL and the `MCP_API_KEY`, sent as an `Authorization: Bearer` header.

### Claude Code

```bash
claude mcp add --transport http playwright https://your-server-production-xxxx.up.railway.app/mcp --header "Authorization: Bearer YOUR_MCP_API_KEY"
```

By default, the new server only loads in the project where you added it. Add `--scope user` to make the server available in all your projects, or `--scope project` to write a `.mcp.json` file in the project.

### Cursor

Add the server to `.cursor/mcp.json` in your project, or `~/.cursor/mcp.json` to use it everywhere:

```json
{
  "mcpServers": {
    "playwright": {
      "url": "https://your-server-production-xxxx.up.railway.app/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_API_KEY"
      }
    }
  }
}
```

After adding the new server to the configuration, restart the client and test the new server via prompt.

## Where should you host a remote MCP server?

Since a remote MCP server is just a web application with a public endpoint, there are many hosting platforms that can run one. However, they vary in how much setup they require, how long they'll hold a streaming request open, and the built-in options for storage and databases.

| | Render | Fly.io | Cloudflare | AWS | Railway |
|---|---|---|---|---|---|
| Setup | Connect a repo | Connect a repo | Add config, connect repo | Choose a service and set up IAM | Connect a repo |
| Max streaming request | 100 minutes | No limit | No limit | Varies | 15 minutes |
| Connecting storage | Environment variables | CLI command | Config file | Set up IAM | One click |
| Databases available | Postgres | Postgres | D1 (SQLite) | RDS, Aurora | Postgres, MySQL, MongoDB |
| Object storage | No | Yes | Yes | Yes | Yes |
| Pricing model | Fixed per service | Per second running | Per request and CPU time | Varies* | Usage-based |
| Best for | Long-running streams | Region-specific servers | Edge deployment | Existing AWS setups | Shipping quickly |

### Render

[Render](https://render.com) deploys straight from GitHub and gives each request up to 100 minutes to finish. It offers managed Postgres and Redis-compatible key-value storage, but no built-in file storage. Each service is billed at a fixed monthly price, starting at $7. The free tier spins down after 15 minutes of inactivity, so it isn't suitable for MCP servers.

Choose Render if your server runs very long streaming requests or you want a predictable monthly bill.

### Fly.io

[Fly.io](https://fly.io) lets you choose exactly which regions your server runs in. You can launch it from a GitHub repo in the dashboard or with its CLI. It offers managed Postgres and one-command object storage via Tigris. Its proxy closes idle connections, reportedly after about 60 seconds by default, but you can raise this with the `idle_timeout` option in `fly.toml`. Machines are billed per second while running, so a server that auto-stops when idle costs very little. There's no free tier for new customers.

Choose Fly.io if you need your server in specific regions or want it to cost almost nothing when idle.

### Cloudflare

[Cloudflare](https://cloudflare.com) runs your server across its global network instead of in a single region. It has the most useful free tier with 100,000 requests a day, but it covers only Workers, Cloudflare's serverless platform. Workers are limited to JavaScript/TypeScript, Python, and WebAssembly. They have no wall-clock limit, but CPU time is capped at 10 ms per request on the free plan and 30 seconds by default (up to 5 minutes) on the paid plan. For other runtimes, Cloudflare hosts Containers on the $5/month paid plan. Storage options include Cloudflare's own database, key-value storage, and file storage.

Choose Cloudflare if you want low latency worldwide, especially for a lightweight TypeScript server.

### AWS

[AWS](https://aws.amazon.com) offers many ways to host a server, but you'll do more of the setup yourself. Hosting ranges from Lambda to containers and storage includes RDS, DynamoDB, and S3. Deployment usually happens through the AWS CLI or an infrastructure-as-code tool rather than by connecting a repo. You'll configure access permissions and networking yourself, and limits and pricing vary by service.

Choose AWS if your infrastructure already lives there or you need a storage service the others don't offer.

### Railway

Railway takes you from a GitHub repo to a running server with storage attached in a few clicks. Adding a database or S3-compatible bucket takes just one more click, and the credentials are added to your server automatically. Servers run continuously by default so there are no cold starts unless Serverless is enabled. Pricing is usage-based. The Hobby plan is $5/month with $5 of usage included, and Free and Pro plans are also available. Streaming requests are capped at 15 minutes with a 5-minute idle timeout.

Choose Railway if you want to ship quickly and need a database or file storage alongside your server.

## Summary

Deploying a remote MCP server takes three steps: choose a host that supports its runtime and streaming, configure authentication with a bearer token or OAuth, then deploy the code to a public HTTPS endpoint.

The choice of a host comes down to setup, streaming limits, and storage options. Pick Render for very long streams, Fly.io for regional control and low idle costs, Cloudflare for edge latency, AWS if you're already there, and Railway if you want a database or bucket attached in a click.

## Next steps

- [Build and Deploy Your Own MCP Server](/guides/mcp-server)
- [Choose Between Local and Remote MCP Servers](/guides/local-vs-remote-mcp-servers)
- [Public networking specs and limits](/networking/public-networking/specs-and-limits)
- [Storage buckets](/storage-buckets)
