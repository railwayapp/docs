---
title: Deploy an AI Chatbot with Streaming Responses
description: Deploy a chatbot on Railway that streams LLM responses token by token using Server-Sent Events. Covers Next.js with the AI SDK, API key management, and optional conversation persistence with Postgres.
date: "2026-04-14"
tags:
  - ai
  - chatbot
  - streaming
  - sse
  - nextjs
topic: ai
---

This guide covers deploying a chatbot on Railway that streams responses from an LLM API (OpenAI or Anthropic) to the browser using Server-Sent Events. The chatbot uses Next.js with the [Vercel AI SDK](https://sdk.vercel.ai), which handles the streaming protocol on both the server and client.

Railway is a CPU-based platform. The chatbot calls external LLM APIs over HTTP, it does not run models locally.

## What you will set up

- A Next.js app with a streaming chat endpoint using the AI SDK
- An SSE connection that delivers tokens to the browser as they are generated
- Environment variables for your LLM API key
- A public domain for accessing the chatbot
- Optional: Postgres for persisting conversation history

## Prerequisites

- A Railway account
- An API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)
- A Next.js app with the AI SDK installed, or a willingness to start from the AI SDK's [chat template](https://github.com/vercel/ai-chatbot)

## 1. Set up the chat API route

The AI SDK provides a `streamText` function that calls the LLM and returns a streaming response. Create an API route that uses it:

```typescript
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toDataStreamResponse();
}
```

To use Anthropic instead, swap the provider:

```typescript
import { anthropic } from "@ai-sdk/anthropic";

const result = streamText({
  model: anthropic("claude-sonnet-4-20250514"),
  messages,
});
```

## 2. Set up the chat UI

The AI SDK's `useChat` hook manages the message list, input state, and SSE connection:

```tsx
// app/page.tsx
"use client";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

`useChat` sends a POST request to `/api/chat` and reads the streamed response. Tokens appear in the UI as they arrive.

## 3. Deploy to Railway

1. Push your code to a GitHub repository.
2. Create a new [project](/projects) on Railway.
3. Click **+ New** and select **GitHub Repo**, then choose your repository.
4. Add your LLM API key as an [environment variable](/variables):
   - For OpenAI: set `OPENAI_API_KEY`
   - For Anthropic: set `ANTHROPIC_API_KEY`
5. Generate a [public domain](/networking/public-networking#railway-provided-domain) under **Settings > Networking > Public Networking**.

Railway auto-detects Next.js via [Railpack](/builds/railpack) and configures the build. The service will be live at your generated domain once the first deploy completes.

## Streaming and Railway's request duration limit

Railway has a [maximum HTTP request duration of 15 minutes](/networking/public-networking/specs-and-limits). SSE connections that stay open longer than 15 minutes are terminated.

For a chatbot, this is rarely a problem: most LLM responses complete in seconds. If your chatbot runs multi-step agent tasks that could take longer, consider the [async workers pattern](/guides/ai-agent-workers) instead of holding an SSE connection open.

The AI SDK's `useChat` hook handles reconnection automatically. If a connection drops, the client re-sends the message history on the next request, so the user does not lose context.

## Optional: persist conversations with Postgres

Without a database, conversation history only exists in the browser's memory. To persist conversations across sessions:

1. Add [PostgreSQL](/databases/postgresql) to your project: click **+ New > Database > PostgreSQL**.
2. [Reference](/variables#referencing-another-services-variable) the `DATABASE_URL` variable in your Next.js service.
3. Create a table for messages:

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

4. In your API route, load prior messages from Postgres before calling `streamText`, and save the assistant's response after the stream completes.

## Next steps

- [Choose Between SSE and WebSockets](/guides/sse-vs-websockets): Protocol tradeoffs for real-time applications.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): For tasks that take minutes, not seconds.
- [Deploy a RAG Pipeline with pgvector](/guides/rag-pipeline-pgvector): Add knowledge retrieval to your chatbot.
- [PostgreSQL on Railway](/databases/postgresql): Connection pooling, backups, and configuration.
