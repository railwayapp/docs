---
title: Self Hosted Server
---

You can deploy to a separate server (e.g. AWS, GCP, DigitalOcean) and still
connect to your Railway plugins. On the server, you can either login to the CLI
with `railway login` or use a [project token](/deployment/project-tokens). Then prefix the
server start command with `railway run`.

```shell:always
railway run start-server
```
