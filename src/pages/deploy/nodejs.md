---
title: NodeJS Builds
---

The [NodeJS buildpack](https://github.com/heroku/nodejs-npm-buildpack) detects
if your build is Node by looking for a `package.json` file. If found, the build
will execute the following NPM (or Yarn) commands.

```bash
npm install
npm build
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

## Sample Node Procfile

If your project doesn't include a procfile, you can 

