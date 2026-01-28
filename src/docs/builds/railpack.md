---
title: Railpack
description: Railway uses Railpack to build and deploy your code with zero configuration.
---

Railway uses <a href="https://railpack.com" target="_blank">Railpack</a> to
build and deploy your code with zero configuration.

## Supported Languages

Currently, we support the following languages out of the box:

- [Node](https://railpack.com/languages/node)
- [Python](https://railpack.com/languages/python) 
- [Go](https://railpack.com/languages/golang)
- [PHP](https://railpack.com/languages/php)
- [HTML/Staticfile](https://railpack.com/languages/staticfile)
- [Java](https://railpack.com/languages/java)
- [Ruby](https://railpack.com/languages/ruby)
- [Deno](https://railpack.com/languages/deno)
- [Rust](https://railpack.com/languages/rust)
- [Elixir](https://railpack.com/languages/elixir)
- [Shell scripts](https://railpack.com/languages/shell)

## How it Works

Railpack automatically analyzes your code and turns it into a container image.
It detects your programming language, installs dependencies, and configures
build and start commands without any manual configuration required.

## The Build Process

When Railway builds your app with Railpack, the build process will
automatically:

1. **Analyze** your source code to detect the programming language and framework
2. **Install** the appropriate runtime and dependencies
3. **Build** your application using detected or configured build commands
4. **Package** everything into an optimized container image

## Configuration

Railpack works with zero configuration, but you can customize the build process
when needed using [environment variables](/guides/variables#service-variables)
or a [Railpack config file](https://railpack.com/config/file).

## Support

If you have a language or feature that you want us to support, please don't
hesitate to reach out on <a href="https://discord.gg/xAm2w6g"
target="_blank">Discord</a> or on the <a
href="https://github.com/railwayapp/railpack">Railpack repo</a>.
