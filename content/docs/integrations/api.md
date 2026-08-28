---
title: Public API
description: Discover the Railway GraphQL Public API.
---

The Railway public API is built with GraphQL and is the same API that powers the Railway dashboard.

Use the Public API to integrate Railway into your CI/CD pipelines and other workflows.

## Understanding GraphQL

New to GraphQL? Start with the [Introduction to GraphQL](/integrations/api/graphql-overview) guide, which explains the core concepts using Railway's API.

For deeper learning, these external resources are helpful:
- [Official Introduction to GraphQL](https://graphql.org/learn/)
- [GraphQL Basics](https://hasura.io/learn/graphql/intro-graphql/introduction/) course by Hasura
- [GraphQL is the better REST](https://www.howtographql.com/basics/1-graphql-is-the-better-rest/)

## Connecting to the public API

To connect to and query the Public API, you will need the endpoint URL and a token for authentication.

### Endpoint

The public API is accessible at the following endpoint:

```bash
https://backboard.railway.com/graphql/v2
```

### Creating a token

To use the API, you will need an API token. There are three types of tokens you can create in the Railway dashboard. If you're building an application that authenticates users, you can also use OAuth.

#### Choosing a token type

| Token Type | Scope | Best For |
|------------|-------|----------|
| Account token | All your resources and workspaces | Personal scripts, local development |
| Workspace token | Single workspace | Team CI/CD, shared automation |
| Project token | Single environment in a project | Deployments, service-specific automation |
| OAuth | User-granted permissions | Third-party apps acting on behalf of users |

#### Account tokens and workspace tokens

You can create an account or workspace token from the [tokens page](https://railway.com/account/tokens) in your account settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1770147536/docs/new_token_2026_v4yrmw.png"
alt="New token form"
layout="responsive"
width={1674} height={374} quality={80} />

- **Account token** - If you select "No workspace", the token will be tied to your Railway account. This is the broadest scope. The token can perform any API action you're authorized to do across all your resources and workspaces. Do not share this token with anyone else.
- **Workspace token** - Select a specific workspace in the dropdown to create a token scoped to that workspace. A workspace token has access to all the workspace's resources, and cannot be used to access your personal resources or other workspaces on Railway. You can share this token with your teammates.

#### Project token

You can create a project token from the tokens page in your project settings.

Project tokens are scoped to a specific environment within a project and can only be used to authenticate requests to that environment.

#### OAuth access token

If you're building an application that acts on behalf of users, you can use [Login with Railway](/integrations/oauth) to obtain an access token through the OAuth flow. The token's permissions depend on the scopes the user approved.

### Execute a test query

Once you have your token, you can pass it within the Authorization header of your request.

#### Using an account token

You can try the query below in the terminal of your choice. It should return your name and email on Railway:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Authorization: Bearer <API_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { me { name email } }"}'
```

**Note:** This query **cannot** be used with a workspace or project token because the data returned is scoped to your personal account.

#### Using a workspace token

If you have a workspace token, you can use it to authenticate requests scoped to that workspace. The query below should return the workspace name and ID:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Authorization: Bearer <WORKSPACE_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { workspace(workspaceId: \"<WORKSPACE_ID_GOES_HERE>\") { name id } }"}'
```

**Note:** This query **can** also be used with an account token as long as you are a member of the workspace.

#### Using a project token

If you have a project token, you can use it to authenticate requests to a specific environment within a project. The query below should return the project and environment IDs:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Project-Access-Token: <PROJECT_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { projectToken { projectId environmentId } }"}'
```

**Note:** Project tokens use the `Project-Access-Token` header, not the `Authorization: Bearer` header used by account, workspace, and OAuth tokens.

## Viewing the schema

The Railway API supports introspection meaning you can use popular tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to connect to the API and query the schema. Simply set up your connection with the endpoint and Authorization token, and fetch the schema.

### API collection file

We also provide a collection file which can be imported into your preferred API client. Click [here](https://gql-collection-server.up.railway.app/railway_graphql_collection.json) to download it.

Once imported, you should only need to add your API token to get connected and start executing queries in the collection.

### GraphiQL playground

Alternatively, you can use the [GraphiQL playground](https://railway.com/graphiql) to view the schema and test your queries.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694611003/rw-graphiql_zs2l28.png" alt="GraphiQL Playground" layout="responsive" width={6568} height={3886} quality={80} />

Make sure to set an Authorization header with an auth token. Click the "Headers" tab at the bottom of the GraphiQL page and enter this json, using your own token:

```json
{ "Authorization": "Bearer <API_TOKEN_GOES_HERE>" }
```

## Rate limits

In order to protect the Railway API from spam and misuse, we have established some basic rate limits. The current limits to the API are:

- **Requests per hour**: 100 RPH for Free customers, 1000 RPH for Hobby customers, 10000 RPH for Pro customers; custom for Enterprise.
- **Requests per second**: 10 RPS for Hobby customers; 50 RPS for Pro customers; custom for Enterprise.

To help you keep track of your usage, Railway sends a few headers with the response on each request.

| Header                | Description                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| RateLimit-Policy      | The limit and window that apply, advertised on every API response — e.g. `"default";q=1000;w=3600` — so you can read the limit before authenticating. |
| X-RateLimit-Limit     | The maximum number of API requests allowed in the current window.                                                                                  |
| X-RateLimit-Remaining | The number of API requests your token can make in the current window.                                                                              |
| X-RateLimit-Reset     | The time at which the current window ends and your remaining requests reset.                                                                       |
| Retry-After           | The amount of time after which you can make another request. This header is only sent once you've used up all your requests in the current window. |

When you exceed the limit the API responds with **HTTP 429**; wait for the `Retry-After` interval before retrying rather than retrying immediately.

## Errors

The API is GraphQL, so it follows the GraphQL error convention rather than HTTP status alone. **Always inspect the `errors` array, not just the status code.**

- **HTTP 200 with an `errors` array** — the request executed but something in it failed, including authorization failures. A query that runs but is denied returns `200`; the failure is in `errors`.
- **HTTP 400** — the request could not be parsed or validated (malformed JSON, an unknown field, a bad variable). `extensions.code` carries the reason.
- **HTTP 429** — you have exceeded the [rate limit](#rate-limits).

Every error object carries a `message`, an `extensions.code`, and a `traceId`. Include the `traceId` when you contact support — it is how we locate the exact request.

```json
{
  "errors": [
    {
      "message": "Cannot query field \"nope\" on type \"Query\".",
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED",
        "traceId": "7992771584715554281"
      }
    }
  ],
  "data": null
}
```

Common `extensions.code` values:

| Code                       | Meaning                                                             | HTTP |
| -------------------------- | ------------------------------------------------------------------- | ---- |
| `GRAPHQL_PARSE_FAILED`     | The query is not valid GraphQL syntax                               | 400  |
| `GRAPHQL_VALIDATION_FAILED`| The query references fields or types that don't exist               | 400  |
| `BAD_USER_INPUT`           | A field or variable failed validation                               | 400  |
| `INTERNAL_SERVER_ERROR`    | An unexpected error, or an authorization denial (message `Not Authorized`) | 200  |

## Retries

- **Reads (queries) are safe to retry** — they have no side effects.
- **Writes (mutations):** retry only on a network error, or a `429`/`5xx` where you did **not** receive a response. If you received a `200`, the mutation ran — retrying may duplicate it. Most Railway mutations are keyed on the resource they act on, so a retry with identical arguments generally converges, but do not assume exactly-once semantics.
- **Back off exponentially**, and honor `Retry-After` on a `429`.
- Carry the `traceId` from a failed response into any support request.

## Versioning and deprecation

Railway's public API is GraphQL, so **the schema is the contract**. New fields and types are added without a version bump — additive changes never break an existing query, so you do not need to pin a version.

Fields being retired are marked `@deprecated` in the schema, with a reason. Introspect with `includeDeprecated: true` to find them:

```graphql
{
  __type(name: "Project") {
    fields(includeDeprecated: true) {
      name
      isDeprecated
      deprecationReason
    }
  }
}
```

Prefer non-deprecated fields. A deprecated field keeps working through its sunset window and is removed only after it has been marked for a meaningful period.

## Tips and tricks

### Resource IDs

While building your queries, if you quickly need to copy resource IDs, you can hit `Cmd/Ctrl + K` within your project and copy the project/service/environment ID.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694616111/rw-cmd-palette_s5yilj.png" alt="Railway Command Palette" height={678} width={1176} quality={80} />

### The network tab

If you're unsure about what query/mutation to use for what you are trying to achieve, you can always do the action in the dashboard and look for the request in the network tab. As we use the same API internally, you can simply grab the name and then look for specific query in the introspected schema.

### External resources

1. The [awesome-graphql](https://github.com/chentsulin/awesome-graphql) repository is a great resource for all things GraphQL with implementations available across a variety of languages.
2. The [GraphQL Discord](https://discord.graphql.org/) is the official Discord channel for graphql.org with a lot of active members and specific help channels.

## Examples

To help you get started, we have provided example queries and mutations organized by resource type:

- [API Cookbook](/integrations/api/api-cookbook) - Quick reference for common operations
- [Manage Projects](/integrations/api/manage-projects) - Create, update, delete projects
- [Manage Services](/integrations/api/manage-services) - Create services, configure settings
- [Manage Deployments](/integrations/api/manage-deployments) - Deploy, rollback, view logs
- [Manage Variables](/integrations/api/manage-variables) - Set and manage environment variables
- [Manage Environments](/integrations/api/manage-environments) - Create and configure environments
- [Manage Domains](/integrations/api/manage-domains) - Add custom domains, configure DNS
- [Manage Volumes](/integrations/api/manage-volumes) - Create volumes, manage backups

## Status and incidents

Current platform status and incident history are published at [status.railway.com](https://status.railway.com), where you can also subscribe to incident notifications.

For how the API behaves under failure in one place — error format, rate-limit headers, retry guidance, and the deprecation policy — see the [Rate limits](#rate-limits), [Errors](#errors), [Retries](#retries), and [Versioning and deprecation](#versioning-and-deprecation) sections above, or the machine-readable summary at [railway.com/api-reliability.md](https://railway.com/api-reliability.md).

## Support

If you run into problems using the API or have any suggestions, feel free to reach out on [Central Station](https://station.railway.com) where the team can help you directly.
