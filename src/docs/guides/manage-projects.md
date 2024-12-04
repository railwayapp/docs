---
title: Manage Projects with the Public API
---

Here are some examples to help you get started managing your projects using the Public API.

### Fetch All Your Projects

The query below will fetch all your personal projects along with all the services, plugins and environment for them.

```graphql
query me {
  me {
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
          }
          plugins {
            edges {
              node {
                id
                name
              }
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
