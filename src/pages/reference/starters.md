---
title: Starters
---

Starters allow you to deploy a fully configured project that is automatically
connected to infrastructure. Examples of starters are:

- NextJS app with Prisma
- Django app connected to Postgres
- Elixir Phoenix webserver
- Discord/Telegram bots

You can find featured starters at
[railway.app/starters](https://railway.app/starters) and a full list at
[github.com/railwayapp/starters](https://github.com/railwayapp/starters).

This repo is open source and contributions (new starters, updating existing ones, etc) are welcome.

Starters can point at any public repository.

## Railway Button

The button allows you to offer a 1-Click deploy on Railway button.

![Railway Button](https://railway.app/button.svg)

Configure your own button at
[railway.app/button](https://railway.app/button) where you can define the repo
to deploy, plugins to install, and required env vars.

## Updating Starters

Every time you visit your project on Railway, we will check to see if the project it is based on has been updated by its maker.

If it has, we will prompt you to update your project. On confirmation, we will create a branch on Github and open a PR deployment for you on Railway. This way, we don’t replace your production deployment and you can test things out within the PR deploy.

Once you’re happy with the changes, you can merge the PR and your production deployment will be updated to the latest version.
