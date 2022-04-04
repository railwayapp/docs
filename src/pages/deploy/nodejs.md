---
title: NodeJS Builds
---

The [NodeJS buildpack](https://github.com/heroku/nodejs-npm-buildpack) detects
if your build is Node by looking for a `package.json` file. If found, the build
will execute the following NPM (or Yarn) commands.

```bash
npm install
npm run build
```

If no [Procfile](/deploy/builds#procfile) is found,
a [web process](/deploy/builds#web-process) will be started with `npm start`
.

You can customize the node version using the [engines field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines) of your `package.json`. For example

```json
{
  "engines": {
    "node": ">=0.10.3 <15"
  }
}
```

## Custom Build Command

At the moment, we only support custom build commands wtih the [Paketo buildpacks](/deploy/builds#paketo-buildpacks). To
specify a custom build script, you can use the `BP_NODE_RUN_SCRIPTS` environment variable.

The example below will run the `lint` script followed by the `build` script.

```
BP_NODE_RUN_SCRIPTS = lint,build
```

## Sample Node Procfile

Railway uses Procfiles to determine the start command of your application. For NodeJS, it's usually best practice to serve a compiled version of your application and serve the distribution via a start command defined in your `package.json`

```
web: npm start
```
