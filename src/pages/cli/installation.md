---
title: CLI Installation
---

You can install the Railway CLI in a few ways

## Homebrew

```bash
brew tap railwayapp/railway
brew install railway
```

## NPM

```bash
npm i -g @railway/cli
```

## Curl

```bash
sh -c "$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"
```

By default the script will install the `railway` binary to `/usr/local/bin`. You
can override this by setting the `BINARY_NAME` and `INSTALL_DIR` environment
variables, respectively.

## GitHub

The source is available on [GitHub](https://github.com/railwayapp/cli). Pull
requests and issues are welcome.
