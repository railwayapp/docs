---
title: Bring Your Own Models
description: Sign in with ChatGPT or OpenRouter to run the Railway Agent, cloud agents, dev.new, and the Slack and Discord bots on your own model account.
---

<Banner variant="primary">Bring Your Own Models is available through <a href="/platform/priority-boarding" target="_blank">Priority Boarding</a>. Breaking changes may occur.</Banner>

Bring Your Own Models lets you run Railway's AI features on a model account you already have. Sign in with your ChatGPT subscription or your OpenRouter account, pick a model, and the [Railway Agent](/ai/railway-agent) uses it everywhere it runs:

- Railway Agent chat in the dashboard
- The Railway Agent harness on [cloud agents](/cloud-agents)
- Apps you build on <a href="https://dev.new" target="_blank">dev.new</a>
- The [Slack and Discord](/ai/agent-integrations) bots

Requests on your own account are billed by that provider, not by Railway. Railway models stay available alongside yours, so you can switch between them at any time.

## Providers

Railway supports two sign-in providers. Each one has its own Priority Boarding flag, so you can enable either or both.

| Provider | What you connect | Priority Boarding flag |
|----------|------------------|------------------------|
| ChatGPT | Your ChatGPT subscription | Bring Your Own Subscription: ChatGPT |
| OpenRouter | Your OpenRouter account | Bring Your Own Models: OpenRouter |

### ChatGPT

Signing in with ChatGPT connects your ChatGPT subscription. Requests count against your ChatGPT plan's usage limits instead of producing a Railway bill.

The connection belongs to your Railway account, so one sign-in covers every workspace you're a member of.

### OpenRouter

Signing in with OpenRouter gives Railway access to models from several vendors through one account, including OpenAI, Anthropic, xAI, Z.ai, and Moonshot AI. OpenRouter bills the requests to your OpenRouter credits.

Signing in creates an API key labeled **Railway Agents** in your OpenRouter account. Railway stores it encrypted and shows only its last four characters. The key is saved for the workspace you connected it in, so connect OpenRouter again in each workspace where you want to use it.

## Get started

Turning on a provider takes three steps: enable the flag, sign in, and choose a default model.

### 1. Enable the flag

Open the <a href="https://railway.com/account/feature-flags" target="_blank">Feature Flags page</a> and turn on **Bring Your Own Subscription: ChatGPT**, **Bring Your Own Models: OpenRouter**, or both.

### 2. Sign in

1. Navigate to <a href="https://railway.com/account/agents" target="_blank">Account Settings, then **Agents**</a>, with the workspace you want to configure selected.
2. Find the **Providers** section under **Models**.
3. Click **Connect** on the provider you want.

The sign-in flow differs by provider.

For ChatGPT, Railway shows an activation code. Click **Continue to ChatGPT**, enter the code, and approve the connection. The card changes to **Connected as** your ChatGPT email once you approve.

For OpenRouter, Railway opens openrouter.ai in a popup. Approve the connection there, and the card changes to **Connected** with the key's last four characters.

### 3. Choose a default model

Select a model from **Default Model** on the same page. The list groups models by account: **Railway**, **OpenAI Subscription**, and **OpenRouter API Key**.

The default model applies to Railway Agent chat, the Slack and Discord bots, and the cloud agents and dev.new apps you own in the selected workspace. The model picker in chat overrides it for a single message.

## Where your models run

Signing in makes your models available on every surface that runs the Railway Agent. A few rules decide which account a request uses.

### Dashboard chat and chat bots

Railway Agent chat uses your default model unless you pick another one in the chat's model picker. The Slack and Discord bots use the default model of the person who mentioned **@Railway**.

### Cloud agents and dev.new

Cloud agents running the Railway Agent harness, and apps on dev.new, use their owner's model settings and credentials. That holds even when another workspace member uses the agent or app, so a teammate's prompts to your agent run on your account.

Inside a cloud agent, your models appear in the harness's model list, labeled **(ChatGPT)** or **(Personal key)**.

The harness talks to each provider over a specific API, which limits the OpenRouter models it can run. OpenRouter's OpenAI and Anthropic models are available in dashboard chat and the bots but not in cloud agents. To use GPT or Claude models in a cloud agent, use ChatGPT sign-in or a Railway model.

## Available models

The model list in **Default Model** is the authoritative list for your account. Railway curates the models offered for each provider:

| Provider | Models |
|----------|--------|
| ChatGPT | GPT-6 Astra, GPT-6.1 Sol, GPT-6 Luna |
| OpenRouter | GPT-6 Astra, GPT-6.1 Sol, GPT-6 Luna, Claude Opus 5.5, Claude Sonnet 5.5, Grok 4.7, Muse Spark 1.3, GLM 5.3, Kimi K3 |

Reasoning level is set under **Default Reasoning Level** when the selected model supports it.

## Billing

Railway doesn't charge for tokens processed on your own account. ChatGPT requests count against your ChatGPT plan, and OpenRouter requests are paid from your OpenRouter credits.

Railway models keep their [standard pricing](/pricing#railway-agent), so switching back to a Railway model resumes Railway billing for those requests.

## Disconnect a provider

Click **Disconnect** on the provider's card. The effects differ by provider.

- Disconnecting ChatGPT removes the connection from every workspace and resets any default model that used it to the Railway default.
- Disconnecting OpenRouter removes the key from this workspace only. The key stays active in your OpenRouter account until you delete it at <a href="https://openrouter.ai/settings/keys" target="_blank">openrouter.ai/settings/keys</a>.

## Troubleshooting

Most problems show up as a status line on the provider's card in **Agents** settings, so start there.

<Collapse title="ChatGPT sign-in fails to start">
Device code login is disabled for your ChatGPT account or workspace. Enable it in ChatGPT's security settings, or ask your ChatGPT workspace admin to allow it, then click **Connect** again.
</Collapse>

<Collapse title="The ChatGPT card says authentication expired">
OpenAI ended the session. Click **Re-Authenticate** and approve the new activation code. Requests on the subscription fail until you do.
</Collapse>

<Collapse title="The OpenRouter popup didn't open">
Your browser blocked it. Allow popups for `railway.com` and click **Connect** again.
</Collapse>

<Collapse title="An OpenRouter model returns an error">
Check your OpenRouter credit balance and the key's spending limit at <a href="https://openrouter.ai/settings/keys" target="_blank">openrouter.ai/settings/keys</a>. If you deleted the **Railway Agents** key in OpenRouter, disconnect and connect again to create a new one.
</Collapse>

<Collapse title="I don't see the Providers section">
Enable the provider's flag on the <a href="https://railway.com/account/feature-flags" target="_blank">Feature Flags page</a>, then reload **Agents** settings. The section appears once at least one provider flag is on.
</Collapse>

<Collapse title="My cloud agent doesn't list my OpenRouter GPT or Claude models">
The Railway Agent harness can't reach those models through OpenRouter. Use ChatGPT sign-in for GPT models, or a Railway model for Claude.
</Collapse>
