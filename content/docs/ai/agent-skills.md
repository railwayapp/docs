---
title: Agent Skills
description: Agent skills for interacting with Railway directly from your AI coding assistant.
---

Agent skills for interacting with [Railway](https://railway.com) directly from your AI coding assistant.

## What are agent skills?

Agent Skills are an open format for extending AI coding assistants with specialized knowledge and capabilities. They follow the [Agent Skills](https://agentskills.io) specification.

Skills are markdown files (`SKILL.md`) that contain:
- **Metadata** in YAML frontmatter
- **Instructions** with step-by-step guidance for the AI agent
- **Examples** showing expected behavior

When you ask your AI assistant something like "deploy to Railway" or "check my project status," the agent automatically selects the appropriate skill based on your intent and follows its instructions.

### Supported tools

- <a href="https://claude.ai/code" target="_blank">Claude Code</a>
- <a href="https://openai.com/codex" target="_blank">OpenAI Codex</a>
- <a href="https://opencode.ai" target="_blank">OpenCode</a>
- <a href="https://cursor.com" target="_blank">Cursor</a>

## Installation

```bash
curl -fsSL railway.com/skills.sh | bash
```

You can also install via <a href="https://skills.sh" target="_blank">skills.sh</a>:

```bash
npx skills add railwayapp/railway-skills
```

Supports Claude Code, OpenAI Codex, OpenCode, and Cursor. Re-run to update.

**Note:** For Claude Code, you can also install through the [Claude Code plugin marketplace](/ai/claude-code-plugin).

## The use-railway skill

The repository ships one skill called `use-railway`. It uses a route-first design where intent routing is defined in the skill file and execution details are split into action-oriented references.

### Workflow coverage

The `use-railway` skill covers the following areas:

- **Project and service setup** - Create projects, add services, scaffold code for deployment, and link existing projects
- **Deploy and release operations** - Push code to Railway, manage deployments, and handle the deployment lifecycle
- **Troubleshooting and recovery** - View build and deploy logs, redeploy, restart, or remove deployments
- **Environment config and variables** - Query and modify service configuration, environment variables, build/deploy commands, replicas, health checks, and restart policies
- **Networking and domains** - Add Railway-provided domains, configure custom domains, and manage domain settings
- **Status and observability** - Check project status, query resource usage metrics (CPU, memory, network, disk), and monitor services
- **Projects and workspaces** - List projects, switch between projects, and manage project settings
- **Docs and community search** - Fetch Railway documentation and search Central Station for community threads and discussions

## Source

The Railway agent skills are open-source and available on <a href="https://github.com/railwayapp/railway-skills" target="_blank">GitHub</a>.
