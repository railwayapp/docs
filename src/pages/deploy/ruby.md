---
title: Ruby Builds
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
### Ruby

The [Ruby buildpack](https://github.com/heroku/heroku-buildpack-ruby) detects if
your build is Ruby by looking for `Gemfile` and `Gemfile.lock` files. If found,
dependencies will be installed with `bundle install`.