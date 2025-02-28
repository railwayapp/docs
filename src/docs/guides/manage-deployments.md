---
title: Manage Deployments with the Public API
description: Learn how to manage deployments via the public GraphQL API.
---

Here are some examples to help you get started managing your deployments using the Public API.

### Fetch Latest Active Deployment

The query below will fetch the latest active deployment for a service for a specific environment.

```graphql
query deployments {
  deployments(
    first: 1
    input: {
      projectId: "8df3b1d6-2317-4400-b267-56c4a42eed06"
      environmentId: "9fb4baf0-809a-40ec-af32-751f50890802"
      serviceId: "4bd252dc-c4ac-4c2e-a52f-051804292035"
    }
  ) {
    edges {
      node {
        id
        staticUrl
      }
    }
  }
}
```

### Restarting a Deployment

The query below will restart the deployment with the specified `id`.

```graphql
mutation deploymentRestart {
  deploymentRestart(id: "9d5b1306-e22e-4357-9b3f-cc3b97ed8240")
}
```
