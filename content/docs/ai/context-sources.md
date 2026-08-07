---
title: Context Sources
description: Connect Notion, Linear, Sentry, and your own MCP servers, then attach their tools to Railway Agent and dev.new chats from the Context picker.
---

<Banner variant="primary">Context Sources are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

Context Sources connect external tools to Railway's agents. Once you connect a source, attach it to a chat from the Context picker, and the agent can call its tools while it works.

**Note:** This is the opposite direction from the [Railway MCP Server](/ai/mcp-server), which lets external AI tools like Cursor and Claude Code call into Railway. Context Sources let Railway's own agents call out to Notion, Linear, Sentry, and other MCP servers.

## Where you can use it

Context Sources attach to chats in two places:

- **[Railway Agent](/ai/railway-agent)** — the chat assistant built into the Railway dashboard.
- **dev.new** — Railway's AI app builder, where an agent scaffolds, previews, and deploys an app for you in a sandboxed environment.

Both surfaces read from the same connections. Connect a source once in your workspace, and it's available to attach in either place.

## Standard context sources

Railway maintains one-click connections for commonly used tools:

- Notion
- Linear
- Sentry

Click **Connect** on any of these cards in your workspace's <a href="https://railway.com/workspace/agents" target="_blank">Agents settings</a>, then authenticate through the provider's OAuth flow. Once connected, the source's tools are available to attach from the Context picker.

## Custom MCP servers

You can also register any remote MCP server that supports streamable HTTP, so agents can use the tools it exposes.

To add a custom server:

1. Navigate to your workspace's <a href="https://railway.com/workspace/agents" target="_blank">Agents settings</a>.
2. Under **Context Sources**, expand **Custom MCP Servers**.
3. Enter a **Name** for the server. The name becomes part of the tool names the agent sees (`<name>_<toolName>`), so it must be 1-32 characters of lowercase letters, digits, hyphens, or underscores.
4. Enter the server's **URL**. Railway adds `https://` if you omit a scheme, and only connects over HTTPS.
5. Optional: Add headers, such as an `Authorization` token, if the server requires them.

Railway tests the connection automatically after you add or edit a server, and shows the result, connected with a tool count, or an error, on the server's row. If the server supports OAuth instead of a static header, authenticate from the same row.

You can register up to 20 custom servers per workspace member.

## Attach context to a chat

Available sources appear in the composer's Context picker, grouped by kind. A source attaches automatically the first time it becomes available in a session, and stays attached until you remove it from the picker.

Only the sources you have attached are sent to the agent for that message. Removing a source stops the agent from using its tools from that point on, without affecting earlier messages.

## Permissions and scope

Connecting and managing context sources requires workspace admin access. Workspace admins can see every member's connected sources for oversight, by name and host, never credentials, and can remove a member's server.

Every context source is personal: it runs with the credentials of whichever member connected it, and its tools are only ever available on that member's own chats. Connecting a source doesn't share it with the rest of the workspace.

Header values (such as an `Authorization` token) are encrypted at rest and can't be read back through the dashboard or API after you save them.
