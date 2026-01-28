---
title: Introduction to GraphQL
description: Learn what GraphQL is, why Railway uses it, and how to get started.
---

If you've worked with REST APIs, GraphQL might feel unfamiliar at first. This guide explains what GraphQL is, why it exists, and how to start using Railway's API.

## What is GraphQL?

GraphQL is a query language for APIs. Instead of hitting different endpoints to get different pieces of data, you write a query that describes exactly what you want. The server returns exactly that—nothing more, nothing less.

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
}`} variables={{ id: "<your-project-id>" }} />

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

To get a project with its services, you might need multiple requests, then stitch the data together yourself. Each endpoint returns whatever fields the API designer decided to include—you can't ask for less (to save bandwidth) or more (to avoid extra calls).

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
}`} variables={{ id: "<your-project-id>" }} />

Variables are passed separately from the query. This keeps queries reusable and makes it easier to work with dynamic values.

### The schema

Every GraphQL API is backed by a schema that defines all available types, queries, and mutations. You don't need to read the raw schema—tools like GraphiQL surface it for you—but it's what makes autocomplete and validation possible.

## Relay-style pagination

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

This pattern supports cursor-based pagination for large datasets. The actual items are inside `node`. Once you recognize the pattern, it becomes second nature.

For simple cases where you just want all items, you can ignore pagination and just drill into `edges { node { ... } }`.

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

For example, to get a project with its services and each service's latest deployment status—data that might require 3+ REST calls—you write one query:

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
}`} variables={{ id: "<your-project-id>" }} />

## Next steps

- **[API Cookbook](/guides/api-cookbook)** — Copy-paste examples for common operations
- **[GraphiQL Playground](https://railway.com/graphiql)** — Interactive query explorer
- **[Public API Reference](/reference/public-api)** — Authentication, rate limits, and more
