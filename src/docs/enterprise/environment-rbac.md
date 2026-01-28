---
title: Environment RBAC
description: Restrict access to sensitive environments like production with role-based access control.
---

<Banner variant="info">
Environment RBAC is available on [Railway Enterprise](https://railway.com/enterprise).
</Banner>

Environment RBAC (Role-Based Access Control) allows you to restrict access to sensitive environments like production. This ensures that only authorized team members can view or modify critical infrastructure.

## How it Works

When an environment is marked as restricted:

- **Non-admin members** can see that the environment exists but cannot access its resources
- **Restricted resources** include variables, logs, metrics, services, and configurations
- **Deployments** can still be triggered via git push, allowing developers to deploy without accessing sensitive data

This separation allows development teams to deploy code while keeping production secrets and configurations secure.

## Enabling Environment RBAC

[Contact us](https://railway.com/enterprise) to enable Environment RBAC for your enterprise workspace.

Once enabled for your workspace:

1. Go to **Project Settings → Environments**
2. Find the environment you want to restrict (e.g., `production`)
3. Toggle the **Restricted** switch

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1764189412/CleanShot_2025-11-26_at_17.33.18_2x_xzaztj.png"
  alt="Restricted environments toggle in Project Settings"
  layout="responsive"
  width={817}
  height={528}
  quality={80}
/>

## Role Permissions

| Role | Can access restricted environments | Can toggle restriction |
| :--- | :---: | :---: |
| Admin | ✔️ | ✔️ |
| Member | ❌ | ❌ |
| Deployer | ❌ | ❌ |

### Admin

Admins have full access to all environments, including restricted ones. They can:
- View and modify variables, services, and configurations
- Access logs and metrics
- Toggle the restricted status on any environment

### Member

Members cannot access restricted environments. They can:
- See that the environment exists in the project
- Trigger deployments via git push
- Access non-restricted environments normally

### Deployer

Deployers have the same restrictions as Members for restricted environments. They can:
- Trigger deployments via git push
- Cannot view variables, logs, or configurations in restricted environments

## Use Cases

### Protecting Production Secrets

Keep production API keys, database credentials, and third-party service tokens hidden from developers who don't need access.

### Compliance Requirements

Meet security compliance requirements (SOC 2, HIPAA, etc.) by limiting access to production data and configurations.

### Separation of Duties

Allow developers to deploy code without having access to view or modify production infrastructure settings.

## Best Practices

1. **Restrict production by default** - Mark your production environment as restricted immediately after enabling the feature
2. **Limit admin count** - Only grant admin access to team members who need to manage production configurations
3. **Use staging for debugging** - Keep a non-restricted staging environment that mirrors production for debugging purposes
4. **Audit regularly** - Review who has admin access periodically to ensure it aligns with current team responsibilities

## Related

- [Environments](/environments) - Learn about environment management
- [Project Members](/projects/members) - Manage team access and roles
- [Enterprise Features](https://railway.com/enterprise) - Explore other enterprise capabilities
