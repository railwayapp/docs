---
title: Public API Reference
---

<PriorityBoardingBanner />

The Railway public API is built with GraphQL and is the same API that powers the Railway dashboard. You can play around with the API right inside your browser with the [GraphiQL playground](https://railway.app/graphiql). Continue reading to learn more about the API and see some examples of the API in use.

## Endpoint

```bash
https://backboard.railway.app/graphql/v2
```

The Railway API supports introspection so you should be able to use popular tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to query the schema.

## Authentication

To use the API, you will need an API token. You can create one by visiting the [tokens page](https://railway.app/account/tokens) in your account settings. There are two types of tokens you can create.

<Image src="https://res.cloudinary.com/railway/image/upload/v1667386744/docs/new-token-form_rhrbw8.png"
alt="New token form"
layout="responsive"
width={1618 } height={378} quality={80} />

### Team token

If you select a `Team` in the dropdown in the image above, the token will be tied to that team and will have access to all the team's resources. This token cannot be used to access your personal resources on Railway so feel free to share it with your teammates.

### Personal token

If you do not select a `Team`, the token will be tied to your Railway account and will have access to all your resources. Do not share this token with anyone else.

---

Once you have your token, you can pass it within the `Authorization` header of your request:
```bash
curl --request POST \
  --url https://backboard.railway.app/graphql/v2 \
  --header 'Authorization: Bearer <API_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { templates { edges { node { id code } } } }"}'
```

## Examples

To help you get started, here are a few examples for reference.

### `project` Query

The query below will fetch the project with the specified `id` along with all the plugins, environments, and services for it. Additionally, for each service, it will fetch all the deployments associated with it.

```graphql
query project {
  project(id: "fd92dedc-8a09-42b1-9388-8c7142057a53") {
    id
    name
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
    services {
      edges {
        node {
          id
          name
          deployments {
            edges {
              node {
                id
                status
              }
            }
          }
        }
      }
    }
  }
}
```

### `pluginCreate` Mutation

The mutation below will add the `redis` plugin to an existing project and the response will contain the `id` of the newly created plugin.

```graphql
mutation pluginCreate {
  pluginCreate(
    input: { name: "redis", projectId: "a9f2c2a3-ce89-48e4-9174-2d9874beb966z" }
  ) {
    id
  }
}
```

## Rate Limits

In order to protect the Railway API from spam and misusage, we have established some basic rate limits. The current limit is **1000** requests per **hour** to the API. To help you keep track of your usage, Railway sends a few headers with the response on each request.

| Header                | Description                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| X-RateLimit-Limit     | The maximum number of API requests allowed per day.                                                                                                |
| X-RateLimit-Remaining | The number of API requests your token can make in the current window.                                                                              |
| X-RateLimit-Reset     | The time at which the current window ends and your remaining requests reset.                                                                       |
| Retry-After           | The amount of time after which you can make another request. This header is only sent once you've used up all your requests in the current window. |

## Support

If you run into problems using the API or have any suggestions, feel free to join our [Discord server](https://discord.gg/railway) where you can interact with the engineers working on the API directly.
