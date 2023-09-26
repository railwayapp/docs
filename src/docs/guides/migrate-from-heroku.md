---
title: Migrate from Heroku
---

Migrating your app from Heroku to Railway is very simple.  We even support Procfiles out of the box. (Only a single process is supported for now).

All you need to do is create a project in Railway, push your code, and migrate your envionment variables.

This guide will step you through the process of migrating a simple web service, using the [Railway CLI](/develop/cli).

<Image src="https://res.cloudinary.com/railway/image/upload/v1695765903/docs/heroku-migration/intro1_uauodg.gif"
alt="Screenshot of Railway Up"
layout="intrinsic"
width={700} height={464} quality={80} />

## Working Directory

In your terminal, ensure your current working directory is the same directory where your service code is located.

This is important so that as you complete the following steps, the Railway CLI is properly linked.

## Login to Railway from the CLI

Ensure your CLI is authenticated to your Railway account:
```bash
railway login
```

This command will prompt to open a browser to complete authentication.  Once authenticated, commands executed by the Railway CLI, will be performed in the context of your Railway account.

## Create a New Project

Now, let's create a new [project](develop/projects):
```bash
railway init
```

This command will prompt you to define a name for your service.


## Deploy the Service

Once your project is created, you can push your code into the project and assign a domain.

### Push the Code

Push the code into a service in Railway:
```bash
railway up -d
```

At this point, the service is being deployed, but let's give it a Domain.

### Assign a Domain

The service we are migrating is a web service that should be available over the Internet, so let's assign a Domain:
```bash
railway domain
```

Now the service will be available over the Internet via the provided Domain.

## Migrate the Environment Variables

Finally, we will import the environment variables from Heroku into Railway.

<Image src="https://res.cloudinary.com/railway/image/upload/v1695765481/docs/heroku-migration/variables_hagopv.gif"
alt="Screenshot of Railway Up"
layout="intrinsic"
width={600} height={364} quality={80} />

### Open the Project in Railway

Let's open over our new Railway project in the UI:
```bash
railway open
```

This will open the project in your browser.

### Add Heroku Variables to the Service

From the project canvas, import the Heroku variables into the service:
- click on the service
- click `Variables` tab
- open the command palette using `CMD + K` or `Ctrl + K`.
- search for `Import variables from Heroku`
- confirm the Heroku service and hit `Enter`

Your Heroku variables will be imported into the service, and it will automatically redeploy.

_Note: The first time you import variables from Heroku, you will be prompted to Allow Railway to connec to your Heroku account._

## Conclusion

Following this guide, we have successfully migrated a simple web service from Heroku to Railway including importing Heroku variables.

For more advanced operations, like migrating your databases from Heroku to Railway, the process will be a bit more involved, but we are happy to help work out a solution!

## Need Help?

If you run into any issues, or would like help with your migrations, we would be more than happy to answer your questions on our [Discord](https://discord.gg/railway) or over email at [team@railway.app](mailto:team@railway.app).