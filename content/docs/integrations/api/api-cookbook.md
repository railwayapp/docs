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

Test your connection:

<GraphQLCodeTabs query={`query {
  me {
    id
    name
    email
  }
}`} />

---

## Projects

See [Manage Projects](/integrations/api/manage-projects) for more details.

### List All Projects

<GraphQLCodeTabs query={`query {
  projects {
    edges {
      node {
        id
        name
      }
    }
  }
}`} />

### Get Project with Services

<GraphQLCodeTabs query={`query project($id: String!) {
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
}`} 
variables={{ id: "project-id" }}
requiredFields={[
  { name: "id", label: "ID", path: "id" }
]} />

### Create a Project

<GraphQLCodeTabs query={`mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
  }
}`} 
variables={{ input: { name: "My Project" } }}
requiredFields={[
  { name: "name", label: "Name", path: "input.name" }
]}
optionalFields={[
  { name: "input.description", type: "String", description: "Project description" },
  { name: "input.workspaceId", type: "String", description: "Create in a specific workspace" },
  { name: "input.isPublic", type: "Boolean", description: "Make project publicly visible", apiDefault: "false" },
  { name: "input.prDeploys", type: "Boolean", description: "Enable PR deploy environments", apiDefault: "false" },
  { name: "input.defaultEnvironmentName", type: "String", description: "Name for default environment", apiDefault: "production" }
]} />

---

## Services

See [Manage Services](/integrations/api/manage-services) for more details.

### Create Service from GitHub

<GraphQLCodeTabs query={`mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
  }
}`} 
variables={{ input: { projectId: "project-id", name: "API", source: { repo: "username/repo" } } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "name", label: "Name", path: "input.name" },
  { name: "repo", label: "Repo", path: "input.source.repo" }
]}
optionalFields={[
  { name: "input.branch", type: "String", description: "Git branch to deploy" },
  { name: "input.icon", type: "String", description: "Service icon URL" },
  { name: "input.variables", type: "JSON", description: "Initial environment variables" }
]} />

### Create Service from Docker Image

<GraphQLCodeTabs query={`mutation serviceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
  }
}`} 
variables={{ input: { projectId: "project-id", name: "Ubuntu", source: { image: "ubuntu" } } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "name", label: "Name", path: "input.name" },
  { name: "image", label: "Image", path: "input.source.image" }
]}
optionalFields={[
  { name: "input.icon", type: "String", description: "Service icon URL" },
  { name: "input.variables", type: "JSON", description: "Initial environment variables" }
]} />

### Update Service Settings

<GraphQLCodeTabs query={`mutation serviceInstanceUpdate($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) {
  serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input)
}`} 
variables={{ serviceId: "service-id", environmentId: "environment-id", input: { startCommand: "npm start" } }}
requiredFields={[
  { name: "serviceId", label: "Service ID", path: "serviceId" },
  { name: "environmentId", label: "Environment ID", path: "environmentId" },
  { name: "startCommand", label: "Start Command", path: "input.startCommand" }
]}
optionalFields={[
  { name: "input.buildCommand", type: "String", description: "Custom build command" },
  { name: "input.healthcheckPath", type: "String", description: "Health check endpoint path" },
  { name: "input.numReplicas", type: "Int", description: "Number of replicas", apiDefault: "1" },
  { name: "input.region", type: "String", description: "Deployment region" },
  { name: "input.rootDirectory", type: "String", description: "Root directory for monorepos" },
  { name: "input.cronSchedule", type: "String", description: "Cron schedule for cron jobs" },
  { name: "input.sleepApplication", type: "Boolean", description: "Enable sleep when idle", apiDefault: "false" }
]} />

---

## Deployments

See [Manage Deployments](/integrations/api/manage-deployments) for more details.

### List Recent Deployments

