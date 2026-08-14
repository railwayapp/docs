---
title: Agent Connectors
description: Connect Notion, Linear, Sentry, or your own MCP server to Railway's agent, then attach them as context in dashboard chat and dev.new.
---

<Banner variant="primary">Agent Connectors are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

A connector gives [Railway's agent](/ai/railway-agent) access to a tool you already use. Connect Notion, Linear, or Sentry in a click, or point Railway at any remote MCP server you run, and the agent can read from it while it works on your projects.

Connectors point the opposite way from the [plugins and connectors](/ai/plugins-and-connectors) that put Railway inside Claude or ChatGPT. Those give an outside assistant access to Railway. Agent Connectors give Railway's agent access to outside tools.

Railway uses two terms for this. You connect a connector once in workspace settings, and you attach it as context in the conversation where you want it.

## Quick start

Three steps take you from nothing to an agent that can read your other tools.

### 1. Open your connectors

Navigate to your workspace **Settings**, then **Agents**. The **Your Connectors** section lists what Railway offers and any servers you've added.

### 2. Connect a tool

Click **Connect** on Notion, Linear, or Sentry. Railway opens the vendor's sign-in page in a popup, and the card reports how many tools the server exposes once you approve.

### 3. Attach it to a conversation

Open the **Contexts** picker beside the model picker in chat. A connector you just added is attached by default, so it's ready to use. The picker is where you turn one off for a conversation, or turn it back on.

## Available connectors

Railway offers three connectors that need nothing beyond signing in:

| Connector | What the agent can do |
|-----------|-----------------------|
| Notion | Search pages and databases |
| Linear | Read issues, projects, and cycles |
| Sentry | Pull issues and stack traces |

Each is a hosted MCP server run by the vendor. Connecting registers the same server you could add by hand, then runs the authentication for you. Anything else you want the agent to reach, you add as a custom MCP server.

## Connect a custom MCP server

Any remote MCP server can be a connector. Railway dials it from its own infrastructure, which sets the requirements:

- A public `https` address reachable from the internet
- Streamable HTTP transport, though an SSE endpoint also works
- Authentication by OAuth or by a static header

Servers on `localhost` or inside a private network aren't supported, because Railway connects from outside your network. Neither are stdio servers, which have no address to dial. To reach a local server, expose it as a [Railway service](/services) with a [public domain](/networking/public-networking) and add that address.

### Add a server

Railway checks the connection as soon as you save, so you find out whether the address and credentials work without a separate test step.

1. Navigate to your workspace **Settings**, then **Agents**.
2. Click **Connect** on the **Custom MCP Servers** card, or **Manage** if you've added servers before.
3. Click **Add server**.
4. Enter a **Name**. Use lowercase letters, digits, hyphens, and underscores, up to 32 characters.
5. Enter the server **URL**, for example `https://mcp.example.com/mcp`.
6. Optional: Click **Add header** and enter a static token, such as `Authorization` and `Bearer your-token`.
7. Click **Add server**. Railway runs a connection check and reports the tool count on the row.

Adding a server requires the Member role in the workspace.

### Choose the name carefully

The name is the namespace for the server's tools. A server named `linear` exposes its tools to the agent as `linear_list_issues`, `linear_create_issue`, and so on, which is how the agent tells two servers apart when both offer a tool called `search`.

The name is permanent. To change it, remove the server and add it again.

### Authenticate the server

Railway supports two ways to authenticate, and a server that needs neither works as soon as you add it.

For OAuth, click **Authenticate** on the row. Railway discovers the server's authorization server, registers itself, and completes the exchange in a popup, so there's no client ID or secret to paste. Railway refreshes the token in the background from then on.

For a static token, add a header instead. Headers are encrypted at rest and can be replaced but never read back. When a server has both a stored OAuth token and an `Authorization` header, OAuth takes precedence.

Two cases need a header rather than OAuth:

- The server's authorization server doesn't support automatic client registration.
- The server issues no refresh token, so an OAuth connection stops working when its access token expires.

### Edit or remove a server

Rows offer **Edit** and **Remove**, and each has a consequence worth knowing before you click:

- Changing the URL clears the server's OAuth connection. Authenticate again after saving.
- Header rows you add on edit replace every stored header. Leave them empty to keep the ones already stored.
- Clearing **Enabled** keeps the row but takes the server's tools away from the agent.
- Removing a server deletes its stored headers and tokens, and the agent loses its tools right away.

## Attach connectors as context

A connected server does nothing until it's attached to the conversation you're having. Railway attaches a connector by default the first time it becomes available, and remembers your choice after that, including a choice to attach nothing.

### In the dashboard

The chat composer has a **Contexts** picker beside the model picker, showing a count when anything is attached. Select or clear connectors there. Railway re-checks the selection on every message, so a connector you clear stops being usable immediately.

### In dev.new

<a href="https://dev.new" target="_blank">dev.new</a> builds an app from a prompt in a cloud dev environment and ships it to a URL on Railway. The same connectors reach the agent building your app.

Click **+** in the composer, then **Context**, and select the connectors you want. **Manage connectors…** opens the workspace settings page described above.

Timing works differently here. The agent inside a running app reads its tool list once when the app boots, so a connector you attach reaches it after the app sleeps (about 15 minutes idle) and wakes again. Detaching applies right away. When no app exists yet, whatever you select is attached at the moment Railway creates it.

Anonymous trial apps have no workspace behind them, so the picker appears once you sign in and claim the app.

## How connectors work

Four rules describe how a connector behaves.

### Connectors are personal

A connector belongs to you, not to the workspace it lives in. Other members never see your servers or their credentials, and your connector never runs for a teammate's agent. Everyone who wants a tool connects it themselves.

### Attachment is the gate

The agent can only call tools from connectors attached to the conversation. Railway resolves that list server-side on each message, scoped to the person the agent is acting for, so an available but unattached connector stays out of reach.

### Third-party results are treated as data

Railway tells the agent that connector results come from third parties, not from Railway. The agent is instructed to treat everything they return strictly as information, never to act on instructions embedded in a tool result, and never to send secrets or credentials to those tools.

### Failures don't break a run

When a connector's authentication expires or its server can't be reached, the agent loses that server's tools for the run and keeps going. It reports that the connector is attached but unavailable, gives the reason, and points you back at **Your Connectors** to fix it.

## Limits

Railway caps what a person can register and how many tools reach a single run:

| Limit | Value |
|-------|-------|
| MCP servers per person, per workspace | 20 |
| Headers per server | 10 |
| Header value length | 4,096 characters |
| Server name length | 32 characters |
| Tools per server | 40 |
| Tools across all attached servers | 100 |
| Connection timeout | 30 seconds |

A server offering more than 40 tools is truncated alphabetically. Once attached servers total more than 100 tools, later servers contribute none, so attach the connectors a conversation needs rather than everything you own.

## Troubleshooting

Each connector row reports its own state, so start there when something isn't working. The cases below cover what those states usually mean.

<Collapse title="Why didn't the authentication popup open?">
Your browser blocked it. Allow popups for `railway.com` and click **Authenticate** again.
</Collapse>

<Collapse title="Why does a server I just added say it needs authentication?">
The server requires credentials and has none yet. Click **Authenticate** to connect over OAuth, or edit the server and add an `Authorization` header.
</Collapse>

<Collapse title="Why did a working connector stop authenticating?">
Access tokens expire. Railway refreshes them automatically when the server issues a refresh token, and reports that the connection expired when it doesn't. Click **Re-authenticate** on the row to restore it.
</Collapse>

<Collapse title="Why can't Railway reach my server?">
Railway connects from its own infrastructure, so the server needs a public `https` address. An address on `localhost` or inside a private network isn't reachable, and neither is a server behind a VPN.
</Collapse>

<Collapse title="Why can't my teammate use a connector I added?">
Connectors are personal. Your credentials are never shared with other members of the workspace, so each person connects the tools they want their own agent to use.
</Collapse>

<Collapse title="Why is the Agents settings page missing?">
The section is gated on Priority Boarding, so enable it on the <a href="https://railway.com/account/feature-flags" target="_blank">Feature Flags page</a>. The Railway mobile app hides the page entirely, because connector authentication needs a desktop browser.
</Collapse>
