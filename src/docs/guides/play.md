---
title: Deploy a Scala Play App
description: Learn how to deploy a Scala Play app to Railway with this step-by-step guide. It covers quick setup, database integration, one-click deploys and other deployment strategies.
---

[Play](https://www.playframework.com) is a high velocity and productive web framework for Java and Scala. It is based on a lightweight, stateless, web-friendly architecture and features predictable and minimal resource consumption (CPU, memory, threads) for highly-scalable applications thanks to its reactive model, based on Pekko Streams.

This guide covers how to deploy a Scala Play app to Railway in four ways:

1. [One-click deploy from a template](#one-click-deploy-from-a-template).
2. [From a GitHub repository](#deploy-from-a-github-repo).
3. [Using the CLI](#deploy-from-the-cli).
4. [Using a Dockerfile](#use-a-dockerfile).

Now, let's create a Play app!

## Create a Play App

**Note:** If you already have a Play app locally or on GitHub, you can skip this step and go straight to the [Deploy Play App to Railway](#deploy-the-play-app-to-railway).

To create a new Scala Play app, ensure that you have [JDK](https://www.oracle.com/java/technologies/downloads/) and [sbt](https://www.scala-sbt.org/download/) installed on your machine.

Run the following command in your terminal to create a new Play app:

```bash
sbt new
```

A list of templates will be shown to select from. Select the `playframework/play-scala-seed.g8` template.

- Give it a name, `helloworld`.
- Give it an organization name, `com.railwayguide`
- Hit Enter for the rest to use the latest versions of play, scala and sbt scaffold.

A new Scala Play app will be provisioned in the `helloworld` directory.

### Modify Scala Play Views and Set Up Database Config

_Step 1_ : Modify the Index File

Open the project in your editor. Head over to the `app/views/index.scala.html` file.

Modify it to the following:

```scala
@()

@main("Welcome to Play") {
  <h1>Welcome to Play!</h1>
  <h1>Hello World, Railway!</h1>
}
```

This change adds a new heading, which you'll see when you run the app locally.

_Step 2_ : Run the App Locally

- Now, let’s run the app locally to verify our changes. You should see the new headers appear in the browser.

_Step 3_ : Add PostgreSQL Driver as a Dependency

Play doesn’t provide built-in database drivers, so we need to add the PostgreSQL JDBC driver manually to our project.

In your `build.sbt`, add the following dependency:

```scala
libraryDependencies += "org.postgresql" % "postgresql" % "42.7.4" // Always use the latest stable version
```

_Step 4_ : Configure PostgreSQL in application.conf

Next, configure the PostgreSQL database connection in `conf/application.conf`:

```scala
# Default database configuration using PostgreSQL
db.default.driver = org.postgresql.Driver
db.default.url = "jdbc:postgresql://username:password@127.0.0.1:5432/scala_play"  # Replace with correct credentials
```

Make sure to replace `username` and `password` with your PostgreSQL credentials.

_Step 5_ : Update Project Dependencies

To download the PostgreSQL driver and any updated dependencies, run the following:

```bash
sbt update
```

_Step 6_ : Add Database Migration Tool (Flyway)

Play doesn’t include built-in support for database migrations, so we’ll use Flyway.

1. Install Flyway Plugin: Open your `project/plugin.sbt` and add the Flyway plugin:

```scala
addSbtPlugin("io.github.davidmweber" % "flyway-sbt" % "7.4.0")
```

2. Configure Flyway in `build.sbt`: Enable Flyway and configure the database connection in your `build.sbt`:

```scala
name := """helloworld"""
organization := "com.railwayguide"
version := "1.0-SNAPSHOT"
executableScriptName := "main"

lazy val root = (project in file(".")).enablePlugins(PlayScala).enablePlugins(FlywayPlugin)

scalaVersion := "2.13.15"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test
libraryDependencies += "org.postgresql" % "postgresql" % "42.7.4" // Latest version

flywayUrl := "jdbc:postgresql://127.0.0.1:5432/scala_play?user=<username>"  # Replace with correct credentials
flywayLocations := Seq("filesystem:src/main/resources/db/migration")
```

Replace `username` with your database username.

_Step 7_ : Create the Migration Files

1. **Create Migration Folder**: Create the folder structure for your migration files:

```bash
src/main/resources/db/migration
```

2. **Create Migration SQL File**: In `src/main/resources/db/migration`, create a schema migration file called `V1_0__create_employees_table.sql` with the following content:

```sql
CREATE TABLE employee (
  id VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  email VARCHAR(30),
  admin BOOLEAN
);
```

_Step 8_ : Run Database Migrations

Once your migration file is in place, run the Flyway migration with the following command:

```bash
sbt flywayMigrate
```

This will apply the migration and create the employee table in your PostgreSQL database.

Check your database to confirm that the employee table has been successfully created. You can use a database tool like psql or any PostgreSQL client to view the table.

### Run the Play App locally

Next, run `sbt run` in the terminal to build the project, install all the dependencies and start the embedded [Pekko](https://pekko.apache.org) HTTP server.

Open your browser and go to `http://localhost:9000` to see the app.

### Prepare Scala Play App for deployment

1. **Set Application Secret**:
   - Open up the `application.conf` file and add the following to it to set the app's secret.
     ```scala
     play.http.secret.key=${?APPLICATION_SECRET}
     ```
2. **Set Database URL**:
   - Open up the `application.conf` file and add the following to it to ensure the `DATABASE_URL` is read from the environment variable.
     ```scala
     db.default.url="jdbc:${?DATABASE_URL}"
     ```
3. **Set Allowed Hosts**:
   - By default, Play ships with a list of [default Allowed Hosts filter](https://www.playframework.com/documentation/3.0.x/resources/confs/play-filters-helpers/reference.conf). This is the list of allowed valid hosts = ["localhost", ".local", "127.0.0.1"]. You need to add an option to allow Railway hosts, `[".up.railway.app"]`.
   - Add the following to the `application.conf` file:
     `scala
    play.filters.hosts.allowed=[".up.railway.app"]
    `
     **Note:** Railway provided domains end in `.up.railway.app`. Once you add your custom domain, please update the allowed hosts to the new URL.
4. **Add sbt-native-packager sbt plugin**:

   - Add the `sbt-native-packager` sbt plugin to `project/plugins.sbt`
     ```scala
     addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "x.x.x")
     ```
   - Enable the `JavaAppPackaging` plugin in `build.sbt` and set the `executableScriptName` to `main`. Your `build.sbt` should be looking like this now:

     ```scala
     name := """helloworld"""
     organization := "com.railwayguide"

     version := "1.0-SNAPSHOT"

     executableScriptName := "main"

     lazy val root = (project in file(".")).enablePlugins(PlayScala).enablePlugins(JavaAppPackaging).enablePlugins(FlywayPlugin)

     scalaVersion := "2.13.15"

     libraryDependencies += guice
     libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.1" % Test
     libraryDependencies += "org.postgresql" % "postgresql" % "42.7.4" // Always use the latest stable version

     flywayUrl := sys.env.getOrElse("DATABASE_URL", "jdbc:postgresql://127.0.0.1:5432/scala_play?user=username")

     flywayLocations := Seq("filesystem:src/main/resources/db/migration")
     ```

   - Run `sbt update` to install the `sbt-native-packager` and update the dependencies.

Now, we are ready to deploy to Railway!

## Deploy the Play App to Railway

Railway offers multiple ways to deploy your Scala app, depending on your setup and preference.

### One-Click Deploy from a Template

If you’re looking for the fastest way to get started, the one-click deploy option is ideal.

Click the button below to begin:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/my9q_q)

We highly recommend that [you eject from the template after deployment](/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.

**Note:** You can also choose from a <a href="https://railway.com/templates?q=scala" target="_blank">variety of Scala app templates</a> created by the community.

### Deploy from the CLI

1. **Install the Railway CLI**:
   - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
   - Run the command below in your Luminus app directory.
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
   - In the `Enter a variable` prompt, enter `APPLICATION_SECRET=<generated-app-secret>` where `<generated-app-secret>` is the secret generated from running `playGenerateSecret` in your terminal.
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

<Image src="https://res.cloudinary.com/railway/image/upload/f_auto,q_auto/v1731046089/docs/quick-start/scala_on_railway.png"
alt="screenshot of the deployed Scala service"
layout="responsive"
width={1676} height={1490} quality={100} />

### Deploy from a GitHub Repo

To deploy a Scala Play app to Railway directly from GitHub, follow the steps below:

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
     - `APPLICATION_SECRET`: Set the value to the generated app secret.
4. **Deploy the App Service**:
   - Click **Deploy** on the Railway project canvas to apply your changes.
5. **Verify the Deployment**:

   - Once the deployment completes, go to [**View logs**](/guides/logs#build--deploy-panel) to check if the server is running successfully.

   **Note:** During the deployment process, Railway will automatically [detect that it’s a Scala app](https://nixpacks.com/docs/providers/scala).

6. **Set Up a Public URL**:
   - Navigate to the **Networking** section under the [Settings](/overview/the-basics#service-settings) tab of your new service.
   - Click [Generate Domain](/guides/public-networking#railway-provided-domain) to create a public URL for your app.

### Use a Dockerfile

1. Create a `Dockerfile` in the Play app's root directory.
2. Add the content below to the `Dockerfile`:

   ```bash
   # Use the Scala sbt official image
   # https://hub.docker.com/r/sbtscala/scala-sbt/tags
   FROM sbtscala/scala-sbt:eclipse-temurin-21.0.5_11_1.10.5_3.5.2

   # Create and change to the app directory.
   WORKDIR /app

   # Copy local code to the container image.
   COPY . ./

   # Build the app.
   RUN sbt stage

   # Run the app
   CMD ["./target/universal/stage/bin/main"]
   ```

3. Either deploy via the CLI or from GitHub.

Railway automatically detects the `Dockerfile`, [and uses it to build and deploy the app.](/guides/dockerfiles)

**Note:** Railway supports also <a href="/guides/services#deploying-a-public-docker-image" target="_blank">deployment from public and private Docker images</a>.

This guide covers the main deployment options on Railway. Choose the approach that suits your setup, and start deploying your Scala apps seamlessly!

## Next Steps

Explore these resources to learn how you can maximize your experience with Railway:

- [Add a Database Service](/guides/build-a-database-service)
- [Monitor your app](/guides/monitoring)
