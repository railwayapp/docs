---
title: Storage Buckets
description: Persist assets in object storage.
---

Railway Buckets are private, S3-compatible object storage buckets for your projects. They give you durable object storage on Railway without needing to wire up an external provider. Use them for file uploads, user-generated content, static assets, backups, or any data that needs reliable object storage.

## Getting Started

To create a bucket in your project, click the Create button on your canvas, select Bucket, and select its region and optionally change its name. You aren't able to change your region after you create your bucket.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419444/CreateABucket_naa0ss.mp4" controls autoPlay loop muted playsInline />

Unlike traditional S3, you can choose any display name you want for your bucket. It doesn't need to be globally unique. To identify it in the S3 API, a unique S3 Bucket Name will be generated from the display name the bucket was given at creation, plus a short hash on the end to ensure uniqueness between workspaces.

<video src="https://res.cloudinary.com/railway/video/upload/v1763520962/SettingName_eyhi4k.mp4" controls autoPlay loop muted playsInline />

When connecting to your bucket with an S3 client, you'll need to use this unique S3 name. You can find it in the bucket Credentials tab under Bucket Name. Even if you rename your bucket's display name later, this unique identifier stays the same.

## Connecting to Your Bucket

Railway Buckets are private by default, meaning you can only edit and upload your files by authenticating with the S3 API using the bucket's credentials. To make files accessible publicly, you can use [presigned URLs](#presigned-urls), or proxy files through a backend service. Read more about [Serving and Uploading Files](#serving-and-uploading-files).

Global public access to your entire bucket is currently not supported.

<Banner variant="info">
If public buckets is something you're interested in, leave your feedback in [Central Station](https://station.railway.com/feedback/public-railway-storage-buckets-1e3bdac8) and tell us your use-case. We're excited to hear what you'd like to build!
</Banner> 

Once your bucket is deployed, you'll find S3-compatible authentication credentials in the Credentials tab of the bucket. These include the necessary details for you to connect to your bucket using your S3 client library.

<Image src="https://res.cloudinary.com/railway/image/upload/v1764373635/docs/bucket_credentials_pcvjup.png"
alt="Screenshot of bucket credentials"
layout="responsive"
width={2554} height={1970} quality={80} />

Railway Buckets use <a target="_blank" href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#virtual-hosted–style-access">virtual-hosted–style URLs</a>, which add your bucket name as a subdomain in the S3 endpoint. This is the modern S3 standard and is what most libraries either expect or support. Most S3 client libraries will only need the base endpoint (`https://storage.railway.app`) and call the virtual-hosted–style URL underneath.

Buckets that were created before this change (like those who used them during Priority Boarding) might require you to use <a target="_blank" href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access">path-style URLs</a> instead. The Credentials tab of your bucket will tell you which style you should use.

### Variable References

