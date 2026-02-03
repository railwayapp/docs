---
title: Audit Logs
description: Learn more about how Railway keeps a record of actions in workspaces.
---

Audit logs provide a record of actions performed within your Railway [workspace](/reference/teams). This includes changes to projects, services, deployments, variables, and workspace settings.

Audit logs can be accessed by workspace admins through the <a href="https://railway.com/workspace/audit-logs" target="_blank">**Audit Logs**</a> link in the workspace settings.

Audit logs help teams with:

- **Security:** Track who made changes to sensitive resources like environment variables, integrations, or workspace settings
- **Compliance:** Maintain records of all changes for regulatory requirements and internal policies
- **Troubleshooting:** Identify when and how changes were made to diagnose issues
- **Team Coordination:** Understand what changes team members are making across projects
- **Change Management:** Review the history of deployments and configuration changes

<Image src="https://res.cloudinary.com/railway/image/upload/v1743471483/docs/audit-logs-list_ryluzl.png"
alt="Screenshot of audit log list"
layout="responsive"
width={1652} height={1538} quality={80} />

## Accessing Audit Logs

Audit logs are available at the workspace level and can be accessed by workspace admins through the workspace settings page.

To view audit logs:
1. Navigate to your workspace dashboard
2. Click on <a href="https://railway.com/workspace/audit-logs" target="_blank">**Audit Logs**</a> in the sidebar

For more information about workspace roles and permissions, see the [Workspaces documentation](/reference/teams).

## Log Contents

Each audit log entry contains detailed information about the action that was performed:

- **Event Type:** The type of action that occurred (e.g., service created, variable updated, deployment triggered)
- **Timestamp:** When the action was performed
- **Workspace:** The workspace where the action occurred
- **Project:** The project affected by the action (if applicable)
- **Environment:** The environment affected by the action (if applicable)
- **Event Data:** Specific details about the change, such as resource data that was created, modified, or deleted
- **Actor:** Information about who or what performed the action

<Image src="https://res.cloudinary.com/railway/image/upload/v1743471483/docs/audit-log-details_e1wipe.png"
alt="Screenshot of audit log details"
layout="responsive"
width={1559} height={1339} quality={80} />

### Actor Types

Actions in audit logs can be performed by three types of actors:

- **User:** An action performed by a workspace or project member
- **Railway Staff:** An action performed by Railway's team (typically during support requests)
- **Railway System:** An automated action performed by Railway's platform (e.g., automatic updates, backups)

<Banner variant="info">
Historic events from before audit logs were released may not contain information about the actor.
</Banner>

## Listing all Audit Logs Event Types

The complete documentation of all audit log event types and their descriptions can be retrieved using the [Railway GraphQL API](/reference/public-api).

You can explore this information using the <a href="https://railway.com/graphiql" target="_blank">GraphiQL playground</a>:

```graphql
{
  auditLogEventTypeInfo {
    eventType
    description
  }
}
```

This query returns all available event types in audit logs, along with a description of what each event represents.

## Exporting Audit Logs via the API

You can export audit logs programmatically using the [Railway GraphQL API](/reference/public-api).

Use the `auditLogs` query to retrieve audit log entries for a specific workspace. You can test this query in the <a href="https://railway.com/graphiql" target="_blank">GraphiQL playground</a>:

```graphql
{
  auditLogs(workspaceId: "YOUR_WORKSPACE_ID") {
    edges {
      node {
        id
        eventType
        createdAt
        projectId
        environmentId
        payload
        context
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
```

For more information on using the GraphQL API, see the [Public API Guide](/guides/public-api).

## Audit Log Retention

Audit logs are retained for different periods depending on your Railway plan:

| Plan                       | Retention Period |
| -------------------------- | ---------------- |
| **Free, Trial and Hobby**  | 48 hours         |
| **Pro**                    | 30 days          |
| **Enterprise**             | 18 months        |

For longer retention periods or custom log export solutions, consider upgrading to a higher plan or [contact us](https://railway.com/enterprise) to discuss Enterprise options.
