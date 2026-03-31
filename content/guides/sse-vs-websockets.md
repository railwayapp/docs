---
title: Choose Between SSE and WebSockets
description: When to use Server-Sent Events vs WebSockets for real-time data. Covers protocol differences, reconnection handling, and how to deploy both on Railway.
date: "2026-03-30"
tags:
  - architecture
  - sse
  - websockets
  - real-time
topic: architecture
---

Most real-time applications need one of two protocols: Server-Sent Events (SSE) or WebSockets. This guide covers when to use each, how they differ, and what to account for when deploying them on Railway.

## Quick comparison

| Feature | SSE | WebSockets |
| --- | --- | --- |
| Direction | Server to client only | Bidirectional |
| Protocol | HTTP/1.1 | HTTP/1.1 upgrade to ws:// |
| Auto-reconnect | Built into EventSource API | Must implement manually |
| Binary data | No (text only) | Yes |
| Browser support | All modern browsers | All modern browsers |
| Proxy/load balancer compatibility | Better (standard HTTP) | Can be tricky (upgrade required) |
| Use cases | Live feeds, AI streaming, notifications | Chat, gaming, collaborative editing |

## When to use SSE

**Best for:** AI/LLM token streaming, live dashboards, notification feeds, and any scenario where the server pushes data and the client only listens.

Use SSE when the server pushes data to the client and the client does not need to send data back. Common cases include:

- **AI/LLM token streaming.** This is the most common use case. The server streams generated tokens to the client as they are produced.
- **Live dashboards and log tailing.** The server pushes new data points or log lines as they arrive.
- **Notification feeds.** The server sends alerts or updates without the client needing to poll.

SSE is simpler to implement and debug than WebSockets. The browser's `EventSource` API handles reconnection automatically. SSE works through most HTTP proxies without extra configuration since it uses standard HTTP.

**Limitation:** SSE only supports text data (no binary). It is unidirectional, so the client cannot send data back over the same connection. If you need to send data to the server, use a separate HTTP request.

## When to use WebSockets

**Best for:** chat applications, multiplayer games, collaborative editors, and any scenario where both client and server send messages frequently.

Use WebSockets when the client and server both need to send messages. Common cases include:

- **Chat applications.** Both sides send messages freely.
- **Multiplayer games.** Clients send input, the server sends game state.
- **Collaborative editors.** Multiple clients send edits, the server broadcasts changes.
- **Binary data transfer.** WebSockets support binary frames for file uploads or media streaming.
- **High-frequency bidirectional messaging.** When both sides exchange many messages per second.

**Limitation:** WebSocket connections require an HTTP/1.1 upgrade, which some proxies and load balancers may not support. The client must implement reconnection logic manually since there is no built-in auto-reconnect.

## Railway-specific constraints

Railway supports both protocols natively:

- **WebSocket connections** work via HTTP/1.1 upgrade.
- **SSE connections** work via standard HTTP responses.
- **Maximum request duration is 15 minutes.** Both SSE and WebSocket connections are subject to this limit. Connections open longer than 15 minutes are terminated.

For connections that need to last longer than 15 minutes, implement reconnection logic on the client side.

### Handling the 15-minute limit

#### SSE reconnection

The browser's `EventSource` API automatically reconnects when a connection drops. To resume from where the connection left off:

1. Send an `id` field with each event on the server.
2. When the client reconnects, the browser sends the last event ID in the `Last-Event-ID` header.
3. Your server reads that header and resumes from that point.

```javascript
// Server (Node.js)
app.get('/events', (req, res) => {
  const lastId = req.headers['last-event-id'];

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  let id = parseInt(lastId) || 0;
  const interval = setInterval(() => {
    id++;
    res.write(`id: ${id}\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});
```

```javascript
// Client
const source = new EventSource('/events');
source.onmessage = (event) => {
  console.log(event.data);
};
// EventSource automatically reconnects and sends Last-Event-ID
```

#### WebSocket reconnection

WebSockets do not auto-reconnect. Implement a reconnection wrapper on the client:

```javascript
function connect() {
  const ws = new WebSocket('wss://your-app.railway.app/ws');

  ws.onclose = () => {
    // Reconnect after a short delay
    setTimeout(connect, 1000);
  };

  ws.onmessage = (event) => {
    console.log(event.data);
  };
}

connect();
```

For production use, add exponential backoff to avoid overwhelming the server during an outage:

```javascript
function connect(attempt = 0) {
  const ws = new WebSocket('wss://your-app.railway.app/ws');

  ws.onopen = () => {
    attempt = 0; // Reset on successful connection
  };

  ws.onclose = () => {
    const delay = Math.min(1000 * 2 ** attempt, 30000);
    setTimeout(() => connect(attempt + 1), delay);
  };

  ws.onmessage = (event) => {
    console.log(event.data);
  };
}

connect();
```

## Deploy on Railway

Both SSE and WebSocket services deploy the same way as any other Railway service. No special configuration is needed.

1. Deploy your service from [GitHub Autodeploys](/deployments/github-autodeploys) or the [CLI](/cli).
2. [Generate a domain](/networking/public-networking#railway-provided-domain) for public access.
3. Your SSE or WebSocket endpoints work immediately.

Ensure your application binds to `0.0.0.0` and reads the port from the [`PORT` environment variable](/variables).

## Next steps

- [Public Networking Specs & Limits](/networking/public-networking/specs-and-limits) - Request duration limits and other networking constraints.
- [Deploy from GitHub](/deployments/github-autodeploys) - Set up automatic deploys from your repository.
- [Monitor your app](/observability/metrics) - Track request metrics and service health.
