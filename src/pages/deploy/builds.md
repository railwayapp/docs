---
title: Builds
---

Railway uses [Nixpacks](https://nixpacks.com) to build and deploy your code with zero configuration. Currently, we support the following languages out of the box.

- [NodeJS](https://nixpacks.com/docs/providers/node)
- [Deno](https://nixpacks.com/docs/providers/deno)
- [Python](https://nixpacks.com/docs/providers/python)
- [Go](https://nixpacks.com/docs/providers/go)
- [Ruby](https://nixpacks.com/docs/providers/ruby)
- [PHP](https://nixpacks.com/docs/providers/php)
- [Java](https://nixpacks.com/docs/providers/java)
- [Rust](https://nixpacks.com/docs/providers/rust)
- [.NET](https://nixpacks.com/docs/providers/csharp)
- [Haskell](https://nixpacks.com/docs/providers/haskell)
- [Crystal](https://nixpacks.com/docs/providers/crystal)

## Build Configuration

Nixpacks has a variety of options that can be configured with environment variables. These include things like

- Install/build/start commands
- Nix/Apt packages to install
- Directories to cache

For a full list of these options, please view the [Nixpacks docs](https://nixpacks.com/docs/config).

If you have a language or feature that you want us to support, please don't hesitate to
reach out on [Discord](https://discord.gg/xAm2w6g) or on [the Nixpacks GitHub repo](https://github.com/railwayapp/nixpacks/discussions/245).

## Procfile

If using Nixpacks, you can override the start command with a [Procfile](https://nixpacks.com/docs/config#procfiles) at the root of your app. Only a single process type is supported at the moment.

HTTP servers should use the `web` process type. This process should listen on
the [PORT environment variable](/deploy/railway-up#port-variable) and will receive
HTTP traffic.

_Note: some buildpacks specify a default start command_

## Dockerfiles

We will also build using a [Dockerfile](/deploy/docker) if found at the project root.

## Buildpacks

Railway can also use [Cloudnative Buildpacks](https://buildpacks.io/). These are now deprecated and will eventually be removed from Railway.

### Heroku

Heroku buildpacks support

- NodeJS
- Python
- Go
- Ruby
- Java

[Go to Heroku buildpack documentation](https://devcenter.heroku.com/articles/heroku-20-stack).

### Paketo

Paketo buildpacks support

- NodeJS
- Go
- PHP
- Ruby
- Java
- .NET
- NGINX
- Python

[Go to Paketo buildpack documentation](https://paketo.io/)

### Custom Buildpacks

By default, the appropriate buildpacks are selected by inspecting the source
files of a project. For more control, a
[project.toml](https://buildpacks.io/docs/app-developer-guide/using-project-descriptor/)
file can be used to achieve a more custom setup.

Here is an example `project.toml` file that forces a NodeJS project to use Yarn
instead of NPM.

```toml
[[build.buildpacks]]
uri = "heroku/nodejs"

[[build.buildpacks]]
uri = "heroku/nodejs-yarn"
```
