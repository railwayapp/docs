---
title: Manage Environments with the Public API
description: Learn how to manage environments via the public GraphQL API.
---

Here are examples to help you manage your environments using the Public API.

## List Environments

Get all environments for a project:

```graphql
query environments($projectId: String!) {
  environments(projectId: $projectId) {
    edges {
      node {
        id
        name
        createdAt
      }
    }
  }
}
```

**Variables:**
```json
{
  "projectId": "your-project-id"
}
```

### Exclude Ephemeral Environments

Filter out PR/preview environments:

```json
{
  "projectId": "your-project-id",
  "isEphemeral": false
}
```

## Get a Single Environment

Fetch an environment by ID with its service instances:

```graphql
query environment($id: String!) {
  environment(id: $id) {
    id
    name
    createdAt
    serviceInstances {
      edges {
        node {
          id
          serviceName
          latestDeployment {
            id
            status
          }
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "id": "your-environment-id"
}
```

## Create an Environment

Create a new environment:

```graphql
mutation environmentCreate($input: EnvironmentCreateInput!) {
  environmentCreate(input: $input) {
    id
    name
  }
}
```

**Variables:**
```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "staging"
  }
}
```

### Clone from Another Environment

Create an environment that copies variables and settings from an existing one:

```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "staging",
    "sourceEnvironmentId": "production-environment-id"
  }
}
```

### Skip Initial Deploys

Create an environment without triggering deployments:

```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "staging",
    "skipInitialDeploys": true
  }
}
```

### Create an Ephemeral Environment

Create a temporary environment (useful for PR previews):

```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "pr-123",
    "ephemeral": true
  }
}
```

## Rename an Environment

```graphql
mutation environmentRename($id: String!, $name: String!) {
  environmentRename(id: $id, name: $name)
}
```

**Variables:**
```json
{
  "id": "your-environment-id",
  "name": "new-name"
}
```

## Delete an Environment

<Banner variant="danger">This will delete the environment and all its deployments.</Banner>

```graphql
mutation environmentDelete($id: String!) {
  environmentDelete(id: $id)
}
```

**Variables:**
```json
{
  "id": "your-environment-id"
}
```

## Deploy All Services

Trigger deployments for all services in an environment:

```graphql
mutation environmentTriggersDeploy($environmentId: String!, $projectId: String!) {
  environmentTriggersDeploy(environmentId: $environmentId, projectId: $projectId)
}
```

**Variables:**
```json
{
  "environmentId": "your-environment-id",
  "projectId": "your-project-id"
}
```

## Get Environment Logs

Fetch logs from all services in an environment:

```graphql
query environmentLogs($environmentId: String!, $filter: String) {
  environmentLogs(environmentId: $environmentId, filter: $filter) {
    timestamp
    message
    severity
    tags {
      serviceId
      deploymentId
    }
  }
}
```

**Variables:**
```json
{
  "environmentId": "your-environment-id"
}
```

### Filter by Text

```json
{
  "environmentId": "your-environment-id",
  "filter": "error"
}
```

## Staged Changes

Railway supports staging variable changes before deploying them.

### Get Staged Changes

```graphql
query environmentStagedChanges($environmentId: String!) {
  environmentStagedChanges(environmentId: $environmentId)
}
```

### Commit Staged Changes

```graphql
mutation environmentPatchCommitStaged($environmentId: String!) {
  environmentPatchCommitStaged(environmentId: $environmentId)
}
```
