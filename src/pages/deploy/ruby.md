---
title: Ruby Builds
---

### Ruby

The [Ruby buildpack](https://github.com/heroku/heroku-buildpack-ruby) detects if
your build is Ruby by looking for `Gemfile` and `Gemfile.lock` files. If found,
dependencies will be installed with `bundle install`.
