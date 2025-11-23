---
title: Private Networking
description: Learn everything about private networking on Railway.
---

Private Networking is a feature within Railway that allows you to have a private network between your services, helpful for situations where you want to have a public gateway for your API but leave internal communication private.

<Image src="https://res.cloudinary.com/railway/image/upload/v1686946888/docs/CleanShot_2023-06-16_at_16.21.08_2x_lgp9ne.png"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={1310} height={420} quality={100} />

By default, all projects have private networking enabled and services will get a new DNS name under the `railway.internal` domain. This DNS name will resolve to the internal IPv6 address of the services within a project.

## Communicating Over the Private Network

To communicate over the private network, there are some specific things to know to be successful.

### Listen on IPv6

Since the private network is an IPv6 only network, applications that will receive requests over the private network must be configured to listen on IPv6. On most web frameworks, you can do this by binding to the host `::`.

Some examples are below -

#### Node / Express

Listen on `::` to bind to both IPv4 and IPv6.

```javascript
const port = process.env.PORT || 3000;

app.listen(port, "::", () => {
  console.log(`Server listening on [::]${port}`);
});
```

#### Node / Nest

Listen on `::` to bind to both IPv4 and IPv6.

```javascript
const port = process.env.PORT || 3000;

async function bootstrap() {
  await app.listen(port, "::");
}
```

#### Node / Next

Update your start command to bind to both IPv4 and IPv6.

```bash
next start --hostname :: --port ${PORT-3000}
```

Or if you are using a custom server, set `hostname` to `::` in the configuration object passed to the `next()` function.

```javascript
const port = process.env.PORT || 3000;

const app = next({
  // ...
  hostname: "::",
  port: port,
});
```

