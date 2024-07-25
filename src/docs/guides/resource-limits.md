---
title: Resource Limits
---

Resource limits are a way to limit the maximum amount of resources available to a service.

## Configure Resource Limits

You can update resource limits from the service settings page under the "Deploy" section.

<Image
  src="https://res.cloudinary.com/railway/image/upload/v1721917970/resource-limits.png"
  alt="Resource Limits setting"
  layout="intrinsic"
  width={1298}
  height={658}
  quality={80}
/>

### Use Resource Limits

Using resource limits makes sense in scenarios where:

1. You don't want to risk a high bill due to unexpected spikes in usage.
2. You are okay with the service possibly crashing if it exceeds the limit, possibly in non-production environments.

**Note**: We do not recommend using resource limits in production environments as setting your limits too low can cause your service to crash.
