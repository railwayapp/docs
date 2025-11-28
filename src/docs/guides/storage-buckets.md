---
title: Storage Buckets
description: Persist assets in object storage.
---

Buckets are a feature in Railway which allow you to have S3 compatible object storage in your project. Buckets are great if you need durable blob storage without having to wire up an external provider. 

## Getting started

<Banner variant="info">Storage Buckets are currently only available behind a feature flag in Priority Boarding. To learn more about Priority Boarding and how to join, visit [this page](https://docs.railway.com/guides/join-priority-boarding).</Banner>

To create a new bucket, right-click on your canvas and select Bucket. Here you can choose what region to host the bucket in and its name. By defualt, buckets are created with a pre-generated name. This acts as both the display name in your project and the bucket's S3 name. Once your bucket is created, you can change its display name, but you can't change the S3 name. Make sure you change it at creation if you want to customize it. We add a few extra characters on the end of your custom name to keep it unique between accounts.

<video src="https://res.cloudinary.com/railway/video/upload/v1763520962/SettingName_eyhi4k.mp4" controls autoplay loop muted playsinline />

After you deploy your bucket, it'll become available to use in just a couple of seconds.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419444/CreateABucket_naa0ss.mp4" controls autoplay loop muted playsinline />

### Using buckets

Storage Buckets are fully S3-compatible. You can use any S3 client library and expect it to work just like a normal S3 bucket. You can view your connection credentials in the Credentials tab when clicking on the bucket service.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419442/GetCredentials_y69ge4.mp4" controls autoplay loop muted playsinline />

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

### Path-style URLs

If you see an error like this coming from your service:

- `Invalid client configuration:`
- `A behavior major version must be set when sending a request or constructing a client.`
- `Not authorized to perform: s3:CreateBucket on resource: arn:aws:s3:::resource`

You have to configure your S3 client to utilize **path-style URLs**. This is a requirement when using Railway buckets, and can be enabled by most S3 client libraries. 

With the Node.js [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) library, for example, you can configure path-style URLs like so:

```jsx
const client = new S3Client({
    region: "Region",
    endpoint: "Endpoint URL",
    credentials: {
      accessKeyId: "Access Key ID",
      secretAccessKey: "Secret Access Key",
    },
    forcePathStyle: true, // This bit is required
});
```

### Help us improve Storage Buckets

Upvote these feature requests on our feedback page if these features sound useful to you:

- [Native file explorer](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Snapshots and backups](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a)
- [Publicly-accessible buckets](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697)

If you have an idea for other features, let us know on [this feedback page](https://station.railway.com/feedback/object-storage-tell-us-what-you-need-924b88fc).
