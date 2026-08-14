---
title: Agent Connectors
description: Connect Notion, Linear, Sentry, or your own MCP server to Railway's agent, then attach them as context in dashboard chat and dev.new.
---

<Banner variant="primary">Agent Connectors are available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

A connector gives [Railway's agent](/ai/railway-agent) access to a tool you already use. Connect Notion, Linear, or Sentry from the catalog, or point Railway at any remote MCP server you run, and the agent can read from it while it works on your projects. Ask it why a deploy broke and it can pull the Sentry issue, or hand it a Linear ticket to work from.

Railway uses two words for this, and they mean different things. A connector is what you set up once in workspace settings. Context is what you attach to a particular conversation.

**Note:** Don't confuse these with the [plugins and connectors](/ai/plugins-and-connectors) that put Railway inside Claude or ChatGPT. Those point the other way, giving an outside assistant access to Railway.

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

Each is a hosted MCP server run by the vendor, so what the agent can do with one is whatever that vendor's server exposes. Connecting registers the same server you could have added by hand and runs the authentication for you. For anything else, add a custom MCP server.

## Connect a custom MCP server

Any remote MCP server can be a connector. Railway dials it from its own infrastructure, which sets the requirements:

- A public `https` address reachable from the internet
- Streamable HTTP transport, though an SSE endpoint also works
- Authentication by OAuth or by a static header

Servers on `localhost` or inside a private network aren't supported, because Railway connects from outside your network. Neither are stdio servers, which have no address to dial. To reach a local server, expose it as a [Railway service](/services) with a [public domain](/networking/public-networking) and add that address.

### Add a server

The connection is checked as soon as you save, so there's no separate test step to run.

1. Navigate to your workspace **Settings**, then **Agents**.
2. Click **Connect** on the **Custom MCP Servers** card, or **Manage** if you've added servers before.
3. Click **Add server**.
4. Enter a **Name**. Use lowercase letters, digits, hyphens, and underscores, up to 32 characters.
5. Enter the server **URL**, for example `https://mcp.example.com/mcp`.
6. Optional: Click **Add header** and enter a static token, such as `Authorization` and `Bearer your-token`.
7. Click **Add server**. Railway runs a connection check and reports the tool count on the row.

Adding a server requires the Member role in the workspace.

### Choose the name carefully

The name is the namespace for the server's tools. A server named `linear` reaches the agent as `linear_list_issues`, `linear_create_issue`, and so on, which is how the agent keeps two servers apart when both offer a tool called `search`.

Pick one you'll recognize later, because the name is permanent. Changing it means removing the server and adding it again.

### Authenticate the server

Railway supports two ways to authenticate, and a server that needs neither works as soon as you add it.

For OAuth, click **Authenticate** on the row. Railway finds the server's authorization server, registers itself, and completes the exchange in a popup, so there's no client ID or secret to paste. The token then refreshes in the background.

For a static token, add a header instead. Headers are encrypted at rest and can be replaced but never read back. When a server has both a stored OAuth token and an `Authorization` header, OAuth wins.

Two cases need a header rather than OAuth:

- The server's authorization server doesn't support automatic client registration.
- The server issues no refresh token, so an OAuth connection stops working when its access token expires.

### Edit or remove a server

Rows offer **Edit** and **Remove**. Both carry consequences that aren't obvious from the buttons:

- Changing the URL clears the server's OAuth connection. Authenticate again after saving.
- Header rows you add on edit replace every stored header. Leave them empty to keep the ones already stored.
- Clearing **Enabled** keeps the row but takes the server's tools away from the agent.
- Removing a server deletes its stored headers and tokens, and the agent loses its tools right away.

## Attach connectors as context

A connected server does nothing until it's attached to the conversation you're having. Railway attaches one for you the first time it becomes available, so you usually don't have to touch the picker at all. When you do change the selection, how long that change lasts depends on where you made it.

### In the dashboard

The chat composer has a **Contexts** picker beside the model picker, showing a count when anything is attached. Select or clear connectors there. Railway re-checks the selection on every message, so clearing one puts it out of reach right away.

That choice lasts for the session. Reloading the dashboard starts over with everything available attached.

### In dev.new

<a href="https://dev.new" target="_blank">dev.new</a> builds an app from a prompt in a cloud dev environment and ships it to a URL on Railway. The same connectors reach the agent building your app.

Click **+** in the composer, then **Context**, and select the connectors you want. **Manage connectors…** opens the workspace settings page described above.

Selections here are saved per app, so they survive a reload and are waiting for you when you come back.

Timing works differently too. The agent inside a running app reads its tool list once when the app boots, so a connector you attach reaches it after the app sleeps (about 15 minutes idle) and wakes again. Detaching applies right away. When no app exists yet, whatever you select is attached at the moment Railway creates it.

Anonymous trial apps have no workspace behind them, so the picker appears once you sign in and claim the app.

## How connectors work

Four behaviors are worth understanding before you depend on a connector day to day.

### Ownership is personal

A connector belongs to you, not to the workspace it lives in. Other members don't see your servers or their credentials, and your connector never runs for a teammate's agent, so everyone who wants a tool connects it themselves.

Railway checks this on both sides. The list of available connectors is scoped to the person the agent is acting for, and an attachment pointing at someone else's server resolves to nothing.

### Attaching controls what the agent can call

The agent reaches only the tools belonging to connectors attached to that conversation. Railway resolves the list server-side on every message rather than trusting what the composer sent, so a connector you've connected but not attached stays out of reach.

### Results from a connector are treated as data

Railway tells the agent that connector results come from third parties rather than from Railway, and instructs it to treat everything they return strictly as information. The agent is told not to act on instructions embedded in a tool result, and not to send secrets or credentials to those tools.

That guidance is a mitigation, not a guarantee. Connect servers you trust with the data your agent can see.

### A broken connector doesn't break the run

Expired authentication and unreachable servers are handled the same way: the agent loses that server's tools and carries on with the rest. It reports that the connector is attached but unavailable, gives the reason, and points you back at **Your Connectors**.

A connector in this state still appears in the picker and still attaches. You find out it's broken when the agent tells you, or from the status on its row in settings.

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

Both tool caps cut silently. A server offering more than 40 tools keeps the first 40 by alphabetical order, and once the attached servers reach 100 tools between them, the servers after that contribute nothing. Attaching a couple of tool-heavy connectors is enough to reach the ceiling, so attach what a conversation needs rather than everything you've connected.

## Troubleshooting

Every server keeps a status on its row in settings, so start there when something isn't working.

<Collapse title="Why didn't the authentication popup open?">
Your browser blocked it. Allow popups for `railway.com` and click **Authenticate** again.
</Collapse>

<Collapse title="A server I just added says it needs authentication. What's missing?">
It requires credentials and doesn't have any yet. Click **Authenticate** to connect over OAuth, or edit the server and add an `Authorization` header.

If OAuth reports that the server doesn't support automatic client registration, a header is the only option for that server.
</Collapse>

<Collapse title="What happens when a token expires?">
Railway refreshes tokens in the background, provided the server issued a refresh token when you first authenticated. Servers that issue no refresh token stop working once the access token expires, and the row reports it. Either way, **Re-authenticate** on the row restores the connection.
</Collapse>

<Collapse title="Why can't Railway reach my server?">
Railway connects from its own infrastructure, so the server needs a public `https` address. An address on `localhost` or inside a private network isn't reachable, and neither is a server behind a VPN.
</Collapse>

<Collapse title="Can a teammate use a connector I added?">
No. Connectors are personal, and your credentials aren't shared with the rest of the workspace, so each person connects the tools they want their own agent to use.
</Collapse>

<Collapse title="Where is the Agents settings page?">
It sits under workspace **Settings**, and appears once Priority Boarding is enabled on the <a href="https://railway.com/account/feature-flags" target="_blank">Feature Flags page</a>. The Railway mobile app hides it, because authenticating a connector needs a desktop browser.
</Collapse>
