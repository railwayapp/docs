---
title: Manage Environments with the Public API
description: Learn how to manage environments via the public GraphQL API.
---

Here are examples to help you manage your environments using the Public API.

## List Environments

Get all environments for a project:

<CodeTabs query={`query environments($projectId: String!) {
  environments(projectId: $projectId) {
    edges {
      node {
        id
        name
        createdAt
      }
    }
  }
}`} variables={{ projectId: "project-id" }} />

### Exclude Ephemeral Environments

Filter out PR/preview environments:

<CodeTabs query={`query environments($projectId: String!, $isEphemeral: Boolean) {
  environments(projectId: $projectId, isEphemeral: $isEphemeral) {
    edges {
      node {
        id
        name
        createdAt
      }
    }
  }
}`} variables={{ projectId: "project-id", isEphemeral: false }} />

## Get a Single Environment

Fetch an environment by ID with its service instances:

<CodeTabs query={`query environment($id: String!) {
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
}`} variables={{ id: "environment-id" }} />

## Create an Environment

Create a new environment:

<CodeTabs query={`mutation environmentCreate($input: EnvironmentCreateInput!) {
  environmentCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "project-id", name: "staging" } }}
optionalFields={[
  { name: "input.sourceEnvironmentId", type: "String", description: "Clone variables and settings from this environment" },
  { name: "input.ephemeral", type: "Boolean", description: "Create as ephemeral (for PR previews)", apiDefault: "false" },
  { name: "input.skipInitialDeploys", type: "Boolean", description: "Don't trigger deployments on creation", apiDefault: "false" },
  { name: "input.stageInitialChanges", type: "Boolean", description: "Stage changes instead of applying immediately", apiDefault: "false" },
]} />

## Rename an Environment

<CodeTabs query={`mutation environmentRename($id: String!, $input: EnvironmentRenameInput!) {
  environmentRename(id: $id, input: $input)
}`} variables={{ id: "environment-id", input: { name: "new-name" } }} />

## Delete an Environment

<Banner variant="danger">This will delete the environment and all its deployments.</Banner>

<CodeTabs query={`mutation environmentDelete($id: String!) {
  environmentDelete(id: $id)
}`} variables={{ id: "environment-id" }} />

## Get Environment Logs

Fetch logs from all services in an environment:

<CodeTabs query={`query environmentLogs($environmentId: String!, $filter: String) {
  environmentLogs(environmentId: $environmentId, filter: $filter) {
    timestamp
    message
    severity
    tags {
      serviceId
      deploymentId
    }
  }
}`} variables={{ environmentId: "environment-id" }}
optionalFields={[
  { name: "filter", type: "String", description: "Filter logs by text (e.g., 'error')" },
]} />

## Staged Changes

Railway supports staging variable changes before deploying them.

### Get Staged Changes

<CodeTabs query={`query environmentStagedChanges($environmentId: String!) {
  environmentStagedChanges(environmentId: $environmentId)
}`} variables={{ environmentId: "environment-id" }} />

### Commit Staged Changes

<CodeTabs query={`mutation environmentPatchCommitStaged($environmentId: String!) {
  environmentPatchCommitStaged(environmentId: $environmentId)
}`} variables={{ environmentId: "environment-id" }} />
