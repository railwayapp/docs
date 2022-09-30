---
title: Builds
---

Railway uses [Nixpacks](https://nixpacks.com) to build and deploy your code with
zero configuration.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664564851/docs/nixpacks-builder_k1fmlp.png"
alt="Nixpacks builder"
layout="responsive"
width={1158} height={338} quality={80} />

Currently, we support the following languages out of the box.

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
- [Swift](https://nixpacks.com/docs/providers/swift)
- [Zig](https://nixpacks.com/docs/providers/zig-lang)
- [Dart](https://nixpacks.com/docs/providers/dart)
- [Staticfile](https://nixpacks.com/docs/providers/https://nixpacks.com/docs/providers/staticfile)
- [Elixir](https://nixpacks.com/docs/providers/elixir)

## Build Configuration

Nixpacks has a variety of options that can be configured with environment variables. These include things like

- Install/build/start commands
- Nix/Apt packages to install
- Directories to cache

For a full list of these options, please view the [Nixpacks docs](https://nixpacks.com/docs/guides/configuring-builds).

If you have a language or feature that you want us to support, please don't hesitate to
reach out on [Discord](https://discord.gg/xAm2w6g) or on [the Nixpacks GitHub repo](https://github.com/railwayapp/nixpacks/discussions/245).

## Build Command

If using the Nixpacks builder, you can customize the build command that is run. For those familiar with Nixpacks, this gets set as the `--build-cmd` argument during the Nixpacks build.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664564851/docs/build-command_vhuify.png"
alt="Screenshot of Railway Build Command"
layout="responsive"
width={1168} height={346} quality={80} />

## Root Directory

The root directory defaults to `/` but can be changed for various use-cases like
[monorepo](/deploy/monorepo) projects. When specified, all build and deploy
commands will operate within that root directory. Additionally, files changed
outside the root directory will not trigger a new build.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664565164/docs/root-directory_nczles.png"
alt="Screenshot of Railway Root Directory"
layout="responsive"
width={1190} height={400} quality={80} />

## Watch Paths

Watch paths are
[gitignore-style](https://git-scm.com/docs/gitignore#_pattern_format) patterns
that can be used to trigger a new deployment based on what file paths have
changed. For example, a monorepo might want to only trigger builds if files are
changed in the `/packages/backend` directory. When specified, any changes that
don't match the patterns will skip creating a new deployment. Multiple patterns
can be combined, one per line.

_Note, if a Root Directory is provided, patterns still operate from `/`. For a root directory of `/app`, `/app/**.js` would be used as a pattern to match files in the new root._

Here are a few examples of common use-cases.

```gitignore
# Match all TypeScript files under src/
/src/**/*.ts
```

```gitignore
# Match Go files in the root, but not in subdirectories
/*.go
```

```gitignore
# Ignore all Markdown files
**
!/*.md
```

_Note, negations will only work if you include files in a preceding rule._

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664565164/docs/watch-paths_l4xozt.png"
alt="Screenshot of Railway Watch Paths"
layout="responsive"
width={1158} height={444} quality={80} />

## Procfiles

If using Nixpacks, you can override the start command with a [Procfile](https://nixpacks.com/docs/config#procfiles) at the root of your app. Only a single process type is supported at the moment.

HTTP servers should use the `web` process type. This process should listen on
the [PORT environment variable](/deploy/railway-up#port-variable) and will receive
HTTP traffic.

_Note: some buildpacks specify a default start command_

## Dockerfiles

We will also build using a [Dockerfile](/deploy/dockerfiles) if found at the project root.

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