Storage Buckets can provide the S3 authentication credentials to your other services by using [Variable References](https://docs.railway.com/guides/variables#referencing-a-shared-variable). You can do this in two ways:

<Collapse slug="storage-buckets-manual-credentials-variables" title="Manually configuring your service's variables">
You can use regular Shared Variables by creating a new variable in your service and referencing each authentication credential from your bucket service:

<video src="https://res.cloudinary.com/railway/video/upload/v1763419449/VariableReferenceManual_ld79zb.mp4" controls autoplay loop muted playsinline />
</Collapse>

<Collapse slug="storage-buckets-automatic-credentials-variables" title="Automatically provisioning the variables to your service">
You can insert all the required authentication variables into your service's variables depending on your S3 client. We have presets for the AWS SDK, Bun's built-in S3 driver, FastAPI, Laravel, and more.

Doing this sets the names for the credentials based on what each library expects as the default environment variable names. Supported libraries (notably the official AWS SDKs) can automatically pick them up so you don't have to provide each variable to the S3 client.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419460/AutoInjectVariables_xborrx.mp4" controls autoplay loop muted playsinline />
</Collapse>

### Railway-Provided Variables

Railway provides the following variables which can be used as [Variable References](https://docs.railway.com/guides/variables#referencing-a-shared-variable).

| Name                       | Description                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `BUCKET`                   | The globally unique bucket name for the S3 API. Example: `my-bucket-jdhhd8oe18xi`                |
| `SECRET_ACCESS_KEY`        | The secret key for the S3 API.                                                                   |
| `ACCESS_KEY_ID`            | The key id for the S3 API.                                                                       |
| `REGION`                   | The region for the S3 API. Example: `auto`                                                       |
| `ENDPOINT`                 | The S3 API endpoint. Example: `https://storage.railway.app`                                      |
| `RAILWAY_PROJECT_NAME`     | The project name the bucket belongs to.                                                          |
| `RAILWAY_PROJECT_ID`       | The project id the bucket belongs to.                                                            |
| `RAILWAY_ENVIRONMENT_NAME` | The environment name of the bucket instance.                                                     |
| `RAILWAY_ENVIRONMENT_ID`   | The environment id of the bucket instance.                                                       |
| `RAILWAY_BUCKET_NAME`      | The bucket name.This is not the bucket name to use for the S3 API. Use `BUCKET` instead.         |
| `RAILWAY_BUCKET_ID`        | The bucket id.                                                                                   |

## Serving and Uploading Files

Even though buckets are private, you can still serve files directly from the bucket, proxy them through your backend, and upload files directly from clients or from your services depending on what your application needs.

Bucket egress is free, but service egress is not free. Service egress occurs when you send data from a service to users, but also when you upload from a service to the bucket. This section includes ways to prevent unnecessary service egress.

### Presigned URLs

Presigned URLs are temporary URLs that grant access to individual objects in your bucket for a specific time. They can be created with any S3 client library and can live for up to 90 days. They're ideal for exposing individual files in a private bucket.

Files served through presigned URLs come directly from the bucket and incur no egress costs.

### Serve Files with Presigned URLs

You can deliver files directly from your bucket by redirecting users to a presigned URL. This avoids most egress costs from your service, because the service is only serving the redirect, not the file itself.

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
- Delivering user-uploaded assets like profile photos
- Handing out temporary links for downloads
- Serving large files without passing them through your service
- Enforcing authorization before serving a file
- Redirecting static URLs to presigned URLs

### Serve Files with a Backend Proxy

You can fetch the object from the bucket in your backend and send it to the client. This gives you full control over the response format, headers, and transformations. It does incur service egress, but it also enables CDN caching on your backend routes, which can dramatically reduce repeated fetches from your service. Some web frameworks have built-in support to proxy files through the backend, for example for built-in image optimization.

Use-cases:
- Transforming or optimizing images (resizing, cropping, compressing)
- Sanitizing files or validating metadata before returning them
- Taking advantage of CDN caching for frequently accessed files
- Web frameworks that already use a proxy for image optimization

### Upload Files with Presigned URLs

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

Similar to handling uploads through your service, be mindful that users may try to upload HTML, JavaScript, or other executable files. Treat all uploads as untrusted. Consider validating or scanning the file after the upload completes, and remove anything that shouldn't be served.

Use-cases:
- Uploading files from the browser
- Mobile apps uploading content directly
- Large file uploads where you want to avoid streaming through your service

### Upload Files from a Service

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

## Buckets in Environments

Each environment gets its own separate bucket instance with isolated credentials. When you [duplicate an environment](/guides/environments#create-an-environment) or use [PR environments](/guides/environments#enable-pr-environments), you won't need to worry about accidentally deleting production objects, exposing sensitive data in pull requests, or polluting your production environment with test data.

## How Buckets are Billed

Buckets are billed at **$0.015** per GB-month (30 days), based on the total amount of data stored across all bucket instances in your workspace, including Environments. All S3 API operations are unlimited and free. Egress is also unlimited and free, whether that's using presigned URLs or via the S3 API. Note that service egress is not free, as explained in [Bucket Egress vs. Service Egress](#bucket-egress-vs-service-egress)

Usage (GB-month) is calculated by averaging the day-to-day usages and rounding the final accumulation to the next whole number if it totaled a fractional amount (5.1 GB-month gets billed as 6 GB-month).

Buckets are currently only available in the Standard storage tier – there's no minimum storage retention and no data retrieval fees.

### Bucket Egress vs. Service Egress

Even though *buckets* don't charge for ingress or egress, buckets still live on the public network. When you upload files from your Railway services to your buckets, those *services* will incur egress usages, since you're uploading over the public network. Buckets are currently not available on the private network.

### Billing Examples

- If you stored **10 GBs for 30 days**, you'd get charged for for 10 GB-month.
- If you stored **10 GBs for 15 days** then emptied your bucket and stored **0 GBs for another 15 days**, those totals will be averaged out and you will be charged for **5 GB-month**.

### Free Plan

You can use up to **10 GB-month** each month on the free plan. Bucket usage counts against your $1 monthly credit. Once the credit is fully used, bucket access is suspended and files become unavailable, but your files will not be deleted. You can access your files again at the next billing cycle when credits refresh, or immediately if you upgrade to a paid plan.

### Trial Plan

You can use up to **50 GB-month** during the trial. Bucket usage counts against your trial credits. When the trial ends, bucket access is suspended and files become unavailable. You can access your files again when you switch to the Free Plan or upgrade to a paid plan.

### Limited Trial

Buckets are not available in the [Limited Trial](/reference/pricing/free-trial#full-vs-limited-trial).

### Hobby

The Hobby Plan has a combined maximum storage capacity of **1TB**. Any uploads that would exceed this limit will fail.

### Pro

The Pro Plan has **unlimited** storage capacity.

### Usage Limit

If you exceed your [Hard Usage Limit](/reference/usage-limits#hard-limit), bucket access is suspended and files cannot be read or uploaded anymore. Think of this to prevent that even more data will be uploaded. Existing stored data is still billed. You can access your files again once you raise or remove the Hard Limit, or when the next billing period starts.

## S3 Compatibility

Buckets are fully S3-compatible. You can use them with any S3 client library for any language, tool, or framework, and you can expect the same functionality on Railway Buckets as if you were using a normal S3 bucket.

Supported features include:
- Put, Get, Head, Delete objects
- List objects, List objects V2
- Copy objects
- Presigned URLs
- Object tagging
- Multipart uploads

Not yet supported:
- Server-side encryption
- Object versioning
- Object locks
- Bucket lifecycle configuration

## Deleting a Bucket

You can delete your bucket by clicking on it in your canvas, going to Settings, and selecting Delete Bucket. 

Buckets without any data in them will be deleted immediately, and non-empty buckets will be scheduled for permanent deletion two days after you select the deletion to protect against [accidental deletions](https://blog.railway.com/p/how-we-oops-proofed-infrastructure-deletion-on-railway).

You will continue to be billed for your accumulated storage size until your bucket has been permanently deleted at the two-day mark.

## FAQ

<Collapse title="How can I view my bucket files in a project?">

Railway doesn't currently have a built-in file explorer. To view, upload, or download files, you'll need to use an S3 file explorer app.

Interested in a native file explorer? Show your support by upvoting [this feature request](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a).

</Collapse>

<Collapse title="Are there automatic backups for buckets?">

Railway doesn't currently offer automatic backups or snapshots for buckets.

Want this feature? Leave your feedback [in this feature request](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697).

</Collapse>

<Collapse title="What hardware do buckets run on?">

Railway Buckets run on [Tigris's](https://www.tigrisdata.com/) metal servers, which provides real object storage with high performance and durability.

This is true object storage, not block storage like Volumes, so concepts like IOPS don't apply here.

</Collapse>

<Collapse title="Can I use private networking to connect to a bucket?">

Buckets are currently only accessible via public networking.

</Collapse>

<Collapse title="How are S3 API operations billed?">

All S3 API operations (PUT, GET, DELETE, LIST, HEAD, etc.) are free and unlimited on Railway Buckets.

In traditional S3 pricing, these are categorized as Class A operations (PUT, POST, COPY, LIST) and Class B operations (GET, HEAD), but on Railway, you don't need to worry about operation costs at all.

</Collapse>

<Collapse title="How is egress billed?">

Egress from buckets to the internet or to your services is free and unlimited.

Note that egress from your services to buckets (uploads) is billed at the standard public egress rate. Learn more about [Bucket Egress vs. Service Egress](#bucket-egress-vs-service-egress).

</Collapse>

## Help us improve Storage Buckets

Upvote these feature requests on our feedback page if these features sound useful to you:

- [Native file explorer](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Snapshots and backups](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Publicly-accessible buckets](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697)

If you have an idea for other features, let us know on [this feedback page](https://station.railway.com/feedback/object-storage-tell-us-what-you-need-924b88fc).
