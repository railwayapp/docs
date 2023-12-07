---
title: Private Networking
---

Private Networking is a feature within Railway that allows you to have a private network between your services, helpful for situations where you want to have a public gateway for your API but leave internal communication private.

<Image src="https://res.cloudinary.com/railway/image/upload/v1686946888/docs/CleanShot_2023-06-16_at_16.21.08_2x_lgp9ne.png"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={1310} height={420} quality={100} />

By default, all projects have private networking enabled and services will get a new DNS name under the `railway.internal` domain. This DNS name will resolve to the internal IPv6 address of the services within a project.

## Communicating over the private network

First, it is important to understand that the private network exists in the context of a project and environment and is not accessible over the public internet.  In other words -

- A client-side application **cannot** communicate to another service over the private network (unless the requests are server-side).
- Services in one project/environment **cannot** communicate with services in another project/environment over the private network.

### Listen on IPv6

To set up an application to listen on the private network, your app must listen on IPv6.  On most web frameworks, you can do this via `::` and specifying the port(s) to which you want to bind.

For example - 
```javascript
const port = 3000;

app.listen(port, '::', () => {
    console.log(`Server listening on  ::${port}`);
});
```

### Internal Hostname

To make a request to a service over the private network, you should use the internal DNS name of the service, plus the `PORT` on which the service is listening.

For example, if you have a service called `api` listening on port 3000, and you want to communicate with it from another service, you would use `api.railway.internal` as the hostname and specify the port -

```javascript
app.get('/fetch-secret', async (req, res) => {
    axios.get('http://api.railway.internal:3000/secret')
    .then(response => {
        res.json(response.data);
    })
})
```

If you wish to open a service that has a public, you can use the `PORT` environment variable to specify the public port. This will allow Railway to route traffic to the public port.

## Changing the service name for DNS

Within the service settings you can change the service name you refer to but not the internal DNS root. Ex. `api-1.railway.internal` -> `api-2.railway.internal`

## Workaround for Alpine-based images

During private networking initialization (the period under 100ms), dns resolution is handled via a fallback DNS server 8.8.8.8 in the container DNS config.

In Alpine-based images, due to how DNS resolution is handled, if that public DNS server's response is faster than the private networking DNS, it causes private resolution to fail.

You can workaround this issue by adding `ENABLE_ALPINE_PRIVATE_NETWORKING=true` in your service environment variables.
This will effectively remove the fallback DNS server 8.8.8.8 which is used during the private networking 100ms initialization period.

<Banner variant="info">
Note that using this workaround will cause the 100ms dns initialization delay to impact both public and private networking.
</Banner>

## Caveats

During the feature development process we found a few caveats that you should be aware of:

- Private networking is not available during the build phase.
- You will need to establish a wireguard tunnel to external services if you wish to vendor requests in your application.
- You will need to bind to a IPv6 port to receive traffic on the private network.
- Private networking is enabled automatically for new projects/environments. If you want to use private networking in an existing environment, you will have to enable it manually in the settings panel of one of the environment services.
- Private networks take 100ms to initialize on deploy, we ask that you set initial requests on a retry loop.
- We don't support IPv4 private networking
- Alpine-based images may not work with our internal DNS due to how it performs
  resolution. See the section above for a workaround.

## Projects created before 2023/06/16

For projects created before the above date, Private Networking is not automatically enabled.  

In the service settings page, you can enable private networking and service discovery for all services within the environment. 

<Image src="https://res.cloudinary.com/railway/image/upload/v1686946842/docs/CleanShot_2023-06-16_at_16.15.35_2x_woehyq.png"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={1442} height={510} quality={100} />