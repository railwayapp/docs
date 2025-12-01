---
title: Storage Buckets
description: Persist assets in object storage.
---

Railway Buckets are private, S3-compatible object storage buckets for your projects. They give you durable object storage on Railway without needing to wire up an external provider. Use them for file uploads, user-generated content, static assets, backups, or any data that needs reliable object storage.

## Getting started

To create a bucket in your project, click the Create button on your canvas, select Bucket, and select its region and optionally change its name. You aren't able to change your region after you create your bucket.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419444/CreateABucket_naa0ss.mp4" controls autoPlay loop muted playsInline />

Unlike traditional S3, you can choose any display name you want for your bucket. It doesn't need to be globally unique. To identify it in the S3 API, its S3 or Bucket Name will be created from the display name the bucket was given at creation, plus a short hash on the end to ensure uniqueness between workspaces.

<video src="https://res.cloudinary.com/railway/video/upload/v1763520962/SettingName_eyhi4k.mp4" controls autoPlay loop muted playsInline />

When connecting to your bucket with an S3 client, you'll need to use this unique S3 name. You can find it in the bucket Credentials tab under Bucket Name. Even if you rename your bucket's display name later, this unique identifier stays the same.

## Connecting to your bucket

Railway Buckets are private by default, meaning you can only edit and upload your files by authenticating with the S3 API using the bucket's credentials. Presigned URLs are the only native way for bucket objects to be accessed or uploaded to publicly, and global public access to your entire bucket is not supported. If you want to make files accessible publicly outside of presigned URLs, you'll have to proxy them through your backend services.

Presigned URLs are temporary URLs that grant access to individual objects in your bucket for a specific time. You can create them using your S3 client library of choice and they can expire up to 90 days in the future. They're used to share individual files to the public without making your entire bucket public.

If you want to make your entire bucket publicly accessible, you'll need to create a proxy service or serve them through your backend.

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

## Buckets in Environments

Each environment gets its own separate bucket instance with isolated credentials. When you [duplicate an environment](/guides/environments#create-an-environment) or use [PR environments](/guides/environments#enable-pr-environments), you won't need to worry about accidentally deleting production objects, exposing sensitive data in pull requests, or polluting your production environment with test data.

## How buckets are billed

Buckets are billed at **$0.015** per GB-month (30 days), based on the total amount of data stored across all bucket instances in your workspace, including Environments. All S3 API operations are unlimited and free. Egress is also unlimited and free, whether that's using presigned URLs or via the S3 API.

<Banner variant="info">Even though *buckets* don't charge for ingress or egress, buckets still live on the public network. When you upload files from your Railway services to your buckets, those *services* will incur egress usages, since you're uploading over the public network. Buckets are currently not available on the private network.</Banner>

Usage (GB-months) is calculated by averaging the day-to-day usages and rounding the final accumulation to the next whole number if it totaled a fractional amount (5.1 GB-month gets billed as 6 GB-month).

For example, if you stored **10 GBs for 30 days**, you'd get charged for for 10 GB-month. If you stored **10 GBs for 15 days** then emptied your bucket and stored **0 GBs for another 15 days**, those totals will be averaged out and you will be charged for **5 GB-month**.

Buckets are currently only available in the Standard storage tier - there's no minimum storage retention and no data retrieval fees.

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

Note that egress from your services to buckets (uploads) is billed at the standard public egress rate.

</Collapse>

### Help us improve Storage Buckets

Upvote these feature requests on our feedback page if these features sound useful to you:

- [Native file explorer](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Snapshots and backups](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Publicly-accessible buckets](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697)

If you have an idea for other features, let us know on [this feedback page](https://station.railway.com/feedback/object-storage-tell-us-what-you-need-924b88fc).
