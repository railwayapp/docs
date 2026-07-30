---
title: Choose Between Local and Remote MCP Servers
description: When an MCP server should run locally over stdio and when it should be a remote Streamable HTTP service. Decision factors, what the 2026 spec changed, and how to deploy the remote kind on Railway.
date: "2026-07-29"
tags:
  - mcp
  - agents
  - architecture
  - ai
topic: ai
---

An MCP server runs in one of two places. A local server is a subprocess the AI client launches on your machine and talks to over standard input/output. A remote server is an HTTP service the client calls over the network. Same protocol, same tools; different transport, and a different set of things that can go wrong.

The decision is less about preference than about three questions: who uses the tools, what the tools touch, and who keeps the server running.

## The short answer

Run the server **locally** when the tools are for you: they touch your filesystem, your local git checkout, your machine's credentials, and nobody else needs them.

Run the server **remotely** when the tools are for a team or a product: they wrap a shared database, an internal API, or your application's data, and more than one person (or agent) should reach them without installing anything.

## How the two differ

| | Local (stdio) | Remote (Streamable HTTP) |
|---|---|---|
| Runs | As a subprocess of the client | As a hosted HTTP service |
| Reach | One machine, one user | Anyone with the URL and credentials |
| Access to | Local files, local processes | Whatever the server is deployed next to |
| Setup per user | Install the server and configure the command | Paste a URL |
| Updates | Every user updates their copy | Deploy once, every client gets it |
| Auth | Inherits your local permissions | Must be built: bearer tokens or OAuth |
| Uptime | Alive while the client is | Your job, like any service |

Two of those rows decide most cases. **Access**: a tool that reads local files has to run locally; a tool that queries your production database should not have production credentials distributed to every laptop. **Updates**: a team of ten running local copies of a shared tool is ten slightly different versions; a remote server is one.

## What the 2026 spec changed

The [2026-07-28 spec revision](https://blog.modelcontextprotocol.io/posts/2026-07-28/) simplified the remote side. Streamable HTTP is the single remote transport (the older HTTP+SSE transport is officially deprecated, with a year-long offramp), and the protocol is now stateless: no initialize handshake, no session header, so any replica of a remote server can serve any request. Remote servers scale like ordinary HTTP services now, which removed the main operational argument against them.

stdio is unchanged. It remains the right transport for local tools and is not deprecated.

## Running the local kind

A local server is a command in your client's configuration. In Claude Code:

```bash
claude mcp add my-tools -- node /path/to/server/dist/index.js
```

The client launches the process, pipes JSON-RPC over stdio, and kills it when the session ends. There is nothing to host and nothing to secure beyond your own machine.

## Running the remote kind

A remote server is a deployment. Build it with the MCP SDK's Streamable HTTP transport, deploy it, and give clients the URL:

```bash
claude mcp add --transport http my-tools https://my-tools-production.up.railway.app/mcp
```

[Build and Deploy Your Own MCP Server](/guides/mcp-server) walks through the whole thing on Railway: the stateless transport setup, bearer-token auth, and the deploy. A remote server on Railway can also stay off the public internet entirely: agents and services in the same project environment reach it over [private networking](/networking/private-networking), which is the right shape when the "team" consuming the tools is other services, not people.

## The migration path

Most servers that matter end up remote, and the path is unexciting by design: the tool definitions do not change between transports. A server built with the MCP SDK swaps its stdio transport for the Streamable HTTP transport, gains an auth check, and everything a client saw before, it sees after. Starting local is not a decision you get locked into.

## Next steps

- [Build and Deploy Your Own MCP Server](/guides/mcp-server): the remote path, end to end.
- [Railway MCP Server](/ai/mcp-server): Railway's own remote MCP server for managing infrastructure.
- [Agent Skills](/ai/agent-skills): the other way to extend coding agents with Railway knowledge.
- [Private Networking](/networking/private-networking): remote servers without public exposure.
