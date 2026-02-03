---
title: Public API Reference
description: Learn about the Railway GraphQL Public API.
---

The Railway public API is built with GraphQL and is the same API that powers the Railway dashboard.

## Endpoint

The public API is accessible at the following endpoint:

```bash
https://backboard.railway.com/graphql/v2
```

## Authentication

To use the API, you will need an API token. There are three types of tokens you can create in the Railway dashboard. If you're building an application that authenticates users, you can also use OAuth.

#### Account Tokens and Workspace Tokens

You can create an account or workspace token from the <a href="https://railway.com/account/tokens" target="_blank">tokens page</a> in your account settings.

- **Account token**: If you select "No workspace", the token will be tied to your Railway account. This is the broadest scope. The token can perform any API action you're authorized to do across all your resources and workspaces. Do not share this token with anyone else.
- **Workspace token**: Select a specific workspace in the dropdown to create a token scoped to that workspace. A workspace token has access to all the workspace's resources, and cannot be used to access your personal resources or other workspaces on Railway. You can share this token with your teammates.

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Authorization: Bearer <API_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { me { name email } }"}'
```

#### Project Token

You can create a project token from the tokens page in your project settings.

Project tokens are scoped to a specific environment within a project and can only be used to authenticate requests to that environment.

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Project-Access-Token: <PROJECT_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { projectToken { projectId environmentId } }"}'
```

**Note:** Project tokens use the `Project-Access-Token` header, not the `Authorization: Bearer` header used by account, workspace, and OAuth tokens.

#### OAuth Access Token

If you're building an application that acts on behalf of users, you can use [Login with Railway](/reference/oauth/login-with-railway) to obtain an access token through the OAuth flow. The token's permissions depend on the scopes the user approved.

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Authorization: Bearer <ACCESS_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { me { name email } }"}'
```

## Schema

The Railway API supports introspection meaning you can use popular tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to query the schema. Simply set up your connection with the endpoint and Authorization token, and fetch the schema.

### API Collection File

We provide a collection file which can be imported into your preferred API client. Once imported, you should only need to add your API token to get connected and start executing queries in the collection. Click [here](https://gql-collection-server.up.railway.app/railway_graphql_collection.json) to download it.

### GraphiQL Playground

Use our [GraphiQL playground](https://railway.com/graphiql) to view the schema and test your queries.

Make sure to set a header with your [authorization token](/reference/public-api#authentication). Click the "Headers" tab at the bottom of the GraphiQL page and enter this json, using your own token based on your use case:

For an account or workspace token:
```json
{ "Authorization": "Bearer <API_TOKEN_GOES_HERE>" }
```

For a project token:
```json
{ "Project-Access-Token": "<PROJECT_TOKEN_GOES_HERE>" }
```

## Rate Limits

In order to protect the Railway API from spam and misusage, we have established some basic rate limits. The current limits to the API are:

- Requests per hour: **100** RPH for Free customers, **1000** RPH for Hobby customers, **10000** RPH for Pro customers; custom for Enterprise.
- Requests per second: **10** RPS for Hobby customers; **50** RPS for Pro customers; custom for Enterprise.

To help you keep track of your usage, Railway sends a few headers with the response on each request.

| Header                | Description                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| X-RateLimit-Limit     | The maximum number of API requests allowed per day.                                                                                                |
| X-RateLimit-Remaining | The number of API requests your token can make in the current window.                                                                              |
| X-RateLimit-Reset     | The time at which the current window ends and your remaining requests reset.                                                                       |
| Retry-After           | The amount of time after which you can make another request. This header is only sent once you've used up all your requests in the current window. |

## Support

For more information on how to use the Public API and for examples of queries, view the [Public API guide](/guides/public-api).

If you run into problems using the API or have any suggestions, feel free to join our [Discord server](https://discord.gg/railway) where you can interact with the engineers working on the API directly.
