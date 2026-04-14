---
title: Self-Host Open WebUI
description: Deploy Open WebUI on Railway to get a ChatGPT-like interface that connects to OpenAI, Anthropic, and other LLM providers. Includes persistent storage and authentication setup.
date: "2026-04-14"
tags:
  - ai
  - open-webui
  - docker
  - self-hosted
topic: ai
---

[Open WebUI](https://openwebui.com) is an open-source chat interface for interacting with LLMs. It provides a ChatGPT-like experience that you control, with support for multiple model providers, conversation history, file uploads, and user management.

Open WebUI is commonly paired with Ollama for local model inference, but Railway does not offer GPU instances. This guide configures Open WebUI to connect to external LLM APIs (OpenAI, Anthropic, etc.) instead.

## What you will set up

- An Open WebUI instance running from the official Docker image
- Persistent storage for conversation history and uploaded files
- Connection to external LLM APIs (not Ollama)
- A public domain for accessing the chat interface

## One-click deploy from a template

Railway has an Open WebUI template that provisions the setup in one step.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/open-webui)

After deploying, skip to [Configure LLM providers](#configure-llm-providers).

If you prefer manual setup, continue below.

## Deploy from a Docker image

1. Create a new project in Railway.
2. Click **+ New** and select **Docker Image**.
3. Enter `ghcr.io/open-webui/open-webui:main` as the image name.
4. Railway will pull the image and create a service.

## Configure environment variables

Add the following variables under the **Variables** tab:

| Variable | Value | Description |
| --- | --- | --- |
| `PORT` | `8080` | Port for the web interface |
| `OLLAMA_BASE_URL` | (leave empty) | Disables Ollama connection attempts |
| `OPENAI_API_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible API endpoint |
| `OPENAI_API_KEY` | Your API key | API key for OpenAI (or compatible provider) |
| `WEBUI_SECRET_KEY` | A random string | Secret key for session management |
| `DATA_DIR` | `/app/backend/data` | Directory for persistent data |

To use Anthropic or other providers, configure them through the Open WebUI settings after first login. Open WebUI supports multiple concurrent providers.

## Attach persistent storage

Open WebUI stores conversations, uploaded files, and user data in `/app/backend/data`. Without a volume, this data is lost on each deployment.

1. Open the service in your project.
2. Go to the **Volumes** tab.
3. Click **Add Volume**.
4. Set the mount path to `/app/backend/data`.
5. Choose a size (2 GB is a reasonable starting point).
6. Click **Add**.

## Set up a public domain

1. Go to the **Settings** tab of the service.
2. Under **Networking**, click **Generate Domain**.
3. Open the domain in your browser.

## Configure LLM providers

1. On first access, create an admin account.
2. Go to **Settings > Connections**.
3. Verify your OpenAI connection is active, or add additional providers.
4. Models from connected providers will appear in the model selector dropdown.

Open WebUI supports any OpenAI-compatible API endpoint. This includes providers like Anthropic (via their OpenAI-compatible endpoint), Together AI, Groq, and Fireworks.

## GPU and Ollama

Open WebUI is often used with Ollama for running models locally. Railway does not offer GPU instances, so running Ollama with production-sized models is not practical on Railway. If you need local inference, connect Open WebUI on Railway to an Ollama instance running on a GPU-equipped server elsewhere by setting `OLLAMA_BASE_URL` to that server's address.

## Next steps

- [Manage Volumes](/volumes): Resize or back up your persistent storage.
- [Set up a custom domain](/networking/domains): Use your own domain for the interface.
- [Monitor your app](/observability): View logs and metrics.
- [Self-Host Flowise](/guides/flowise): A visual builder for LLM chains and workflows.
