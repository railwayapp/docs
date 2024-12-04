---
title: Build Configuration
---

Railway will build and deploy your code with zero configuration, but when necessary, there are several ways to configure this behavior to suit your needs.

## Nixpacks Options

Railway uses <a href="https://nixpacks.com/docs" target="_blank">Nixpacks</a> to build your code. It has a variety of options that can be configured with [environment variables](/guides/variables#service-variables) which can be defined in your services settings. These include things like:
- Install/build/start commands
- Nix/Apt packages to install
- Directories to cache

For a full list of these options, please view the <a href="https://nixpacks.com/docs/guides/configuring-builds" target="_blank">Nixpacks docs</a>.


You can find a complete list of languages we support out of the box [here](/reference/nixpacks#supported-languages).

## Customize the Build Command

Using the default Nixpacks builder, you can customize the build command that is run from within your service settings.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664564851/docs/build-command_vhuify.png"
alt="Screenshot of Railway Build Command"
layout="responsive"
width={745} height={238} quality={80} />

For those familiar with Nixpacks, this gets set as the `--build-cmd` argument during the Nixpacks build.

## Set the Root Directory

The root directory defaults to `/` but can be changed for various use-cases like
[monorepo](/guides/monorepo) projects. 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664565164/docs/root-directory_nczles.png"
alt="Screenshot of Root Directory"
layout="responsive"
width={1190} height={400} quality={80} />

When specified, all build and deploy
commands will operate within the defined root directory. 

**Note:** The **Railway Config File** does not follow the **Root Directory** path. You have to specify the absolute path for the `railway.json` or `railway.toml` file.

## Configure Watch Paths

Watch paths are <a href="https://git-scm.com/docs/gitignore#_pattern_format" target="_blank">gitignore-style</a> patterns
that can be used to trigger a new deployment based on what file paths have
changed. 

<Image
src="https://res.cloudinary.com/railway/image/upload/v1664565164/docs/watch-paths_l4xozt.png"
alt="Screenshot of Railway Watch Paths"
layout="responsive"
width={1158} height={444} quality={80} />

For example, a monorepo might want to only trigger builds if files are
changed in the `/packages/backend` directory.

When specified, any changes that
don't match the patterns will skip creating a new deployment. Multiple patterns
can be combined, one per line.

_Note, if a Root Directory is provided, patterns still operate from `/`. For a root directory of `/app`, `/app/**.js` would be used as a pattern to match files in the new root._

Here are a few examples of common use-cases:
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

## Install a Specific Package Using Nixpacks

When using Nixpacks, you can install specific packages by defining them in a nixpacks configuration file.  For example:

```toml
[phases.setup]
    aptPkgs = ['wget']
```

See the [Nixpacks docs](https://nixpacks.com/docs/configuration/file) for more information.

## Build Providers

With Nixpacks, we analyze the app source directory and generate a build plan. This determines for which language provider to install packages and runtimes.

Within your Service's settings, under the Builds section, you can define within the multi-select box which Nixpacks language providers you would like to use for your builds. This is useful if you have code that calls libraries that need to be built from another language within your repo.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1668662436/docs/multi-providers_lrxdbp.png"
alt="Screenshot of Railway Build Providers"
layout="responsive"
width={745} height={238} quality={80} />

When multiple providers are defined, Railway will build your service with the language providers (in the order you defined) and ensure your binaries are ready to be called. The runtime(s) will then initialize as soon as you start your application.

## Procfiles

If using Nixpacks, you can override the start command with a <a href="https://nixpacks.com/docs/configuration/procfile" target="_blank">Procfile</a> at the root of your app. Only a single process type is supported at the moment.

HTTP servers should use the `web` process type. This process should listen on
the [PORT environment variable](/guides/public-networking#port-variable) and will receive
HTTP traffic.

_Note: Some buildpacks specify a default start command_


## Specify a Custom Install Command

We do not expose a way to configure a custom install command in the UI, but you can control this using [config as code](/reference/config-as-code#nixpacks-plan) (see Nixpacks Plan -> Install Command).

## Disable Build Layer Caching

By default, Railway will cache build layers to provide faster build times.  If you have a need to disable this behavior, set the following environment variable in your service:

```plaintext
NO_CACHE=1
```

## Why Isn't My Build Using Cache?

Since Railway's build system scales up and down in response to demand, cache hit on builds is not guaranteed.

If you have a need for faster builds and rely on build cache to satisfy that requirement, you should consider creating a pipeline to build your own image and deploy your image directly.
