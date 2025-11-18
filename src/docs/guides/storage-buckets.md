---
title: Storage Buckets
description: Persist assets in object storage.
---

Buckets are a feature in Railway which allow you to have S3 compatible object storage in your project. Buckets are great if you need durable blob storage without having to wire up an external provider. 

## Setting up buckets.

Creating a bucket is just like any other service on railway. Right click the canvas and select Bucket. Once you select your region, hit deploy and your S3 compatible bucket gets created.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419444/CreateABucket_naa0ss.mp4" controls autoplay loop muted playsinline />


### Connecting

Storage Buckets are fully S3-compatible, so you can connect with any S3-capable library or tool with full functionality out of the box. Your connection credentials are available in the Credentials tab of the bucket’s settings.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419442/GetCredentials_y69ge4.mp4" controls autoplay loop muted playsinline />

### Path-style URLs

In some instances when attempting to establish a connection you’ll see things like:

`Invalid client configuration:`
`A behavior major version must be set when sending a request or constructing a client.`

`Not authorized to perform: s3:CreateBucket on resource: arn:aws:s3:::resource`

Railway buckets *require* path style URLs which can be forced by most AWS S3 libraries. 

Using the official [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) here’s an example of forcing path style. 

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

### Variable References

Storage Buckets support [variable reference](https://docs.railway.com/guides/variables#referencing-a-shared-variable) in two ways. The first is manually entering fields you want linked by navigating to your service’s variable tab and selecting “Add Reference”.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419449/VariableReferenceManual_ld79zb.mp4" controls autoplay loop muted playsinline />

The second method injects a predefined set of environment variables into the target service. These presets, such as “AWS SDK,” “Bun,” “FastAPI,” or “n8n”, configure the variables in the format expected by that tool. Select your bucket, open the Credentials tab, choose “Add to Service”, pick the service and style, then click “Add Variables”. Redeploy the service for the changes to take effect.

<video src="https://res.cloudinary.com/railway/video/upload/v1763419460/AutoInjectVariables_xborrx.mp4" controls autoplay loop muted playsinline />

### Notes

Interested in a native file explorer? You can show your support by upvoting [this feature request](https://station.railway.com/feedback/railway-storage-buckets-native-file-expl-e0bc1a5a).

Want snapshots or backups? Upvote [this feature request](https://station.railway.com/feedback/railway-storage-buckets-backup-feature-8c44e697) too.

Looking for public buckets? Upvote [this feature request](https://station.railway.com/feedback/public-railway-storage-buckets-1e3bdac8).
