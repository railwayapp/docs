---
title: Public Networking
description: Learn everything about public networking on Railway.
---

Public Networking refers to exposing your application to the internet, to be accessible from the public network.

## Port variable

An essential part of connecting to your service from the internet is properly handling the `PORT` variable.

The easiest way to get up and running is by using the Railway-provided port.

### Railway-provided port

As long as you have not defined a `PORT` variable, Railway will provide and expose one for you.

To have your application use the Railway-provided port, you should ensure it is listening on `0.0.0.0:$PORT`, where `PORT` is the Railway-provided environment variable.

**Examples** -

```python
# Python web server
if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
```

```javascript
// node web server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
```

More information and examples for this can be found in the [Troubleshooting guide](/troubleshooting).

**Note:** If your application needs to be accessible over both public and private networks, your application server must support dual stack binding. Most servers handle this automatically when listening on `::`, but some, like Uvicorn, do not.

### User-defined port

If you prefer to explicitly set a port, you can set the `PORT` variable in your service variables to the port on which your service is listening.

If your domain does not have a [target port set](/networking/domains#target-ports), Railway will direct incoming traffic to the port specified in the `PORT` variable, this is sometimes needed when creating a template.

For information on how to configure variables, see the [Variables guide](/variables).

## Domains

Railway provides multiple options for exposing your services via domains:

- **Railway-provided domains** - Quick setup with auto-generated `*.up.railway.app` domains
- **Custom domains** - Bring your own domain with automatic SSL certificate provisioning
- **Wildcard domains** - Flexible subdomain management
- **Private domains** - Internal `*.railway.internal` domains for service-to-service communication

For complete information on domain configuration, DNS setup, and SSL certificates, see the [Domains guide](/networking/domains).

## TCP proxy

For services that don't use HTTP (such as databases or game servers), Railway supports TCP proxying. This allows you to expose raw TCP traffic to the internet.

For more information, see the [TCP Proxy guide](/networking/tcp-proxy).

## Specs & limits

For detailed technical specifications, rate limits, TLS information, and DDoS protection details, see the [Specs & Limits](/networking/public-networking/specs-and-limits) page.

## FAQ

<Collapse title="How do I handle forwarding traffic to my exposed port?">
To have traffic from the public internet properly forwarded to your service's exposed port, you must ensure that you are properly using the `PORT` environment variable made available to every service deployment.
- If your application is listening on an explicitly defined port, you must define a `PORT` variable with the proper assignment in your service's [variables](/variables).
- If you do not explicitly define the `PORT`, Railway provides one for you and exposes it during deployment.
</Collapse>

## Troubleshooting

Having trouble connecting to your app from the internet? Check out the [Troubleshooting guide](/troubleshooting) or reach out on our <a href="https://discord.gg/railway" target="_blank">Discord</a>.
