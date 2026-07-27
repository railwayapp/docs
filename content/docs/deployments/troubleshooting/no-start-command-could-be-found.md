---
title: No Start Command Could be Found
description: Learn how to troubleshoot and fix the 'No Start Command Could be Found' error.
---

## What this error means

Railway uses [Railpack](https://railpack.com) to analyze your application's files to generate a container image for your application.

Seeing the `No start command could be found` error means that Railway was unable to automatically find an appropriate start command for your application.

A start command is a command that will be executed by Railway to run your application.

## Why this error can occur

By default, Railway uses [Railpack](https://railpack.com) to build and run your application. Railpack will try its best to find an appropriate start command for your application.

Some limited examples of start commands that Railway will try are -

For Node based apps it will try to use `npm start`, `yarn start`, `pnpm start`, or `bun start` if a start script is present in your `package.json` file.

For Python apps it will try to use `python main.py` if a `main.py` file is present, or `python manage.py migrate && gunicorn {app_name}.wsgi` if a Django application is detected.

For Ruby apps it will try to use `bundle exec rails server -b 0.0.0.0` if a Rails application is detected.

Failing the automatic detection, Railway will return the `No start command could be found` error.

## Possible solutions

Since Railway was unable to find a start command, you will need to specify a start command yourself.

You can do this in the [service settings](/overview/the-basics#service-settings) under the `Start Command` field.

Some common start commands for various frameworks and languages are -

#### Node.js

```bash
node main.js
```

Where `main.js` is the entry point for your application, could be `index.js`, `server.js`, `app.js`, etc.

#### Next.js

```bash
npx next start --port $PORT
```

_Note: The `--port` flag is needed to ensure that Next.js listens on the correct port._

#### Nuxt.js

```bash
node .output/server/index.mjs
```

This will run Nuxt.js in production mode using its built-in Nitro server.

#### FastAPI

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Where `main` is the name of the file that contains the `app` variable from FastAPI.

_Note: The `--host` and `--port` flags are needed to ensure that FastAPI listens on the correct host and port._

#### Flask

```bash
gunicorn main:app
```

Where `main` is the name of the file that contains the `app` variable from Flask.

#### Django

```bash
gunicorn myproject.wsgi
```

Where `myproject` is the name of the folder that contains your `wsgi.py` file.

#### Ruby on Rails

```bash
bundle exec rails server -b 0.0.0.0 -p $PORT
```

_Note: The `-b` and `-p` flags are needed to ensure that Rails listens on the correct host and port._

#### Vite

```bash
serve --single --listen $PORT dist
```

_Note: The `serve` command is needed to serve the static site files and can be installed by running `npm install serve` locally._

#### Create React app

```bash
serve --single --listen $PORT build
```

_Note: The `serve` command is needed to serve the static site files and can be installed by running `npm install serve` locally._
