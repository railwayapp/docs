---
title: Storage Buckets
description: Persist assets in object storage.
---

Railway Buckets are private, S3-compatible object storage buckets for your projects. They give you durable object storage on Railway without needing to wire up an external provider. Use them for file uploads, user-generated content, static assets, backups, or any data that needs reliable object storage.

## Getting Started

To create a bucket in your project, click the Create button on your canvas, select Bucket, and select its region and optionally change its name. You aren't able to change your region after you create your bucket.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419444/CreateABucket_naa0ss.mp4" controls autoPlay loop muted playsInline />

Unlike traditional S3, you can choose a custom display name for your bucket. The actual S3 bucket name is that display name plus a short hash, ensuring it stays unique across workspaces.

<video src="https://res.cloudinary.com/railway/video/upload/v1763520962/SettingName_eyhi4k.mp4" controls autoPlay loop muted playsInline />


## Connecting to Your Bucket

Railway Buckets are private, meaning you can only edit and upload your files by authenticating with the bucket's credentials. To make files accessible publicly, you can use [presigned URLs](#presigned-urls), or proxy files through a backend service. Read more in [Serving and Uploading Files](#serving-and-uploading-files).

Public buckets are currently not supported.

<Banner variant="info">
If public buckets is something you're interested in, leave your feedback in [Central Station](https://station.railway.com/feedback/public-railway-storage-buckets-1e3bdac8) and tell us your use-case. We're excited to hear what you'd like to build!
</Banner> 

Once your bucket is deployed, you'll find S3-compatible authentication credentials in the Credentials tab of the bucket. These include the necessary details for you to connect to your bucket using your S3 client library.

<Image src="https://res.cloudinary.com/railway/image/upload/v1764706763/PathStyle_lgev9e.png"
alt="Screenshot of bucket credentials"
layout="responsive"
width={2554} height={1970} quality={80} />

### URL Style


Railway Buckets use <a target="_blank" href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#virtual-hosted–style-access">virtual-hosted–style URLs</a>, where the bucket name appears as the subdomain of the S3 endpoint. This is the standard S3 URL format, and most libraries support it out of the box. In most cases you only need to provide the base endpoint (`https://storage.railway.app`) and the client builds the full virtual-hosted URL automatically.

Buckets that were created before this change might require you to use <a target="_blank" href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access">path-style URLs</a> instead. The Credentials tab of your bucket will tell you which style you should use.

### Variable References

Storage Buckets can provide the S3 authentication credentials to your other services by using [Variable References](https://docs.railway.com/guides/variables#referencing-a-shared-variable). You can do this in two ways:

<Collapse slug="storage-buckets-manual-credentials-variables" title="Manually configuring your service's variables">
You can use regular Shared Variables by adding one to your service and pointing it at the values provided by your bucket.

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

Buckets are private, but you can still work with their files in a few ways. You can serve files straight from the bucket using presigned URLs, proxy them through your backend, or upload files directly from clients or services.

Bucket egress is free. Service egress is not. If your service sends data to users or uploads files to a bucket, that traffic counts as service egress.

Learn about the different patterns for working with files in the [Uploading & Serving Files](/storage-buckets/uploading-serving) guide.

## Buckets in Environments

Each environment gets its own separate bucket instance with isolated credentials. When you [duplicate an environment](/guides/environments#create-an-environment) or use [PR environments](/guides/environments#enable-pr-environments), you won't need to worry about accidentally deleting production objects, exposing sensitive data in pull requests, or polluting your production environment with test data.

## How Buckets are Billed

Buckets are billed at **$0.015** per GB-month. All S3 API operations and bucket egress are unlimited and free.

For detailed pricing information, plan limits, and billing examples, see the [Storage Buckets Billing](/storage-buckets/billing) page.

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

You can delete your bucket by clicking on it in your canvas, going to Settings, and selecting Delete Bucket. The bucket will disappear immediately from your project, but it's not permanently deleted yet. It will only be permanently deleted after two days to protect against [accidental deletions](https://blog.railway.com/p/how-we-oops-proofed-infrastructure-deletion-on-railway).

You will continue to be billed for your accumulated storage size until your bucket has been permanently deleted at the two-day mark. To prevent being billed for the storage, remove all files from the bucket before deleting it.

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

<Collapse title="Are buckets encrypted?">

Railway Storage Buckets are encrypted at rest.

</Collapse>

## Help us improve Storage Buckets

Upvote these feature requests on our feedback page if these features sound useful to you:

- [Native file explorer](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Snapshots and backups](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697)
- [Publicly-accessible buckets](https://station.railway.com/feedback/public-railway-storage-buckets-1e3bdac8)

If you have an idea for other features, let us know on [this feedback page](https://station.railway.com/feedback/object-storage-tell-us-what-you-need-924b88fc).
