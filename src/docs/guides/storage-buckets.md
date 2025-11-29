---
title: Storage Buckets
description: Persist assets in object storage.
---

Railway Buckets are private, S3-compatible object storage buckets for your projects. They give you durable object storage on Railway without needing to wire up an external provider. Use them for file uploads, user-generated content, static assets, backups, or any data that needs reliable object storage.

## Creating a Bucket

To create a bucket, click the "Create" button on your canvas and select a region. Note that once you deploy the bucket, you won't be able to change its region.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419444/CreateABucket_naa0ss.mp4" controls autoPlay loop muted playsInline />

### No public access to buckets

Railway Buckets are private by default. Objects can only be publicly accessed using presigned URLs. Direct public access isn't currently supported.

Presigned URLs are temporary, signed URLs that grant time-limited access to specific objects in your bucket. You generate them using your S3 client library, and can set expiration times up to 90 days. They're perfect for sharing files securely without making your entire bucket public.

Want to make your entire bucket publicly accessible? You'll need to create a dedicated proxy service or proxy files through your backend.

<Banner variant="info">
If you want public buckets, leave your feedback in [Central Station](https://station.railway.com/feedback/public-railway-storage-buckets-1e3bdac8) and tell us your usecase. We're excited to hear what you'd like to build!
</Banner>

## Using Credentials to connect to a Bucket

Once your bucket is deployed, you'll find S3-compatible credentials in the "Credentials" tab. These include an access key ID and secret access key that your S3 client uses to authenticate.

The credentials are scoped to your bucket. They only grant access to objects in this specific bucket, so you can't use them to view objects in other buckets or modify the bucket itself.

Each bucket has a single credential pair. If you need to rotate credentials, click "Regenerate Credentials" and Railway will automatically suggest redeploying affected services so they can pick up the new credentials.

<Image src="https://res.cloudinary.com/railway/image/upload/v1764373635/docs/bucket_credentials_pcvjup.png"
alt="Screenshot of bucket credentials"
layout="responsive"
width={2554} height={1970} quality={80} />

### Use virtual-hosted—style URLs

Railway Buckets use virtual-hosted—style URLs, which include your bucket name in the subdomain. This is the modern S3 standard and what most libraries expect.

Here's the format:

```
https://your-bucket-name-hash.storage.railway.app/key-name
```

When working with S3 libraries or tools, you'll typically only need to provide the endpoint `https://storage.railway.app` and your bucket name. The library handles creating the virtual-hosted—style URL for you.

If you're using an older bucket created before this standard, it might require path-style URLs instead (like `https://storage.railway.app/bucket-name/key-name`). Check the Bucket Credentials tab to see which URL style your bucket needs.

### Use the globally unique bucket name

Unlike traditional S3, you can choose any display name you want for your bucket in Railway. It doesn't need to be globally unique. However, Railway automatically generates a globally unique identifier behind the scenes for the actual S3 connection.

When connecting to your bucket with an S3 client, you'll need to use this globally unique identifier. You can find it in the Bucket Credentials tab under "Bucket Name". Even if you rename your bucket's display name later, this unique identifier stays the same.

The globally unique identifier is generated from the bucket name you provide before deployment.

<video src="https://res.cloudinary.com/railway/video/upload/v1763520962/SettingName_eyhi4k.mp4" controls autoPlay loop muted playsInline />

## Bucket Variables

Railway buckets expose several variables that you can reference in your services using [variable references](/guides/variables#referencing-a-shared-variable). These include the bucket name, region, endpoint, access key ID, and secret access key. Everything your S3 client needs to connect.

You can reference these directly in your service's environment variables without copy-pasting credentials manually.

<Image src="https://res.cloudinary.com/railway/image/upload/v1764373717/docs/bucket_variables_q6vevd.png"
alt="Screenshot of bucket variables in a service"
layout="responsive"
width={1908} height={1378} quality={80} />

To bulk-add all bucket credentials to a service, head to the "Credentials" tab in your bucket and click "Add to Service". You can choose environment variable naming conventions from popular libraries and frameworks (like AWS SDK, Bun, etc.), or define your own variable names.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419460/AutoInjectVariables_xborrx.mp4" controls autoplay loop muted playsinline />

## Buckets in Environments

Each environment gets its own separate bucket instance with isolated credentials. When you [duplicate an environment](/guides/environments#create-an-environment) or use [PR environments](/guides/environments#enable-pr-environments), you won't need to worry about accidentally deleting production objects, exposing sensitive data in pull requests, or polluting your production environment with test data.

## How buckets are billed

Buckets are billed as GB-month, based on the total amount of data stored across all bucket instances in your workspace.

- $0.015 per GB-month of storage
- S3 API operations (PUT, GET, DELETE, LIST, etc.) are unlimited and free
- Egress from buckets is unlimited and free

Billing works by adding each day's average usage to your workspace total. At the end of the billing period, fractional GB-month values are rounded up to the next whole number (so 5.1 GB-month becomes 6 GB-month). A GB-month is calculated as 30 days.

Here are some examples:
- Store 10 GB for 30 days → charged for 10 GB-month
- Store 10 GB for 15 days and 0 GB for 15 days → charged for 5 GB-month

Buckets are currently only available in the Standard storage tier. There's no minimum storage retention and no data retrieval fees.

## S3 Compatibility

Buckets are fully S3-compatible, which means you can use them with any S3-capable library, tool, or framework. Most use cases work out of the box with full functionality.

Supported features include:
- Presigned URLs
- Multipart uploads
- Server-side encryption

Not yet supported:
- Object Versioning
- Object Locks
- Bucket Lifecycle configuration

<Banner variant="info">
Missing a feature you need? Let us know in [Central Station](https://station.railway.com/) and tell us what you're building with it.
</Banner>

## Deleting a Bucket

You can delete a bucket from your project canvas.

- Empty buckets are deleted immediately
- Non-empty buckets are scheduled for deletion 2 days later, to prevent [accidental file deletion](https://blog.railway.com/p/how-we-oops-proofed-infrastructure-deletion-on-railway)

Note that you'll continue to be billed for files until they're actually deleted after the 2-day period. If you'd prefer to delete them right away, you can manually remove the files before deleting the bucket.

## FAQ

<Collapse title="How can I view my bucket files in a project?">

Railway doesn't currently have a built-in file explorer. To view, upload, or download files, you'll need to use an S3 file explorer app.

Interested in a native file explorer? Show your support by upvoting [this feature request](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a).

</Collapse>

<Collapse title="Are there automatic backups for buckets?">

Railway doesn't currently offer automatic backups or snapshots for buckets.

Want this feature? Leave your feedback [in this feature request](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697).

</Collapse>

<Collapse title="What infrastructure are buckets using?">

Railway Buckets run on [Tigris's](https://www.tigrisdata.com/) bare-metal infrastructure, which provides real object storage with high performance and durability.

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