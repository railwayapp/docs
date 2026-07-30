---
title: Use Object Storage for AI Agent Outputs
description: Store AI agent artifacts in S3-compatible object storage on Railway. Where generated files, transcripts, and reports should live, how to write them from a worker, and how to share them with presigned URLs.
date: "2026-07-29"
tags:
  - object-storage
  - agents
  - buckets
  - ai
topic: ai
---

Object storage for AI workloads means putting what agents produce, generated files, run transcripts, reports, datasets, into an S3-compatible store instead of a database or a filesystem. Objects are written once, read many times, addressed by key, and shared by URL.

In this guide we store agent outputs in a Railway [storage bucket](/storage-buckets) and serve them back with presigned URLs.

## Where agent outputs should live

An agent run produces two kinds of data, and they want different homes:

- **State** (task status, steps, tool calls, token counts) is small, structured, and queried. It belongs in [Postgres](/databases/postgresql).
- **Artifacts** (the generated PDF, the CSV export, the full transcript, the rendered image) are large, immutable, and fetched whole. They belong in object storage.

Putting artifacts in Postgres bloats the database and its backups. Putting them on a [volume](/volumes) ties them to one service and gives you no URL to hand out. Object storage is built for exactly this shape: a Railway bucket is private, S3-compatible, and billed at $0.015 per GB-month with free egress and unlimited free API operations.

## 1. Add a bucket

Click **Create** on your project canvas and select **Bucket**. Pick the region where your workers run; it cannot be changed after creation.

Each Railway environment gets its own bucket instance with isolated credentials, so agent runs in a PR environment cannot touch production artifacts.

## 2. Connect from the worker

The bucket exposes its credentials as [variable references](/variables#referencing-a-shared-variable). Add them to the worker service that produces artifacts:

| Variable | Reference |
| --- | --- |
| `BUCKET` | `${{Bucket.BUCKET}}` |
| `ACCESS_KEY_ID` | `${{Bucket.ACCESS_KEY_ID}}` |
| `SECRET_ACCESS_KEY` | `${{Bucket.SECRET_ACCESS_KEY}}` |
| `ENDPOINT` | `${{Bucket.ENDPOINT}}` |
| `REGION` | `${{Bucket.REGION}}` |

The bucket's credential presets can also inject these under the default names your S3 library expects (the AWS SDKs, Bun's S3 driver, and others), so the client picks them up with no explicit configuration.

## 3. Write artifacts, hand out URLs

Install the S3 client:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

The worker writes each artifact under a key that encodes the run, and the API hands the client a presigned URL instead of the bytes:

```typescript
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

// Worker: store the artifact when the run completes
export async function storeArtifact(runId: string, name: string, body: string) {
  const key = `runs/${runId}/${name}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key,
      Body: body,
      ContentType: "text/markdown",
    })
  );
  return key;
}

// API: return a time-limited download URL, not the bytes
export async function artifactUrl(key: string) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.BUCKET, Key: key }),
    { expiresIn: 3600 }
  );
}
```

The key scheme is the schema. `runs/{runId}/{name}` means listing a run's artifacts is a prefix query, and deleting a run's artifacts is a prefix delete. Store the key in the run's Postgres row and the two systems stay joined.

## Why presigned URLs matter here

Buckets are private; there are no public bucket URLs. A presigned URL is a time-limited grant to one object, which fits agent artifacts well: the user who requested the run gets the report, and the link expires.

It also routes the bytes around your services. Files served through presigned URLs come directly from the bucket and incur no egress cost, and your API never holds a 50 MB PDF in memory. The same pattern works for uploads: a client can [upload directly to the bucket](/storage-buckets/uploading-serving) with a presigned POST, so input files for agent runs skip your API too.

## Retention

Agents produce artifacts on every run, forever. Decide early what expires: keep final reports, expire intermediate outputs. A [cron service](/cron-jobs) that prefix-deletes `runs/` older than N days keeps the bucket from becoming an unbounded ledger of every draft your agents ever wrote.

## Next steps

- [Storage Buckets](/storage-buckets): credentials, URL styles, and S3 compatibility.
- [Uploading & Serving Files](/storage-buckets/uploading-serving): presigned upload and download patterns in full.
- [Deploy an AI Agent with Async Workers](/guides/ai-agent-workers): the worker architecture these artifacts come from.
- [Use Storage Buckets for Uploads, Exports, and Assets](/guides/storage-buckets-guide): the general-purpose bucket patterns.
