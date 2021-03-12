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
railway run <cmd>
```

For example, to run your node project with Railway:

```bash
railway run npm start
```

If you have a Dockerfile in your project directory, you can just run
`railway run` to build and run the Dockerfile.

## Deploy

Deploy current directory to Railway.

```bash
railway up
```
