---
title: Deploy from a Private Container Registry
description: Deploy Docker images from private registries (GHCR, Docker Hub, GitLab, ECR, Google Artifact Registry) on Railway, from credential setup to CI-driven redeploys.
date: "2026-07-29"
tags:
  - docker
  - registries
  - deployments
  - ci-cd
topic: infrastructure
---

Railway can deploy a service directly from a private container registry, one whose images require authentication to pull. You provide the image path and registry credentials; Railway authenticates with the registry, pulls the image, and runs it. There is no build step on Railway's side, so what you push to the registry is exactly what runs.

## Requirements

Private registry credentials are available on the [Pro plan](/pricing/plans). Public images work on any plan.

Railway works with any registry that supports standard Docker authentication, including:

| Registry | Domain |
| -------- | ------ |
| Docker Hub | `docker.io` (default) |
| GitHub Container Registry | `ghcr.io` |
| GitLab Container Registry | `registry.gitlab.com` |
| Quay.io | `quay.io` |
| AWS ECR | account-specific domain |
| Google Artifact Registry | `us-west1-docker.pkg.dev` (region-specific) |

## Build and push an image

The example below uses GitHub Container Registry (GHCR), but the flow is the same for any registry: build, tag with the full registry path, push.

A minimal app to containerize:

```javascript
// server.js
const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", version: process.env.APP_VERSION || "dev" }));
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
```

```dockerfile
# Dockerfile
FROM node:22-slim

WORKDIR /app
COPY server.js .

CMD ["node", "server.js"]
```

Build and push:

```bash
# Authenticate to GHCR with a personal access token that has write:packages scope
echo $GITHUB_TOKEN | docker login ghcr.io -u your-github-username --password-stdin

# Build for linux/amd64. Docker on Apple Silicon defaults to arm64,
# so pass --platform explicitly when building on an ARM machine.
docker build --platform linux/amd64 -t ghcr.io/your-org/my-app:1.0.0 .

docker push ghcr.io/your-org/my-app:1.0.0
```

Images pushed to GHCR are private by default when the repository is private.

## Create the service on Railway

1. In your project canvas, create a new service and choose **Docker Image** as the source.
2. Enter the full image path, including the registry domain: `ghcr.io/your-org/my-app:1.0.0`. For Docker Hub you can omit the domain: `your-username/private-image:1.0.0`.
3. Deploy. The first deploy fails to pull until credentials are configured, which is the next step.

## Configure registry credentials

1. Open the service's **Settings** page.
2. Under **Source**, find **Registry Credentials**.
3. Enter your credentials and save, then redeploy.

Credentials are encrypted at rest with envelope encryption and only decrypted at deployment time when Railway pulls the image.

### GHCR

