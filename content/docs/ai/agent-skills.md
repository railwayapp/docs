---
title: Agent Skills
description: Agent skills for interacting with Railway directly from your AI coding assistant.
---

Agent skills for interacting with [Railway](https://railway.com) directly from your AI coding assistant.

## What are agent skills?

Agent Skills are an open format for extending AI coding assistants with specialized knowledge and capabilities. They follow the [Agent Skills](https://agentskills.io) specification.

Skills are markdown files (`SKILL.md`) that contain:
- **Metadata** - Name and description in YAML frontmatter
- **Instructions** - Step-by-step guidance for the AI agent
- **Examples** - Concrete examples showing expected behavior

When you ask your AI assistant something like "deploy to Railway" or "check my project status", the agent automatically selects the appropriate skill based on your intent and follows its instructions.

### Supported tools

- [Claude Code](https://claude.ai/code)
- [OpenAI Codex](https://openai.com/codex)
- [OpenCode](https://opencode.ai)
- [Cursor](https://cursor.com)

## Installation

```bash
curl -fsSL railway.com/skills.sh | bash
```

You can also install via [skills.sh](https://skills.sh):

```bash
npx skills add railwayapp/railway-skills 
```

This will allow you to pick and choose which skills to install.

Supports Claude Code, OpenAI Codex, OpenCode, and Cursor. Re-run to update.

---

## Skills

### Project management

#### Status
Check Railway project status, services, and deployments. Use for "is it running", "what's deployed", or deployment status queries.

#### Projects
List all projects, switch between projects, rename projects, enable/disable PR deploys, and modify project settings.

#### New
Create new projects and services, scaffold code for deployment, link existing projects. Handles initial setup and adding services to existing projects.

### Service operations

#### Service
Check service status, rename services, change service icons, link different services, or create services with Docker images.

#### Deploy
Push local code to Railway using `railway up`. Supports detach mode (default) and CI mode for watching builds.

#### Domain
Add Railway-provided domains, configure custom domains, view current domains, or remove domains from services.

### Configuration

#### Environment
Query and modify service configuration: environment variables, build/deploy commands, replicas, health checks, restart policies, and source settings. Also handles service deletion.

### Infrastructure

#### Database
Add official Railway databases (Postgres, Redis, MySQL, MongoDB) with pre-configured volumes and connection variables. Handles wiring services to databases.

#### Templates
Search and deploy services from Railway's template marketplace (Ghost, Strapi, n8n, Minio, Uptime Kuma, etc.).

### Monitoring and debugging

#### Metrics
Query resource usage metrics: CPU, memory, network, and disk. Useful for debugging performance issues.

#### Deployment
Manage deployment lifecycle: list deployments, view build/deploy logs, redeploy, restart, or remove deployments.

### Resources

#### Railway-docs
Fetch up-to-date Railway documentation. Use for questions about Railway features, pricing, or how things work.

#### Central-station
Search Railway's Central Station community platform for threads, discussions, and support questions.