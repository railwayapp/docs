---
title: Nixpacks
---

Railway uses <a href="https://nixpacks.com/docs" target="_blank">Nixpacks</a> to build and deploy your code with
zero configuration.

## Supported Languages

Currently, we support the following languages out of the box:
- [NodeJS](https://nixpacks.com/docs/providers/node)
- [Bun](https://nixpacks.com/docs/providers/node#bun-support) (Experimental)
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
- [Staticfile](https://nixpacks.com/docs/providers/staticfile)
- [Elixir](https://nixpacks.com/docs/providers/elixir)

## The Build Table / Build Plan

When Railway builds your app with Nixpacks a Build Plan will be printed **at the top** of the build logs.

This table displays a list of packages and commands that will be used in the build process for your application.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1722994637/docs/build_table_j6izfy.png"
alt="nixpacks build table"
layout="responsive"
width={1365} height={790} quality={80} />

## Support

If you have a language or feature that you want us to support, please don't hesitate to
reach out on <a href="https://discord.gg/xAm2w6g" target="_blank">Discord</a> or on the <a href="https://github.com/railwayapp/nixpacks/discussions/245" target="_blank">Nixpacks repo</a>.