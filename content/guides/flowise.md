---
title: Self-Host Flowise
description: Deploy Flowise on Railway with persistent storage and authentication. Build LLM chains, agents, and chatbots through a visual drag-and-drop interface without managing servers.
date: "2026-04-14"
tags:
  - ai
  - flowise
  - docker
  - self-hosted
topic: ai
---

[Flowise](https://flowiseai.com) is an open-source tool for building LLM-powered applications through a visual drag-and-drop interface. You can create chatbots, RAG pipelines, and multi-step agent workflows by connecting nodes, without writing application code.

Flowise runs on Railway as a CPU-based service. The LLM chains you build in Flowise call external APIs (OpenAI, Anthropic, HuggingFace Inference, etc.) for model inference. No models run locally on Railway.

## What you will set up

- A Flowise instance running from the official Docker image
- Persistent storage via a Railway [Volume](/volumes)
- Authentication to protect the Flowise editor
- A public domain for accessing the interface

## One-click deploy from a template

Railway has a Flowise template that provisions the full setup in one step.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/flowise)

After deploying, skip to [Configure authentication](#configure-authentication) to secure your instance.

If you prefer to set things up manually, continue with the steps below.

## Deploy from a Docker image

1. Create a new project in Railway.
2. Click **+ New** and select **Docker Image**.
3. Enter `flowiseai/flowise` as the image name and press Enter.
4. Railway will pull the image and create a service.

## Configure environment variables

Add the following variables to your Flowise service under the **Variables** tab:

| Variable | Value | Description |
| --- | --- | --- |
| `PORT` | `${{PORT}}` | Binds Flowise to Railway's injected port |
| `FLOWISE_USERNAME` | Your username | Username for editor authentication |
| `FLOWISE_PASSWORD` | Your password | Password for editor authentication |
| `APIKEY_PATH` | `/root/.flowise` | Path for storing API keys |
| `SECRETKEY_ENCRYPT` | A random string | Encryption key for stored credentials |
| `LOG_LEVEL` | `info` | Log verbosity (debug, info, warn, error) |

## Attach persistent storage

Flowise stores chatflow definitions, credentials, and configuration in `/root/.flowise` by default. Without a volume, this data is lost on every deployment.

1. Open the Flowise service in your project.
2. Go to the **Volumes** tab.
3. Click **Add Volume**.
4. Set the mount path to `/root/.flowise`.
5. Choose a size appropriate for your usage (1 GB is a reasonable starting point).
6. Click **Add**.

## Set up a public domain

1. Go to the **Settings** tab of the Flowise service.
2. Under **Networking**, click **Generate Domain**.
3. Open the domain in your browser to access the Flowise editor.

## Configure authentication

If you set `FLOWISE_USERNAME` and `FLOWISE_PASSWORD`, the editor requires authentication. Without these variables, anyone with the URL can access and modify your chatflows.

After logging in, you can also generate API keys within Flowise to protect your chatflow API endpoints for external integrations.

## Add LLM API keys

Flowise does not include LLM models. You provide API keys for external providers within the Flowise editor:

1. Open a chatflow in the editor.
2. Add an LLM node (e.g., ChatOpenAI, ChatAnthropic).
3. Click the node and enter your API key in the credentials section.

Flowise encrypts stored credentials using `SECRETKEY_ENCRYPT`.

## Next steps

- [Manage Volumes](/volumes): Resize or back up your persistent storage.
- [Set up a custom domain](/networking/domains): Use your own domain instead of the generated Railway domain.
- [Monitor your app](/observability): View logs and metrics for your Flowise instance.
