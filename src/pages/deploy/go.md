---
title: Go Builds
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

### Go

The [Go buildpack](https://github.com/heroku/heroku-buildpack-go) will detect
your build is Go if you are using go modules, dep, govendor, glide, GB, or
Godep. If detected, dependencies will be installed and the source compiled.

If no [Procfile](/deployment/builds#procfile) is found,
a [web process](/deployment/builds#web-process) will be started
with `go run main.go`.