---
title: Manage Variables with the Public API
description: Learn how to manage variables via the public GraphQL API.
---

Here are some examples to help you get started managing your variables using the Public API.

### Fetch Variables For a Service

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

### Upsert Variable For a Service

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
