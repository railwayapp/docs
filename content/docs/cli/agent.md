---
title: railway agent
description: Interact with the Railway Agent to manage your project using natural language.
---

Interact with the Railway Agent directly from the CLI. Ask questions about your project, create resources, debug issues, and more using natural language. Starts an interactive session by default, or send a single prompt with the `-p` flag.

## Usage

```bash
railway agent [OPTIONS]
```

## Options

| Flag | Description |
|------|-------------|
| `-p, --prompt <MESSAGE>` | Send a single prompt (omit for interactive mode) |
| `--json` | Output response as JSON |
| `--thread-id <ID>` | Continue an existing chat thread |
| `-s, --service <SERVICE>` | Service to scope the conversation to (name or ID) |
| `-e, --environment <ENV>` | Environment to use (defaults to linked environment) |

## Examples

### Start an interactive session

```bash
railway agent
```

### Show logs for your project

```bash
railway agent -p "show me the logs for my project"
```

### Create a database

```bash
railway agent -p "create a PostgreSQL database in this project"
```

### Debug a failing service

```bash
railway agent -p "help me debug why my backend service is failing"
```

### Check deployment status

```bash
railway agent -p "what's the status of my latest deployment?"
```

### Investigate resource usage

```bash
railway agent -p "show me the memory and CPU usage for my services"
```

### Scope to a specific service

```bash
railway agent -p "check the logs for errors" --service backend
```

### Get configuration help

```bash
railway agent -p "what environment variables are set on my project?"
```

### JSON output for scripting

```bash
railway agent -p "list my services and their status" --json
```

### Continue a previous conversation

```bash
railway agent --thread-id <THREAD_ID>
```

## Interactive mode

When run without `-p`, the agent starts an interactive session where you can have a back-and-forth conversation:

```
$ railway agent
Railway Agent (type 'exit' or Ctrl+C to quit)

> You: what services do I have?

Railway Agent: You have 3 services...

> You: show me the logs for the backend

Railway Agent: Here are the recent logs...

> You: exit
```

The agent maintains context within the session, so follow-up questions understand previous messages.

## JSON output

Use `--json` to get a structured response for scripting and automation:

```bash
railway agent -p "list my services" --json
```

Returns a JSON object with:

```json
{
  "threadId": "abc-123",
  "response": "You have 3 services...",
  "toolCalls": [
    {
      "toolName": "environmentStatusTool",
      "args": { ... },
      "result": { ... },
      "isError": false
    }
  ]
}
```

## Authentication

The agent command requires user authentication via `railway login`. Project access tokens (`RAILWAY_TOKEN`) are not supported.

## Related

- [railway logs](/cli/logs)
- [railway status](/cli/status)
- [railway deploy](/cli/deploy)
