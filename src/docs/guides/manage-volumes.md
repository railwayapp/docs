---
title: Manage Volumes with the Public API
description: Learn how to manage persistent volumes via the public GraphQL API.
---

Here are examples to help you manage persistent volumes using the Public API.

## Get Project Volumes

List all volumes in a project:

```graphql
query project($id: String!) {
  project(id: $id) {
    volumes {
      edges {
        node {
          id
          name
          createdAt
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "id": "your-project-id"
}
```

## Get Volume Instance Details

Get details about a volume instance (volume in a specific environment):

```graphql
query volumeInstance($id: String!) {
  volumeInstance(id: $id) {
    id
    mountPath
    currentSizeMB
    state
    volume {
      id
      name
    }
    serviceInstance {
      serviceName
    }
  }
}
```

**Variables:**
```json
{
  "id": "your-volume-instance-id"
}
```

## Create a Volume

Create a new persistent volume attached to a service:

```graphql
mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
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
    "serviceId": "your-service-id",
    "mountPath": "/data"
  }
}
```

### Create in a Specific Environment

```json
{
  "input": {
    "projectId": "your-project-id",
    "serviceId": "your-service-id",
    "environmentId": "your-environment-id",
    "mountPath": "/data"
  }
}
```

### Create in a Specific Region

```json
{
  "input": {
    "projectId": "your-project-id",
    "serviceId": "your-service-id",
    "mountPath": "/data",
    "region": "us-west1"
  }
}
```

## Update a Volume

Rename a volume:

```graphql
mutation volumeUpdate($id: String!, $input: VolumeUpdateInput!) {
  volumeUpdate(id: $id, input: $input) {
    id
    name
  }
}
```

**Variables:**
```json
{
  "id": "your-volume-id",
  "input": {
    "name": "database-storage"
  }
}
```

## Update Volume Instance

Update the mount path for a volume instance:

```graphql
mutation volumeInstanceUpdate($id: String!, $input: VolumeInstanceUpdateInput!) {
  volumeInstanceUpdate(id: $id, input: $input)
}
```

**Variables:**
```json
{
  "id": "your-volume-instance-id",
  "input": {
    "mountPath": "/new/path"
  }
}
```

## Delete a Volume

<Banner variant="danger">This will permanently delete the volume and all its data.</Banner>

```graphql
mutation volumeDelete($id: String!) {
  volumeDelete(id: $id)
}
```

**Variables:**
```json
{
  "id": "your-volume-id"
}
```

## Volume Backups

### List Backups

Get all backups for a volume instance:

```graphql
query volumeInstanceBackupList($volumeInstanceId: String!) {
  volumeInstanceBackupList(volumeInstanceId: $volumeInstanceId) {
    id
    createdAt
    sizeBytes
    status
    lockedAt
    expiresAt
  }
}
```

**Variables:**
```json
{
  "volumeInstanceId": "your-volume-instance-id"
}
```

### Create a Backup

```graphql
mutation volumeInstanceBackupCreate($volumeInstanceId: String!) {
  volumeInstanceBackupCreate(volumeInstanceId: $volumeInstanceId)
}
```

**Variables:**
```json
{
  "volumeInstanceId": "your-volume-instance-id"
}
```

### Restore from Backup

```graphql
mutation volumeInstanceBackupRestore($backupId: String!, $volumeInstanceId: String!) {
  volumeInstanceBackupRestore(backupId: $backupId, volumeInstanceId: $volumeInstanceId)
}
```

**Variables:**
```json
{
  "backupId": "your-backup-id",
  "volumeInstanceId": "your-volume-instance-id"
}
```

### Lock a Backup (Prevent Expiration)

```graphql
mutation volumeInstanceBackupLock($backupId: String!) {
  volumeInstanceBackupLock(backupId: $backupId)
}
```

### Delete a Backup

```graphql
mutation volumeInstanceBackupDelete($backupId: String!) {
  volumeInstanceBackupDelete(backupId: $backupId)
}
```

## Backup Schedules

### List Backup Schedules

```graphql
query volumeInstanceBackupScheduleList($volumeInstanceId: String!) {
  volumeInstanceBackupScheduleList(volumeInstanceId: $volumeInstanceId) {
    id
    schedule
    nextRunAt
    retentionDays
  }
}
```

### Update Backup Schedule

```graphql
mutation volumeInstanceBackupScheduleUpdate(
  $volumeInstanceId: String!
  $input: VolumeInstanceBackupScheduleUpdateInput!
) {
  volumeInstanceBackupScheduleUpdate(
    volumeInstanceId: $volumeInstanceId
    input: $input
  )
}
```

**Variables:**
```json
{
  "volumeInstanceId": "your-volume-instance-id",
  "input": {
    "schedule": "0 0 * * *",
    "retentionDays": 7
  }
}
```

## Common Mount Paths

| Use Case | Recommended Mount Path |
|----------|------------------------|
| PostgreSQL | `/var/lib/postgresql/data` |
| MySQL | `/var/lib/mysql` |
| MongoDB | `/data/db` |
| Redis | `/data` |
| General Storage | `/data` or `/app/data` |
