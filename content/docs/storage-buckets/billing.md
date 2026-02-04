---
title: Storage Buckets Billing
description: Understand how Railway Storage Buckets are priced and billed.
---

Buckets are billed at **$0.015** per GB-month (30 days), based on the total amount of data stored across all bucket instances in your workspace, including Environments. All S3 API operations are unlimited and free. Egress is also unlimited and free, whether that's using presigned URLs or via the S3 API.

Usage (GB-month) is calculated by averaging the day-to-day usages and rounding the final accumulation to the next whole number if it totaled a fractional amount (5.1 GB-month gets billed as 6 GB-month).

Buckets are currently only available in the Standard storage tier – there's no minimum storage retention and no data retrieval fees.

## Bucket egress VS. Service egress

Even though *buckets* don't charge for ingress or egress, buckets still live on the public network. When you upload files from your Railway services to your buckets, those *services* will incur egress usages, since you're uploading over the public network. Buckets are currently not available on the private network.

Note that service egress is not free. If your service sends data to users or uploads files to a bucket, that traffic counts as service egress.

## Billing examples

- If you stored **10 GBs for 30 days**, you'd get charged for **10 GB**-month.
- If you stored **10 GBs for 15 days** and **0 GB** for the next 15, your usage averages to **5 GB**-month.

## Plan limits

### Free plan

You can use up to **10 GB-month** each month on the free plan. Bucket usage counts against your $1 monthly credit. Once the credit is fully used, bucket access is suspended and files become unavailable, but your files will not be deleted. You can access your files again at the next billing cycle when credits refresh, or immediately if you upgrade to a paid plan.

### Trial plan

You can use up to **50 GB-month** during the trial. Bucket usage counts against your trial credits. When the trial ends, bucket access is suspended and files become unavailable. You can access your files again when you switch to the Free Plan or upgrade to a paid plan.

### Limited trial

Buckets are not available in the [Limited Trial](/pricing/free-trial#full-vs-limited-trial).

### Hobby

The Hobby Plan has a combined maximum storage capacity of **1TB**. Any uploads that would exceed this limit will fail.

### Pro

The Pro Plan has **unlimited** storage capacity.

## Usage limit

If you exceed your [Hard Usage Limit](/pricing/cost-control#hard-limit), bucket access is suspended and files cannot be read or uploaded anymore. Existing stored data is still billed. You can access your files again once you raise or remove the Hard Limit, or when the next billing period starts.

## FAQ

<Collapse title="How are S3 API operations billed?">

All S3 API operations (PUT, GET, DELETE, LIST, HEAD, etc.) are free and unlimited on Railway Buckets.

In traditional S3 pricing, these are categorized as Class A operations (PUT, POST, COPY, LIST) and Class B operations (GET, HEAD), but on Railway, you don't need to worry about operation costs at all.

</Collapse>

<Collapse title="How is egress billed?">

Egress from buckets to the internet or to your services is free and unlimited.

Note that egress from your services to buckets (uploads) is billed at the standard public egress rate. Learn more about [Bucket Egress vs. Service Egress](#bucket-egress-vs-service-egress).

</Collapse>
