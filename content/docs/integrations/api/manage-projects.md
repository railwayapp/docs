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
}`} variables={{ workspaceId: "workspace-id" }} />

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
}`} variables={{ id: "project-id" }} />

## Create a Project

Create a new empty project:

<CodeTabs query={`mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { name: "My New Project" } }}
optionalFields={[
  { name: "input.description", type: "String", description: "Project description" },
  { name: "input.workspaceId", type: "String", description: "Create in a specific workspace" },
  { name: "input.isPublic", type: "Boolean", description: "Make project publicly visible", apiDefault: "false" },
  { name: "input.prDeploys", type: "Boolean", description: "Enable PR deploy environments", apiDefault: "false" },
  { name: "input.defaultEnvironmentName", type: "String", description: "Name for default environment", apiDefault: "production" },
  { name: "input.repo", type: "ProjectCreateRepo", description: "Connect to a GitHub repository" },
]} />

## Update a Project

Update project name or description:

<CodeTabs query={`mutation projectUpdate($id: String!, $input: ProjectUpdateInput!) {
  projectUpdate(id: $id, input: $input) {
    id
    name
    description
  }
}`} variables={{ id: "project-id", input: { name: "Updated Project Name" } }}
optionalFields={[
  { name: "input.description", type: "String", description: "Project description" },
  { name: "input.isPublic", type: "Boolean", description: "Make project publicly visible", apiDefault: "false" },
  { name: "input.prDeploys", type: "Boolean", description: "Enable PR deploy environments", apiDefault: "false" },
]} />

## Delete a Project

<Banner variant="danger">This is a destructive action and cannot be undone.</Banner>

<CodeTabs query={`mutation projectDelete($id: String!) {
  projectDelete(id: $id)
}`} variables={{ id: "project-id" }} />

## Transfer a Project to a Workspace

Transfer a project to a different workspace:

<CodeTabs query={`mutation projectTransfer($projectId: String!, $input: ProjectTransferInput!) {
  projectTransfer(projectId: $projectId, input: $input)
}`} variables={{ projectId: "project-id", input: { workspaceId: "target-workspace-id" } }} />

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
}`} variables={{ projectId: "project-id" }} />

