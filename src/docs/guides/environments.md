---
title: Using Environments
description: Manage complex development workflows via environments in your projects on Railway.
---

Railway supports complex development workflows through environments, giving you isolated instances of all services in a project.

## Create an Environment

1. Select `+ New Environment` from the environment drop down in the top navigation. You can also go to Settings > Environments.
2. Choose which type of environment to create -

   - **Duplicate Environment** creates a copy of the selected environment, including services, variables, and configuration.

     When the duplicate environment is created, all services and their configuration will be staged for deployment.
     _You must review and approve the [staged changes](/guides/staged-changes) before the services deploy._

   - **Empty Environment** creates an empty environment with no services.

---

## Sync Environments

You can easily sync environments to _import_ one or more services from one environment into another environment.

1. Ensure your current environment is the one that should _receive_ the synced service(s)
2. Click `Sync` at the top of the canvas
3. Select the environment from which to sync changes
4. Upon sync, each service card that has received a change will be tagged "New", "Edited", "Removed"
5. Review the [staged changes](/guides/staged-changes) by clicking Details on the staged changes banner
6. Click "Deploy" once you are ready to apply the changes and re-deploy

<Image src="https://res.cloudinary.com/railway/image/upload/v1743192480/docs/sync-environments_sujrxq.png"
            alt="Staged changes on Railway canvas"
            layout="responsive"
            width={1200} height={843} quality={100} />

---

## Enable PR Environments

Railway can spin up a temporary environment whenever you open a Pull Request. To enable PR environments, go to your Project Settings -> Environments tab.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1699568846/docs/enablePrEnv_f5n2hx.png"
alt="Screenshot of Deploy Options"
layout="responsive"
width={1622} height={506} quality={80} />

When enabled, a temporary environment is spun up to support the Pull Request deploy. These environments are deleted as soon as these PRs are merged or closed.

#### How Come my GitHub PR Won't Deploy?

Railway will not deploy a PR branch from a user who is not in your workspace or invited to your project without their associated GitHub account.

#### Domains in PR Environments

To enable automatic domain provisioning in PR environments, ensure that services in your base environment use Railway-provided domains. Services in PR environments will only receive domains automatically when their corresponding base environment services have Railway-provided domains.

### Focused PR Environments

<PriorityBoardingBanner />

For monorepos and multi-service projects, Focused PR Environments only deploy services affected by files changed in the pull request. This speeds up PR environments and reduces resource usage.

#### How It Works

When a PR is opened, Railway determines which services to deploy:

1. Services connected to the PR repo that are affected by changed files (based on [watch paths](/guides/monorepo#watch-paths) or [root directory](/guides/monorepo#deploying-an-isolated-monorepo))
2. Dependencies of affected services (via variable references like `${{service.URL}}`)

All other services are skipped and indicated on the canvas. The GitHub PR comment shows which services were skipped.

#### Deploying Skipped Services

Skipped services can be deployed manually from the canvas. Click on the skipped service and select "Deploy" to add it to the PR environment.

#### Enabling Focused PR Environments

1. Go to **Project Settings → Environments**
2. Ensure PR Environments are enabled
3. Toggle **Enable Focused PR Environments**

### Bot PR Environments

You can enable automatic PR environment creation for PRs opened by supported GitHub bots using the `Enable Bot PR Environments` toggle on the Environments tab in the Project Settings page.

**Supported bots:**
- [Dependabot](https://github.com/dependabot)
- [Renovate](https://github.com/renovatebot)
- [Devin AI](https://github.com/apps/devin-ai-integration)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Copilot](https://github.com/features/copilot)
- [Jules (Google)](https://jules.google/)
- [Roo Code](https://roocode.com/)
- [Claude Code (Anthropic)](https://claude.com/product/claude-code)

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1768408949/docs/guides/environments/mockup-1768408821891_wxdyrr.png"
  alt="Bot PR Environments toggle"
  layout="responsive"
  width={3096}
  height={940}
  quality={80}
/>

---

## Environment RBAC

<Banner variant="info">
Restricted environments are available on [Railway Enterprise](https://railway.com/enterprise).
</Banner>

Restrict access to sensitive environments like production. Non-admin members can see these environments exist but cannot access their resources (variables, logs, metrics, services, and configurations). They can still trigger deployments via git push.

[Contact us](https://railway.com/enterprise) to enable it for your enterprise workspace.

Once enabled, go to **Project Settings → Environments** and toggle the **Restricted** switch for any environment you want to restrict.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1764189412/CleanShot_2025-11-26_at_17.33.18_2x_xzaztj.png"
  alt="Restricted environments toggle in Project Settings"
  layout="responsive"
  width={817}
  height={528}
  quality={80}
/>

| Role | Can access | Can toggle |
| :--- | :---: | :---: |
| Admin | ✔️ | ✔️ |
| Member | ❌ | ❌ |
| Deployer | ❌ | ❌ |

---

## Forked Environments

As of January 2024, forked environments have been deprecated in favor of Isolated Environments with the ability to Sync.

Any environments forked prior to this change will remain, however, you must adopt the [Sync Environments](#sync-environments) flow, in order to merge changes into your base environment.
