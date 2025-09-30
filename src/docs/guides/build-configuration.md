---
title: Build Configuration
description: Learn how to configure Railpack, optimize build caching, and set up watchpaths.
---

Railway will build and deploy your code with zero configuration, but when necessary, there are several ways to configure this behavior to suit your needs.

## Railpack

Railway uses <a href="https://railpack.com" target="_blank">Railpack</a> to
build your code. It works with zero configuration, but can be customized using
[environment variables](/guides/variables#service-variables) or a [config
file](https://railpack.com/config/file). Configuration options include:

- Language versions
- Build/install/start commands
- Mise and Apt packages to install
- Directories to cache

For a full list of configuration options, please view the <a
href="https://railpack.com/config/environment-variables"
target="_blank">Railpack docs</a>. You can find a complete list of languages we
support out of the box [here](/reference/railpack#supported-languages).

## Nixpacks

<DeprecationBanner>
Nixpacks is deprecated and in maintenance mode. New services default to Railpack.
</DeprecationBanner>

Existing services will continue to work with Nixpacks. To migrate to Railpack, update your service settings or set `"builder": "RAILPACK"` in your railway.json file.

For services still using Nixpacks, it can be configured with [environment variables](/guides/variables#service-variables). For a full list of options, view the <a href="https://nixpacks.com/docs/guides/configuring-builds" target="_blank">Nixpacks docs</a>.

You can find a complete list of languages we support out of the box [here](/reference/nixpacks#supported-languages).

## Customize the Build Command

You can override the detected build command by setting a value in your service
settings. This is run after languages and packages have been installed.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192207/docs/build-command_bwdprb.png"
alt="Screenshot of Railway Build Command"
layout="responsive"
width={1200} height={373} quality={80} />

## Set the Root Directory

The root directory defaults to `/` but can be changed for various use-cases like
[monorepo](/guides/monorepo) projects.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192841/docs/root-directory_nfzkfi.png"
alt="Screenshot of Root Directory"
layout="responsive"
width={1200} height={421} quality={80} />

When specified, all build and deploy
commands will operate within the defined root directory.

**Note:** The **Railway Config File** does not follow the **Root Directory** path. You have to specify the absolute path for the `railway.json` or `railway.toml` file.

## Configure Watch Paths

Watch paths are <a href="https://git-scm.com/docs/gitignore#_pattern_format" target="_blank">gitignore-style</a> patterns
that can be used to trigger a new deployment based on what file paths have
changed.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743192841/docs/watch-paths_zv62py.png"
alt="Screenshot of Railway Watch Paths"
layout="responsive"
width={1200} height={456} quality={80} />

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

## Install Specific Packages using Railpack

| Environment variable            | Description                                                    |
|---------------------------------|----------------------------------------------------------------|
| `RAILPACK_PACKAGES`             | A list of [Mise](https://mise.jdx.dev/) packages to install    |
| `RAILPACK_BUILD_APT_PACKAGES`   | Install additional Apt packages during build                   |
| `RAILPACK_DEPLOY_APT_PACKAGES`  | Install additional Apt packages in the final image             |

See the [Railpack docs](https://railpack.com/config/environment-variables) for more information.

## Procfiles

Railpack automatically detects commands defined in
[Procfiles](https://railpack.com/config/procfile). Although this is not
recommended and specifing the start command directly in your service settings is
preferred.


## Specify a Custom Install Command

You can override the install command by setting the `RAILPACK_INSTALL_COMMAND`
environment variable in your service settings.

## Disable Build Layer Caching

By default, Railway will cache build layers to provide faster build times. If
you have a need to disable this behavior, set the following environment variable
in your service:

```plaintext
NO_CACHE=1
```

## Why Isn't My Build Using Cache?

Since Railway's build system scales up and down in response to demand, cache hit
on builds is not guaranteed.

If you have a need for faster builds and rely on build cache to satisfy that
requirement, you should consider creating a pipeline to build your own image and
deploy your image directly.
