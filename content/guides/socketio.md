---
title: Deploy a WebSocket Application with Socket.IO
description: Deploy a Socket.IO server and client on Railway. Covers CORS configuration, the 15-minute connection limit, reconnection handling, and scaling with a Redis adapter.
date: "2026-04-14"
tags:
  - deployment
  - frontend
  - websockets
  - socketio
topic: integrations
---

[Socket.IO](https://socket.io) is the most widely used library for real-time bidirectional communication in JavaScript applications. It handles WebSocket connections with automatic fallback to HTTP long-polling, built-in reconnection, and room-based message routing.

This guide covers how to deploy a Socket.IO application on Railway, handle the 15-minute connection limit, and scale across multiple instances.

## What you will deploy

- A Socket.IO server running on Express.
- A frontend client that connects to the server.
- Both services deployed to the same Railway project.

## Server setup

Create a new Node.js project and install dependencies:

```bash
npm init -y
npm install express socket.io
```

Create `server.js`:

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
  // Start with polling, then upgrade to WebSocket
  transports: ['polling', 'websocket'],
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', connections: io.engine.clientsCount });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('message', (data) => {
    // Broadcast to all other clients
    socket.broadcast.emit('message', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Socket.IO server running on port ${port}`);
});
```

Key configuration:

- **CORS:** set `origin` to your frontend's domain. Use a [reference variable](/variables#referencing-another-services-variable) like `FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}` to keep it in sync.
- **Transports:** `['polling', 'websocket']` starts with HTTP long-polling and upgrades to WebSocket. This is Socket.IO's default and works reliably through Railway's proxy.
- **Health check:** the `/health` endpoint lets Railway monitor the service. Configure it in [Health Checks](/deployments/healthchecks).

## Client setup

Install the Socket.IO client in your frontend:

```bash
npm install socket.io-client
```

Connect to your Railway-hosted server:

```javascript
import { io } from 'socket.io-client';

const socket = io('https://your-socketio-server.railway.app', {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('message', (data) => {
  console.log('Received:', data);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Socket.IO will automatically reconnect
});
```

Replace `https://your-socketio-server.railway.app` with your service's [public domain](/networking/public-networking#railway-provided-domain).

## Deploy to Railway

1. Create a new project on <a href="https://railway.com/new" target="_blank">Railway</a>.
2. Deploy the Socket.IO server from your [GitHub repository](/deployments/github-autodeploys) or using the [CLI](/cli).
3. [Generate a domain](/networking/public-networking#railway-provided-domain) for the server.
4. Set the `FRONTEND_URL` variable to your frontend's domain for CORS.
5. Configure a [health check](/deployments/healthchecks) pointing to `/health`.

Ensure the server binds to `0.0.0.0` and reads the port from the `PORT` environment variable.

## Handle the 15-minute connection limit

Railway has a [maximum request duration of 15 minutes](/networking/public-networking/specs-and-limits). WebSocket connections open longer than 15 minutes are terminated.

Socket.IO handles this automatically. When the connection drops, the client reconnects and receives a new `socket.id`. The reconnection settings in the client configuration above ensure this happens with exponential backoff.

To preserve state across reconnections:

1. **Use rooms for group membership.** When a client reconnects, re-join the rooms it was in:

```javascript
// Server
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
});

// Client
socket.on('connect', () => {
  // Re-join rooms after reconnection
  socket.emit('join-room', currentRoomId);
});
```

2. **Use a last-seen timestamp.** On reconnection, the client sends the timestamp of the last message it received. The server sends any messages the client missed.

## Scale with a Redis adapter

By default, Socket.IO routes messages through the server's in-process memory. If you scale to multiple instances, clients connected to different instances cannot communicate.

The <a href="https://socket.io/docs/v4/redis-adapter/" target="_blank">Redis adapter</a> solves this by routing messages through Redis pub/sub.

1. Add a [Redis database](/databases/redis) to your Railway project.
2. Install the adapter:

```bash
npm install @socket.io/redis-adapter redis
```

3. Configure the server:

```javascript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

Set `REDIS_URL` using a [reference variable](/variables#referencing-another-services-variable) pointing to your Redis service's connection string.

With the Redis adapter in place, messages broadcast on one instance reach clients connected to all instances.

## Common pitfalls

**WebSocket upgrade fails, connection stays on polling.** This can happen if your client or a proxy between the client and Railway does not support WebSocket upgrades. Socket.IO falls back to polling automatically, which works but is less efficient. To debug, check the `transport` property:

```javascript
socket.on('connect', () => {
  console.log('Transport:', socket.io.engine.transport.name);
  socket.io.engine.on('upgrade', () => {
    console.log('Upgraded to:', socket.io.engine.transport.name);
  });
});
```

**CORS errors on connection.** The Socket.IO server must explicitly allow your frontend's origin. Set the `origin` in the `cors` option. Using `'*'` works for development but should be restricted in production.

**Sticky sessions not configured for multiple instances.** Without the Redis adapter, clients that reconnect may hit a different instance that does not have their session. The Redis adapter eliminates this issue. If you cannot use Redis, enable sticky sessions by routing based on the Socket.IO session ID, though this is more complex to configure.

## Next steps

- [Choose between SSE and WebSockets](/guides/sse-vs-websockets) - Decide which protocol fits your use case.
- [Redis on Railway](/databases/redis) - Set up Redis for the Socket.IO adapter.
- [Private Networking](/networking/private-networking) - Connect services within your project.
- [Scaling](/deployments/scaling) - Scale your Socket.IO server based on connection count.
