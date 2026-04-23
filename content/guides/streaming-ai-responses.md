---
title: Stream AI Responses to a Frontend with Server-Sent Events
description: Stream LLM tokens from an API service to a frontend using Server-Sent Events on Railway. Covers Express and Hono server implementations, client-side consumption, and reconnection handling.
date: "2026-04-14"
tags:
  - frontend
  - ai
  - sse
  - streaming
topic: architecture
---

AI applications stream tokens from an LLM API to the browser as they are generated. Server-Sent Events (SSE) is the standard protocol for this because it works over plain HTTP and the browser handles reconnection automatically.

This guide covers how to build and deploy an AI streaming endpoint on Railway, with both server and client implementations.

## Architecture

The streaming flow has three parts:

1. The **frontend** sends a prompt to your API service.
2. The **API service** calls an LLM API (OpenAI, Anthropic) with streaming enabled.
3. The API forwards each token chunk to the frontend as an SSE event.

The frontend displays tokens as they arrive, giving the user immediate feedback instead of waiting for the full response.

## Server implementation

### Express

```javascript
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json());

const client = new Anthropic();

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages,
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  });

  stream.on('end', () => {
    res.write('data: [DONE]\n\n');
    res.end();
  });

  req.on('close', () => {
    stream.abort();
  });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

### Hono

```typescript
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { serve } from '@hono/node-server';
import Anthropic from '@anthropic-ai/sdk';

const app = new Hono();
const client = new Anthropic();

app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json();

  return streamSSE(c, async (stream) => {
    const response = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages,
    });

    response.on('text', async (text) => {
      await stream.writeSSE({ data: JSON.stringify({ text }) });
    });

    await response.finalMessage();
    await stream.writeSSE({ data: '[DONE]' });
  });
});

const port = parseInt(process.env.PORT || '3000');
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});
```

Key details:

- `X-Accel-Buffering: no` prevents reverse proxies from buffering the stream. Without it, the client may receive all tokens at once instead of progressively.
- `req.on('close')` detects when the client disconnects. Aborting the LLM stream avoids paying for tokens the user will never see.
- Bind to `0.0.0.0` so Railway can route traffic to your service.

## Client implementation

The browser's `EventSource` API only supports GET requests. Since chat endpoints typically use POST (to send a message body), use `fetch` with a `ReadableStream` instead:

```javascript
async function streamChat(messages, onToken) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        const { text } = JSON.parse(data);
        onToken(text);
      }
    }
  }
}

// Usage
let fullResponse = '';
await streamChat(
  [{ role: 'user', content: 'Explain Railway in one paragraph' }],
  (token) => {
    fullResponse += token;
    document.getElementById('output').textContent = fullResponse;
  }
);
```

### Using the Vercel AI SDK

The <a href="https://sdk.vercel.ai/" target="_blank">Vercel AI SDK</a> provides higher-level React hooks for streaming. It works with any hosting provider, not just Vercel:

```jsx
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}
```

This requires the server endpoint to use the AI SDK's `streamText` response format. See the <a href="https://sdk.vercel.ai/docs" target="_blank">AI SDK documentation</a> for server-side setup.

## Deploy on Railway

SSE streaming works on Railway without special configuration.

1. Deploy your API service from [GitHub](/deployments/github-autodeploys) or the [CLI](/cli).
2. Set the `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) as a [service variable](/variables).
3. [Generate a domain](/networking/public-networking#railway-provided-domain) for your service.

Ensure your application binds to `0.0.0.0` and reads the port from the `PORT` environment variable.

## Railway constraints

**Maximum request duration is 15 minutes.** Most LLM streaming responses complete in seconds, so this limit rarely applies. For agent workflows that run for minutes, use the async worker pattern instead: the API enqueues the task, returns a job ID, and the client polls for results. See [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers).

## Common pitfalls

**Tokens arrive all at once instead of streaming.** This happens when something buffers the response. Check for:
- Compression middleware (e.g., `express-compression`) applied to SSE routes. Disable it for streaming endpoints or set `X-Accel-Buffering: no`.
- A CDN or caching layer between the client and Railway. Bypass it for streaming routes.

**Client disconnects are not detected.** If you do not listen for the `close` event on the request, the server continues calling the LLM API after the user navigates away. This wastes tokens and API credits.

**CORS errors when calling from a separate frontend.** If your frontend and API are on different domains, configure CORS headers on the API service. In Express: `app.use(cors({ origin: 'https://your-frontend.railway.app' }))`.

## Next steps

- [Choose between SSE and WebSockets](/guides/sse-vs-websockets) - When to use SSE vs WebSockets for real-time features.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers) - Handle long-running AI tasks that exceed the 15-minute limit.
- [Manage environment variables](/guides/frontend-environment-variables) - Configure API keys and URLs across services.
- [Private Networking](/networking/private-networking) - Connect frontend and API services internally.
