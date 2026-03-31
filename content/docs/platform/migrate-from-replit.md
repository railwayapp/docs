---
title: Migrate from Replit to Railway
description: Step-by-step guide to migrate a Replit project to Railway. Covers code export, environment variables, database migration, and deployment configuration.
---

This guide covers how to move a project from Replit to Railway, including code export, environment variables, database migration, and deployment configuration.

## Prerequisites

- A <a href="https://railway.com" target="_blank">Railway account</a>
- A <a href="https://github.com" target="_blank">GitHub account</a>
- Access to your Replit project
- The [Railway CLI](/cli) installed (optional, but useful for database migration)

## 1. Export your code from Replit

Your code needs to be in a GitHub repository before you can deploy it on Railway.

**If your Replit project is already connected to GitHub:**

No export is needed. You will connect the same repository to Railway in the next step.

**If your Replit project is not connected to GitHub:**

1. In Replit, open your project and click the three-dot menu in the file tree.
2. Select **Download as zip**.
3. Create a new repository on GitHub.
4. Unzip the downloaded project and push the code to your new repository:

```bash
cd your-project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

Remove the `.replit` and `replit.nix` files from your repository before pushing: Railway does not use them.

## 2. Create a Railway project

1. Go to <a href="https://railway.com/new" target="_blank">railway.com/new</a>.
2. Select **Deploy from GitHub Repo**.
3. Connect your GitHub account if you have not already, then select the repository containing your code.

Railway creates a new project with a service linked to your repository. Pushes to your default branch will trigger deployments automatically.

## 3. Configure environment variables

Replit stores environment variables in the **Secrets** tab. You need to copy these into Railway.

1. In Replit, open the **Secrets** tab and note each key-value pair.
2. In Railway, click on your service and go to the **Variables** tab.
3. Add each variable individually, or click **Raw Editor** to paste multiple variables at once in `KEY=VALUE` format.

After saving, Railway redeploys the service with the updated variables.

If your Replit project references a `DATABASE_URL` or similar connection string, update it after completing the database migration in the next step.

## 4. Migrate your database

Skip this step if your Replit project does not use a database.

### Replit PostgreSQL to Railway Postgres

1. Right-click on the Railway project canvas and select **Database > Add PostgreSQL** to provision a new Postgres instance.
2. Export your data from Replit's PostgreSQL using `pg_dump`:

```bash
pg_dump -Fc --no-acl --no-owner -h <replit-db-host> -p <replit-db-port> -U <replit-db-user> -d <replit-db-name> -f backup.dump
```

3. Restore the dump into your Railway Postgres instance:

```bash
pg_restore --no-acl --no-owner -h <railway-db-host> -p <railway-db-port> -U <railway-db-user> -d <railway-db-name> backup.dump
```

You can find your Railway Postgres connection details in the **Variables** tab of the database service.

4. Update the `DATABASE_URL` variable in your app service to reference the Railway Postgres instance. You can use the [reference variable](/variables/reference-variables) `${{Postgres.DATABASE_URL}}` to keep the value in sync automatically.

For more detail, see [PostgreSQL on Railway](/databases/postgresql).

### Replit Database (key-value) to Railway Redis

Replit Database is a key-value store. If your project uses it, you can migrate to a Redis instance on Railway.

1. Write a script in your Replit project to export all keys and values from Replit Database to a JSON file:

```python
from replit import db
import json

data = dict(db)
with open("replit_db_export.json", "w") as f:
    json.dump(data, f)
```

2. Provision a Redis instance in Railway by right-clicking on the project canvas and selecting **Database > Add Redis**.
3. Write a script to import the JSON data into Redis:

```python
import json
import redis

r = redis.Redis.from_url("your-railway-redis-url")

with open("replit_db_export.json", "r") as f:
    data = json.load(f)

for key, value in data.items():
    r.set(key, json.dumps(value) if not isinstance(value, str) else value)
```

4. Update your application code to use Redis instead of `replit.db`.

## 5. Configure builds and deployments

Replit uses the `.replit` file to define run commands and language settings. Railway uses <a href="https://railpack.io" target="_blank">Railpack</a> for build detection and does not read `.replit` files.

**Automatic detection:** Railpack detects your project type from standard files:
- **Node.js:** `package.json` (reads `scripts.start` for the start command)
- **Python:** `requirements.txt` or `pyproject.toml`
- **Go:** `go.mod`

If Railpack detects your project correctly, no configuration is needed.

**Custom build or start commands:** If you need to override the defaults, go to your service's **Settings** tab and set the **Build Command** and **Start Command** fields.

**Dockerfile:** If your project requires a custom build environment, you can add a `Dockerfile` to your repository. Railway detects and uses it automatically.

## 6. Set up a public domain

Replit provides `.replit.app` domains. On Railway, you can generate a `.railway.app` domain or configure a custom domain.

1. Click on your service in the project canvas.
2. Go to the **Settings** tab.
3. Under **Networking > Public Networking**, click **Generate Domain** to get a `.railway.app` domain.

To use a custom domain, see [Custom Domains](/networking/domains).

## Migration checklist

- [ ] Code exported to GitHub
- [ ] `.replit` and `replit.nix` files removed from the repository
- [ ] Environment variables migrated
- [ ] Database migrated (if applicable)
- [ ] Build and start commands verified
- [ ] Public domain configured
- [ ] Application tested

## Next steps

- [Add a Database Service](/databases)
- [Monitor your app](/observability)
- [Set up a custom domain](/networking/domains)
