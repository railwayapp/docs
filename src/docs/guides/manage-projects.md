---
title: Manage Projects with the Public API
description: Learn how to manage projects via the public GraphQL API.
---

Here are some examples to help you get started managing your projects using the Public API.

Note: Authenticate your requests with your workspace token by setting the Authorization header to `Bearer <your-workspace-token>`.

### Fetch All Your Projects

The query below will fetch all your personal projects along with all the services and environments for them.

```graphql
query Projects {
  projects {
    edges {
      node {
        id
        name
        services {
          edges {
            node {
              id
              name
            }
          }
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}
```

### Delete a Project

<Banner variant="danger">This is a destructive action</Banner>

The mutation below will delete the project with the specified `id`.

```graphql
mutation projectDelete {
  projectDelete(id: "5e594338-0faa-415f-b2a7-2b5f2d4ec11a")
}
```
