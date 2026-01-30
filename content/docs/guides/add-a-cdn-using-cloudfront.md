---
title: Add a CDN using Amazon CloudFront
description: Learn how to integrate Amazon CloudFront as a CDN for your Fastify app in this step-by-step guide.
---

## What is the purpose of a CDN?

> A CDN improves efficiency [of web applications] by introducing intermedeiary servers between the client and the server. [These CDN servers] decrease web traffic to the web server, reduce bandwidth consumption, and improve the user experience of your applications.

_Source: [What is a CDN?](https://aws.amazon.com/what-is/cdn/)_

## About this Tutorial

We know that performance of your web applications is critical to your business, and one way to achieve higher performance is by implementing a CDN to serve data from servers closest to your users.

Many CDN options are available ([list from G2](https://www.g2.com/categories/content-delivery-network-cdn)), but in this tutorial, we will cover step-by-step how to implement a CDN using [Amazon CloudFront](https://aws.amazon.com/cloudfront/).

**Objectives**

In this tutorial, you will learn how to -

- Deploy a simple [Fastify server](https://fastify.dev/) to Railway
- Create a [CloudFront distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) in AWS and connect it to the Fastify server
- _(Optional)_ Setup SSL and DNS for a custom domain managed in [Namecheap](https://www.namecheap.com/)

**Prerequisites**

To be successful using this tutorial, you should already have -

- Latest version of the Railway [CLI installed](/guides/cli#installing-the-cli)
- An [AWS account](https://aws.amazon.com/) with permissions to create new resources
- Latest version of the [AWS CLI](https://aws.amazon.com/cli/) installed and authenticated to your AWS account
- Latest version of the [AWS CDK](https://aws.amazon.com/cdk/) installed
- _(Optional)_ A Namecheap account to connect a custom domain

**Let's get started!**

## 1. Create and Deploy a Fastify Server

First, let's create and deploy a simple Fastify server using the [Railway CLI](/guides/cli#installing-the-cli)

- On your local machine, create a folder called "fastify"
- Inside of the folder, create a file called "server.js"
- Run the following commands to initialize the project and install the required packages using npm
  ```plaintext
  npm init -y
  npm i fastify @fastify/etag
  ```
- Add the following code to the "server.js" file

  ```javascript
  const Fastify = require("fastify");
  const fastifyEtag = require("@fastify/etag");

  const fastify = Fastify();
  fastify.register(fastifyEtag);

  fastify.get("/dynamic", async (request, reply) => {
    console.log("Received request on dynamic route");

    const staticContent = {
      message: "This is some dynamic content",
      timestamp: new Date().toISOString(),
    };

    reply.type("application/json");
    reply.headers({
      "cache-control": "must-revalidate, max-age=60",
    });

    reply.send(staticContent);
  });

  fastify.get("/static", async (request, reply) => {
    console.log("Received request on static route");

    const staticContent = {
      message: "This is some static content",
    };

    reply.type("application/json");
    reply.headers({
      "cache-control": "must-revalidate, max-age=60",
    });

    reply.send(staticContent);
  });

  fastify.get("/staticEtag", async (request, reply) => {
    console.log("Received request on staticEtag route");

    const staticContent = {
      message: "This will serve a static etag",
    };

    reply.type("application/json");

    reply.headers({
      "cache-control": "must-revalidate, max-age=60",
    });

    reply.header("etag", '"foobar"');
    reply.send(staticContent);
  });

  const start = async () => {
    try {
      await fastify.listen({
        port: Number(process.env.PORT) || 3000,
        host: "0.0.0.0",
      });
      console.log(
        `Server is running at PORT:${Number(process.env.PORT) || 3000}`,
      );
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
  ```

- Run the following command to initialize a new project in Railway
  ```plaintext
  railway init
  ```
- Follow the prompts and name your project "fastify-cdn"
- Run the following command to deploy your Fastify server
  ```plaintext
  railway up -d
  ```
- Run the following command to generate a domain for the Fastify service
  ```plaintext
  railway domain
  ```
- Run the following command to open your Railway project in your browser
  ```plaintext
  railway open
  ```

### Checkpoint

Nice! You now have a Fastify server running in Railway serving three routes, which will serve to demonstrate a few different concepts related to caching:

- `/static` - the static route serves a static message which never changes, unless the code is updated
- `/dynamic` - the dynamic route servers a dynamic message which changes when the route is accessed and the `Date()` function runs
- `/staticEtag` - the staticEtag route demonstrates how you can manually set an [HTTP Etag](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.8.3) on a route

  _Note: The Fastify server code above implements [Fastify's eTag plugin](https://www.npmjs.com/package/@fastify/etag)._

#### Observe Route Behavior with no CDN

To observe the behavior without a CDN in place, navigate to any of the routes above from the Railway-provided domain, your request will always go directly to the service running in Railway.

One way you can visualize this, is by navigating to the `/static` route in your browser, opening up Network Tools, and observing that each request always receives a **HTTP 200** status code:

<Image src="https://res.cloudinary.com/railway/image/upload/v1719001891/docs/tutorials/CDN/CleanShot_2024-06-21_at_15.28.36_2x_em6o5s.png"
alt="Screenshot of DevTools no CDN"
layout="responsive"
width={1477} height={623} quality={100} />

Since the data for the route has not been cached on a CDN, the server receives every request, generates a new timestamp, and sends it back with a 200 status code.

Once we setup the CloudFront CDN, we will see how this behavior changes.

## 2. Create a CloudFront Distribution in AWS

_This step assumes you have already [configured the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) to connect to your AWS account._

Now let's create a CloudFront distribution using the AWS CDK.

- In your "fastify" folder, create a new folder called "cloudfront"
- Within the "cloudfront" folder, run the following command to initialize a new CDK project in TypeScript
  ```plaintext
  cdk init app --language typescript
  ```
- Run the following command to install the CDK packages for CloudFront
  ```plaintext
  npm install @aws-cdk/aws-cloudfront @aws-cdk aws-cloudfront-origins @aws-cdk/core
  ```
- Replace the contents of the "/bin/cloudfront.ts" file with the following code.

  _When you run `cdk bootstrap` in the following steps, the account and region environment variables should be added for you._

  ```javascript
  #!/usr/bin/env node
  import "source-map-support/register";
  import * as cdk from "@aws-cdk/core";
  import { CloudfrontCdkStack } from "../lib/cloudfront-stack";

  const app = new cdk.App();
  new CloudfrontCdkStack(app, "CloudfrontCdkStack", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
  ```

- Replace the contents of the "/lib/cloudfront-stack.ts" file with the following code

  ```javascript
  import * as cdk from "@aws-cdk/core";
  import * as cloudfront from "@aws-cdk/aws-cloudfront";
  import * as origins from "@aws-cdk/aws-cloudfront-origins";

  export class CloudfrontCdkStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      // Replace with the Domain provided by Railway
      const origin = new origins.HttpOrigin("RAILWAY PROVIDED DOMAIN");

      // Custom Cache Policy
      const cachePolicy = new cloudfront.CachePolicy(
        this,
        "CustomCachePolicy",
        {
          cachePolicyName: "CustomCachePolicy",
          minTtl: cdk.Duration.seconds(0),
          maxTtl: cdk.Duration.seconds(86400),
          defaultTtl: cdk.Duration.seconds(60),
          cookieBehavior: cloudfront.CacheCookieBehavior.all(),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
          headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
            "CloudFront-Viewer-Country",
            "CloudFront-Is-Mobile-Viewer",
          ),
        },
      );

      // CloudFront distribution
      const distribution = new cloudfront.Distribution(this, "Distribution", {
        defaultBehavior: {
          origin,
          cachePolicy: cachePolicy,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
      });
    }
  }
  ```

  **IMPORTANT: Be sure to replace the `HttpOrigin` in the code above with the Railway-provided domain (e.g. _fastify-server.up.railway.app_)**

- Run the following command to bootstrap the environment for the CDK
  ```plaintext
  cdk bootstrap
  ```
- Run the following command to deploy the CloudFront distribution
  ```plaintext
  cdk deploy
  ```

_If you experience any problems with the AWS utilities used in this step, you can create and configure the CloudFront distribution manually using the AWS Management Console, using the same settings defined in the "cloudfront-stack.ts" file._

### Checkpoint 2

Great job! You should now have a CloudFront distribution pointed to your Fastify service in Railway. Your distribution will be assigned a domain similar to the one below:

- `https://d1a23bcdefg.cloudfront.net`

Now let's see how the behavior for the `/dynamic` route has changed when accessing the server from the CloudFront distribution domain.

<Image src="https://res.cloudinary.com/railway/image/upload/v1719001866/docs/tutorials/CDN/CleanShot_2024-06-21_at_15.24.47_2x_knqo9f.png"
alt="Screenshot of DevTools with CDN"
layout="responsive"
width={1477} height={623} quality={100} />

Notice how the first request was served an **HTTP 200** from the server with the dynamically generated data, but subsequent requests were served a **HTTP 304 Not Modified** code.

This is the CloudFront CDN in action!

If you inspect the route definition for `/dynamic`, you'll see that the headers include a `cache-control` parameter:

    ```javascript
    reply.headers({
        'cache-control': 'must-revalidate, max-age=60'
    });
    ```

This cache control definition tells CloudFront to revalidate the data at the route after 60s.

#### Cache Behavior

When the initial request is made to the route, CloudFront retrieves the data from the server, then stores it. For 60s after the initial request, CloudFront will serve the cached response with **HTTP 304**, and after 60s, it will check the server for new data.

#### Faster Response Time

In the screenshot above, take note of the Size and Time columns.

When CloudFront serves the cached data, it takes significantly less time to resolve the route, and, probably due to less headers, the Size of the message is also smaller.

## 3. Connect a Custom Domain with SSL enabled

Now that the CloudFront distribution is up and running, you may want to connect a custom domain and ensure SSL is enabled.

This step will _quickly_ cover how to generate a SSL certificate in AWS and configure the custom domain in Namecheap and CloudFront.

Let's first generate an SSL certificate -

- In AWS Management Console, navigate to your CloudFront distribution
- Under the General tab, click the `Edit` button
- Under _Custom SSL certificate_, click the _"Request certificate"_ link below the input field. This will take you to AWS Certificate Manager.
- Click the `Next` button to request a public certificate
- Enter your fully qualified domain name, e.g. `www.railway.com`
  - If you'd like the cert to include the apex domain, click `Add another name to this certificate` and enter it, e.g. `railway.com`
- Click the `Next` button to generate the certificate
- In **Namecheap**, in the Advanced DNS section for the domain, add the host record(s).
  - If you set up the certificate for both www and the apex domain, you will add two **CNAME** records
  - The CNAME name value provided by AWS, should be used as the **Host** value in Namecheap.
  - The CNAME name value provided by AWS, includes the domain name, but in Namecheap, you should add everything except the domain, e.g.
    - if your CNAME name is `_6cf3abcd1234abcd1234aabb11cc22.www.railway.com`
    - you should add `_6cf3abcd1234abcd1234aabb11cc22.www` to the **Host** value in Namecheap
- Once you add the DNS records in Namecheap, refresh the Certificate status page in AWS to confirm the Status shows **Success**

Now, we'll add the certificate in the CloudFront distribution settings and finish setting up the custom domain -

- Return the the CloudFront distribution settings
- Under _Custom SSL certificate_, choose the certificate you just created from the drop down menu
- Under _Alternate domain name (CNAME)_, add your custom domain.
  - If you want both www and apex domain, be sure to add both
- At the bottom, click the `Save changes` button
- In **Namecheap**, in the Advanced DNS section for the domain, add the host record(s)
  - If you are setting up both www and the apex domain, you will add two **ALIAS** records
  - The record value should be your Cloudfront distribution domain, e.g. `d1a23bcdefg.cloudfront.net`
  - The **Host** value should be `@` for the apex domain and `www` for the www subdomain.

That's it! You should now be able to navigate to the three routes in the Fastify service from your custom domain.

## Conclusion

Congratulations! You have deployed a Fastify app to Railway, created a CloudFront distribution in AWS connected to the Railway service, and (optionally) connected your custom domain in Namecheap to the CloudFront distribution with SSL enabled.

#### Additional Resources

This is a _very_ simple tutorial covering the most basic steps to implement CloudFront CDN in your stack. There are many, many more concepts you should explore related to CDNs and caching in general, to take full advantage of the technology and tailor it to your specific needs.

We recommend checking out these resources to start:

- [What is a CDN?](https://aws.amazon.com/what-is/cdn/)
- [What is caching?](https://www.cloudflare.com/learning/cdn/what-is-caching/)
- [CDN vs Caching](https://www.fastly.com/blog/leveraging-browser-cache-fastlys-cdn/)