For `ghcr.io` you need only a token: create a [GitHub personal access token](https://github.com/settings/tokens) with the `read:packages` scope and paste it into the **GitHub Access Token** field. Railway handles the username for you.

Use a token scoped to read only. The `write:packages` token from your CI pipeline should not be reused here.

### Other registries

For all other registries, provide a username and password:

| Registry | Username | Password |
| -------- | -------- | -------- |
| Docker Hub | Docker ID | [Personal access token](https://docs.docker.com/security/access-tokens/) |
| GitLab | GitLab username | Personal access token with `read_registry` scope |
| Quay.io | Robot account, `namespace+robotname` | Generated robot token |
| AWS ECR | `AWS` | Token from `aws ecr get-login-password` |
| Google Artifact Registry | `_json_key` | Full service account JSON key contents |

### The ECR token problem

ECR authentication tokens expire after 12 hours. A token saved in Railway's registry credentials stops working half a day later, and the next redeploy or restart that needs to pull the image will fail.

If you control where images live, prefer a registry with long-lived credentials (GHCR, Docker Hub, GitLab, Quay) for services deployed to Railway. If your images must stay in ECR, your CI pipeline needs to refresh the stored credential before each deploy, or mirror the image to a registry with static credentials as a final CI step.

## Deploy new versions from CI

Pushing a new image does not redeploy your service on its own. There are three ways to get a new version live.

### Option 1: a mutable tag plus a CI redeploy

Push a mutable tag like `:latest` or `:production`, then trigger a redeploy with the [Railway CLI](/cli/redeploy). The redeploy pulls the tag again and picks up the new digest.

```yaml
# .github/workflows/deploy.yml
name: Build and deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64
          push: true
          tags: ghcr.io/${{ github.repository }}:production

      - name: Redeploy on Railway
        run: npx -y @railway/cli@latest redeploy --service my-app --yes
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Create a project token under your project settings and store it as `RAILWAY_TOKEN` in your repository secrets. A project token is scoped to one environment, so the redeploy targets that environment's service.

### Option 2: image auto updates

For images on Docker Hub or GHCR, Railway can [check for new versions automatically](/deployments/image-auto-updates) and redeploy during a maintenance window you choose. Within that window, semantic version tags update according to a policy you set (patches only, or minor plus patches), and mutable tags like `:latest` redeploy whenever the digest behind the tag changes.

Auto updates fit dependencies you consume (databases, reverse proxies, third-party tools) better than your own application, because detection results are cached for up to a few hours and updates wait for the maintenance window. For your own app, a CI-triggered redeploy is immediate and deterministic.

### Option 3: unique tags plus a staged update

Tag every build uniquely (`:1.4.2`, or the git SHA) and update the service's image reference for each release. This gives you exact rollbacks: [deployment rollbacks](/deployments/deployment-actions) restore both the image reference and the variables from a previous deploy. You can update the image in the service settings, or automate it against Railway's API.

## Runtime configuration

Railway runs your image as-is, so configuration happens through the service, not the build:

- **Port.** Railway injects a `PORT` variable and expects your process to listen on it when serving HTTP behind a [Railway-provided domain](/networking/domains). The example server above reads `process.env.PORT`.
- **Variables.** Set them under the service's **Variables** tab. They are injected at runtime, so the same image can run with different configuration in each environment.
- **Start command.** The image's `CMD` runs by default. Override it in service settings if the image ships multiple entrypoints.
- **Health checks.** Configure an HTTP [health check path](/deployments/healthchecks) so Railway only shifts traffic to a new container after it reports healthy. This is required for zero-downtime deploys.

## Private images in templates

If you publish a [template](/templates/create) that uses a private image, you can attach your registry credentials to the template service without exposing them. Users who deploy the template see that the service uses hidden registry credentials but cannot read them, and SSH access is disabled on those services to protect the credentials. See [private Docker images in templates](/templates/private-docker-images).

## Troubleshooting

- **Pull fails with an authentication error.** Verify the image path includes the registry domain and that the token has read scope for that specific package or repository. GHCR packages have their own access settings separate from the repository.
- **Pull worked yesterday, fails today.** Check for expired credentials. ECR tokens last 12 hours; some registries expire personal access tokens on a schedule you set at creation.
- **Image runs locally but crashes immediately on Railway.** Check the image's CPU architecture. Docker on Apple Silicon builds arm64 images by default; rebuild with `--platform linux/amd64` and push again.
- **New push is not live.** Redeploys are not automatic. Trigger `railway redeploy`, wait for the maintenance window if you use auto updates, or update the tag reference.

## Next steps

- [Private registries](/builds/private-registries) is the reference for supported registries and credential formats.
- [Image auto updates](/deployments/image-auto-updates) covers maintenance windows, version policies, and volume backups before updates.
- [Health checks](/deployments/healthchecks) explains how to get zero-downtime deploys for image-based services.
- [Deploy a Node Express API with zero downtime](/guides/deploy-node-express-api-with-auto-scaling-secrets-and-zero-downtime) shows the full production setup around a deployed service.
