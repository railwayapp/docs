---
title: Manage Volumes with the Public API
description: Learn how to manage persistent volumes via the public GraphQL API.
---

Here are examples to help you manage persistent volumes using the Public API.

## Get project volumes

List all volumes in a project:

<GraphQLCodeTabs query={`query project($id: String!) {
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
}`} variables={{ id: "project-id" }} />

## Get volume instance details

Get details about a volume instance (volume in a specific environment):

<GraphQLCodeTabs query={`query volumeInstance($id: String!) {
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
}`} variables={{ id: "volume-instance-id" }} />

## Create a volume

Create a new persistent volume attached to a service:

<GraphQLCodeTabs query={`mutation volumeCreate($input: VolumeCreateInput!) {
  volumeCreate(input: $input) {
    id
    name
  }
}`} variables={{ input: { projectId: "project-id", serviceId: "service-id", mountPath: "/data" } }}
optionalFields={[
  { name: "input.environmentId", type: "String", description: "Create in a specific environment" },
  { name: "input.region", type: "String", description: "Volume region (e.g., us-west1)" },
]} />

## Update a volume

Rename a volume:

<GraphQLCodeTabs query={`mutation volumeUpdate($volumeId: String!, $input: VolumeUpdateInput!) {
  volumeUpdate(volumeId: $volumeId, input: $input) {
    id
    name
  }
}`} variables={{ volumeId: "volume-id", input: { name: "database-storage" } }} />

## Update volume instance

Update the mount path for a volume instance:

<GraphQLCodeTabs query={`mutation volumeInstanceUpdate($volumeId: String!, $input: VolumeInstanceUpdateInput!) {
  volumeInstanceUpdate(volumeId: $volumeId, input: $input)
}`} variables={{ volumeId: "volume-id", input: { mountPath: "/new/path" } }} />

## Delete a volume

<Banner variant="danger">This will permanently delete the volume and all its data.</Banner>

<GraphQLCodeTabs query={`mutation volumeDelete($volumeId: String!) {
  volumeDelete(volumeId: $volumeId)
}`} variables={{ volumeId: "volume-id" }} />

## Volume backups

### List backups

Get all backups for a volume instance:

<GraphQLCodeTabs query={`query volumeInstanceBackupList($volumeInstanceId: String!) {
  volumeInstanceBackupList(volumeInstanceId: $volumeInstanceId) {
    id
    name
    createdAt
    expiresAt
    usedMB
    referencedMB
  }
}`} variables={{ volumeInstanceId: "volume-instance-id" }} />

### Create a backup

<GraphQLCodeTabs query={`mutation volumeInstanceBackupCreate($volumeInstanceId: String!) {
  volumeInstanceBackupCreate(volumeInstanceId: $volumeInstanceId)
}`} variables={{ volumeInstanceId: "volume-instance-id" }} />

### Restore from backup

<GraphQLCodeTabs query={`mutation volumeInstanceBackupRestore($volumeInstanceBackupId: String!, $volumeInstanceId: String!) {
  volumeInstanceBackupRestore(volumeInstanceBackupId: $volumeInstanceBackupId, volumeInstanceId: $volumeInstanceId)
}`} variables={{ volumeInstanceBackupId: "backup-id", volumeInstanceId: "volume-instance-id" }} />

### Lock a backup (prevent expiration)

<GraphQLCodeTabs query={`mutation volumeInstanceBackupLock($volumeInstanceBackupId: String!, $volumeInstanceId: String!) {
  volumeInstanceBackupLock(volumeInstanceBackupId: $volumeInstanceBackupId, volumeInstanceId: $volumeInstanceId)
}`} variables={{ volumeInstanceBackupId: "backup-id", volumeInstanceId: "volume-instance-id" }} />

### Delete a backup

<GraphQLCodeTabs query={`mutation volumeInstanceBackupDelete($volumeInstanceBackupId: String!, $volumeInstanceId: String!) {
  volumeInstanceBackupDelete(volumeInstanceBackupId: $volumeInstanceBackupId, volumeInstanceId: $volumeInstanceId)
}`} variables={{ volumeInstanceBackupId: "backup-id", volumeInstanceId: "volume-instance-id" }} />

## Backup schedules

### List backup schedules

<GraphQLCodeTabs query={`query volumeInstanceBackupScheduleList($volumeInstanceId: String!) {
  volumeInstanceBackupScheduleList(volumeInstanceId: $volumeInstanceId) {
    id
    name
    cron
    kind
    retentionSeconds
    createdAt
  }
}`} variables={{ volumeInstanceId: "volume-instance-id" }} />

## Common mount paths

| Use Case | Recommended Mount Path |
|----------|------------------------|
| PostgreSQL | `/var/lib/postgresql/data` |
| MySQL | `/var/lib/mysql` |
| MongoDB | `/data/db` |
| Redis | `/data` |
| General Storage | `/data` or `/app/data` |
