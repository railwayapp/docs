---
title: CLI Quick Start
---

Use the Railway CLI to connect your code to your projects infrastructure without
needing to worry about environment variables or configuration.

## Install

Install with [Brew](https://brew.sh) or [NPM](https://www.npmjs.com/package/@railway/cli).

```bash
brew install railwayapp/railway/railway
# or
npm i -g @railway/cli
```

## Connect

Connect to an existing Railway project or create a new one.

```bash
railway init
```

## Run

Run code inside your Railway environment. We connect your code to your
infrastructure hosted on Railway by injecting environment variables.

```bash
railway run CMD
```

## Deploy

Deploy current directory to Railway.

```bash
railway up
```
