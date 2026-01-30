---
title: Manage Services with the Public API
description: Learn how to create and manage services via the public GraphQL API.
---

Here are examples to help you manage your services using the Public API.

## Get a Service

Fetch a service by ID:

<CodeTabs query={`query service($id: String!) {
  service(id: $id) {
    id
    name
    icon
    createdAt
    projectId
  }
}`} variables={{ id: "service-id" }} />

## Get a Service Instance

Get detailed service configuration for a specific environment:

<CodeTabs query={`query serviceInstance($serviceId: String!, $environmentId: String!) {
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
}`} variables={{ serviceId: "service-id", environmentId: "environment-id" }} />

## Create a Service

### From a GitHub Repository

<CodeTabs query={`mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "project-id", name: "My API", source: { repo: "username/repo-name" } } }}
optionalFields={[
  { name: "input.branch", type: "String", description: "Git branch to deploy" },
  { name: "input.icon", type: "String", description: "Service icon URL" },
  { name: "input.variables", type: "JSON", description: "Initial environment variables" },
]} />

### From a Docker Image

<CodeTabs query={`mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "project-id", name: "Redis", source: { image: "redis:7-alpine" } } }}
optionalFields={[
  { name: "input.icon", type: "String", description: "Service icon URL" },
  { name: "input.variables", type: "JSON", description: "Initial environment variables" },
]} />

### Empty Service (No Source)

Create an empty service that you can configure later:

<CodeTabs query={`mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "project-id", name: "Backend API" } }}
optionalFields={[
  { name: "input.icon", type: "String", description: "Service icon URL" },
  { name: "input.variables", type: "JSON", description: "Initial environment variables" },
]} />

## Update a Service

Update service name or icon:

<CodeTabs query={`mutation serviceUpdate($id: String!, $input: ServiceUpdateInput!) {
  serviceUpdate(id: $id, input: $input) {
    id
    name
    icon
  }
}`} variables={{ id: "service-id", input: { name: "Renamed Service" } }}
optionalFields={[
  { name: "input.icon", type: "String", description: "Service icon URL" },
]} />

## Update Service Instance Settings

Update build/deploy settings for a service in a specific environment. Click "Additional options" to see all available settings:

<CodeTabs query={`mutation serviceInstanceUpdate($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) {
  serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input)
}`} variables={{ serviceId: "service-id", environmentId: "environment-id", input: { startCommand: "npm run start" } }}
optionalFields={[
  { name: "input.buildCommand", type: "String", description: "Custom build command" },
  { name: "input.rootDirectory", type: "String", description: "Root directory for monorepos" },
  { name: "input.healthcheckPath", type: "String", description: "Health check endpoint path" },
  { name: "input.healthcheckTimeout", type: "Int", description: "Health check timeout in seconds", apiDefault: "300" },
  { name: "input.region", type: "String", description: "Deployment region (e.g., us-west1)" },
  { name: "input.numReplicas", type: "Int", description: "Number of replicas", apiDefault: "1" },
  { name: "input.restartPolicyType", type: "RestartPolicyType", description: "ON_FAILURE, ALWAYS, or NEVER", apiDefault: "ON_FAILURE" },
  { name: "input.restartPolicyMaxRetries", type: "Int", description: "Max restart retries", apiDefault: "10" },
  { name: "input.cronSchedule", type: "String", description: "Cron schedule (e.g., 0 0 * * *)" },
  { name: "input.sleepApplication", type: "Boolean", description: "Enable sleep when idle", apiDefault: "false" },
  { name: "input.dockerfilePath", type: "String", description: "Custom Dockerfile path" },
  { name: "input.watchPatterns", type: "[String!]", description: "File patterns to watch for changes" },
]} />

## Connect a Service to a Repo

Connect an existing service to a GitHub repository:

<CodeTabs query={`mutation serviceConnect($id: String!, $input: ServiceConnectInput!) {
  serviceConnect(id: $id, input: $input) {
    id
  }
}`} variables={{ id: "service-id", input: { repo: "username/repo-name", branch: "main" } }} />

## Disconnect a Service from a Repo

<CodeTabs query={`mutation serviceDisconnect($id: String!) {
  serviceDisconnect(id: $id) {
    id
  }
}`} variables={{ id: "service-id" }} />

## Deploy a Service

Trigger a new deployment for a service:

<CodeTabs query={`mutation serviceInstanceDeployV2($serviceId: String!, $environmentId: String!) {
  serviceInstanceDeployV2(serviceId: $serviceId, environmentId: $environmentId)
}`} variables={{ serviceId: "service-id", environmentId: "environment-id" }} />

This returns the deployment ID.

## Redeploy a Service

Redeploy the latest deployment:

<CodeTabs query={`mutation serviceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
  serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
}`} variables={{ serviceId: "service-id", environmentId: "environment-id" }} />

## Get Resource Limits

Get the resource limits for a service instance (returns a JSON object):

<CodeTabs query={`query serviceInstanceLimits($serviceId: String!, $environmentId: String!) {
  serviceInstanceLimits(serviceId: $serviceId, environmentId: $environmentId)
}`} variables={{ serviceId: "service-id", environmentId: "environment-id" }} />

## Delete a Service

<Banner variant="danger">This will delete the service and all its deployments.</Banner>

<CodeTabs query={`mutation serviceDelete($id: String!) {
  serviceDelete(id: $id)
}`} variables={{ id: "service-id" }} />
