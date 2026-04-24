---
title: Railway Agent
description: Chat with the Railway Agent to manage services, diagnose failures, and ship fixes directly from the Railway dashboard.
---

The Railway Agent is a chat-based AI assistant built into the Railway dashboard. It can operate the platform on your behalf: creating and configuring services, inspecting deployments, diagnosing failures, and opening pull requests to fix broken builds.

## What the agent can do

The agent has access to the same primitives you do, so it can act across your entire project. The agent can:

- Create services, set variables, connect databases, wire up networking, and adjust resource limits.
- List projects, environments, services, and deployments, and read logs or metrics.
- Walk through a failing deployment, read build and runtime logs, and explain what went wrong.
- Identify the cause of a failed deployment and open a pull request against your repository with a proposed fix.

## Automatic deployment diagnosis

When a deployment fails, the agent can automatically investigate. It reads the build and runtime logs, correlates them with your service configuration and recent code changes, and produces a short explanation of the failure.

If the fix is in your code, the agent can open a pull request with the change so you can review and merge it.

## Pricing

Usage of the Railway Agent is billed based on the underlying LLM tokens consumed, at the exact per-token rates published on <a href="https://www.anthropic.com/pricing" target="_blank">anthropic.com/pricing</a>, with no markup. See [Pricing](/pricing#railway-agent) for details.
