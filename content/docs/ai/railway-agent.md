---
title: Railway Agent
description: Chat with the Railway Agent to manage services, diagnose failures, and ship fixes — directly from the Railway dashboard.
---

The Railway Agent is a chat-based AI assistant built into the Railway dashboard. It can operate the platform on your behalf: creating and configuring services, inspecting deployments, diagnosing failures, and even opening pull requests to fix broken builds.

<!-- screenshot: Railway Agent chat panel open in the dashboard -->

## What it can do

The agent has access to the same primitives you do, which means it can act across your entire project:

- **Manage services** — create services, set variables, connect databases, wire up networking, and adjust resource limits.
- **Inspect state** — list projects, environments, services, deployments, and read logs or metrics.
- **Diagnose issues** — walk through a failing deployment, read build and runtime logs, and explain what went wrong.
- **Fix issues** — when a deployment fails, the agent can identify the cause and open a pull request against your repository with a proposed fix.

## Automatic deployment diagnosis

When a deployment fails, the agent can automatically investigate. It reads the build and runtime logs, correlates them with your service configuration and recent code changes, and produces a short explanation of the failure.

If the fix is in your code, the agent can open a pull request with the change so you can review and merge it.

<!-- screenshot: Agent-authored PR fixing a failed deployment -->

## Using the agent

Open the agent panel from the Railway dashboard and describe what you want in natural language. Examples:

- "Add a Postgres database to this service and wire up `DATABASE_URL`."
- "Why did the last deployment on `api` fail?"
- "Set up a staging environment that mirrors production."

The agent will explain what it's about to do before making changes that affect your infrastructure.

<!-- screenshot: Agent proposing a change with a confirm step -->

## Pricing

Usage of the Railway Agent is billed based on the underlying LLM tokens consumed, at the exact per-token rates published on <a href="https://www.anthropic.com/pricing" target="_blank">anthropic.com/pricing</a> — no markup. See [Pricing → Railway Agent](/pricing#railway-agent) for details.