<GraphQLCodeTabs query={`query deployments($input: DeploymentListInput!) {
  deployments(input: $input, first: 5) {
    edges {
      node {
        id
        status
        createdAt
      }
    }
  }
}`} 
variables={{ input: { projectId: "project-id", serviceId: "service-id" } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "serviceId", label: "Service ID", path: "input.serviceId" }
]} />

### Get Deployment Logs

<GraphQLCodeTabs query={`query deploymentLogs($deploymentId: String!, $limit: Int) {
  deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
    timestamp
    message
    severity
  }
}`} 
variables={{ deploymentId: "deployment-id", limit: 100 }}
requiredFields={[
  { name: "deploymentId", label: "Deployment ID", path: "deploymentId" },
  { name: "limit", label: "Limit", path: "limit" }
]} />

### Deploy

<GraphQLCodeTabs query={`mutation serviceInstanceDeploy($serviceId: String!, $environmentId: String!) {
  serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId)
}`} 
variables={{ serviceId: "service-id", environmentId: "environment-id" }}
requiredFields={[
  { name: "serviceId", label: "Service ID", path: "serviceId" },
  { name: "environmentId", label: "Environment ID", path: "environmentId" }
]} />

### Rollback

<GraphQLCodeTabs query={`mutation deploymentRollback($id: String!) {
  deploymentRollback(id: $id) {
    id
  }
}`} 
variables={{ id: "deployment-id" }}
requiredFields={[
  { name: "id", label: "ID", path: "id" }
]} />

---

## Variables

See [Manage Variables](/integrations/api/manage-variables) for more details.

### Get Variables

<GraphQLCodeTabs query={`query variables($projectId: String!, $environmentId: String!, $serviceId: String) {
  variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId)
}`} 
variables={{ projectId: "project-id", environmentId: "environment-id", serviceId: "service-id" }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "projectId" },
  { name: "environmentId", label: "Environment ID", path: "environmentId" },
  { name: "serviceId", label: "Service ID", path: "serviceId" }
]} />

### Set Variables

<GraphQLCodeTabs query={`mutation variableCollectionUpsert($input: VariableCollectionUpsertInput!) {
  variableCollectionUpsert(input: $input)
}`} 
variables={{ input: { projectId: "project-id", environmentId: "environment-id", serviceId: "service-id", variables: { KEY1: "value1", KEY2: "value2" } } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "environmentId", label: "Environment ID", path: "input.environmentId" },
  { name: "serviceId", label: "Service ID", path: "input.serviceId" },
  { name: "KEY1", label: "KEY1", path: "input.variables.KEY1" },
  { name: "KEY2", label: "KEY2", path: "input.variables.KEY2" }
]}
optionalFields={[
  { name: "input.replace", type: "Boolean", description: "Replace all existing variables", apiDefault: "false" },
  { name: "input.skipDeploys", type: "Boolean", description: "Skip automatic redeploy after change", apiDefault: "false" }
]} />

---

## Environments

### List Environments

<GraphQLCodeTabs query={`query environments($projectId: String!) {
  environments(projectId: $projectId) {
    edges {
      node {
        id
        name
      }
    }
  }
}`} 
variables={{ projectId: "project-id" }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "projectId" }
]} />

### Create Environment

<GraphQLCodeTabs query={`mutation environmentCreate($input: EnvironmentCreateInput!) {
  environmentCreate(input: $input) {
    id
  }
}`} 
variables={{ input: { projectId: "project-id", name: "staging" } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "name", label: "Name", path: "input.name" }
]}
optionalFields={[
  { name: "input.sourceEnvironmentId", type: "String", description: "Clone from this environment" },
  { name: "input.ephemeral", type: "Boolean", description: "Create as ephemeral (PR preview)", apiDefault: "false" },
  { name: "input.skipInitialDeploys", type: "Boolean", description: "Don't trigger deploys on creation", apiDefault: "false" }
]} />

---

## Domains

### Add Railway Domain

