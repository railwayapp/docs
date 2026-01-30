---
title: Introduction to GraphQL
description: Learn what GraphQL is, why Railway uses it, and how to get started.
---

If you've worked with REST APIs, GraphQL might feel unfamiliar at first. This guide explains what GraphQL is, why it exists, and how to start using Railway's API.

## What is GraphQL?

GraphQL is a query language for APIs. Instead of hitting different endpoints to get different pieces of data, you write a query that describes exactly what you want. The server returns nothing more, nothing less.

Here's a simple example. Say you want to fetch a project's name and the names of its services:

```graphql
query project($id: String!) {
  project(id: $id) {
    name
    services {
      edges {
        node {
          name
        }
      }
    }
  }
}
```

```json
{
  "id": "your-project-id"
}
```

The response mirrors the shape of your query:

```json
{
  "data": {
    "project": {
      "name": "my-app",
      "services": {
        "edges": [
          { "node": { "name": "api" } },
          { "node": { "name": "postgres" } }
        ]
      }
    }
  }
}
```

If you also wanted `createdAt`, you'd add it to your query. If you don't need something, leave it out.

## How is this different from REST?

With a REST API, you typically have multiple endpoints that return fixed data structures:

```
GET /projects/123           → returns project details
GET /projects/123/services  → returns list of services
GET /services/456           → returns one service's details
```

To get a project with its services, you might need multiple requests, then stitch the data together yourself. Each endpoint returns whatever fields the API designer decided to include.

GraphQL inverts this. There's one endpoint, and you decide what data you need by writing a query.

| REST | GraphQL |
| --- | --- |
| Multiple endpoints | Single endpoint |
| Server decides response shape | Client decides response shape |
| Often requires multiple round-trips | Fetch related data in one request |
| Fixed response structure | Flexible response structure |

## Why does Railway use GraphQL?

**Evolve without versioning.** Adding new fields doesn't break existing queries. Clients only get what they ask for, so new fields are invisible to old clients. No `/v1/`, `/v2/` versioning needed.

**Strongly typed.** Every GraphQL API has a schema that defines valid queries. This means better tooling, auto-generated documentation, and errors caught before runtime.

**Self-documenting.** The schema is always available to explore, which we'll cover below.

## Core concepts

### Queries

Queries read data. They're the GraphQL equivalent of GET requests.

```graphql
query {
  me {
    id
    name
    email
  }
}
```

### Mutations

Mutations change data. They're the equivalent of POST, PUT, or DELETE.

```graphql
mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
    name
  }
}
```

```json
{
  "input": {
    "name": "my-new-project"
  }
}
```

Notice that mutations also return data. You can ask for fields on the newly created resource in the same request.

### Variables

The mutation example above uses `$input`. Variables are passed separately from the query as JSON. This keeps queries reusable and makes it easier to work with dynamic values.

### The schema

Every GraphQL API is backed by a schema that defines all available types, queries, and mutations. The schema is what makes autocomplete and validation possible.

## Exploring the schema

The best way to discover what's available in Railway's API is through the [GraphiQL playground](https://railway.com/graphiql).

### Using the Docs panel

Click the "Docs" button (or press Ctrl/Cmd+Shift+D) to open the documentation explorer. From here you can:

1. **Browse root operations:** Start with `Query` to see all available queries, or `Mutation` for all mutations
2. **Search for types:** Use the search box to find types like `Project`, `Service`, or `Deployment`
3. **Navigate relationships:** Click on any type to see its fields, then click on field types to explore further

### Understanding type signatures

GraphQL types follow consistent patterns:

```graphql
name: String          # Optional string (can be null)
name: String!         # Required string (cannot be null)

services: [Service!]! # Required list of required Service objects
```

The `!` means non-null. When you see `String!`, a value is guaranteed. When you see `String` without `!`, it might be null. For lists, `[Service!]!` means the list itself is required and every item in it is required.

When a field returns an object type like `Service`, you must specify which fields you want from it:

```graphql
services {      # services is [Service!]!
  id            # pick the fields you want
  name
}
```

Input types define what you pass to mutations:

```graphql
input ProjectCreateInput {
  name: String!       # Required field
  description: String # Optional field
}
```

### Finding available fields

Click on any type in GraphiQL's Docs panel to see its fields. For example, click `Project` to see `id`, `name`, `description`, `services`, `environments`, and more. For mutations, click the input type (like `ProjectCreateInput`) to see required and optional fields.

### Pro tip: Use autocomplete

In GraphiQL's editor, press Ctrl+Space to trigger autocomplete. It shows all valid fields at your current position in the query, with descriptions.

## Pagination

Railway's API uses Relay-style pagination for lists. Instead of returning a flat array, lists are wrapped in `edges` and `node`:

```graphql
services {
  edges {
    node {
      id
      name
    }
  }
}
```

This structure enables cursor-based pagination for large datasets.

### Paginating through results

For larger lists, use `first` to limit results and `after` to fetch the next page:

```graphql
query deployments($input: DeploymentListInput!, $first: Int, $after: String) {
  deployments(input: $input, first: $first, after: $after) {
    edges {
      node {
        id
        status
        createdAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

The `pageInfo` object tells you:

- `hasNextPage`: whether more results exist
- `endCursor`: the cursor to pass as `after` to get the next page

## Making your first request

Railway's GraphQL endpoint is:

```
https://backboard.railway.com/graphql/v2
```

A GraphQL request is an HTTP POST with a JSON body containing your query. You can use Railway's [GraphiQL playground](https://railway.com/graphiql) to explore and test queries before writing code, or tools like [Apollo Studio](https://studio.apollographql.com/sandbox/explorer) or [Insomnia](https://insomnia.rest/).

## Tips for getting started

**Start small.** Write a simple query that fetches one thing. Once that works, gradually expand to include related data.

**Read the errors.** GraphQL error messages are specific and helpful. If you misspell a field or pass the wrong type, the error tells you exactly what went wrong and what's valid.

**Think in graphs.** Instead of "what endpoint do I call?", think "what data do I need, and how is it connected?" For example, to get a project with its services and each service's latest deployment status:

```graphql
query project($id: String!) {
  project(id: $id) {
    name
    services {
      edges {
        node {
          name
          serviceInstances {
            edges {
              node {
                latestDeployment {
                  status
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Next steps

- **[API Cookbook](/guides/api-cookbook):** Copy-paste examples for common operations
- **[Public API Reference](/reference/public-api):** Authentication, rate limits, and more
