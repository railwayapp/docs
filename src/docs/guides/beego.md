---
title: Deploy a Beego App
description: Learn how to deploy a Beego app to Railway with this step-by-step guide. It covers quick setup, private networking, database integration, one-click deploys and other deployment strategies.
---

[Beego](https://github.com/beego/beego) is a high-performance, open-source web framework designed for building robust applications in Go (Golang). It is used for rapid development of enterprise apps, including RESTful APIs, web apps and backend services.

This guide covers how to deploy a Beego app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Beego app!

## Create a Beego App

**Note:** If you already have a Beego app locally or on GitHub, you can skip this step and go straight to the [Deploy Beego App to Railway](#deploy-the-beego-app-to-railway).

To create a new Beego app, ensure that you have [Go](https://go.dev/dl) and [Bee tool](https://doc.meoying.com/en-US/beego/developing/#manual-installation) installed on your machine.

Run the following command in your terminal to create a new Beego app and install all dependencies:

```bash
bee new helloworld
cd helloworld
go mod tidy
```

A new Beego app will be provisioned for you in the `helloworld` directory.

### Configure Database

Run `go get github.com/lib/pq` in your terminal to install the Go Postgres driver.

Create a database, `helloworld_dev` in your local Postgres instance.

Open the `main.go` file and modify the content to the code below:

```go
package main

import (
	"fmt"
	_ "helloworld/routers"

	_ "github.com/lib/pq"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"
)

// Users -
type Users struct {
	ID        int    `orm:"column(id)"`
	FirstName string `orm:"column(first_name)"`
	LastName  string `orm:"column(last_name)"`
}

func init() {
	// set default database
	orm.RegisterDriver("postgres", orm.DRPostgres)

	// set default database
	orm.RegisterDataBase("default", "postgres", "postgres://unicodeveloper:@localhost/helloworld_dev?sslmode=disable")

	// register model
	orm.RegisterModel(new(Users))

	// create table
	orm.RunSyncdb("default", false, true)
}

func main() {
	o := orm.NewOrm()

	// Create a slice of Users to insert
	users := []Users{
		{FirstName: "John", LastName: "Doe"},
		{FirstName: "Jane", LastName: "Doe"},
		{FirstName: "Railway", LastName: "Deploy Beego"},
	}

	// Iterate over the slice and insert each user
	for _, user := range users {
		id, err := o.Insert(&user)
		if err != nil {
			fmt.Printf("Failed to insert user %s %s: %v\n", user.FirstName, user.LastName, err)
		} else {
			fmt.Printf("Inserted user ID: %d, Name: %s %s\n", id, user.FirstName, user.LastName)
		}
	}

	beego.Run()
}
```

Replace this `postgres://username:@localhost/helloworld_dev?sslmode=disable` with the appropriate URL for your local Postgres database.

**Code Summary**:

- The Users struct defines the schema for the users table in the database.
- The `init()` function registers the Postgres driver, registers the Users model, and automatically creates the users table in the database. If any errors occur while inserting users, they are logged.
- The `main()` function creates an ORM instance, defines sample user data (first name and last name), inserts the data into the users table, and starts the Beego web server to serve your app.

### Run the Beego App Locally

To start your app, run:

```bash
bee run
```

Once the app is running, open your browser and navigate to `http://localhost:8080` to view it in action.

In your terminal, you’ll see logs indicating that the user data is being inserted. Head over to your database, and you should see the users table populated with the seeded data.

### Prepare Beego App for Deployment

1. Open the `conf/app.conf` file and add an environment variable, `DATABASE_URL` to it.

```go
db_url = ${DATABASE_URL}
```

2. Head over to the `main.go` file and make some modifications to the way we retrieve the Postgres database url. The `init()` function should look like this:

```go
func init() {
	// set default database
	orm.RegisterDriver("postgres", orm.DRPostgres)

	// set default database
	dbURL, err := beego.AppConfig.String("db_url")
	if err != nil {
		log.Fatal("Error getting database URL: ", err)
	}

	orm.RegisterDataBase("default", "postgres", dbURL)

	// register model
	orm.RegisterModel(new(Users))

	// create table
	orm.RunSyncdb("default", false, true)
}
```

## Deploy the Beego App to Railway

Railway offers multiple ways to deploy your Beego app, depending on your setup and preference.

### One-Click Deploy From a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/CPq9Ry)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=beego" target="_blank">variety of Beego app templates</a> created by the community.

### Deploy From the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Beego app directory.
     ```bash
     railway init
     ```
   - Follow the prompts to name your project.
   - After the project is created, click the provided link to view it in your browser.
3. **Add a Postgres Database Service**:
   - Run `railway add -d postgres`.
   - Hit **Enter** to add it to your project.
   - A database service will be added to your Railway project.
4. **Add a Service and Environment Variable**:

   - Run `railway add`.
   - Select `Empty Service` from the list of options.
   - In the `Enter a service name` prompt, enter `app-service`.
   - In the `Enter a variable` prompt, enter `DATABASE_URL=${{Postgres.DATABASE_URL}}`.
     - The value, `${{Postgres.DATABASE_URL}}`, references the URL of your new Postgres database. Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).

   **Note:** Explore the [Railway CLI reference](/reference/cli-api#add) for a variety of options.

5. **Deploy the Application**:
   - Run `railway up` to deploy your app.
     - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
   - Once the deployment is complete, we can proceed to generate a domain for the app service.
6. **Set Up a Public URL**:
   - Run `railway domain` to generate a public URL for your app.
   - Visit the new URL to see your app live in action!

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731331898/docs/quick-start/beego_on_railway.png"
alt="screenshot of the deployed Beego service"
layout="responsive"
width={2420} height={1986} quality={100} />

### Deploy From a GitHub Repo

To deploy a Beego app to Railway directly from GitHub, follow the steps below:

1. **Create a New Project on Railway**:
   - Go to <a href="https://railway.com/new" target="_blank">Railway</a> to create a new project.
2. **Deploy from GitHub**:
   - Select **Deploy from GitHub repo** and choose your repository.
     - If your Railway account isn’t linked to GitHub yet, you’ll be prompted to do so.
3. **Add Environment Variables and Provision a Database Service**:
   - Click **Add Variables**, but hold off on adding anything just yet. First, proceed with the next step.
   - Right-click on the Railway project canvas or click the **Create** button, then select **Database** and choose **Add PostgreSQL**.
     - This will create and deploy a new PostgreSQL database for your project.
   - Once the database is deployed, you can return to adding the necessary environment variables:
     - `DATABASE_URL`: Set the value to `${{Postgres.DATABASE_URL}}` (this references the URL of your new Postgres database). Learn more about [referencing service variables](/guides/variables#referencing-another-services-variable).
4. **Deploy the App Service**:
   - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:

   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s a Go app](https://nixpacks.com/docs/providers/go).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the Beego app's root directory.
2. Add the content below to the `Dockerfile`:

   ```docker
   # Use the Go 1.22 official image
   # https://hub.docker.com/_/golang
   FROM golang:1.22

   # Create and change to the app directory.
   WORKDIR /app

   # Copy local code to the container image.
   COPY . ./

   # Install project dependencies
   RUN go mod download

   # Build the app
   RUN go build -o app

   # Run the service on container startup.
   ENTRYPOINT ["./app"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Beego apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
