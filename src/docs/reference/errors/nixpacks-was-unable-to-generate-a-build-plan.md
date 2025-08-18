---
title: Nixpacks Was Unable to Generate a Build Plan for This App
description: Learn how to troubleshoot and fix the 'Nixpacks was unable to generate a build plan for this app' error.
---

## What This Error Means

Railway uses [Nixpacks](https://nixpacks.com/docs/how-it-works) to analyze your application's files to generate a container image for your application.

Seeing the `Nixpacks was unable to generate a build plan for this app` error means that Nixpacks was unable to correlate your application's files with a supported build plan.

A build plan is a set of predefined instructions that Nixpacks uses to build and run your application on the Railway platform.

A list of supported build plans can be found [here](https://nixpacks.com/docs/build-plans) under the `Language Support` section.

## Why This Error Can Occur

This error can occur for a variety of reasons, here are some common ones and what the failed build logs could look like for each scenario -

- You are attempting to deploy a monorepo.

  ```txt
  The contents of the app directory are:

  /frontend
  /backend
  ```

  Nixpacks doesn't know which directory you want to deploy from.

- Your application's files and or directory structure do not match any of the supported build plans.

  ```txt
  The contents of the app directory are:

  web.py
  requirements.txt
  ```

  This is obviously Python, a supported language, but Nixpacks doesn't know exactly to do with just a `web.py` file since it was never explicitly programmed to handle this.

- Your application is using a language or framework that is not supported by Nixpacks.

  ```txt
  The contents of the app directory are:

  main.nim
  nimble.nimble
  ```

  This is [Nim](https://nim-lang.org/), but unfortunately, Nixpacks doesn't have a build plan for Nim.

## Possible Solutions

### Monorepo Without Root Directory

If you are attempting to deploy a monorepo, you will need to set a [root directory](https://docs.railway.com/guides/build-configuration#set-the-root-directory) in your [service settings](https://docs.railway.com/overview/the-basics#service-settings) under the source repository section.

For a comprehensive guide on how to deploy a monorepo, please refer to our [Deploying a Monorepo](https://docs.railway.com/tutorials/deploying-a-monorepo) guide.

### Unsupported Project Layout or Directory Structure

While you may be using a language or framework that is supported by Nixpacks, the project layout or directory structure of your application may not be natively supported.

For example, if you are using Python but Python was not automatically detected, you can write your own [build plan](/docs/guides/configuring-builds).

In a `nixpacks.toml` file -

```toml
providers = ["python"] # Tell Nixpacks to use the Python build plan

[start]
cmd = "python web.py" # Tell Nixpacks to start your web.py file
```

Of course, this is just an example, but you can see how you can write your own build plan to support your application.

Supported Languages (Providers) can be found [here](https://nixpacks.com/docs) under the `Language Support` section.

If writing your own build plan is not an option, you can try to deploy your application using a [Dockerfile](/docs/guides/configuring-builds#using-a-dockerfile).

### Language or Framework Not Supported

If you believe your application should be supported, please [create an issue](https://github.com/railwayapp/nixpacks/issues/new) on the Nixpacks GitHub repository.

To unblock yourself, you can try to deploy your application using a [Dockerfile](https://www.geeksforgeeks.org/what-is-dockerfile/).

If your project contains a `Dockerfile` Railway will automatically use it to build your application.

Read more about [using a Dockerfile](/guides/dockerfiles).
