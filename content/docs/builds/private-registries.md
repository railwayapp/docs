---
title: Private Registries
description: Learn how to deploy Docker images from private container registries on Railway.
---

Railway supports deploying Docker images from private container registries. This allows you to use proprietary images, internal tools, or images stored in your organization's private registry.

## Supported Registries

Any registry that supports standard Docker authentication works with Railway. Here are a few:

| Registry | Domain |
| -------- | ------ |
| Docker Hub | `docker.io` (default) |
| GitHub Container Registry | `ghcr.io` |
| GitLab Container Registry | `registry.gitlab.com` |
| Quay.io | `quay.io` |
| AWS ECR Public | `public.ecr.aws` |
| Google Artifact Registry | `us-west1-docker.pkg.dev` |
| Microsoft Container Registry | `mcr.microsoft.com` |

## Requirements

Private registry credentials are available on the **Pro plan**. If you're on a Free, Trial, or Hobby plan, you'll need to upgrade to use private registries.

## Configure Registry Credentials

To deploy from a private registry:

1. Navigate to your service's **Settings** page
2. Under the **Source** section, locate **Registry Credentials**
3. Enter your credentials and save

<video src="https://res.cloudinary.com/railway/video/upload/v1767657773/AddCredentials_dkhoyx.mp4" controls autoplay loop muted playsinline/>

### GitHub Container Registry (GHCR)

For images hosted on `ghcr.io`, Railway provides a simplified authentication flow:

1. Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with the `read:packages` scope
2. Enter your token in the **GitHub Access Token** field

Railway automatically handles the username configuration for GHCR.

### Other Registries

For all other registries, provide:

| Field | Description |
| ----- | ----------- |
| **Username** | Your registry username or service account name/id |
| **Password** | Your registry password, access token, or API key |

The exact credentials depend on your registry provider:

- **Docker Hub** - Docker ID and [personal access token](https://docs.docker.com/security/access-tokens/)
- **GitLab** - Username and [personal access token](https://docs.gitlab.com/user/packages/container_registry/authenticate_with_container_registry/) with `read_registry` scope (add `write_registry` for push access)
- **Quay.io** - [Robot account](https://docs.quay.io/glossary/robot-accounts.html) username in format `namespace+robotname` and the generated robot token
- **AWS ECR** - Use `AWS` as username and an [authentication token](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html) as password, generated via `aws ecr get-login-password` (tokens expire after 12 hours)
- **Google Artifact Registry** - Use `_json_key` as username and your [service account JSON key](https://cloud.google.com/artifact-registry/docs/docker/authentication) contents as password

## Security

Registry credentials are encrypted at rest using envelope encryption. Credentials are only decrypted at deployment time when pulling your image.

## Image Format

When specifying a private image, use the full image path including the registry domain:

```
ghcr.io/your-org/your-image:tag
registry.gitlab.com/your-group/your-project:tag
your-dockerhub-username/private-repo:tag
```

For Docker Hub private images, you can omit the domain:

```
your-username/private-image:latest
```

