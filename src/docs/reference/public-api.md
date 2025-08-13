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

To use the API, you will need an API token. There are three types of tokens you can create.

#### Team Token and Personal Token

You can create an API token by visiting the <a href="https://railway.com/account/tokens" target="_blank">tokens page</a> in your account settings.

- **Team tokens** are tied to a team and will have access to all the team's resources. This token cannot be used to access your personal resources on Railway so feel free to share it with your teammates.
- **Non-team tokens** will be tied to your Railway account and will have access to all your resources. Do not share this token with anyone else.

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Authorization: Bearer <API_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { me { name email } }"}'
```

#### Project Token

You can create a project token by visiting the tokens page in your project settings.

Project tokens are scoped to a specific environment within a project and can only be used to authenticate requests to that environment.

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Project-Access-Token: <PROJECT_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { projectToken { projectId environmentId } }"}'
```

## Schema

The Railway API supports introspection meaning you can use popular tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to query the schema. Simply set up your connection with the endpoint and Authorization token, and fetch the schema.

### API Collection File

We provide a collection file which can be imported into your preferred API client. Once imported, you should only need to add your API token to get connected and start executing queries in the collection. Click [here](https://gql-collection-server.up.railway.app/railway_graphql_collection.json) to download it.

### GraphiQL Playground

Use our [GraphiQL playground](https://railway.com/graphiql) to view the schema and test your queries.

Make sure to set an Authorization header with an [auth token](/reference/public-api#authentication). Click the "Headers" tab at the bottom of the GraphiQL page and enter this json, using your own token:

```json
{ "Authorization": "Bearer <API_TOKEN_GOES_HERE>" }
```

## Rate Limits

In order to protect the Railway API from spam and misusage, we have established some basic rate limits. The current limits to the API are:

- **1000** requests per **hour**
- Requests per second: **10** RPS for Hobby users; **50** RPS for Pro users; custom for Enterprise

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
