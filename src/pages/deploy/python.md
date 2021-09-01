---
title: Python Builds
---

## Buildpacks

Railway uses [Cloudnative Buildpacks](https://buildpacks.io/) to attempt to
build and deploy with zero configuration. Currently, we support the following
languages out of the box

- NodeJS
- Python
- Go
- Ruby
- Java

If you have a language that you want us to support, please don't hesitate to
[reach out](https://discord.gg/xAm2w6g) and let us know.

### Python

The [Python buildpack](https://github.com/heroku/heroku-buildpack-python)
detects if your build is Python by looking for a `requirements.txt` file. If
found, dependencies will be installed using `pip`.

Please include a [Procfile](/deployment/builds#procfile) in the root folder of your repository. If no [Procfile](/deployment/builds#procfile) is found, your deploy might fail to start with the following error.

```
ERROR: failed to launch: determine start command: when there is no default process a command is required
```

The default Python version is `3.6`.

You can customize the Python version by adding a `runtime.txt` file to the root of your project.
The contents of the file should include the version. For example,

```
python-3.9.6
```