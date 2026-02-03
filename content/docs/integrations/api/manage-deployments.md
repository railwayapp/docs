---
title: Manage Deployments with the Public API
description: Learn how to manage deployments via the public GraphQL API.
---

Here are examples to help you manage your deployments using the Public API.

## List Deployments

Get all deployments for a service in an environment:

<CodeTabs query={`query deployments($input: DeploymentListInput!, $first: Int) {
  deployments(input: $input, first: $first) {
    edges {
      node {
        id
        status
        createdAt
        url
        staticUrl
      }
    }
  }
}`} variables={{ input: { projectId: "project-id", serviceId: "service-id", environmentId: "environment-id" }, first: 10 }} />

## Get a Single Deployment

Fetch a deployment by ID:

<CodeTabs query={`query deployment($id: String!) {
  deployment(id: $id) {
    id
    status
    createdAt
    url
    staticUrl
    meta
    canRedeploy
    canRollback
  }
}`} variables={{ id: "deployment-id" }} />

## Get Latest Active Deployment

Get the currently running deployment:

<CodeTabs query={`query latestDeployment($input: DeploymentListInput!) {
  deployments(input: $input, first: 1) {
    edges {
      node {
        id
        status
        url
        createdAt
      }
    }
  }
}`} variables={{ input: { projectId: "project-id", serviceId: "service-id", environmentId: "environment-id", status: { successfulOnly: true } } }} />

## Get Build Logs

Fetch build logs for a deployment:

<CodeTabs query={`query buildLogs($deploymentId: String!, $limit: Int) {
  buildLogs(deploymentId: $deploymentId, limit: $limit) {
    timestamp
    message
    severity
  }
}`} variables={{ deploymentId: "deployment-id", limit: 500 }} />

## Get Runtime Logs

Fetch runtime logs for a deployment:

<CodeTabs query={`query deploymentLogs($deploymentId: String!, $limit: Int) {
  deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
    timestamp
    message
    severity
  }
}`} variables={{ deploymentId: "deployment-id", limit: 500 }}
optionalFields={[
  { name: "filter", type: "String", description: "Filter logs by text" },
  { name: "startDate", type: "DateTime", description: "Start of time range (ISO 8601)" },
  { name: "endDate", type: "DateTime", description: "End of time range (ISO 8601)" },
]} />

## Get HTTP Logs

Fetch HTTP request logs for a deployment:

<CodeTabs query={`query httpLogs($deploymentId: String!, $limit: Int) {
  httpLogs(deploymentId: $deploymentId, limit: $limit) {
    timestamp
    requestId
    method
    path
    httpStatus
    totalDuration
    srcIp
  }
}`} variables={{ deploymentId: "deployment-id", limit: 100 }} />

## Trigger a Redeploy

Redeploy an existing deployment:

<CodeTabs query={`mutation deploymentRedeploy($id: String!) {
  deploymentRedeploy(id: $id) {
    id
    status
  }
}`} variables={{ id: "deployment-id" }} />

## Restart a Deployment

Restart a running deployment without rebuilding:

<CodeTabs query={`mutation deploymentRestart($id: String!) {
  deploymentRestart(id: $id)
}`} variables={{ id: "deployment-id" }} />

## Rollback to a Deployment

Rollback to a previous deployment:

<CodeTabs query={`mutation deploymentRollback($id: String!) {
  deploymentRollback(id: $id) {
    id
    status
  }
}`} variables={{ id: "deployment-id" }} />

<Banner variant="info">You can only rollback to deployments that have `canRollback: true`.</Banner>

## Stop a Deployment

Stop a running deployment:

<CodeTabs query={`mutation deploymentStop($id: String!) {
  deploymentStop(id: $id)
}`} variables={{ id: "deployment-id" }} />

## Cancel a Deployment

Cancel a deployment that is building or queued:

<CodeTabs query={`mutation deploymentCancel($id: String!) {
  deploymentCancel(id: $id)
}`} variables={{ id: "deployment-id" }} />

## Remove a Deployment

Remove a deployment from the history:

<CodeTabs query={`mutation deploymentRemove($id: String!) {
  deploymentRemove(id: $id)
}`} variables={{ id: "deployment-id" }} />

## Deploy a Specific Service in an Environment

Trigger a deployment for a specific service:

<CodeTabs query={`mutation environmentTriggersDeploy($input: EnvironmentTriggersDeployInput!) {
  environmentTriggersDeploy(input: $input)
}`} variables={{ input: { environmentId: "environment-id", projectId: "project-id", serviceId: "service-id" } }} />

## Deployment Statuses

| Status | Description |
|--------|-------------|
| `BUILDING` | Deployment is being built |
| `DEPLOYING` | Deployment is being deployed |
| `SUCCESS` | Deployment is running successfully |
| `FAILED` | Deployment failed to build or deploy |
| `CRASHED` | Deployment crashed after starting |
| `REMOVED` | Deployment was removed |
| `SLEEPING` | Deployment is sleeping (inactive) |
| `SKIPPED` | Deployment was skipped |
| `WAITING` | Deployment is waiting for approval |
| `QUEUED` | Deployment is queued |
