---
title: Fetching Workspaces or Projects
description: Query workspaces and projects the user has granted access to.
---

When users authorize your application with workspace or project scopes, they select exactly which resources to share. Your application can then query these resources through the [Public GraphQL API](/guides/public-api).

## Fetching Workspaces

Workspace queries return the workspaces a user granted access to when authorizing your application. This requires that the user approved a workspace scope (`workspace:viewer`, `workspace:member`, or `workspace:admin`) and that your authorization request included the `email` and `profile` scopes alongside it.

**Query:**

```graphql
query {
  me {
    workspaces {
      id
      name
    }
  }
}
```

This query returns the ID and name of each workspace. You can extend it to request additional fields depending on what your application needs. Consult the [GraphQL schema](/reference/public-api#schema) for available fields.

**Example Request:**

```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { me { workspaces { id name } } }"}'
```

**Response:**

```json
{
  "data": {
    "me": {
      "workspaces": [
        {
          "id": "...",
          "name": "My Workspace"
        },
        {
          "id": "...",
          "name": "ACME Inc."
        }
      ]
    }
  }
}
```

The response includes only the workspaces the user selected during consent.

## Fetching Projects

Project queries work similarly but use the `externalWorkspaces` field, which returns workspaces along with the specific projects the user granted access to. This requires a project scope (`project:viewer` or `project:member`) in the original authorization request.

Unlike workspace scopes, project scopes let users share individual projects without granting access to the entire workspace.

**Query:**

```graphql
query {
  externalWorkspaces {
    id
    name
    projects {
      id
      name
    }
  }
}
```

**Example Request:**

```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { externalWorkspaces { id name projects { id name } } }"}'
```

**Response:**

```json
{
  "data": {
    "externalWorkspaces": [
      {
        "id": "...",
        "name": "My Workspace",
        "projects": [
          {
            "id": "...",
            "name": "mywebsite.com"
          },
          {
            "id": "...",
            "name": "workflow automations"
          }
        ]
      }
    ]
  }
}
```