---
title: Python Builds
---

The [Python buildpack](https://github.com/heroku/heroku-buildpack-python)
detects if your build is Python by looking for a `requirements.txt` file. If
found, dependencies will be installed using `pip`.

Please include a [Procfile](/deploy/builds#procfile) in the root folder of your repository. If no [Procfile](/deploy/builds#procfile) is found, your deploy might fail to start with the following error.

```
ERROR: failed to launch: determine start command: when there is no default process a command is required
```

The default Python version is `3.6`.

You can customize the Python version by adding a `runtime.txt` file to the root of your project.
The contents of the file should include the version. For example,

```
python-3.9.6
```

## Hosting Django 

When serving Django, you need to set the IP to `0.0.0.0`, any other IP will most likely return an error when initiating the `runserver` command.

## Sample Flask Python Procfile

Railway uses Procfiles to determine the start command of your application. Flask is a popular choice for web servers on Railway.

```
web: gunicorn main:app
```