---
title: Use the Public API
description: Discover the Railway GraphQL Public API.
---

The Railway public API is built with GraphQL and is the same API that powers the Railway dashboard.

Use the Public API to integrate Railway into your CI/CD pipelines and other workflows.

## Understanding GraphQL

If you haven't used GraphQL before, here are a few resources to get started:

1. The official [Introduction to GraphQL](https://graphql.org/learn/)
2. The [GraphQL Basics](https://hasura.io/learn/graphql/intro-graphql/introduction/) course by Hasura
3. [GraphQL is the better REST](https://www.howtographql.com/basics/1-graphql-is-the-better-rest/) to understand how it is different from a REST API

## Connecting to the Public API

To connect to and query the Public API, you will need the endpoint URL and a token for authentication.

### Endpoint

The public API is accessible at the following endpoint:

```bash
https://backboard.railway.com/graphql/v2
```

### Creating a Token

To use the API, you will need an API token. There are three types of tokens you can create.

#### Team Tokens and Account Tokens

You can create an API token from the [tokens page](https://railway.com/account/tokens) in your account settings.

<Image src="https://res.cloudinary.com/railway/image/upload/v1667386744/docs/new-token-form_rhrbw8.png"
alt="New token form"
layout="responsive"
width={1618 } height={378} quality={80} />

- **Team token** - Select a team in the `Team` dropdown to create a token tied to a team. A team token has access to all the team's resources, and cannot be used to access your personal resources on Railway. Feel free to share this token with your teammates.
- **Account token** - If you do not select a team, the token will be tied to your Railway account and will have access to all your resources including the teams you are a part of. Do not share this token with anyone else.

_Note that Teams are a Pro feature._

#### Project Token

You can create a project token from the tokens page in your project settings.

Project tokens are scoped to a specific environment within a project and can only be used to authenticate requests to that environment.

#### OAuth Access Token

If you're building an application that acts on behalf of users, you can use [Login with Railway](/reference/oauth/login-with-railway) to obtain an access token through the OAuth flow. The token's permissions depend on the scopes the user approved.

### Execute a Test Query

Once you have your token, you can pass it within the Authorization header of your request.

#### Using an Account Token

You can try the query below in the terminal of your choice. It should return your name and email on Railway:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Authorization: Bearer <API_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { me { name email } }"}'
```

**Note:** This query **cannot** be used with a team or project token because the data returned is scoped to your personal account.

#### Using a Team Token

If you have a team token, you can use it to authenticate requests to a specific team. The query below should return the team name and ID:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Team-Access-Token: <TEAM_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { team(id: \"<TEAM_ID_GOES_HERE>\") { name id } }"}'
```

**Note:** This query **can** also be used with an account token as long as you are a member of the team.

#### Using a Project Token

If you have a project token, you can use it to authenticate requests to a specific environment within a project. The query below should return the project and environment IDs:

```bash
curl --request POST \
  --url https://backboard.railway.com/graphql/v2 \
  --header 'Project-Access-Token: <PROJECT_TOKEN_GOES_HERE>' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query { projectToken { projectId environmentId } }"}'
```

## Viewing the Schema

Use popular tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to connect to the API and query the schema. Simply set up your connection with the endpoint and Authorization token, and fetch the schema.

### API Collection File

We also provide a collection file which can be imported into your preferred API client. Click [here](https://gql-collection-server.up.railway.app/railway_graphql_collection.json) to download it.

Once imported, you should only need to add your API token to get connected and start executing queries in the collection.

### GraphiQL Playground

Alternatively, you can use our [GraphiQL playground](https://railway.com/graphiql) to view the schema and test your queries.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694611003/rw-graphiql_zs2l28.png" alt="GraphiQL Playground" layout="responsive" width={6568} height={3886} quality={80} />

Make sure to set an Authorization header with an [auth token](/reference/public-api#authentication). Click the "Headers" tab at the bottom of the GraphiQL page and enter this json, using your own token:

```json
{ "Authorization": "Bearer <API_TOKEN_GOES_HERE>" }
```

## Tips and Tricks

### Resource IDs

While building your queries, if you quickly need to copy resource IDs, you can hit `Cmd/Ctrl + K` within your project and copy the project/service/environment ID.

<Image src="https://res.cloudinary.com/railway/image/upload/v1694616111/rw-cmd-palette_s5yilj.png" alt="Railway Command Palette" height={678} width={1176} quality={80} />

### The Network Tab

If you're unsure about what query/mutation to use for what you are trying to achieve, you can always do the action in the dashboard and look for the request in the network tab. As we use the same API internally, you can simply grab the name and then look for specific query in the introspected schema.

### External Resources

1. The [awesome-graphql](https://github.com/chentsulin/awesome-graphql) repository is a great resource for all things GraphQL with implementations available across a variety of languages.
2. The [GraphQL Discord](https://discord.graphql.org/) is the official Discord channel for graphql.org with a lot of active members and specific help channels.

## Examples

To help you get started, we have provided some example queries in the guides within this section -

- [Manage Projects](/guides/manage-projects)
- [Manage Services](/guides/manage-services)
- [Manage Deployments](/guides/manage-deployments)
- [Manage Variables](/guides/manage-variables)

## Support

If you run into problems using the API or have any suggestions, feel free to join our [Discord server](https://discord.gg/railway) where you can interact with the engineers working on the API directly.

### Rate Limits

Rate limits are enforced on the Public API. For details on the limits visit the [Public API reference page](/reference/public-api#rate-limits).
