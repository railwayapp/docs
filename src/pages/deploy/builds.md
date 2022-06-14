---
title: Builds
---

Railway uses [Cloudnative Buildpacks](https://buildpacks.io/) to attempt to
build and deploy with zero configuration. Currently, we support the following
languages out of the box

- [NodeJS](nodejs)
- [Python](python)
- [Go](go)
- [Ruby](ruby)
- [Java](java)

If you have a language that you want us to support, please don't hesitate to
[reach out](https://discord.gg/xAm2w6g) and let us know.

We will also build using a [Dockerfile](/deploy/docker) if found at the project root.

## Procfile

If your project use buildpacks, you specify the start command with a
[Procfile](https://devcenter.heroku.com/articles/procfile). A Procfile is in the format of

```
process: command
```

When Railway deploys your build, the process listed in the file will be started by running the respective command. Note: Railway can only execute one process per Procfile.

_Note: some buildpacks specify a default start command_

### Web process

HTTP servers should use the `web` process type. This process should listen on
the [PORT environment variable](/deploy/railway-up#port-variable) and will receive
HTTP traffic. For example,

```
web: npm start
```

## Paketo Buildpacks

By default Railway will attempt to build your app with the
[heroku/buildpacks:20](https://devcenter.heroku.com/articles/heroku-20-stack)
builder, which is based on how [Heroku](https://www.heroku.com/) builds apps. However, you can opt-in to build your app with the [Paketo buildpacks](https://paketo.io/). Paketo has support for

- NodeJS
- Go
- PHP
- Ruby
- Java
- .NET
- NGINX
- Python

## Custom Buildpacks

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

## Nixpacks

Nixpacks is an opensource, drop in replacement for the cloud native buildpacks

Once in Priority Boarding, you should be able to enable it inside of Service -> Settings -> Builder

Issues? Report them on [GitHub](https://github.com/railwayapp/nixpacks/issues)