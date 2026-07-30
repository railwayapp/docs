---
title: Build and Deploy Your Own MCP Server
description: Build a remote MCP server in TypeScript with Streamable HTTP transport and deploy it on Railway. Expose your app's data as tools that AI assistants like Claude and Cursor can call over the network.
date: "2026-07-29"
tags:
  - mcp
  - typescript
  - agents
topic: ai
---

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open standard for connecting AI assistants to external tools and data. An MCP server exposes tools the assistant can call and resources it can read.

In this guide we build a remote MCP server in TypeScript and deploy it on Railway, so assistants like Claude and Cursor can call it over the network.

Railway already has an [MCP server for managing Railway infrastructure](/ai/mcp-server). This guide is not about that one. It is about building and hosting your own, for your own tools and data.

## How MCP transport works

MCP has two transport protocols:

- **stdio**: The client launches the server as a local subprocess and talks to it over standard input/output. This only works when the server runs on the same machine as the client.
- **Streamable HTTP**: The server runs as an HTTP service with a single `/mcp` endpoint. The client connects over the network. This is the transport for a hosted server.

Streamable HTTP replaced the older HTTP+SSE transport. The [2026-07-28 spec revision](https://blog.modelcontextprotocol.io/posts/2026-07-28/) made the deprecation official, with a year-long offramp. Guides and client configs built around an `/sse` endpoint target the legacy transport. New servers should use Streamable HTTP.

The same revision made MCP a stateless request/response protocol. The `initialize` handshake and `Mcp-Session-Id` header are retired; each request carries the protocol version and client identity in its own metadata. This matters for hosting. Any replica can serve any request, so the service scales horizontally without sticky sessions. Session tracking still exists in the SDK, but only as a compatibility mode for clients on older spec revisions.

## Prerequisites

- Node.js 20 or later
- A [Railway account](https://railway.com)
- An AI assistant that supports remote MCP servers (Claude Code, Cursor, or Claude via Connectors)

## 1. Create the MCP server

Most MCP servers exist to expose an application's data and actions: query the database, search the docs, create a record. We will build the smallest version of that: a to-do list with tools to create, list, and complete tasks. The shape extends to whatever your application stores.

Initialize a project and install the MCP SDK packages:

```bash
mkdir todo-mcp-server && cd todo-mcp-server
npm init -y
npm install @modelcontextprotocol/server @modelcontextprotocol/express @modelcontextprotocol/node express zod
npm install -D typescript @types/node @types/express
npx tsc --init
```

The SDK splits into a core server package plus thin adapters: `@modelcontextprotocol/express` wires MCP into an Express app, and `@modelcontextprotocol/node` provides the Streamable HTTP transport for Node's request and response types.

Update `tsconfig.json` with the following settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Create the server with the to-do tools:

```typescript
// src/index.ts
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { McpServer } from "@modelcontextprotocol/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

type Todo = { id: string; title: string; done: boolean };
const todos = new Map<string, Todo>();

const server = new McpServer({
  name: "todo-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "create_todo",
  {
    description: "Add a task to the to-do list",
    inputSchema: z.object({
      title: z.string().describe("What needs doing"),
    }),
  },
  async ({ title }) => {
    const todo: Todo = { id: randomUUID(), title, done: false };
    todos.set(todo.id, todo);
    return {
      content: [{ type: "text", text: `Created ${todo.id}: ${title}` }],
    };
  }
);

server.registerTool(
  "list_todos",
  {
    description: "List every task and its status",
    inputSchema: z.object({}),
  },
  async () => ({
    content: [
      { type: "text", text: JSON.stringify([...todos.values()], null, 2) },
    ],
  })
);

server.registerTool(
  "complete_todo",
  {
    description: "Mark a task as done",
    inputSchema: z.object({
      id: z.string().describe("The id returned by create_todo"),
    }),
  },
  async ({ id }) => {
    const todo = todos.get(id);
    if (!todo) {
      return {
        content: [{ type: "text", text: `No task with id ${id}` }],
        isError: true,
      };
    }
    todo.done = true;
    return {
      content: [{ type: "text", text: `Done: ${todo.title}` }],
    };
  }
);

// host: "0.0.0.0" binds for deployment. The default binds 127.0.0.1 and
// enables localhost-only DNS rebinding protection, which rejects requests
// arriving through a public domain.
const app = createMcpExpressApp({ host: "0.0.0.0" });

app.post("/mcp", async (req, res) => {
  // A fresh transport per request: stateless, per the 2026-07-28 spec.
  // sessionIdGenerator: undefined opts out of the legacy session mode
  // kept for clients on older spec revisions.
  const transport = new NodeStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`MCP server listening on port ${port}`);
});
```

Add a build script to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 2. Test locally

```bash
npm run build && npm start
```

The server starts on port 3000 with its endpoint at `http://localhost:3000/mcp`. Test it with the MCP Inspector, an interactive client for calling tools:

```bash
npx @modelcontextprotocol/inspector
```

Enter `http://localhost:3000/mcp` as the URL with Streamable HTTP transport and connect. Call `create_todo` with a title, then `list_todos` to see the task, then `complete_todo` with its id.

## 3. Deploy to Railway

1. Push your code to a GitHub repository.
2. Create a new [project](/projects) on Railway.
3. Click **+ New > GitHub Repo** and select your repository.
4. Railway detects the Node.js project and builds it via [Railpack](/builds/railpack).
5. Generate a [public domain](/networking/domains) under **Settings > Networking**.

The [Railway CLI](/cli) skips the repository entirely: `railway init` creates the project, and `railway up` deploys the directory you are standing in.

Your MCP server is now reachable at `https://your-server-production-xxxx.up.railway.app/mcp`.

Railway injects the `PORT` [environment variable](/variables) at runtime, which the server code above already reads.

## 4. Connect from an AI assistant

### Claude Code

```bash
claude mcp add --transport http my-server https://your-server-production-xxxx.up.railway.app/mcp
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "url": "https://your-server-production-xxxx.up.railway.app/mcp"
    }
  }
}
```

### Claude (web and desktop)

Add the server URL as a custom connector under **Settings > Connectors**.

Restart the client after updating the configuration. The three tools appear in the assistant's tool list. Ask it to add a task and list what's open; it will call the tools itself.

## Adding authentication

A public MCP server is accessible to anyone with the URL. To restrict access, check a bearer token before the MCP handler runs. Express runs middleware in registration order, so this `app.use` must come before the `app.post("/mcp", ...)` route:

```typescript
app.use("/mcp", (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== process.env.MCP_AUTH_TOKEN) {
    res.status(401).send("Unauthorized");
    return;
  }
  next();
});
```

Set `MCP_AUTH_TOKEN` as an [environment variable](/variables) in your Railway service, and configure the same token in clients that support custom headers.

For full OAuth, MCP defines an [authorization spec](https://modelcontextprotocol.io/specification/draft/basic/authorization) that treats your server as an OAuth resource server. The `@modelcontextprotocol/express` package ships `requireBearerAuth` and `mcpAuthMetadataRouter` helpers for validating tokens and serving the protected resource metadata that spec-compliant clients discover.

## Keeping the server private

If the only consumers of your MCP server are agents and services in the same project environment, skip the public domain entirely. Services in an environment reach each other over [private networking](/networking/private-networking) at `http://<service-name>.railway.internal:<port>/mcp`, so the server never accepts traffic from the public internet.

## Adding a database

The in-memory `Map` keeps the example self-contained, but it is per-replica and wiped on every redeploy. The protocol will not carry state for you either; requests are stateless. State lives behind the server, in a database. Add [Postgres](/databases/postgresql) to your project, connect via the `DATABASE_URL` [reference variable](/variables#referencing-another-services-variable), and swap the `Map` operations for queries against a `todos` table. The tool definitions do not change. Only the handler bodies do.

## Next steps

- [Choose Between Local and Remote MCP Servers](/guides/local-vs-remote-mcp-servers): when a server should be remote at all.
- [Railway MCP Server](/ai/mcp-server): Railway's own MCP server for managing infrastructure.
- [Agent Skills](/ai/agent-skills): Open format for extending AI coding assistants with Railway knowledge.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): For tools that trigger long-running tasks.
- [Public Networking](/networking/public-networking): Domain configuration and networking specs.
