---
title: Integrations
description: Integrate with Railway using OAuth and the GraphQL API.
---

Railway provides two main integration points: **OAuth** for authenticating users with their Railway account, and the **GraphQL API** for programmatic access to Railway resources.

## OAuth

[Login with Railway](/integrations/oauth) allows third-party applications to authenticate users with their Railway account. Built on OAuth 2.0 and OpenID Connect (OIDC), it provides a secure way for users to grant your application access to their Railway resources.

**Use cases:**
- Build CLIs that manage Railway infrastructure on behalf of users
- Add one-click deploy-to-Railway functionality to your framework
- Create dashboards that display project metrics and deployment history
- Let users sign in with their Railway account

[Get started with OAuth →](/integrations/oauth/quickstart)

## API

The [Railway GraphQL API](/integrations/api) is the same API that powers the Railway dashboard. Use it to integrate Railway into your CI/CD pipelines and other workflows.

**Use cases:**
- Automate deployments and rollbacks
- Manage projects, services, and variables programmatically
- Build custom monitoring and alerting
- Create infrastructure-as-code workflows

[Get started with the API →](/integrations/api)
