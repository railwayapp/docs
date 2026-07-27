---
title: Use Storage Buckets for Uploads, Exports, and Assets
description: Set up Railway storage buckets for file uploads via presigned URLs, background export generation, and asset serving through a backend proxy.
date: "2026-03-30"
tags:
  - architecture
  - storage
  - buckets
  - uploads
topic: architecture
---

Railway Buckets provide S3-compatible object storage inside your project. This guide covers three common patterns: accepting user uploads via presigned URLs, generating files in background jobs, and serving assets through a backend proxy.

## Prerequisites

- A Railway project with at least one service
- Familiarity with S3-compatible APIs

## Create a bucket

1. Open your Railway project
2. Click **+ New** on the project canvas and select **Bucket**
3. Choose a region and name. You cannot change the region after creation.
4. The bucket deploys with S3-compatible credentials available in the Credentials tab

For full details, see [Storage Buckets](/storage-buckets).

## Connect your service to the bucket

Use Railway's variable references to pass bucket credentials to your service:

1. Click on your service in the project canvas
2. Go to the **Variables** tab
3. Use the [auto-inject feature](/storage-buckets) to add bucket credentials for your S3 client library (AWS SDK, Bun S3, etc.)

Railway supports automatic credential injection for common libraries. See [Storage Buckets](/storage-buckets) for details.

## Pattern 1: User uploads via presigned URLs

**When to use:** User-generated content, profile pictures, file attachments. Any scenario where the client uploads directly to storage without routing through your server.

Presigned URLs let users upload files directly to the bucket without routing binary data through your server.

### How it works

1. Your backend generates a presigned PUT URL using the S3 SDK
2. Your frontend uploads directly to that URL
3. The file lands in the bucket without touching your server

### Backend: generate a presigned URL

```javascript
// Node.js with @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
});

async function getUploadUrl(key) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
```

### Frontend: upload to the presigned URL

```javascript
const response = await fetch('/api/upload-url?filename=photo.jpg');
const { url } = await response.json();

await fetch(url, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});
```

### CORS configuration

If uploading from a browser, configure CORS on the bucket. See the [Storage Buckets docs](/storage-buckets) for CORS setup instructions.

## Pattern 2: Background exports and report generation

**When to use:** Scheduled reports, CSV exports, PDF generation. Any file created by a background process that users download later.

Workers or [cron jobs](/cron-jobs) can generate files and upload them to the bucket for later retrieval. To [choose between cron jobs, workers, and queues](/guides/cron-workers-queues), see the dedicated guide.

### How it works

1. A background worker or cron job generates a report (CSV, PDF, etc.)
2. The worker uploads the file to the bucket using the S3 SDK
3. When a user requests the file, your backend generates a presigned GET URL

### Upload from a worker

```javascript
import { PutObjectCommand } from '@aws-sdk/client-s3';

async function uploadReport(data, filename) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `reports/${filename}`,
    Body: data,
    ContentType: 'text/csv',
  }));
}
```

### Serve via presigned GET URL

```javascript
import { GetObjectCommand } from '@aws-sdk/client-s3';

async function getDownloadUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
```

## Pattern 3: Serving assets through a backend proxy

**When to use:** Serving private files that require access control, or files that need processing (resizing, watermarking) before delivery.

Railway Buckets are private. There are no public bucket URLs. To serve stored files to end users, route requests through your backend.

### How it works

1. Store assets in the bucket
2. Your backend fetches the object from S3 and streams it to the client
3. Add caching headers to reduce repeated fetches

```javascript
app.get('/assets/:key', async (req, res) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: req.params.key,
  });

  const object = await s3.send(command);
  res.set('Content-Type', object.ContentType);
  res.set('Cache-Control', 'public, max-age=86400');
  object.Body.pipe(res);
});
```

For high-traffic asset serving, consider using presigned GET URLs instead to avoid routing all downloads through your server.

## Next steps

- [Storage Buckets](/storage-buckets) - Full reference for bucket configuration, CORS, and credential injection
- [Running a Cron Job](/cron-jobs) - Schedule report generation
- [Private Networking](/networking/private-networking) - Connect services over the internal network