If neither of these options are viable, you can set a `HOSTNAME` [service variable](/guides/variables#service-variables) with the value `::` to listen on both IPv4 and IPv6.

#### Python / Gunicorn

Update your start command to bind to both IPv4 and IPv6.

```bash
gunicorn app:app --bind [::]:${PORT-3000}
```

#### Python / Hypercorn

Update your start command to bind to both IPv4 and IPv6.

```bash
hypercorn app:app --bind [::]:${PORT-3000}
```

#### Python / Uvicorn

Update your start command to bind to IPv6.

```bash
uvicorn app:app --host :: --port ${PORT-3000}
```

**Note:** If your application needs to be accessible over both private and public networks, your application server must support dual stack binding. Most servers handle this automatically when listening on `::`, but some, like Uvicorn, do not.

#### Rust / Axum

Listen on `[::]` to bind to both IPv4 and IPv6.

```rust
let app = Router::new().route("/", get(health));

let listener = tokio::net::TcpListener::bind("[::]:8080").await.unwrap();

axum::serve(listener, app).await;
```


### Use Internal Hostname and Port

For applications making requests to a service over the private network, you should use the internal DNS name of the service, plus the `PORT` on which the service is listening.

For example, if you have a service called `api` listening on port 3000, and you want to communicate with it from another service, you would use `api.railway.internal` as the hostname and specify the port -

```javascript
app.get("/fetch-secret", async (req, res) => {
  axios.get("http://api.railway.internal:3000/secret").then(response => {
    res.json(response.data);
  });
});
```

Note that you should use `http` in the address.

#### Using Reference Variables

Using [reference variables](/guides/variables), you can accomplish the same end as the above example.

Let's say you are setting up your frontend service to talk to the `api` service. In the frontend service, set the following variable -

```
BACKEND_URL=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}
```

<div style={{ marginTop: '1.5em' }}><Banner variant="info">
`api.PORT` above refers to a service variable that must be set manually. It does not automatically resolve to the port the service is listening on, nor does it resolve to the `PORT` environment variable injected into the service at runtime.
</Banner></div>

Then in the frontend code, you will simply reference the `BACKEND_URL` environment variable -

```javascript
app.get("/fetch-secret", async (req, res) => {
  axios.get(`${process.env.BACKEND_URL}/secret`).then(response => {
    res.json(response.data);
  });
});
```

### Private Network Context

The private network exists in the context of a project and environment and is not accessible over the public internet. In other words -

- A web application that makes client-side requests **cannot** communicate to another service over the private network.
- Services in one project/environment **cannot** communicate with services in another project/environment over the private network.

Check out the [FAQ](#faq) section for more information.

### Known Configuration Requirements for IPv6

Some libraries and components require you to be explicit when either listening or establishing a connection over IPv6.

<Collapse title="ioredis">

`ioredis` is a Redis client for node.js, commonly used for connecting to Redis from a node application.

When initializing a Redis client using `ioredis`, you must specify `family=0` in the connection string to support connecting to both IPv6 and IPv4 endpoints:

```javascript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL + "?family=0");

const ping = await redis.ping();
```

<a href="https://www.npmjs.com/package/ioredis" target="_blank">ioredis docs</a>

</Collapse>

<Collapse title="bullmq">

`bullmq` is a message queue and batch processing library for node.js, commonly used for processing jobs in a queue.

When initializing a bullmq client, you must specify `family: 0` in the connection object to support connecting to both IPv6 and IPv4 Redis endpoints:

```javascript
import { Queue } from "bullmq";

const redisURL = new URL(process.env.REDIS_URL);

const queue = new Queue("Queue", {
  connection: {
    family: 0,
    host: redisURL.hostname,
    port: redisURL.port,
    username: redisURL.username,
    password: redisURL.password,
  },
});

const jobs = await queue.getJobs();

console.log(jobs);
```

<a href="https://docs.bullmq.io/" target="_blank">bullmq docs</a>

</Collapse>

<Collapse title="Mongo Docker image">

If you are creating a service using the official Mongo Docker image in Docker Hub and would like to connect to it over the private network, you must start the container with some options to instruct the Mongo instance to listen on IPv6. For example, this would be set in your [Start Command](/guides/start-command):

```bash
docker-entrypoint.sh mongod --ipv6 --bind_ip ::,0.0.0.0
```

**Note that the official template provided by Railway is already deployed with this Start Command.**

</Collapse>

<Collapse title="hot-shots">

`hot-shots` is a StatsD client for node.js, which can be used to ship metrics to a DataDog agent for example. When initializing a StatsD client using `hot-shots`, you must specify that it should connect over IPv6:

```javascript
const StatsD = require("hot-shots");

const statsdClient = new StatsD({
  host: process.env.AGENT_HOST,
  port: process.env.AGENT_PORT,
  protocol: "udp",
  cacheDns: true,
  udpSocketOptions: {
    type: "udp6",
    reuseAddr: true,
    ipv6Only: true,
  },
});
```

<a href="https://www.npmjs.com/package/hot-shots" target="_blank">hot-shots docs</a>

</Collapse>

<Collapse title="Go Fiber">

`fiber` is a web framework for Go. When configuring your Fiber app, you should set the Network field to `tcp` to have it listen on IPv6 as well as IPv4:

```go
app := fiber.New(fiber.Config{
    Network:       "tcp",
    ServerHeader:  "Fiber",
    AppName: "Test App v1.0.1",
})
```

<a href="https://docs.gofiber.io/api/fiber#:~:text=json.Marshal-,Network,-string" target="_blank">Fiber docs</a>

</Collapse>

## Changing the Service Name for DNS

Within the service settings you can change the service name to which you refer, e.g. `api-1.railway.internal` -> `api-2.railway.internal`

The root of the domain, `railway.internal`, is static and **cannot** be changed.

## Caveats

During the feature development process we found a few caveats that you should be aware of:

- Private networking is not available during the build phase.
- You will need to bind to a IPv6 port to receive traffic on the private network.
- We don't support IPv4 private networking

## FAQ

<Collapse title="What is a client side app, a server side app, and what kind of app am I running?">

In the context of private networking, the key distinction between client- and server-side is from where requests are being made.

- In client-side applications, requests to other resources (like other Railway services) are made from a browser, which exists on the public network and outside the private network.
- In server-side applications, requests to other resources are made from the server hosting the application, which would exist within the private network (assuming the server hosting the app is in Railway).

One way to determine whether your application is making client- or server-side requests is by inspecting the request in the Network tab of DevTools. If the RequestURL is the resource to which the request is being made, e.g. a backend server, this is a good indication that the browser itself is making the request (client-side).

</Collapse>

<Collapse title="What if I am making a request server-side, but from Vercel?">

Since an application hosted on Vercel exists outside of the private network in Railway, requests coming from Vercel servers cannot be made over the private network.

</Collapse>
