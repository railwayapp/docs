---
title: Manage Services with the Public API
description: Learn how to create and manage services via the public GraphQL API.
---

Here are examples to help you manage your services using the Public API.

## Get a Service

Fetch a service by ID:

```graphql
query service($id: String!) {
  service(id: $id) {
    id
    name
    icon
    createdAt
    projectId
  }
}
```

**Variables:**
```json
{
  "id": "your-service-id"
}
```

## Get a Service Instance

Get detailed service configuration for a specific environment:

```graphql
query serviceInstance($serviceId: String!, $environmentId: String!) {
  serviceInstance(serviceId: $serviceId, environmentId: $environmentId) {
    id
    serviceName
    startCommand
    buildCommand
    rootDirectory
    healthcheckPath
    region
    numReplicas
    restartPolicyType
    restartPolicyMaxRetries
    latestDeployment {
      id
      status
      createdAt
    }
  }
}
```

**Variables:**
```json
{
  "serviceId": "your-service-id",
  "environmentId": "your-environment-id"
}
```

## Create a Service

### From a GitHub Repository

```graphql
mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
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
    "name": "My API",
    "source": {
      "repo": "username/repo-name"
    }
  }
}
```

### From a Docker Image

```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "Redis",
    "source": {
      "image": "redis:7-alpine"
    }
  }
}
```

### Empty Service (No Source)

Create an empty service that you can configure later:

```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "Backend API"
  }
}
```

### With Initial Variables

Create a service with environment variables:

```json
{
  "input": {
    "projectId": "your-project-id",
    "name": "My Service",
    "source": {
      "repo": "username/repo-name"
    },
    "variables": {
      "NODE_ENV": "production",
      "PORT": "3000"
    }
  }
}
```

## Update a Service

Update service name or icon:

```graphql
mutation serviceUpdate($id: String!, $input: ServiceUpdateInput!) {
  serviceUpdate(id: $id, input: $input) {
    id
    name
    icon
  }
}
```

**Variables:**
```json
{
  "id": "your-service-id",
  "input": {
    "name": "Renamed Service",
    "icon": "https://devicons.railway.app/i/nodejs.svg"
  }
}
```

## Update Service Instance Settings

Update build/deploy settings for a service in a specific environment:

```graphql
mutation serviceInstanceUpdate(
  $serviceId: String!
  $environmentId: String!
  $input: ServiceInstanceUpdateInput!
) {
  serviceInstanceUpdate(
    serviceId: $serviceId
    environmentId: $environmentId
    input: $input
  )
}
```

### Set Start Command

```json
{
  "serviceId": "your-service-id",
  "environmentId": "your-environment-id",
  "input": {
    "startCommand": "npm run start"
  }
}
```

### Set Build Command

```json
{
  "input": {
    "buildCommand": "npm run build"
  }
}
```

### Set Root Directory (Monorepos)

```json
{
  "input": {
    "rootDirectory": "apps/api"
  }
}
```

### Configure Health Checks

```json
{
  "input": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

### Set Region

```json
{
  "input": {
    "region": "us-west1"
  }
}
```

### Configure Replicas

```json
{
  "input": {
    "numReplicas": 3
  }
}
```

### Set Restart Policy

```json
{
  "input": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5
  }
}
```

Valid restart policies: `ON_FAILURE`, `ALWAYS`, `NEVER`

### Configure Cron Schedule

```json
{
  "input": {
    "cronSchedule": "0 0 * * *"
  }
}
```

## Connect a Service to a Repo

Connect an existing service to a GitHub repository:

```graphql
mutation serviceConnect($id: String!, $input: ServiceConnectInput!) {
  serviceConnect(id: $id, input: $input) {
    id
  }
}
```

**Variables:**
```json
{
  "id": "your-service-id",
  "input": {
    "repo": "username/repo-name",
    "branch": "main"
  }
}
```

## Disconnect a Service from a Repo

```graphql
mutation serviceDisconnect($id: String!) {
  serviceDisconnect(id: $id) {
    id
  }
}
```

## Deploy a Service

Trigger a new deployment for a service:

```graphql
mutation serviceInstanceDeployV2($serviceId: String!, $environmentId: String!) {
  serviceInstanceDeployV2(serviceId: $serviceId, environmentId: $environmentId)
}
```

**Variables:**
```json
{
  "serviceId": "your-service-id",
  "environmentId": "your-environment-id"
}
```

This returns the deployment ID.

## Redeploy a Service

Redeploy the latest deployment:

```graphql
mutation serviceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
  serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
}
```

## Get Resource Limits

Get the resource limits for a service instance:

```graphql
query serviceInstanceLimits($serviceId: String!, $environmentId: String!) {
  serviceInstanceLimits(serviceId: $serviceId, environmentId: $environmentId) {
    cpu
    memory
    disk
  }
}
```

## Delete a Service

<Banner variant="danger">This will delete the service and all its deployments.</Banner>

```graphql
mutation serviceDelete($id: String!) {
  serviceDelete(id: $id)
}
```

**Variables:**
```json
{
  "id": "your-service-id"
}
```