<GraphQLCodeTabs query={`mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
  serviceDomainCreate(input: $input) {
    domain
  }
}`} 
variables={{ input: { serviceId: "service-id", environmentId: "environment-id" } }}
requiredFields={[
  { name: "serviceId", label: "Service ID", path: "input.serviceId" },
  { name: "environmentId", label: "Environment ID", path: "input.environmentId" }
]}
optionalFields={[
  { name: "input.targetPort", type: "Int", description: "Route traffic to this port" }
]} />

### Add Custom Domain

<GraphQLCodeTabs query={`mutation customDomainCreate($input: CustomDomainCreateInput!) {
  customDomainCreate(input: $input) {
    id
    status {
      dnsRecords {
        hostlabel
        requiredValue
      }
    }
  }
}`} 
variables={{ input: { projectId: "project-id", environmentId: "environment-id", serviceId: "service-id", domain: "api.example.com" } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "environmentId", label: "Environment ID", path: "input.environmentId" },
  { name: "serviceId", label: "Service ID", path: "input.serviceId" },
  { name: "domain", label: "Domain", path: "input.domain" }
]}
optionalFields={[
  { name: "input.targetPort", type: "Int", description: "Route traffic to this port" }
]} />

---

## Volumes

### Create Volume

<GraphQLCodeTabs query={`mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
    id
  }
}`} 
variables={{ input: { projectId: "project-id", serviceId: "service-id", mountPath: "/data" } }}
requiredFields={[
  { name: "projectId", label: "Project ID", path: "input.projectId" },
  { name: "serviceId", label: "Service ID", path: "input.serviceId" },
  { name: "mountPath", label: "Mount Path", path: "input.mountPath" }
]}
optionalFields={[
  { name: "input.environmentId", type: "String", description: "Create in specific environment" },
  { name: "input.region", type: "String", description: "Volume region (e.g., us-west1)" }
]} />

### Create Backup

<GraphQLCodeTabs query={`mutation volumeInstanceBackupCreate($volumeInstanceId: String!) {
  volumeInstanceBackupCreate(volumeInstanceId: $volumeInstanceId)
}`} 
variables={{ volumeInstanceId: "volume-instance-id" }}
requiredFields={[
  { name: "volumeInstanceId", label: "Volume Instance ID", path: "volumeInstanceId" }
]} />

---

## TCP Proxies

### List TCP Proxies

<GraphQLCodeTabs query={`query tcpProxies($serviceId: String!, $environmentId: String!) {
  tcpProxies(serviceId: $serviceId, environmentId: $environmentId) {
    id
    domain
    proxyPort
    applicationPort
  }
}`} 
variables={{ serviceId: "service-id", environmentId: "environment-id" }}
requiredFields={[
  { name: "serviceId", label: "Service ID", path: "serviceId" },
  { name: "environmentId", label: "Environment ID", path: "environmentId" }
]} />

---

## Workspaces

### Get Workspace

<GraphQLCodeTabs query={`query workspace($workspaceId: String!) {
  workspace(workspaceId: $workspaceId) {
    id
    name
    members {
      id
      name
      email
      role
    }
  }
}`} 
variables={{ workspaceId: "workspace-id" }}
requiredFields={[
  { name: "workspaceId", label: "Workspace ID", path: "workspaceId" }
]} />

---

## Useful Queries

### Get Project Token Info

Use with a project token:

<GraphQLCodeTabs query={`query {
  projectToken {
    projectId
    environmentId
  }
}`} />

### List Available Regions

<GraphQLCodeTabs query={`query {
  regions {
    name
    country
    location
  }
}`} />

---

## Tips

### Finding IDs

Press `Cmd/Ctrl + K` in the Railway dashboard and search for "Copy Project ID", "Copy Service ID", or "Copy Environment ID".

### Using the Network Tab

Do the action in the Railway dashboard and inspect the network tab to see the exact GraphQL queries used.

### GraphiQL Playground

Test queries interactively at [railway.com/graphiql](https://railway.com/graphiql).
