---
title: Nixpacks
description: Railway uses Nixpacks to build and deploy your code with zero configuration.
---

Railway uses <a href="https://nixpacks.com/docs" target="_blank">Nixpacks</a> to build and deploy your code with
zero configuration.

## Supported Languages

Currently, we support the following languages out of the box:
- [Bun](https://nixpacks.com/docs/providers/node#bun-support) (Experimental)
- [Clojure](https://nixpacks.com/docs/providers/clojure)
- [Cobol](https://nixpacks.com/docs/providers/cobol)
- [Crystal](https://nixpacks.com/docs/providers/crystal)
- [C#/.NET](https://nixpacks.com/docs/providers/csharp)
- [Dart](https://nixpacks.com/docs/providers/dart)
- [Deno](https://nixpacks.com/docs/providers/deno)
- [Elixir](https://nixpacks.com/docs/providers/elixir)
- [F#](https://nixpacks.com/docs/providers/fsharp)
- [Gleam](https://nixpacks.com/docs/providers/gleam)
- [Go](https://nixpacks.com/docs/providers/go)
- [Haskell](https://nixpacks.com/docs/providers/haskell)
- [Java](https://nixpacks.com/docs/providers/java)
- [Lunatic](https://nixpacks.com/docs/providers/lunatic)
- [Node](https://nixpacks.com/docs/providers/node)
- [PHP](https://nixpacks.com/docs/providers/php)
- [Python](https://nixpacks.com/docs/providers/python)
- [Ruby](https://nixpacks.com/docs/providers/ruby)
- [Rust](https://nixpacks.com/docs/providers/rust)
- [Scheme](https://nixpacks.com/docs/providers/scheme)
- [Staticfile](https://nixpacks.com/docs/providers/staticfile)
- [Swift](https://nixpacks.com/docs/providers/swift)
- [Scala](https://nixpacks.com/docs/providers/scala)
- [Zig](https://nixpacks.com/docs/providers/zig-lang)

## The Build Table / Build Plan

When Railway builds your app with Nixpacks a Build Plan will be printed **at the top** of the build logs.

This table displays a list of packages and commands that will be used in the build (and start) process for your application.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1722994637/docs/build_table_j6izfy.png"
alt="nixpacks build table"
layout="responsive"
width={1365} height={790} quality={80} />

## Support

If you have a language or feature that you want us to support, please don't hesitate to
reach out on <a href="https://discord.gg/xAm2w6g" target="_blank">Discord</a> or on the <a href="https://github.com/railwayapp/nixpacks/discussions/245" target="_blank">Nixpacks repo</a>.
