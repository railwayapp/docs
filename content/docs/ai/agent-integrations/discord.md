---
title: Discord
description: Install the Railway Agent in your Discord server and work with your projects from chat.
---

<Banner variant="primary">Agent integrations are in beta. Breaking changes may occur.</Banner>

Mention **@Railway** in Discord to ask the [Railway Agent](/ai/railway-agent) about your projects, inspect deployments, read logs, and make changes without leaving the conversation.

## Set up

1. Go to [Account Settings](https://railway.com/account) → **Railway Agent Integrations** and click **Add to Discord**. Authorize the app into your server.
2. Connect your Discord account to Railway under **Account Integrations** on the same page. If you skip this, the agent will prompt you the first time you mention it.
3. A Railway workspace admin runs `/link workspace` in the server and picks the Railway workspace to connect.
4. Mention **@Railway** with a question.

Each teammate connects their own account (step 2); the server link (step 3) only needs to happen once. Run `/link workspace` again at any time to point the server at a different Railway workspace.

## Removing the integration

Workspace admins can remove the server connection from [Account Settings](https://railway.com/account) — see [Managing connections](/ai/agent-integrations#managing-connections). The agent stops responding in that server immediately; remove the app itself from Discord's own server settings.
