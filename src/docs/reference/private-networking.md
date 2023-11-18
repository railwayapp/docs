---
title: Private Networking
---

Private Networking is a feature within Railway that will open network communication through a IPv6 wireguard mesh only accessible to your Railway services within an environment.

<Image src="https://res.cloudinary.com/railway/image/upload/v1686946888/docs/CleanShot_2023-06-16_at_16.21.08_2x_lgp9ne.png"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={1310} height={420} quality={100} />

This will allow you to have a private network between your services, helpful for situations where you want to have a public gateway for your API but leave internal communication private.

## How it works

Every service within an environment now has its own subnet within an environment.

Under the hood, Railway is using encrypted Wireguard tunnels to create a mesh network between all services within an environment. This allows Railway to route traffic between services without having to expose any ports publicly.

**Note: You cannot use private networking to communicate with services in other environments.**

Every service gets an internal DNS name under the `railway.internal` domain. This DNS name will resolve to the internal IP address of the service. This allows you to communicate with any service within an environment without having to expose any ports publicly. Any valid IPv6 traffic is allowed, UDP, TCP and HTTP.

## Caveats

During the feature development process we found a few caveats that you should be aware of:

- Private networking is not available during the build phase.
- You will need to establish a wireguard tunnel to external services if you wish to vendor requests in your application.
- You will need to bind to a IPv6 port to receive traffic on the private network.
- Private networking is enabled automatically for new projects/environments. If you want to use private networking in an existing environment, you will have to enable it manually in the settings panel of one of the environment services.
- Private networks take 100ms to initialize on deploy, we ask that you set initial requests on a retry loop.
- We don't support IPv4 private networking
- Alpine-based images may not work with our internal DNS due to how it performs
  resolution. [Click here](/how-to/use-private-networking#workaround-for-alpine-based-images) for a workaround.
