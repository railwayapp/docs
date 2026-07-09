---
title: Slack and Discord
description: Add the Railway agent to your Slack workspace or Discord server and work with your projects from chat.
---

<Banner variant="primary">The Slack and Discord integrations are in beta. Breaking changes may occur.</Banner>

The Railway agent can join your team chat. Once installed, mention **@Railway** in Slack or Discord to ask about your projects, inspect deployments, read logs, and make changes — the same [Railway Agent](/ai/railway-agent) that runs in the dashboard, answering where your team already works.

## How it works

Two connections make the agent available in a chat workspace:

1. **Your account** — each person links their Slack or Discord identity to their Railway account. The agent acts with *your* access, never someone else's.
2. **The workspace** — a Railway workspace admin links the Slack workspace or Discord server to a single Railway workspace. This decides which projects the agent can see and which workspace pays for usage.

Both are checked on every message. If you leave the Railway workspace, the agent stops responding to you immediately.

## Set up Slack

1. Go to [Account Settings](https://railway.com/account) → **Railway Agent Integrations** and click **Add to Slack**. Approve the install for your Slack workspace.
2. Mention **@Railway** in any channel. The first time, it replies with a link to connect your Slack identity to your Railway account — follow it.
3. A Railway workspace admin runs `/railway-link` in a channel (not a thread) and picks the Railway workspace to connect.
4. That's it — mention **@Railway** with a question, or run `/railway-link` again at any time to point the server at a different workspace.

The agent can reply in any public channel. For private channels, invite it first with `/invite @Railway`.

## Set up Discord

1. Go to [Account Settings](https://railway.com/account) → **Railway Agent Integrations** and click **Add to Discord**. Authorize the app into your server.
2. Connect your Discord account to Railway under **Account Integrations** on the same page. If you skip this, the agent will prompt you the first time you mention it.
3. A Railway workspace admin runs `/link workspace` in the server and picks the Railway workspace to connect.
4. Mention **@Railway** with a question.

## Managing connections

[Account Settings](https://railway.com/account) shows everything in one place:

- **Your account links** appear under Account Integrations, with a disconnect option for each.
- **Workspace connections** appear on the Slack and Discord cards as "Agent linked to *workspace*" rows. Workspace admins can remove a connection there — the agent stops responding in that server immediately. Removing the connection doesn't uninstall the app from Slack or Discord; do that from the chat platform's own settings.

To reconnect or point a server at a different Railway workspace, run the link command again — no need to reinstall.

## Permissions and billing

- Linking a chat workspace requires **admin** on the Railway workspace, and so does removing the link.
- Using the agent requires being a **member** of the linked Railway workspace, re-checked on every message.
- Agent usage in chat is billed to the linked Railway workspace at the same rates as the dashboard agent. See [Pricing](/pricing#railway-agent) for details.
