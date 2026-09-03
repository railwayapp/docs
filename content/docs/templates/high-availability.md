---
title: High Availability Templates
description: Declare a high availability companion for your database template so users can convert a single service into a replicated cluster.
---

Railway can convert a single-service database deployed from your template into a
replicated cluster, and convert it back. You enable this by publishing **two
templates** and declaring how they relate: the standalone template your users
deploy first, and a high availability (HA) companion template describing the
cluster it becomes.

Everything the platform needs to run a conversion is declared in template
metadata. Adding support for a new engine version, changing how many nodes a
user may pick, or wiring a new coordination variable is a template update, not a
platform change.

## The two-template model

| Field | Set on | Meaning |
| --- | --- | --- |
| `haTemplateCode` | The standalone template's root service | The code of the HA template this service converts into |
| `revertsToTemplateCode` | The HA template's root service | The code of the standalone template a cluster reverts back to |
| `haConversionConfig` | The HA template's root service | Everything about the conversion: node selectors, supported versions, labels |

`haConversionConfig` lives on the **companion**, not on the standalone. The HA
template is the authority on what its own cluster supports, so a standalone
template only ever names its companion and stays otherwise unaware of the
cluster's shape.

<Banner variant="info">
Both templates must be published for conversion to appear. A standalone
template naming an `haTemplateCode` that does not resolve to a published
template offers users nothing.
</Banner>

## Cluster roles

Every service in the HA template declares a `clusterRole`, which tells the
platform what the service is for:

| Role | Purpose |
| --- | --- |
| `root` | The primary data node, and the service users connect to and manage |
| `replica` | Additional data nodes replicating from the root |
| `internal` | Coordination services that are not data nodes, such as a consensus store |
| `edge` | The entry point in front of the data nodes, such as a proxy or load balancer |

The root is special: it is the service that already exists when a user converts,
so the conversion adopts it in place rather than creating a new one. Its data,
volume, connection string, and service ID survive the conversion.

## Declaring the conversion

`haConversionConfig` describes what a user may choose when converting:

```json
{
  "description": "Run three data nodes with automatic failover.",
  "replica": {
    "label": "Data nodes",
    "nodeLabel": "Postgres",
    "description": "Nodes replicating from the primary.",
    "options": [2, 3],
    "defaultValue": 2
  },
  "internal": {
    "label": "Coordination nodes",
    "nodeLabel": "etcd",
    "options": [3],
    "defaultValue": 3
  },
  "supportedImageMajorVersions": [16, 17]
}
```

Each role selector accepts:

- `label` — the heading for the selector, usually plural
- `nodeLabel` — the singular noun for one node of this role, used as the per-node
  type label in cluster views
- `description` — optional helper text under the selector
- `options` — the node counts a user may pick for this role
- `defaultValue` — the initial selection, defaulting to the first entry in
  `options`

Omit a role's selector entirely to hide it. A cluster whose coordination node
count is not a user's choice should simply not declare an `internal` selector.

### Supported engine versions

`supportedImageMajorVersions` lists the image majors your HA template actually
publishes data-node images for. It is a gate, not a hint: conversion requires
the existing service's image major to appear in this list, and the conversion
pins the cluster's data-node images to that major.

This is also why an image whose major cannot be determined is refused. A tag
like `:latest` or a named tag carries no major to pin data nodes to, so the
conversion has nothing to match and declines rather than guessing.

Shipping support for a new major means adding it to this list and publishing the
matching images. No platform release is involved.

### Pinning to a minor version

Set `pinToMinorVersion` to `true` only when your HA image repository publishes
minor alias tags alongside major ones (for example a `:8.2` tag next to `:8`).
When set, and when the adopted service's tag declares a minor, the conversion
pins every service sharing that image repository to the `major.minor` tag.

Use it when your engine's replication is not backward-compatible across minors.
The published tag's existence is the compatibility proof: if the minor is not
published yet, the pull fails loudly instead of producing a replica that cannot
read the primary's data. Leave it unset when replication is minor-agnostic, and
major-only pinning applies.

## Wiring coordination variables

Clusters change shape after conversion: a user can add or remove nodes. For the
platform to re-stamp coordination variables when that happens, declare
`clusterWiring` on the HA template's root service, naming the variables your
images read rather than having the platform hardcode them:

| Field | What it names |
| --- | --- |
| `internalNodeNameVariable` | The variable on each coordination service holding that node's own identity |
| `coordinatorHostsVariable` | The variable on root and replicas holding the coordinator host list |
| `coordinatorPort` | The port appended to each coordinator host |
| `replicaNodeNameVariable` | The variable on each replica holding that replica's own identity |
| `dataNodesVariable` | The variable on the edge service holding the data-node endpoint list |

Entry formats accept two substitutions: `{host}` becomes the node's private
domain reference, and `{rootName}` becomes the cluster root's actual service
name.

<Banner variant="warning">
Never hardcode a template service name in these formats. `clusterWiring` is read
back long after conversion, by which point a user may have renamed the root
service, and a hardcoded name would resolve to nothing. Always use `{rootName}`.
</Banner>

## Checklist

Before publishing, confirm that:

- Both templates are published, and each names the other
- The HA template's root service declares `haConversionConfig`
- Every HA service declares a `clusterRole`
- `supportedImageMajorVersions` lists every major you publish data-node images for
- Node count `options` are values your engine actually supports as a quorum
- `clusterWiring` formats use `{rootName}`, never a literal service name
- Converting and reverting both work on a service holding real data
