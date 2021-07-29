---
title: Builds
---

## Buildpacks

Railway uses [Cloudnative Buildpacks](https://buildpacks.io/) to attempt to
build and deploy with zero configuration. Currently, we support the following
languages out of the box

- NodeJS
- Python
- Go
- Ruby
- Java

If you have a language that you want us to support, please don't hesitate to
[reach out](https://discord.gg/xAm2w6g) and let us know.

### NodeJS

The [NodeJS buildpack](https://github.com/heroku/nodejs-npm-buildpack) detects
if your build is Node by looking for a `package.json` file. If found, the build
will execute the following NPM (or Yarn) commands.

```bash
npm install
npm build
```

If no [Procfile](/deployment/builds#procfile) is found,
a [web process](/deployment/builds#web-process) will be started with `npm start`
.

You can customize the node version using the [engines field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines) of your `package.json`. For example

```json
{
  "engines": {
    "node": ">=0.10.3 <15"
  }
}
```

### Python

The [Python buildpack](https://github.com/heroku/heroku-buildpack-python)
detects if your build is Python by looking for a `requirements.txt` file. If
found, dependencies will be installed using `pip`.

The default Python version is `3.6`.

You can customize the Python version by adding a `runtime.txt` file to the root of your project.
The contents of the file should include the version. For example,

```
python-3.9.6
```

### Go

The [Go buildpack](https://github.com/heroku/heroku-buildpack-go) will detect
your build is Go if you are using go modules, dep, govendor, glide, GB, or
Godep. If detected, dependencies will be installed and the source compiled.

If no [Procfile](/deployment/builds#procfile) is found,
a [web process](/deployment/builds#web-process) will be started
with `go run main.go`.

### Ruby

The [Ruby buildpack](https://github.com/heroku/heroku-buildpack-ruby) detects if
your build is Ruby by looking for `Gemfile` and `Gemfile.lock` files. If found,
dependencies will be installed with `bundle install`.

### Java

The [Java buildpack](https://github.com/heroku/java-buildpack) detects if your
build is Java by looking for a `pom.xml` file. If found, Maven will download all
dependencies and build the project.

### Procfile

Railway supports [Procfiles](https://devcenter.heroku.com/articles/procfile), a
file that can be included in the project to specify which command to run when
the deployment starts.

A Procfile is in the format of

```
process1: command
process2: command
```

When Railway deploys your build, all process will be started by running their
respective command.

_Note: some buildpacks specify a default start command_

#### Web process

HTTP servers should use the `web` process type. This process should listen on
the [PORT environment variable](/deployment/up#port-variable) and will receive
HTTP traffic. For example,

```
web: npm start
```

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

## Dockerfiles

We will look for and use a `Dockerfile` at the project root if it exists.

If you need to use the environment variables that Railway injects at build time,
you must specify them in the Dockerfile with

```
ARG EnvironmentVariable
```
