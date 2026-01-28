---
title: Manage Variables with the Public API
description: Learn how to manage environment variables via the public GraphQL API.
---

Here are examples to help you manage your environment variables using the Public API.

## Get Variables for a Service

Fetch all variables for a service in a specific environment:

<CodeTabs query={`query variables(
  $projectId: String!
  $environmentId: String!
  $serviceId: String
) {
  variables(
    projectId: $projectId
    environmentId: $environmentId
    serviceId: $serviceId
  )
}`} variables={{ projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>" }} />

**Response:**
```json
{
  "data": {
    "variables": {
      "DATABASE_URL": "postgres://...",
      "NODE_ENV": "production",
      "PORT": "3000"
    }
  }
}
```

## Get Shared Variables

Omit the `serviceId` to get shared variables for an environment:

<CodeTabs query={`query variables($projectId: String!, $environmentId: String!) {
  variables(projectId: $projectId, environmentId: $environmentId)
}`} variables={{ projectId: "<your-project-id>", environmentId: "<your-environment-id>" }} />

## Get Unrendered Variables

Get variables with references intact (not resolved):

<CodeTabs query={`query variables(
  $projectId: String!
  $environmentId: String!
  $serviceId: String
  $unrendered: Boolean
) {
  variables(
    projectId: $projectId
    environmentId: $environmentId
    serviceId: $serviceId
    unrendered: $unrendered
  )
}`} variables={{ projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", unrendered: "true" }} />

This returns variables like `${{Postgres.DATABASE_URL}}` instead of the resolved value.

## Create or Update a Variable

Upsert a single variable:

<CodeTabs query={`mutation variableUpsert($input: VariableUpsertInput!) {
  variableUpsert(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", name: "API_KEY", value: "secret-key-here" } }} />

### Create a Shared Variable

Omit `serviceId` to create a shared variable:

<CodeTabs query={`mutation variableUpsert($input: VariableUpsertInput!) {
  variableUpsert(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", name: "SHARED_SECRET", value: "shared-value" } }} />

### Skip Automatic Redeploy

By default, changing a variable triggers a redeploy. To prevent this:

<CodeTabs query={`mutation variableUpsert($input: VariableUpsertInput!) {
  variableUpsert(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", name: "API_KEY", value: "new-value", skipDeploys: "true" } }} />

## Upsert Multiple Variables

Update multiple variables at once:

<CodeTabs query={`mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
  variableCollectionUpsert(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", variables: { DATABASE_URL: "postgres://...", REDIS_URL: "redis://...", NODE_ENV: "production" } } }} />

### Replace All Variables

To replace all existing variables (delete any not in the new set):

<CodeTabs query={`mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
  variableCollectionUpsert(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", variables: { NEW_VAR: "value" }, replace: "true" } }} />

<Banner variant="warning">Using `replace: true` will delete all variables not included in the `variables` object.</Banner>

## Delete a Variable

Delete a single variable:

<CodeTabs query={`mutation variableDelete($input: VariableDeleteInput!) {
  variableDelete(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", name: "OLD_VARIABLE" } }} />

## Get Rendered Variables for Deployment

Get all variables as they would appear during a deployment (with all references resolved):

<CodeTabs query={`query variablesForServiceDeployment(
  $projectId: String!
  $environmentId: String!
  $serviceId: String!
) {
  variablesForServiceDeployment(
    projectId: $projectId
    environmentId: $environmentId
    serviceId: $serviceId
  )
}`} variables={{ projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>" }} />

## Variable References

Railway supports referencing variables from other services using the syntax:

```
${{ServiceName.VARIABLE_NAME}}
```

For example, to reference a database URL from a Postgres service:

<CodeTabs query={`mutation variableUpsert($input: VariableUpsertInput!) {
  variableUpsert(input: $input)
}`} variables={{ input: { projectId: "<your-project-id>", environmentId: "<your-environment-id>", serviceId: "<your-service-id>", name: "DATABASE_URL", value: "${{Postgres.DATABASE_URL}}" } }} />

## Common Patterns

### Copy Variables Between Environments

1. Fetch variables from source environment
2. Upsert to target environment using `variableCollectionUpsert`

### Import from .env File

Parse your `.env` file and use `variableCollectionUpsert` to set all variables at once.

### Rotate Secrets

Use `variableUpsert` with `skipDeploys: true` for all services, then trigger deployments manually when ready.
