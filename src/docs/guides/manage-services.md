---
title: Manage Services with the Public API
description: Learn how to create services via the public GraphQL API.
---

Here are some examples to help you get started managing your services using the Public API.

### Create a New Service With a GitHub Repo

The mutation below will create a new service with the specified GitHub repo attached. The response will contain the newly created service.

<Banner variant="info">You can also use `image` inside the `source` to attach a Docker image to the service.</Banner>

```graphql
mutation serviceCreate {
  serviceCreate(
    input: {
      projectId: "8df3b1d6-2317-4400-b267-56c4a42eed06"
      source: { repo: "railwayapp-templates/django" }
    }
  ) {
    id
  }
}
```
