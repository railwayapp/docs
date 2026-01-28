---
title: Manage Volumes with the Public API
description: Learn how to manage persistent volumes via the public GraphQL API.
---

Here are examples to help you manage persistent volumes using the Public API.

## Get Project Volumes

List all volumes in a project:

<CodeTabs query={`query project($id: String!) {
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
}`} variables={{ id: "<your-project-id>" }} />

## Get Volume Instance Details

Get details about a volume instance (volume in a specific environment):

<CodeTabs query={`query volumeInstance($id: String!) {
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
}`} variables={{ id: "<your-volume-instance-id>" }} />

## Create a Volume

Create a new persistent volume attached to a service:

<CodeTabs query={`mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "<your-project-id>", serviceId: "<your-service-id>", mountPath: "/data" } }} />

### Create in a Specific Environment

<CodeTabs query={`mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "<your-project-id>", serviceId: "<your-service-id>", environmentId: "<your-environment-id>", mountPath: "/data" } }} />

### Create in a Specific Region

<CodeTabs query={`mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "<your-project-id>", serviceId: "<your-service-id>", mountPath: "/data", region: "us-west1" } }} />

## Update a Volume

Rename a volume:

<CodeTabs query={`mutation volumeUpdate($id: String!, $input: VolumeUpdateInput!) {
  volumeUpdate(id: $id, input: $input) {
    id
    name
  }
}`} variables={{ id: "<your-volume-id>", input: { name: "database-storage" } }} />

## Update Volume Instance

Update the mount path for a volume instance:

<CodeTabs query={`mutation volumeInstanceUpdate($id: String!, $input: VolumeInstanceUpdateInput!) {
  volumeInstanceUpdate(id: $id, input: $input)
}`} variables={{ id: "<your-volume-instance-id>", input: { mountPath: "/new/path" } }} />

## Delete a Volume

<Banner variant="danger">This will permanently delete the volume and all its data.</Banner>

<CodeTabs query={`mutation volumeDelete($id: String!) {
  volumeDelete(id: $id)
}`} variables={{ id: "<your-volume-id>" }} />

## Volume Backups

### List Backups

Get all backups for a volume instance:

<CodeTabs query={`query volumeInstanceBackupList($volumeInstanceId: String!) {
  volumeInstanceBackupList(volumeInstanceId: $volumeInstanceId) {
    id
    createdAt
    sizeBytes
    status
    lockedAt
    expiresAt
  }
}`} variables={{ volumeInstanceId: "<your-volume-instance-id>" }} />

### Create a Backup

<CodeTabs query={`mutation volumeInstanceBackupCreate($volumeInstanceId: String!) {
  volumeInstanceBackupCreate(volumeInstanceId: $volumeInstanceId)
}`} variables={{ volumeInstanceId: "<your-volume-instance-id>" }} />

### Restore from Backup

<CodeTabs query={`mutation volumeInstanceBackupRestore($backupId: String!, $volumeInstanceId: String!) {
  volumeInstanceBackupRestore(backupId: $backupId, volumeInstanceId: $volumeInstanceId)
}`} variables={{ backupId: "<your-backup-id>", volumeInstanceId: "<your-volume-instance-id>" }} />

### Lock a Backup (Prevent Expiration)

<CodeTabs query={`mutation volumeInstanceBackupLock($backupId: String!) {
  volumeInstanceBackupLock(backupId: $backupId)
}`} variables={{ backupId: "<your-backup-id>" }} />

### Delete a Backup

<CodeTabs query={`mutation volumeInstanceBackupDelete($backupId: String!) {
  volumeInstanceBackupDelete(backupId: $backupId)
}`} variables={{ backupId: "<your-backup-id>" }} />

## Backup Schedules

### List Backup Schedules

<CodeTabs query={`query volumeInstanceBackupScheduleList($volumeInstanceId: String!) {
  volumeInstanceBackupScheduleList(volumeInstanceId: $volumeInstanceId) {
    id
    schedule
    nextRunAt
    retentionDays
  }
}`} variables={{ volumeInstanceId: "<your-volume-instance-id>" }} />

### Update Backup Schedule

<CodeTabs query={`mutation volumeInstanceBackupScheduleUpdate(
  $volumeInstanceId: String!
  $input: VolumeInstanceBackupScheduleUpdateInput!
) {
  volumeInstanceBackupScheduleUpdate(
    volumeInstanceId: $volumeInstanceId
    input: $input
  )
}`} variables={{ volumeInstanceId: "<your-volume-instance-id>", input: { schedule: "0 0 * * *", retentionDays: 7 } }} />

## Common Mount Paths

| Use Case | Recommended Mount Path |
|----------|------------------------|
| PostgreSQL | `/var/lib/postgresql/data` |
| MySQL | `/var/lib/mysql` |
| MongoDB | `/data/db` |
| Redis | `/data` |
| General Storage | `/data` or `/app/data` |
