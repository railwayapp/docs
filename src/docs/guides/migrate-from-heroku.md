---
title: Migrate from Heroku
---

Getting your app hosted on Heroku moved over to Railway is very simple.

All you need to do is connect your GitHub account, create a new project, and then deploy your repo. We even support Procfiles out of the box. (Only a single process is supported for now).


## Create a New Project in Railway

First, create a new [project](develop/projects) from your Dashboard.

Press the Command + K key combination and type "New Project".

<Image src="/images/getting-started/2-railway-getting-started-create-a-project.gif"
alt="Command K in Action"
layout="intrinsic"
width={800} height={455} quality={80} />

Under the list of options in the menu, select "Empty Project".

## Configure your Service

Words about adding your environment variables from Heroku


## Deploy your Service

If you haven't already, install the [Railway CLI](/develop/cli) and login:
```bash
railway login
```



### Connect to Project Using CLI

Once you've logged in, link to your project by running:
```bash
railway link
```

### Trigger your Deployment

From a [linked project](/develop/cli#link-to-a-project) run:
```bash
railway up
```

## Need Help?

If you run into any issues, we would be more than happy to answer your questions on our [Discord](https://discord.gg/railway) or over email at team@railway.app