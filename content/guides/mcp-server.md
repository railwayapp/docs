---
title: Build and Deploy Your Own MCP Server
description: Build a Model Context Protocol server in TypeScript and deploy it on Railway. Expose custom tools and resources that AI assistants like Claude and Cursor can call over the network.
date: "2026-04-14"
tags:
  - mcp
  - typescript
  - agents
topic: ai
---

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open standard for connecting AI assistants to external tools and data sources. An MCP server exposes tools (functions the AI can call) and resources (data the AI can read) over a standardized protocol.

This guide covers building an MCP server in TypeScript and deploying it on Railway so AI assistants like Claude Desktop and Cursor can connect to it over the network.

Railway already has an [MCP server for managing Railway infrastructure](/ai/mcp-server). This guide is different: it covers building and hosting your own MCP server for your own tools and data.

## How MCP transport works

MCP supports two transport protocols:

- **stdio**: The client launches the server as a local subprocess. Communication happens over standard input/output. This only works when the server runs on the same machine as the client.
- **SSE (Server-Sent Events)**: The server runs as an HTTP service. The client connects over the network. This is the transport you need for a hosted MCP server.

Since Railway hosts the server remotely, you must use SSE transport.

## Prerequisites

- A Railway account
- Node.js 18+ for local development
- An AI client that supports remote MCP servers (Claude Desktop, Cursor, etc.)

## 1. Create the MCP server

Initialize a project and install the MCP SDK:

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk express
npm install -D typescript @types/node @types/express
npx tsc --init
```

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

Create the server with a sample tool:

```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

const app = express();

// Store transports by session ID so the POST handler can route messages
const transports = new Map<string, SSEServerTransport>();

function createServer() {
  const server = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
  });

  // Define a tool
  server.tool("get_weather", "Get the current weather for a city", {
    city: { type: "string", description: "City name" },
  }, async ({ city }) => {
    // Replace with a real API call
    return {
      content: [
        { type: "text", text: `Weather in ${city}: 72°F, sunny` },
      ],
    };
  });

  return server;
}

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports.set(transport.sessionId, transport);

  res.on("close", () => {
    transports.delete(transport.sessionId);
  });

  const server = createServer();
  await server.connect(transport);
});

app.post("/messages", express.json(), async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(400).send("Unknown session");
    return;
  }

  await transport.handlePostMessage(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`MCP server running on port ${port}`);
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

The server starts on port 3000. You can test the SSE endpoint at `http://localhost:3000/sse`.

## 3. Deploy to Railway

1. Push your code to a GitHub repository.
2. Create a new [project](/projects) on Railway.
3. Click **+ New > GitHub Repo** and select your repository.
4. Railway detects the Node.js project and builds it via [Railpack](/builds/railpack).
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings > Networking**.

Your MCP server is now reachable at `https://your-server-production-xxxx.up.railway.app/sse`.

## 4. Connect from an AI assistant

### Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "my-server": {
      "url": "https://your-server-production-xxxx.up.railway.app/sse"
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "my-server": {
      "url": "https://your-server-production-xxxx.up.railway.app/sse"
    }
  }
}
```

Restart the client after updating the configuration. Your tools will appear in the AI assistant's tool list.

## Adding authentication

A public MCP server is accessible to anyone with the URL. To restrict access, add a simple bearer token check:

```typescript
app.get("/sse", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== process.env.MCP_AUTH_TOKEN) {
    return res.status(401).send("Unauthorized");
  }
  const transport = new SSEServerTransport("/messages", res);
  transports.set(transport.sessionId, transport);
  res.on("close", () => transports.delete(transport.sessionId));
  const server = createServer();
  await server.connect(transport);
});
```

Set `MCP_AUTH_TOKEN` as an [environment variable](/variables) in your Railway service.

## Adding a database

If your tools need persistent state, add [Postgres](/databases/postgresql) to your project and access it via the `DATABASE_URL` [reference variable](/variables#referencing-another-services-variable). For example, a tool that queries a knowledge base or stores user preferences.

## Next steps

- [Railway MCP Server](/ai/mcp-server): Railway's own MCP server for managing infrastructure.
- [Agent Skills](/ai/agent-skills): Open format for extending AI coding assistants with Railway knowledge.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): For tools that trigger long-running tasks.
- [Public Networking](/networking/public-networking): Domain configuration and networking specs.
