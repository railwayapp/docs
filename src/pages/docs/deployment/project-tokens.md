---
title: Project Tokens
---

Project tokens can be used in environments where you cannot login (e.g. remote
servers or CI). You can create project tokens for a specific [Railway
environment](/docs/environments) on the project page.

Project tokens allow the CLI to access all the environment variables associated
with a specific project and environment. Use the token by setting the
`RAILWAY_TOKEN` environment variable and then running `railway run`.

```bash
RAILWAY_TOKEN=XXXX railway run
```
