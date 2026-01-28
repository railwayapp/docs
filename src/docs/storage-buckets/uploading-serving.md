---
title: Uploading & Serving Files
description: Learn how to upload and serve files from Railway Storage Buckets.
---

Buckets are private, but you can still work with their files in a few ways. You can serve files straight from the bucket, proxy them through your backend, or upload files directly from clients or services.

Bucket egress is free. Service egress is not. If your service sends data to users or uploads files to a bucket, that traffic counts as service egress. The sections below explain these patterns and how to avoid unnecessary egress.

## Presigned URLs

Presigned URLs are temporary URLs that grant access to individual objects in your bucket for a specific amount of time. They can be created with any S3 client library and can live for up to 90 days.

Files served through presigned URLs come directly from the bucket and incur no egress costs.

## Serve Files with Presigned URLs

You can deliver files directly from your bucket by redirecting users to a presigned URL. This avoids egress costs from your service, as the service isn't serving the file itself.

```ts
import { s3 } from 'bun'

async function handleFileRequest(fileKey: string) {
  const isAuthorized = isUserAuthorized(currentUser, fileKey)
  if (!isAuthorized) throw unauthorized()

  const presignedUrl = s3.presign(fileKey, {
    expiresIn: 3600 // 1 hour
  })
  return Response.redirect(presignedUrl, 302)
}
```

Use-cases:
- Delivering user-uploaded assets like profile pictures
- Handing out temporary links for downloads
- Serving large files without passing them through your service
- Enforcing authorization before serving a file
- Redirecting static URLs to presigned URLs

## Serve Files with a Backend Proxy

You can fetch a file in your backend and return it to the client. This gives you full control over headers, formatting, and any transformations. It does incur **service** egress, but it also lets you use CDN caching on your backend routes. Many frameworks support this pattern natively, especially for image optimization.

Use-cases:
- Transforming or optimizing images (resizing, cropping, compressing)
- Sanitizing files or validating metadata before returning them
- Taking advantage of CDN caching for frequently accessed files
- Web frameworks that already use a proxy for image optimization

## Upload Files with Presigned URLs

You can generate a presigned URL that lets the client upload a file directly to the bucket, without handling the upload in your service. Doing so prevents service egress and reduces memory consumption.

```ts
// server-side
import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

async function prepareImageUpload(fileName: string) {
  const isAuthorized = isUserAuthorized(currentUser, fileKey)
  if (!isAuthorized) throw unauthorized()

  // The key under which the uploaded file will be stored.
  // Make sure that it's unique and users cannot override
  // each other's files.
  const Key = `user-uploads/${currentUser.id}/${fileName}`

  const { url, fields } = await createPresignedPost(new S3Client(), {
    Bucket: process.env.S3_BUCKET,
    Key,
    Expires: 3600,
    Conditions: [
      { bucket: process.env.S3_BUCKET },
      ['eq', '$key', Key],

      // restrict which content types can be uploaded
      ['starts-with', '$Content-Type', 'image/'],

      // restrict content length, to prevent users
      // from uploading suspiciously large files.
      // max 2 MB in this example.
      ['content-length-range', 5_000, 2_000_000],
    ],
  })

  return Response.json({ url, fields })
}

// client-side
async function uploadFile(file) {
  const res = await fetch('/prepare-image-upload', {
    method: 'POST',
    body: JSON.stringify({ fileName: file.name })
  })
  const { url, fields } = await res.json()

  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, value)
  })
  form.append('Content-Type', file.type)
  form.append('file', file)

  await fetch(url, {
    method: 'POST',
    body: form
  })
}
```

<Collapse title="Configuring CORS to upload files from a browser">

To upload a file from a browser frontend to the bucket, you need to configure CORS for your bucket and allow your frontend domain. You can do this with the `aws` CLI:

```shell
AWS_ACCESS_KEY_ID=your_access_key_id \
AWS_SECRET_ACCESS_KEY=your_secret_access_key \
  aws s3api put-bucket-cors \
  --bucket your_bucket_name \
  --endpoint-url https://storage.railway.app \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT","POST"],
        "AllowedOrigins": ["https://your_domain.tld"],
        "MaxAgeSeconds": 3000
      }
    ]
  }'
```

Make sure to replace `your_access_key_id`, `your_secret_access_key`, `your-bucket_name` and `your_domain.tld`.

</Collapse>

Similar to handling uploads through your service, be mindful that users may try to upload HTML, JavaScript, or other executable files. Treat all uploads as untrusted. Consider validating or scanning the file after the upload completes, and remove anything that shouldn't be served.

Use-cases:
- Uploading files from the browser
- Mobile apps uploading content directly
- Large file uploads where you want to avoid streaming through your service

## Upload Files from a Service

A service can upload directly to the bucket using the S3 API. This will incur service egress.

```ts
import { s3 } from 'bun'

async function generateReport() {
  const report = await createPdfReport()

  await s3.putObject("reports/monthly.pdf", report, {
    contentType: "application/pdf"
  })
}
```

Use-cases:
- Background jobs generating files such as PDFs, exports, or thumbnails
- Writing logs or analytics dumps to storage
- Importing data from a third-party API and persisting it in the bucket
