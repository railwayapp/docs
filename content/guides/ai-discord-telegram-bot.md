---
title: Deploy an AI-Powered Bot for Discord or Telegram
description: Deploy a Discord or Telegram bot on Railway that uses LLM APIs for conversational responses. Covers always-on deployment, API key management, conversation memory with Postgres, and rate limit handling.
date: "2026-04-14"
tags:
  - ai
  - bot
  - discord
  - telegram
  - python
topic: ai
---

This guide covers deploying a chat bot for Discord or Telegram on Railway that uses an LLM API (OpenAI, Anthropic, etc.) to generate responses. The bot runs as an always-on service, listens for messages, and replies with AI-generated text.

Railway is a CPU-based platform. The bot calls external LLM APIs over HTTP. No models run locally.

## Architecture

The bot consists of two components:

- **Bot service** runs continuously, connects to the Discord or Telegram API, listens for messages, and calls the LLM API to generate responses.
- **Postgres** (optional) stores conversation history per user or channel so the bot can maintain context across messages.

Bot services do not need a public domain. They connect outbound to the messaging platform's API and to the LLM API.

## Prerequisites

- A Railway account
- A bot token from [Discord](https://discord.com/developers/applications) or [Telegram](https://core.telegram.org/bots#botfather)
- An API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)

## 1. Structure the bot code

Here is a minimal Discord bot using discord.py and OpenAI:

```python
import os
import discord
from openai import OpenAI

intents = discord.Intents.default()
intents.message_content = True
bot = discord.Client(intents=intents)
llm = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    response = llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message.content},
        ],
    )
    await message.channel.send(response.choices[0].message.content)

bot.run(os.environ["DISCORD_TOKEN"])
```

For Telegram, use python-telegram-bot:

```python
import os
from telegram.ext import ApplicationBuilder, MessageHandler, filters
from openai import OpenAI

llm = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

async def handle_message(update, context):
    response = llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": update.message.text},
        ],
    )
    await update.message.reply_text(response.choices[0].message.content)

app = ApplicationBuilder().token(os.environ["TELEGRAM_TOKEN"]).build()
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
app.run_polling()
```

## 2. Deploy to Railway

1. Push your bot code to a GitHub repository.
2. Create a new [project](/projects) on Railway.
3. Click **+ New > GitHub Repo** and select your repository.
4. Set environment variables under the **Variables** tab:
   - `DISCORD_TOKEN` or `TELEGRAM_TOKEN`: your bot token.
   - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`: your LLM API key.
5. The bot does not need a public domain. It connects outbound to Discord/Telegram servers.

Deploy the bot as an always-on service, not a [cron job](/cron-jobs). Bots must stay connected to receive messages in real time.

## 3. Add conversation memory with Postgres

Without a database, the bot treats every message independently. To maintain conversation context:

1. Add [PostgreSQL](/databases/postgresql) to your project.
2. [Reference](/variables#referencing-another-services-variable) `DATABASE_URL` in the bot service.
3. Store recent messages per user or channel:

```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  channel_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversations_channel ON conversations(channel_id);
```

Before calling the LLM, load the last N messages for the channel and include them in the messages array. This gives the bot conversational context.

## 4. Handle rate limits

LLM APIs enforce rate limits on requests per minute and tokens per minute. When your bot is active in multiple channels simultaneously, you can hit these limits. Mitigations:

- Use a smaller, faster model (GPT-4o mini, Claude Haiku) for most responses. Reserve larger models for complex queries.
- Add a per-channel cooldown to avoid rapid-fire LLM calls.
- Implement retry logic with exponential backoff for 429 responses.
- Truncate conversation history to limit token usage per request.

## Next steps

- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): For bots that need to run longer tasks.
- [PostgreSQL on Railway](/databases/postgresql): Connection pooling, backups, and configuration.
- [Monitor your app](/observability): View logs and metrics for your bot service.
