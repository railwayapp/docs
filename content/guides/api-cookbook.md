---
title: API Cookbook
description: Quick reference for common Railway API operations.
---

This cookbook provides quick copy-paste examples for common API operations. For detailed explanations, see the linked guides.

## Quick Setup

**GraphQL Endpoint:**
```
https://backboard.railway.com/graphql/v2
```

**Authentication:**
```bash
# Set your token (get one from railway.com/account/tokens)
export RAILWAY_TOKEN="your-token"
```

**Test your connection:**

```graphql
query {
  me {
    id
    name
    email
  }
}
```

```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { me { id name email } }"}'
```

---

## Projects

See [Manage Projects](/public-api/manage-projects) for more details.

### List All Projects

```graphql
query {
  projects {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

### Get Project with Services

```graphql
query project($id: String!) {
  project(id: $id) {
    id
    name
    services {
      edges {
        node { id name }
      }
    }
    environments {
      edges {
        node { id name }
      }
    }
  }
}
```

Variables:
```json
{ "id": "your-project-id" }
```

### Create a Project

```graphql
mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
  }
}
```

Variables:
```json
{ "input": { "name": "My Project" } }
```

**Optional fields:** `description` (String), `workspaceId` (String), `isPublic` (Boolean, default: false), `prDeploys` (Boolean, default: false), `defaultEnvironmentName` (String, default: "production")

---

## Services

See [Manage Services](/public-api/manage-services) for more details.

### Create Service from GitHub

```graphql
mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
  }
}
```

Variables:
```json
{
  "input": {
    "projectId": "project-id",
    "name": "API",
    "source": { "repo": "username/repo" }
  }
}
```

**Optional fields:** `branch` (String), `icon` (String), `variables` (JSON)

### Create Service from Docker Image

```graphql
mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
  }
}
```

Variables:
```json
{
  "input": {
    "projectId": "project-id",
    "name": "Ubuntu",
    "source": { "image": "ubuntu" }
  }
}
```

### Update Service Settings

```graphql
mutation serviceInstanceUpdate($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) {
  serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input)
}
```

Variables:
```json
{
  "serviceId": "service-id",
  "environmentId": "environment-id",
  "input": { "startCommand": "npm start" }
}
```

**Optional fields:** `buildCommand`, `healthcheckPath`, `numReplicas` (default: 1), `region`, `rootDirectory`, `cronSchedule`, `sleepApplication` (default: false)

---

## Deployments

See [Manage Deployments](/public-api/manage-deployments) for more details.

### List Recent Deployments

```graphql
query deployments($input: DeploymentListInput!) {
  deployments(input: $input, first: 5) {
    edges {
      node {
        id
        status
        createdAt
      }
    }
  }
}
```

Variables:
```json
{
  "input": {
    "projectId": "project-id",
    "serviceId": "service-id"
  }
}
```

### Get Deployment Logs

```graphql
query deploymentLogs($deploymentId: String!, $limit: Int) {
  deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
    timestamp
    message
    severity
  }
}
```

Variables:
```json
{ "deploymentId": "deployment-id", "limit": 100 }
```

### Trigger a Deploy

```graphql
mutation serviceInstanceDeploy($serviceId: String!, $environmentId: String!) {
  serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId)
}
```

Variables:
```json
{
  "serviceId": "service-id",
  "environmentId": "environment-id"
}
```

### Rollback a Deployment

```graphql
mutation deploymentRollback($id: String!) {
  deploymentRollback(id: $id) {
    id
  }
}
```

Variables:
```json
{ "id": "deployment-id" }
```

---

## Variables

See [Manage Variables](/public-api/manage-variables) for more details.

### Get Variables

```graphql
query variables($projectId: String!, $environmentId: String!, $serviceId: String) {
  variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId)
}
```

Variables:
```json
{
  "projectId": "project-id",
  "environmentId": "environment-id",
  "serviceId": "service-id"
}
```

### Set Variables

```graphql
mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
  variableCollectionUpsert(input: $input)
}
```

Variables:
```json
{
  "input": {
    "projectId": "project-id",
    "environmentId": "environment-id",
    "serviceId": "service-id",
    "variables": {
      "KEY1": "value1",
      "KEY2": "value2"
    }
  }
}
```

**Optional fields:** `replace` (Boolean, default: false - replaces all existing variables), `skipDeploys` (Boolean, default: false)

---

## Environments

### List Environments

```graphql
query environments($projectId: String!) {
  environments(projectId: $projectId) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

Variables:
```json
{ "projectId": "project-id" }
```

### Create Environment

```graphql
mutation environmentCreate($input: EnvironmentCreateInput!) {
  environmentCreate(input: $input) {
    id
  }
}
```

Variables:
```json
{
  "input": {
    "projectId": "project-id",
    "name": "staging"
  }
}
```

**Optional fields:** `sourceEnvironmentId` (String - clone from this environment), `ephemeral` (Boolean, default: false), `skipInitialDeploys` (Boolean, default: false)

---

## Domains

### Add Railway Domain

```graphql
mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
  serviceDomainCreate(input: $input) {
    domain
  }
}
```

Variables:
```json
{
  "input": {
    "serviceId": "service-id",
    "environmentId": "environment-id"
  }
}
```

**Optional fields:** `targetPort` (Int)

### Add Custom Domain

```graphql
mutation customDomainCreate($input: CustomDomainCreateInput!) {
  customDomainCreate(input: $input) {
    id
    status {
      dnsRecords {
        recordType
        hostlabel
        requiredValue
      }
    }
  }
}
```

Variables:
```json
{
  "input": {
    "serviceId": "service-id",
    "environmentId": "environment-id",
    "domain": "api.example.com"
  }
}
```

**Optional fields:** `targetPort` (Int)

---

## Volumes

### Create Volume

```graphql
mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
    id
  }
}
```

Variables:
```json
{
  "input": {
    "projectId": "project-id",
    "serviceId": "service-id",
    "environmentId": "environment-id",
    "mountPath": "/data"
  }
}
```

### List Volumes

```graphql
query project($id: String!) {
  project(id: $id) {
    volumes {
      edges {
        node {
          id
          name
          mountPath
          currentSizeMB
        }
      }
    }
  }
}
```

Variables:
```json
{ "id": "project-id" }
```

---

## Useful Queries

### Get All Service IDs in a Project

```graphql
query project($id: String!) {
  project(id: $id) {
    services {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}
```

### Get Service Latest Deployment Status

```graphql
query project($id: String!) {
  project(id: $id) {
    services {
      edges {
        node {
          name
          serviceInstances {
            edges {
              node {
                environmentId
                latestDeployment {
                  status
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Check Deployment Build Logs

```graphql
query buildLogs($deploymentId: String!, $limit: Int) {
  buildLogs(deploymentId: $deploymentId, limit: $limit) {
    timestamp
    message
  }
}
```

Variables:
```json
{ "deploymentId": "deployment-id", "limit": 200 }
```
