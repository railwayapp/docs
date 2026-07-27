---
title: Agent Integrations
description: Bring the Railway Agent into your team chat — mention @Railway in Slack or Discord to work with your projects from the conversation.
---

<Banner variant="primary">Agent integrations are in beta. Breaking changes may occur.</Banner>

The Railway Agent can join your team chat. Once installed, mention **@Railway** in Slack or Discord to ask about your projects, inspect deployments, read logs, and make changes — the same [Railway Agent](/ai/railway-agent) that runs in the dashboard, answering where your team already works.

## Available integrations

- [Slack](/ai/agent-integrations/slack) — install the app to your Slack workspace and link it with `/railway-link`.
- [Discord](/ai/agent-integrations/discord) — add the app to your Discord server and link it with `/link workspace`.

## How it works

Two connections make the agent available in a chat workspace:

1. **Your account** — each person links their Slack or Discord identity to their Railway account. The agent acts with *your* access, never someone else's.
2. **The workspace** — a Railway workspace admin links the Slack workspace or Discord server to a single Railway workspace. This decides which projects the agent can see and which workspace pays for usage.

Both are checked on every message. If you leave the Railway workspace, the agent stops responding to you immediately.

## Managing connections

[Account Settings](https://railway.com/account) shows everything in one place:

- **Your account links** appear under Account Integrations, with a disconnect option for each.
- **Workspace connections** appear on the Slack and Discord cards as "Agent linked to *workspace*" rows. Workspace admins can remove a connection there — the agent stops responding in that server immediately. Removing the connection doesn't uninstall the app from Slack or Discord; do that from the chat platform's own settings.

To reconnect or point a server at a different Railway workspace, run the link command again — no need to reinstall.

## Permissions and billing

- Linking a chat workspace requires **admin** on the Railway workspace, and so does removing the link.
- Using the agent requires being a **member** of the linked Railway workspace, re-checked on every message.
- Agent usage in chat is billed to the linked Railway workspace at the same rates as the dashboard agent. See [Pricing](/pricing#railway-agent) for details.
