---
title: Introduction to GraphQL
description: Learn what GraphQL is, why Railway uses it, and how to get started.
---

If you've worked with REST APIs, GraphQL might feel unfamiliar at first. This guide explains what GraphQL is, why it exists, and how to start using Railway's API.

## What is GraphQL?

GraphQL is a query language for APIs. Instead of hitting different endpoints to get different pieces of data, you write a query that describes exactly what you want. The server returns nothing more, nothing less. Just exactly what you ask for.

Here's a simple example. Say you want to fetch a project's name and the names of its services:

<CodeTabs query={`query project($id: String!) {
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
}`} variables={{ id: "project-id" }} />

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

You asked for `name` and `services`. That's what you got. If you also wanted `createdAt`, you'd add it to your query. If you don't need something, leave it out.

## How is this different from REST?

With a REST API, you typically have multiple endpoints that return fixed data structures:

```
GET /projects/123           → returns project details
GET /projects/123/services  → returns list of services
GET /services/456           → returns one service's details
```

To get a project with its services, you might need multiple requests, then stitch the data together yourself. Each endpoint returns whatever fields the API designer decided to include; you can't ask for less (to save bandwidth) or more (to avoid extra calls).

GraphQL inverts this. There's one endpoint, and you decide what data you need by writing a query.

| REST | GraphQL |
|------|---------|
| Multiple endpoints | Single endpoint |
| Server decides response shape | Client decides response shape |
| Often requires multiple round-trips | Fetch related data in one request |
| Fixed response structure | Flexible response structure |

## Why does Railway use GraphQL?

**Get exactly what you need.** No over-fetching (getting 50 fields when you need 3) or under-fetching (making extra calls for related data). Your query is your contract.

**Explore the API as you build.** GraphQL APIs are self-documenting. Railway's [GraphiQL playground](https://railway.com/graphiql) lets you browse available types, fields, and operations interactively. Autocomplete field names, see documentation inline, and test queries before writing code.

**Evolve without versioning.** Adding new fields doesn't break existing queries. Clients only get what they ask for, so new fields are invisible to old clients. No `/v1/`, `/v2/` versioning needed.

**Strongly typed.** Every GraphQL API has a schema that defines valid queries. This means better tooling, auto-generated documentation, and errors caught before runtime.

## Core concepts

### Queries

Queries read data. They're the GraphQL equivalent of GET requests.

<CodeTabs query={`query {
  me {
    name
    email
  }
}`} />

### Mutations

Mutations change data. They're the equivalent of POST, PUT, or DELETE.

<CodeTabs query={`mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { name: "my-new-project" } }} />

Notice that mutations also return data. You can ask for fields on the newly created resource in the same request.

### Variables

Instead of hardcoding values in your query, use variables:

<CodeTabs query={`query project($id: String!) {
  project(id: $id) {
    name
    description
  }
}`} variables={{ id: "project-id" }} />

Variables are passed separately from the query. This keeps queries reusable and makes it easier to work with dynamic values.

### The schema

Every GraphQL API is backed by a schema that defines all available types, queries, and mutations. The schema is what makes autocomplete and validation possible.

## Exploring the schema

The best way to discover what's available in Railway's API is through the [GraphiQL playground](https://railway.com/graphiql). Here's how to use it effectively.

### Using the Docs panel

Click the "Docs" button (or press Ctrl/Cmd+Shift+D) to open the documentation explorer. From here you can:

1. **Browse root operations:** Start with `Query` to see all available queries, or `Mutation` for all mutations
2. **Search for types:** Use the search box to find types like `Project`, `Service`, or `Deployment`
3. **Navigate relationships:** Click on any type to see its fields, then click on field types to explore further

### Understanding type signatures

GraphQL types follow consistent patterns:

```graphql
# Scalar types
name: String          # Optional string
name: String!         # Required string (the ! means non-null)

# Lists
services: [Service!]! # Required list of non-null Service objects

# Input types (for mutations)
input ProjectCreateInput {
  name: String!       # Required
  description: String # Optional
}
```

**The `!` suffix means "required"** (non-null). When you see `String!`, a value must be provided. When you see `String` without `!`, it's optional.

### Finding available fields

When writing a query, you can request any field defined on a type. For example, if you're querying a `Project`, click on the `Project` type in GraphiQL's Docs panel to see all available fields:

- `id`, `name`, `description`: basic info
- `services`, `environments`, `volumes`: related resources
- `createdAt`, `updatedAt`: timestamps
- And more...

You don't need to request all fields. Just include the ones you need:

```graphql
query {
  project(id: "...") {
    name                    # Just the fields you want
    services {
      edges { node { name } }
    }
  }
}
```

### Finding mutation input fields

For mutations, check the input type to see what you can pass. For example, `projectCreate` takes a `ProjectCreateInput`. Click on that type in GraphiQL to see:

- **Required fields:** Must be provided (marked with `!`)
- **Optional fields:** Can be omitted for default behavior

The examples in our [API Cookbook](/guides/api-cookbook) show common optional fields, but GraphiQL always has the complete list.

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

### Basic usage

For small lists, just request `edges` and `node` to get all items:

<CodeTabs query={`query project($id: String!) {
  project(id: $id) {
    services {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}`} variables={{ id: "project-id" }} />

### Paginating through results

For larger lists, use `first` to limit results and `after` to fetch the next page:

<CodeTabs query={`query deployments($input: DeploymentListInput!, $first: Int, $after: String) {
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
}`} variables={{ input: { projectId: "project-id" }, first: 10 }} />

The `pageInfo` object tells you:
- `hasNextPage`: whether more results exist
- `endCursor`: the cursor to pass as `after` to get the next page

To fetch the next page, run the same query with `after` set to the `endCursor` from the previous response.

## Making your first request

Railway's GraphQL endpoint is:

```
https://backboard.railway.com/graphql/v2
```

A GraphQL request is an HTTP POST with a JSON body containing your query:

<CodeTabs query={`query {
  me {
    name
    email
  }
}`} />

Most developers use Railway's [GraphiQL playground](https://railway.com/graphiql) to explore and test queries before writing code. You can also use tools like [Apollo Studio](https://studio.apollographql.com/sandbox/explorer) or [Insomnia](https://insomnia.rest/).

## Tips for getting started

**Use the GraphiQL playground.** Start at [railway.com/graphiql](https://railway.com/graphiql). Browse the schema, build queries with autocomplete, and see results instantly. It's the fastest way to learn what's available.

**Start small.** Write a simple query that fetches one thing:

<CodeTabs query={`query {
  me {
    id
    name
  }
}`} />

Once that works, gradually expand to include related data.

**Read the errors.** GraphQL error messages are specific and helpful. If you misspell a field or pass the wrong type, the error tells you exactly what went wrong and what's valid.

**Think in graphs.** GraphQL shines when you need related data. Instead of "what endpoint do I call?", think "what data do I need, and how is it connected?"

For example, to get a project with its services and each service's latest deployment status (data that might require 3+ REST calls), you write one query:

<CodeTabs query={`query project($id: String!) {
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
}`} variables={{ id: "project-id" }} />

## Next steps

- **[API Cookbook](/guides/api-cookbook):** Copy-paste examples for common operations
- **[GraphiQL Playground](https://railway.com/graphiql):** Interactive query explorer
- **[Public API Reference](/reference/public-api):** Authentication, rate limits, and more
