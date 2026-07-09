---
title: Slack
description: Install the Railway Agent in your Slack workspace and work with your projects from chat.
---

<Banner variant="primary">Agent integrations are in beta. Breaking changes may occur.</Banner>

Mention **@Railway** in Slack to ask the [Railway Agent](/ai/railway-agent) about your projects, inspect deployments, read logs, and make changes without leaving the conversation.

## Set up

1. Go to [Account Settings](https://railway.com/account) → **Railway Agent Integrations** and click **Add to Slack**. Approve the install for your Slack workspace.
2. Mention **@Railway** in any channel. The first time, it replies with a link to connect your Slack identity to your Railway account — follow it.
3. A Railway workspace admin runs `/railway-link` in a channel (not a thread) and picks the Railway workspace to connect.
4. That's it — mention **@Railway** with a question.

Each teammate connects their own account (step 2); the workspace link (step 3) only needs to happen once. Run `/railway-link` again at any time to point the workspace at a different Railway workspace.

## Channels

The agent can reply in any public channel. For private channels, invite it first with `/invite @Railway`.

## Removing the integration

Workspace admins can remove the workspace connection from [Account Settings](https://railway.com/account) — see [Managing connections](/ai/agent-integrations#managing-connections). The agent stops responding in that Slack workspace immediately; uninstall the app itself from Slack's own admin settings.
