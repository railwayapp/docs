---
title: Public API Reference
---

The Railway public API is built with GraphQL and is the same API that powers the Railway dashboard.

If you haven't used GraphQL before, here are a few resources to get started:

1. The official [Introduction to GraphQL](https://graphql.org/learn/)
2. The [GraphQL Basics](https://hasura.io/learn/graphql/intro-graphql/introduction/) course by Hasura
3. [GraphQL is the better REST](https://www.howtographql.com/basics/1-graphql-is-the-better-rest/) to understand how it is different from a REST API

## How to Connect

In order to connect to and query the Public API, you will need the endpoint URL and a token for authentication.

### Endpoint

The public API is accessible at the following endpoint:

```bash
https://backboard.railway.app/graphql/v2
```

### Authentication

To use the API, you will need an API token. You can create one by visiting the [tokens page](https://railway.app/account/tokens) in your account settings. There are two types of tokens you can create.

<Image src="https://res.cloudinary.com/railway/image/upload/v1667386744/docs/new-token-form_rhrbw8.png"
alt="New token form"
layout="responsive"
width={1618 } height={378} quality={80} />

#### Team token

If you select a `Team` in the dropdown in the image above, the token will be tied to that team and will have access to all the team's resources. This token cannot be used to access your personal resources on Railway so feel free to share it with your teammates.

#### Personal token

If you do not select a `Team`, the token will be tied to your Railway account and will have access to all your resources. Do not share this token with anyone else.

Once you have your token, you can pass it within the `Authorization` header of your request. You can try the query below in the terminal of your choice. It should return your name and email on Railway:

```bash
curl --request POST \
  --url https://backboard.railway.app/graphql/v2 \
  --header 'Authorization: Bearer <API_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { me { name email } }"}'
```

## Schema

The Railway API supports introspection meaning you can use popular tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to query the schema.  Simply set up your connection with the endpoint and Authorization token, and fetch the schema.

### API Collection File

We also provide a collection file which can be imported into your preferred API client.  Click [here](https://gql-collection-server.up.railway.app/railway_graphql_collection.json) to download it.

Once imported, you should only need to add your API token to get connected and start executing queries in the collection.

### GraphiQL Playground

Alternatively, you can use our [GraphiQL playground](https://railway.app/graphiql) to view the schema and test your queries.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694611003/rw-graphiql_zs2l28.png" alt="GraphiQL Playground" layout="responsive" width={6568} height={3886} quality={80} />


## Rate Limits

In order to protect the Railway API from spam and misusage, we have established some basic rate limits. The current limit is **1000** requests per **hour** to the API. To help you keep track of your usage, Railway sends a few headers with the response on each request.

| Header                | Description                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| X-RateLimit-Limit     | The maximum number of API requests allowed per day.                                                                                                |
| X-RateLimit-Remaining | The number of API requests your token can make in the current window.                                                                              |
| X-RateLimit-Reset     | The time at which the current window ends and your remaining requests reset.                                                                       |
| Retry-After           | The amount of time after which you can make another request. This header is only sent once you've used up all your requests in the current window. |

## Examples

To help you get started, here are a few examples for reference.

### Projects

#### Fetch all your projects

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

#### Delete a project

<Banner variant="danger">This is a destructive action</Banner>

The mutation below will delete the project with the specified `id`.

```graphql
mutation projectDelete {
  projectDelete(id: "5e594338-0faa-415f-b2a7-2b5f2d4ec11a")
}
```

### Plugins

#### Add a plugin to a project

The mutation below will add the `redis` plugin to the specified project. The response will contain all the fields from the newly created plugin.

<Banner variant="info">The supported plugin types are: `redis`, `mysql`, `mongodb` and `postgresql`.</Banner>

```graphql
mutation pluginCreate {
  pluginCreate(
    input: { name: "redis", projectId: "a9f2c2a3-ce89-48e4-9174-2d9874beb966z" }
  ) {
    id
  }
}
```

### Services

#### Create a new service with a GitHub repo

The mutation below will create a new service with the specified GitHub repo attached. The response will contain the newly created service.

<Banner variant="info">You can also use `image` inside the `source` to attach a Docker image to the service.</Banner>

```graphql
mutation serviceCreate {
  serviceCreate(
    input: {
      projectId: "8df3b1d6-2317-4400-b267-56c4a42eed06"
      source: { repo: "railwayapp-templates/django" }
    }
  ) {
    id
  }
}
```

### Deployments

#### Fetch latest active deployment

The query below will fetch the latest active deployment for a service for a specific environment.

```graphql
query deployments {
  deployments(
    first: 1
    input: {
      projectId: "8df3b1d6-2317-4400-b267-56c4a42eed06"
      environmentId: "9fb4baf0-809a-40ec-af32-751f50890802"
      serviceId: "4bd252dc-c4ac-4c2e-a52f-051804292035"
    }
  ) {
    edges {
      node {
        id
        staticUrl
      }
    }
  }
}
```

#### Restarting a deployment

The query below will restart the deployment with the specified `id`.

```graphql
mutation deploymentRestart {
  deploymentRestart(id: "9d5b1306-e22e-4357-9b3f-cc3b97ed8240")
}
```

### Variables

#### Fetch variables for a service

The query below will fetch all the variables for a service for a specific environment. The response will contain all the variables in a key/value object.

<Banner variant="info">You can omit the `serviceId` from this query to fetch the shared variables for the environment.</Banner>

```graphql
query variables {
  variables(
    projectId: "8df3b1d6-2317-4400-b267-56c4a42eed06"
    environmentId: "9fb4baf0-809a-40ec-af32-751f50890802"
    serviceId: "4bd252dc-c4ac-4c2e-a52f-051804292035"
  )
}
```

#### Upsert variable for a service

The mutation below will upsert a new variable for the specified service within the specified environment. You can use this to both create and update variables.

<Banner variant="info">You can omit the `serviceId` from this mutation to create a shared variable.</Banner>

```graphql
mutation variableUpsert {
  variableUpsert(
    input: {
      projectId: "8df3b1d6-2317-4400-b267-56c4a42eed06"
      environmentId: "9fb4baf0-809a-40ec-af32-751f50890802"
      serviceId: "4bd252dc-c4ac-4c2e-a52f-051804292035"
      name: "NEW_VARIABLE"
      value: "SECRET_VALUE"
    }
  )
}
```

## Tips and Tricks

### Resource IDs

While building your queries, if you quickly need to copy resource IDs, you can hit `Cmd/Ctrl + K` within your project and copy the project/service/environment ID.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694616111/rw-cmd-palette_s5yilj.png" alt="Railway Command Palette" height={678} width={1176} quality={80} />

### The network tab

If you're unsure about what query/mutation to use for what you are trying to achieve, you can always do the action in the dashboard and look for the request in the network tab. As we use the same API internally, you can simply grab the name and then look for specific query in the introspected schema.

### External resources

1. The [awesome-graphql](https://github.com/chentsulin/awesome-graphql) repository is a great resource for all things GraphQL with implementations available across a variety of languages.
2. The [GraphQL Discord](https://discord.graphql.org/) is the official Discord channel for graphql.org with a lot of active members and specific help channels.

## Support

If you run into problems using the API or have any suggestions, feel free to join our [Discord server](https://discord.gg/railway) where you can interact with the engineers working on the API directly.
