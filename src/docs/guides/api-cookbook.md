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
export RAILWAY_TOKEN="<your-token>"
```

Test your connection:

<CodeTabs query={`query {
  me {
    id
    name
    email
  }
}`} />

---

## Projects

See [Manage Projects](/guides/manage-projects) for more details.

### List All Projects

<CodeTabs query={`query {
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

<CodeTabs query={`query project($id: String!) {
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
}`} variables={{ id: "<your-project-id>" }} />

### Create a Project

<CodeTabs query={`mutation {
  projectCreate(input: { name: "My Project" }) {
    id
  }
}`} />

---

## Services

See [Manage Services](/guides/manage-services) for more details.

### Create Service from GitHub

<CodeTabs query={`mutation {
  serviceCreate(input: {
    projectId: "<your-project-id>"
    name: "API"
    source: { repo: "username/repo" }
  }) {
    id
  }
}`} />

### Create Service from Docker Image

<CodeTabs query={`mutation {
  serviceCreate(input: {
    projectId: "<your-project-id>"
    name: "Redis"
    source: { image: "redis:7-alpine" }
  }) {
    id
  }
}`} />

### Update Service Settings

<CodeTabs query={`mutation {
  serviceInstanceUpdate(
    serviceId: "<your-service-id>"
    environmentId: "<your-environment-id>"
    input: {
      startCommand: "npm start"
      healthcheckPath: "/health"
    }
  )
}`} />

---

## Deployments

See [Manage Deployments](/guides/manage-deployments) for more details.

### List Recent Deployments

<CodeTabs query={`query deployments($input: DeploymentListInput!) {
  deployments(input: $input, first: 5) {
    edges {
      node {
        id
        status
        createdAt
      }
    }
  }
}`} variables={{ input: { projectId: "<your-project-id>", serviceId: "<your-service-id>" } }} />

### Get Deployment Logs

<CodeTabs query={`query {
  deploymentLogs(deploymentId: "<your-deployment-id>", limit: 100) {
    timestamp
    message
    severity
  }
}`} />

### Redeploy

<CodeTabs query={`mutation {
  deploymentRedeploy(id: "<your-deployment-id>") {
    id
  }
}`} />

### Rollback

<CodeTabs query={`mutation {
  deploymentRollback(id: "<your-deployment-id>") {
    id
  }
}`} />

---

## Variables

See [Manage Variables](/guides/manage-variables) for more details.

### Get Variables

<CodeTabs query={`query {
  variables(
    projectId: "<your-project-id>"
    environmentId: "<your-environment-id>"
    serviceId: "<your-service-id>"
  )
}`} />

### Set a Variable

<CodeTabs query={`mutation {
  variableUpsert(input: {
    projectId: "<your-project-id>"
    environmentId: "<your-environment-id>"
    serviceId: "<your-service-id>"
    name: "API_KEY"
    value: "secret"
  })
}`} />

### Set Multiple Variables

<CodeTabs query={`mutation {
  variableCollectionUpsert(input: {
    projectId: "<your-project-id>"
    environmentId: "<your-environment-id>"
    serviceId: "<your-service-id>"
    variables: {
      "KEY1": "value1"
      "KEY2": "value2"
    }
  })
}`} />

---

## Environments

See [Manage Environments](/guides/manage-environments) for more details.

### List Environments

<CodeTabs query={`query {
  environments(projectId: "<your-project-id>") {
    edges {
      node {
        id
        name
      }
    }
  }
}`} />

### Create Environment

<CodeTabs query={`mutation {
  environmentCreate(input: {
    projectId: "<your-project-id>"
    name: "staging"
  }) {
    id
  }
}`} />

---

## Domains

See [Manage Domains](/guides/manage-domains) for more details.

### Add Railway Domain

<CodeTabs query={`mutation {
  serviceDomainCreate(input: {
    serviceId: "<your-service-id>"
    environmentId: "<your-environment-id>"
  }) {
    domain
  }
}`} />

### Add Custom Domain

<CodeTabs query={`mutation {
  customDomainCreate(input: {
    projectId: "<your-project-id>"
    environmentId: "<your-environment-id>"
    serviceId: "<your-service-id>"
    domain: "api.example.com"
  }) {
    id
    status {
      dnsRecords {
        hostlabel
        requiredValue
      }
    }
  }
}`} />

---

## Volumes

See [Manage Volumes](/guides/manage-volumes) for more details.

### Create Volume

<CodeTabs query={`mutation {
  volumeCreate(input: {
    projectId: "<your-project-id>"
    serviceId: "<your-service-id>"
    mountPath: "/data"
  }) {
    id
  }
}`} />

### Create Backup

<CodeTabs query={`mutation {
  volumeInstanceBackupCreate(volumeInstanceId: "<your-volume-instance-id>")
}`} />

---

## TCP Proxies

### List TCP Proxies

<CodeTabs query={`query {
  tcpProxies(
    serviceId: "<your-service-id>"
    environmentId: "<your-environment-id>"
  ) {
    id
    domain
    proxyPort
    applicationPort
  }
}`} />

---

## Workspaces / Teams

### Get Workspace

<CodeTabs query={`query workspace($workspaceId: String!) {
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
}`} variables={{ workspaceId: "<your-workspace-id>" }} />

---

## Useful Queries

### Get Current User

<CodeTabs query={`query {
  me {
    id
    name
    email
  }
}`} />

### Get Project Token Info

Use with a project token:

<CodeTabs query={`query {
  projectToken {
    projectId
    environmentId
  }
}`} />

### List Available Regions

<CodeTabs query={`query {
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
