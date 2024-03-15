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

To communicate over the private network, there are some specific things to know to be successful.

### Listen on IPv6

Since the private network is an IPv6 network, applications that will receive requests over the private network must be configured to listen on IPv6.  On most web frameworks, you can do this via `::` and specifying the port(s) to which you want to bind.

For example - 
```javascript
const port = process.env.PORT || 3000;

app.listen(port, '::', () => {
    console.log(`Server listening on [::]${port}`);
});
```

### Use Internal Hostname and Port

For applications making requests to a service over the private network, you should use the internal DNS name of the service, plus the `PORT` on which the service is listening.

For example, if you have a service called `api` listening on port 3000, and you want to communicate with it from another service, you would use `api.railway.internal` as the hostname and specify the port -

```javascript
app.get('/fetch-secret', async (req, res) => {
    axios.get('http://api.railway.internal:3000/secret')
    .then(response => {
        res.json(response.data);
    })
})
```

Note that you should use `http` in the address.

**Using Reference Variables**

Using [reference variables](/guides/variables), you can accomplish the same end as the above example.

Let's say you are setting up your frontend service to talk to the `api` service.  In the frontend service, set the following variable -
```
BACKEND_URL=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}
```

Then in the frontend code, you will simply reference the `BACKEND_URL` environment variable - 

```javascript
app.get('/fetch-secret', async (req, res) => {
    axios.get(`${process.env.BACKEND_URL}/secret`)
    .then(response => {
        res.json(response.data);
    })
})
```

### Private Network Context

The private network exists in the context of a project and environment and is not accessible over the public internet.  In other words -

- A web application that makes client-side requests **cannot** communicate to another service over the private network.
- Services in one project/environment **cannot** communicate with services in another project/environment over the private network.

Check out the [FAQ](#faq) section for more information.

### Known Configuration Requirements for IPv6

Some libraries and components require you to be explicit when either listening or establishing a connection over IPv6.

<Collapse title="ioredis">

`ioredis` is a Redis client for node.js, commonly used for connecting to Redis from a node application.  When initializing a Redis client using `ioredis`, you must specify `family=0` in the connection string to support connecting to both IPv6 and IPv4 connections:

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_PRIVATE_URL + '?family=0');

const ping = await redis.ping();
```

<a href="https://www.npmjs.com/package/ioredis" target="_blank">ioredis docs</a>

</Collapse>

<Collapse title="Mongo Docker image">

If you are creating a service using the official Mongo Docker image in Docker Hub and would like to connect to it over the private network, you must start the container with some options to instruct the Mongo instance to listen on IPv6. For example, this would be set in your [Start Command](/guides/start-command):

```bash
docker-entrypoint.sh mongod --ipv6 --bind_ip ::,0.0.0.0
```

**Note that the official template provided by Railway is already deployed with this Start Command.**

</Collapse>

<Collapse title="hot-shots">

`hot-shots` is a StatsD client for node.js, which can be used to ship metrics to a DataDog agent for example.  When initializing a StatsD client using `hot-shots`, you must specify that it should connect over IPv6:

```javascript
const StatsD = require('hot-shots');

const statsdClient = new StatsD({
  host: process.env.AGENT_HOST,
  port: process.env.AGENT_PORT,
  protocol: 'udp',
  cacheDns: true,
  udpSocketOptions: {
    type: 'udp6',
    reuseAddr: true,
    ipv6Only: true,
  },
});
```

<a href="https://www.npmjs.com/package/hot-shots" target="_blank">hot-shots docs</a>

</Collapse>

<Collapse title="Go Fiber">

`fiber` is a web framework for Go.  When configuring your Fiber app, you should set the Network field to `tcp` to have it listen on IPv6 as well as IPv4:

```go
app := fiber.New(fiber.Config{
    Network:       "tcp",
    ServerHeader:  "Fiber",
    AppName: "Test App v1.0.1",
})
```

<a href="https://docs.gofiber.io/api/fiber#:~:text=json.Marshal-,Network,-string" target="_blank">Fiber docs</a>

</Collapse>


## Changing the service name for DNS

Within the service settings you can change the service name to which you refer, e.g. `api-1.railway.internal` -> `api-2.railway.internal`

The root of the domain, `railway.internal`, is static and **cannot** be changed.

## Workaround for Alpine-based images

During private networking initialization (the period under 100ms), DNS resolution is handled via a fallback DNS server 8.8.8.8 in the container DNS config.

In Alpine-based images, due to how DNS resolution is handled, if that public DNS server's response is faster than the private networking DNS, it causes private resolution to fail.

You can workaround this issue by adding `ENABLE_ALPINE_PRIVATE_NETWORKING=true` in your service environment variables.
This will effectively remove the fallback DNS server 8.8.8.8 which is used during the private networking 100ms initialization period.

<Banner variant="info">
Note that using this workaround will cause the 100ms DNS initialization delay to impact both public and private networking.
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
  resolution. See the [section above](#workaround-for-alpine-based-images) for a workaround.

## FAQ

<Collapse title="What is a client side app, a sever side app, and what kind of app am I running?">

In the context of private networking, the key distinction between client- and server-side is from where requests are being made.
- In client-side applications, requests to other resources (like other Railway services) are made from a browser, which exists on the public network and outside the private network.
- In server-side applications, requests to other resources are made from the server hosting the application, which would exist within the private network (assuming the server hosting the app is in Railway).

One way to determine whether your application is making client- or server-side requests is by inspecting the request in the Network tab of DevTools.  If the RequestURL is the resource to which the request is being made, e.g. a backend server, this is a good indication that the browser itself is making the request (client-side).

</Collapse>

<Collapse title="What if I am making a request server-side, but from Vercel?">

Since an application hosted on Vercel exists outside of the private network in Railway, requests coming from Vercel servers cannot be made over the private network.

</Collapse>