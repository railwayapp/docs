---
title: Manage Projects with the Public API
description: Learn how to manage projects via the public GraphQL API.
---

Here are examples to help you manage your projects using the Public API.

## List All Projects

Fetch all projects in your personal account:

<CodeTabs query={`query {
  projects {
    edges {
      node {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
}`} />

### List Projects in a Workspace

Fetch all projects in a specific workspace:

<CodeTabs query={`query workspaceProjects($workspaceId: String!) {
  projects(workspaceId: $workspaceId) {
    edges {
      node {
        id
        name
        description
      }
    }
  }
}`} variables={{ workspaceId: "<your-workspace-id>" }} />

## Get a Single Project

Fetch a project by ID with its services and environments:

<CodeTabs query={`query project($id: String!) {
  project(id: $id) {
    id
    name
    description
    createdAt
    services {
      edges {
        node {
          id
          name
          icon
        }
      }
    }
    environments {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}`} variables={{ id: "<your-project-id>" }} />

## Create a Project

Create a new empty project:

<CodeTabs query={`mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { name: "My New Project", description: "A project created via the API" } }} />

### Create a Project in a Workspace

<CodeTabs query={`mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { name: "Team Project", workspaceId: "<your-workspace-id>" } }} />

### Create a Project from a GitHub Repo

<CodeTabs query={`mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { name: "My App", repo: { fullRepoName: "username/repo-name" } } }} />

## Update a Project

Update project name or description:

<CodeTabs query={`mutation projectUpdate($id: String!, $input: ProjectUpdateInput!) {
  projectUpdate(id: $id, input: $input) {
    id
    name
    description
  }
}`} variables={{ id: "<your-project-id>", input: { name: "Updated Project Name", description: "Updated description" } }} />

## Delete a Project

<Banner variant="danger">This is a destructive action and cannot be undone.</Banner>

<CodeTabs query={`mutation projectDelete($id: String!) {
  projectDelete(id: $id)
}`} variables={{ id: "<your-project-id>" }} />

## Transfer a Project to a Workspace

Transfer a project to a different workspace:

<CodeTabs query={`mutation projectTransfer($id: String!, $input: ProjectTransferInput!) {
  projectTransfer(id: $id, input: $input)
}`} variables={{ id: "<your-project-id>", input: { workspaceId: "<target-workspace-id>" } }} />

## Get Project Members

List all members of a project:

<CodeTabs query={`query projectMembers($projectId: String!) {
  projectMembers(projectId: $projectId) {
    id
    role
    user {
      id
      name
      email
    }
  }
}`} variables={{ projectId: "<your-project-id>" }} />

## Invite a User to a Project

<CodeTabs query={`mutation projectInviteUser($id: String!, $email: String!, $role: ProjectRole!) {
  projectInviteUser(id: $id, email: $email, role: $role) {
    id
  }
}`} variables={{ id: "<your-project-id>", email: "user@example.com", role: "MEMBER" }} />

Valid roles: `ADMIN`, `MEMBER`, `VIEWER`

## Finding IDs

You can find your project, service, and environment IDs by:

1. Pressing `Cmd/Ctrl + K` in the Railway dashboard
2. Searching for "Copy Project ID", "Copy Service ID", or "Copy Environment ID"

Alternatively, extract IDs from the dashboard URL:
```
https://railway.com/project/[PROJECT_ID]?environmentId=[ENVIRONMENT_ID]
```
