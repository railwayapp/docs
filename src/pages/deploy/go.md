---
title: Go Builds
---

The [Go buildpack](https://github.com/heroku/heroku-buildpack-go) will detect
your that build is Go, if you are using go modules, dep, govendor, glide, GB, or
Godep. If detected, the dependencies will be installed and the source compiled.

If no [Procfile](/deploy/builds#procfile) is found,
a [web process](/deploy/builds#web-process) will be started
with `go run main.go`.

### Sample Go Procfile

Because Go builds produce a single binary, Railway knows how to serve the resulting build without a Procfile.