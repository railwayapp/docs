---
title: Use the Public API
---

The Railway public API is built with GraphQL and is the same API that powers the Railway dashboard.  

If you haven't used GraphQL before, here are a few resources to get started:

1. The official [Introduction to GraphQL](https://graphql.org/learn/)
2. The [GraphQL Basics](https://hasura.io/learn/graphql/intro-graphql/introduction/) course by Hasura
3. [GraphQL is the better REST](https://www.howtographql.com/basics/1-graphql-is-the-better-rest/) to understand how it is different from a REST API

Use the Public API to integrate Railway into your CI/CD pipelines and other workflows.

## How to Connect

To connect to and query the Public API, you will need the endpoint URL and a token for authentication.

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

For information on rate limits visit the [Public API reference page](/reference/public-api).

## Examples

To help you get started, we have provided some examples in the guides within this section - 
- [Manage Projects](/how-to/manage-projects)
- [Manage Services](/how-to/manage-services)
- [Manage Deployments](/how-to/manage-deployments)
- [Manage Variables](/how-to/manage-variables)

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
