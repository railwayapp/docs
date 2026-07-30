---
title: Deploy a Jupyter Server for Team Data Work
description: Run a shared JupyterLab server on Railway with token authentication, a persistent volume for notebooks, and health checks for zero-downtime deploys.
date: "2026-07-29"
tags:
  - jupyter
  - python
  - data-science
  - volumes
topic: integrations
---

A Jupyter server is a long-running web application that hosts notebooks, kernels, and files; your team connects from a browser, and all code executes on the server, not on anyone's laptop. This guide deploys one on Railway that your whole team shares: one Python environment, one set of data files, one pool of compute, instead of "works on my machine" differences across laptops.

The setup includes:

- Token authentication so only your team can open it.
- A volume so notebooks survive redeploys.
- A health check so dependency upgrades deploy with zero downtime.

One constraint up front: Railway services run on CPU. There are no GPUs, so this setup fits data wrangling, analysis, reporting, and classical machine learning, not GPU model training.

## Will long-running cells time out?

No. Jupyter's browser UI talks to kernels over WebSockets, which Railway supports on every service. Those connections are exempt from the idle timeout that applies to plain HTTP requests, so a cell that runs for an hour keeps streaming output to your browser without being cut.

Plain HTTP requests to a service are closed after 5 minutes of no data transfer, and run at most 15 minutes even while transferring. Jupyter's kernel protocol does not hit those limits because the long-lived channel is a WebSocket.

## Create the project files

You need two files. Railway's builder, [Railpack](/builds/railpack), detects `requirements.txt` and builds a Python environment automatically, so no Dockerfile is required.

`requirements.txt`:

```txt
jupyterlab==4.4.5
pandas==2.3.1
matplotlib==3.10.3
```

Add whatever your team analyzes with: `polars`, `scikit-learn`, `duckdb`, database drivers. Pin versions. The server is shared, so an unpinned upgrade breaks everyone at once.

`railway.json`:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "jupyter lab --ip=0.0.0.0 --port=$PORT --no-browser --ServerApp.root_dir=/data --ServerApp.allow_remote_access=True",
    "healthcheckPath": "/api",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

What each flag does:

- `--ip=0.0.0.0` binds all interfaces so Railway's proxy can reach the server.
- `--port=$PORT` listens on the port Railway injects.
- `--ServerApp.root_dir=/data` serves notebooks from the volume mount path you will create below.
- `--ServerApp.allow_remote_access=True` accepts requests whose `Host` header is your public domain. Without it, Jupyter blocks non-local hosts.
- `healthcheckPath: /api` points the health check at Jupyter's version endpoint, which returns 200 without authentication. With a [health check](/deployments/healthchecks) configured, Railway keeps the old deployment serving until the new one is live.

## Deploy the service

From the directory containing both files, using the [Railway CLI](/cli):

```bash
railway init
railway up
```

Or push the two files to a GitHub repository and create a service from it in the dashboard. See [deploying services](/services) for both flows.

The first deploy will crash-loop until the volume and token exist. Set those up next.

## Add a volume for notebooks

Container filesystems on Railway are ephemeral. Every redeploy starts from a fresh image, so notebooks written to the container disk disappear. A [volume](/volumes) persists them.

1. Right-click the service in your project canvas and choose **Attach Volume** (or use the Command Palette with `⌘K`).
2. Set the mount path to `/data`.

The start command above already points Jupyter's root directory at `/data`, so everything your team creates in the JupyterLab file browser lands on the volume.

Two volume behaviors worth knowing:

- Volumes are mounted when the container starts, not during build or pre-deploy. Do not write seed data to `/data` in a build step; it will not persist.
- Volumes cost $0.15 per GB per month, metered per minute.

That persistence has a limit, though: a volume is still a single disk. For datasets you cannot lose, enable [volume backups](/volumes/backups) or keep raw data in a [storage bucket](/storage-buckets) and treat the volume as a working directory.

## Secure the server with a token

A Jupyter server executes arbitrary code. Never expose one without authentication.

Jupyter reads the `JUPYTER_TOKEN` environment variable at startup and requires it for every session. Set it as a [service variable](/variables):

1. Open the service's **Variables** tab.
2. Add `JUPYTER_TOKEN` with a long random value:

```bash
openssl rand -hex 32
```

Once you redeploy, team members open:

```
https://<your-domain>/?token=<value>
```

or paste the token into the login page. Everyone who has the token has full execution access, so treat it like a shared password: store it in your team's secret manager and rotate it when someone leaves. For per-user logins and an admin-managed user list, run [JupyterHub](https://jupyter.org/hub) instead of a single shared server; the volume and networking setup in this guide applies the same way.

## Expose the server on a domain

In the service's **Settings** tab, under **Networking**, generate a Railway-provided domain: a `*.up.railway.app` URL with TLS included. Railway detects the port your server listens on and sets it as that domain's target port. You can replace it with a [custom domain](/networking/domains) later.

If other services in the same environment need to call the Jupyter REST API (for example, a scheduler that executes notebooks), they can use [private networking](/networking/private-networking) at `http://<service-name>.railway.internal:<port>` instead of going over the public internet. Private networking is scoped per environment.

## Size the server for your team

Railway bills for usage: $10 per GB of RAM per month and $20 per vCPU per month, metered by the minute. There is no per-seat charge, so one shared server for five analysts costs the same as for one.

Memory is the number that matters. Every open kernel holds its DataFrames in RAM, and pandas typically needs several times the on-disk size of a dataset. Watch the service's memory graph during a normal working day, then set [replica limits](/pricing/cost-control) with headroom above the observed peak. When a kernel exhausts memory the whole server is at risk, so encourage the team to shut down idle kernels from the JupyterLab kernel sidebar.

If the server sits idle outside working hours, consider [serverless](/deployments/serverless). Railway stops the container after 10 minutes with no outbound traffic and wakes it on the next request. Note that open JupyterLab tabs keep WebSocket traffic flowing, so the server only sleeps once everyone closes their tabs. Notebooks are on the volume, so nothing is lost across sleep and wake cycles.

## Optional: real-time collaboration

JupyterLab supports Google-Docs-style collaborative editing through the `jupyter-collaboration` extension. Add it to `requirements.txt`:

```txt
jupyter-collaboration==4.1.0
```

Redeploy, and multiple people editing the same notebook see each other's cursors and edits live. Without the extension, two people editing one notebook silently overwrite each other on save, so either install it or agree on one-notebook-per-person conventions.

## Verify the deployment

After the deploy goes live:

```bash
curl https://<your-domain>/api
```

should return a JSON version payload like `{"version": "2.16.0"}`. Then open the domain in a browser, authenticate with the token, create a notebook, and run:

```python
import pandas as pd

df = pd.DataFrame({"x": range(5)})
print(df.describe())
```

Redeploy the service and confirm the notebook is still there. That proves the volume mount is correct.

## Next steps

- [Volumes](/volumes) covers mount paths, sizing, and growth.
- [Back up and restore volumes](/volumes/backups) protects the notebook data itself.
- [Right-size CPU and memory](/guides/right-size-cpu-memory) helps you tune limits as the team grows.
- [Managing secrets on Railway](/guides/managing-secrets-on-railway) covers safer handling of tokens like `JUPYTER_TOKEN`.
