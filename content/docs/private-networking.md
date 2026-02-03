---
title: Private Networking
description: Learn everything about private networking on Railway.
---

Private Networking is a feature within Railway that allows you to have a private network between your services, helpful for situations where you want to have a public gateway for your API but leave internal communication private.

<Image src="https://res.cloudinary.com/railway/image/upload/v1686946888/docs/CleanShot_2023-06-16_at_16.21.08_2x_lgp9ne.png"
alt="Preview of What The Guide is Building"
layout="intrinsic"
width={1310} height={420} quality={100} />

## How it works

Under the hood, Railway uses encrypted Wireguard tunnels to create a private mesh network between all services within an environment. This allows traffic to route between services without exposing ports publicly.

By default, all projects have private networking enabled and services will get a DNS name under the `railway.internal` domain. For new environments (created after October 16, 2025), this DNS name will resolve to both internal IPv4 and IPv6 addresses. [Legacy environments](#legacy-environments) resolve to IPv6 only.

### Internal DNS

Every service in a project and environment gets an internal DNS name under the `railway.internal` domain that resolves to the internal IP addresses of the service.

This allows communication between services in an environment without exposing any ports publicly. Any valid IPv6 or IPv4 traffic is allowed, including UDP, TCP, and HTTP.

For more details on internal DNS names, see the [Domains guide](/networking/domains#private-domains).

## Communicating over the private network

To communicate over the private network, there are some specific things to know to be successful.

<div style={{ marginTop: '1.5em' }}><Banner variant="info">
[Railway now supports both IPv6 and IPv4 private networking in all newly created environments](https://railway.com/changelog/2025-10-17-repo-aware-settings#ipv4-private-networks). [Legacy environments](#legacy-environments) (created before October 16th 2025) will still be limited to IPv6. With that in mind, we've preserved the IPv6 only guides below.

However, if you've setup a new service or environment after IPv4 support is released you're good to use IPv4 or IPv6! whatever suits you best!
</Banner></div>

### Service configuration

We recommend configuring your application to listen on `::` (all interfaces). This ensures your app works in both new (IPv4/IPv6) and legacy (IPv6-only) environments.

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

#### Node / next

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

If neither of these options are viable, you can set a `HOSTNAME` [service variable](/variables#service-variables) with the value `::` to listen on both IPv4 and IPv6.

#### Python / gunicorn

Update your start command to bind to both IPv4 and IPv6.

```bash
gunicorn app:app --bind [::]:${PORT-3000}
```

#### Python / hypercorn

Update your start command to bind to both IPv4 and IPv6.

```bash
hypercorn app:app --bind [::]:${PORT-3000}
```

#### Python / uvicorn

Update your start command to bind to both IPv4 and IPv6.

```bash
uvicorn app:app --host "" --port ${PORT-3000}
```

#### Rust / Axum

Listen on `[::]` to bind to both IPv4 and IPv6.

```rust
let app = Router::new().route("/", get(health));

let listener = tokio::net::TcpListener::bind("[::]:8080").await.unwrap();

axum::serve(listener, app).await;
```

### Use internal hostname and port

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

#### Using reference variables

Using [reference variables](/variables#reference-variables), you can accomplish the same end as the above example.

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

### Private network context

The private network exists in the context of a project and environment and is not accessible over the public internet. In other words -

- A web application that makes client-side requests **cannot** communicate to another service over the private network.
- Services in one project/environment **cannot** communicate with services in another project/environment over the private network.

Check out the [FAQ](#faq) section for more information.

### Library-specific configuration

Some libraries and components require explicit configuration for dual-stack (IPv4/IPv6) networking or to work properly in legacy IPv6-only environments.

See the [Library Configuration guide](/networking/private-networking/library-configuration) for detailed setup instructions for:
- **Node.js**: ioredis, bullmq, hot-shots
- **Go**: Fiber
- **Docker**: MongoDB

## Changing the service name for DNS

Within the service settings you can change the service name to which you refer, e.g. `api-1.railway.internal` -> `api-2.railway.internal`

The root of the domain, `railway.internal`, is static and **cannot** be changed.

## Caveats

During the feature development process we found a few caveats that you should be aware of:

- Private networking is not available during the build phase.
- Private networking does not function between [environments](/environments).
- [Legacy environments](#legacy-environments) (created before October 16, 2025) only support IPv6. New environments support both IPv4 and IPv6.

## Legacy environments

Environments created before October 16th, 2025 are considered legacy environments and only support IPv6 addressing for private networking.

<div style={{marginTop: '1.5em'}}>
<Banner variant="info">
Railway will migrate all legacy environments to support both IPv4 and IPv6 addressing at a later date.
</Banner>
</div>

If you want to utilize private networking in a legacy environment, you will need to configure your service to bind to `::` (the IPv6 all-interfaces address). See the [Service Configuration](#service-configuration) section for more information on configuring your listener. This will continue to work after your environment receives IPv4 support.

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

## Troubleshooting

Having issues with private networking? Check out the [Troubleshooting guide](/troubleshooting) or reach out on the <a href="https://discord.gg/railway" target="_blank">Railway Discord</a>.
