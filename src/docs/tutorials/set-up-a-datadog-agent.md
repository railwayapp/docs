---
title: Set Up a Datadog Agent in Railway
---

Datadog provides a centralized location for logs, metrics, and traces emitted from applications deployed in various locations.

While Railway has a native, [centralized logging mechanism](/guides/logs#log-explorer), you may have a need to ship this data to another location, to view it alongside data collected from systems outside of Railway.

**Objectives**

In this tutorial you will learn how to -
- Deploy a Datadog agent in Railway, listening for metrics and logs.
- Configure an application to send metrics and logs to the agent.

If you are looking for a quicker way to get started, you can also deploy this project from a <a href="https://railway.app/template/saGmYG" target="_blank">template</a>.

**Prerequisites**

To be successfull, you should already have - 

- Railway [CLI installed](guides/cli#installing-the-cli)
- Datadog API key and site value

**Caveats**

Keep in mind that the Datadog agent sends data to Datadog over the Internet, meaning you may see a spike in egress cost.

## 1. Create the Project Structure

First we'll create the project structure.

From your local machine -

- Create a folder for your project called `railway-project`.
- Create two folders inside of `railway-project` called `agent` and `expressapi`.

You project structure should look like this

```
railway-project/
├── agent/
└── expressapi/
```


## 2. Set Up the Datadog Agent

Now we'll add files to the `agent` folder, which will build the Datadog Agent image.

- Inside of the `agent` folder, create three files -
  - `Dockerfile`
  - `syslog.yaml`
  - `datadog.yaml`

#### Define the Dockerfile

Let's define the Dockerfile.  

- Within your Dockerfile, add the following contents.

  ```dockerfile
  FROM datadog/agent:7

  # Set environment variables
  ENV DD_LOGS_ENABLED=true
  ENV DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true
  ENV DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true
  ENV DD_BIND_HOST=::1

  ARG DD_API_KEY
  ARG DD_HOSTNAME
  ARG DD_SITE

  # Copy the datadog.yaml into the container
  COPY datadog.yaml /etc/datadog-agent/datadog.yaml

  # Copy the syslog configuration file into the container
  COPY syslog.yaml /etc/datadog-agent/conf.d/syslog.d/

  # Expose the StatsD port and the syslog port
  EXPOSE 8125/udp
  EXPOSE 514/udp
  ```

#### Define the syslog.yaml file

The `syslog.yaml` file is used to instruct the agent to listen for syslogs to be forwarded on the configured port.

- Within the `syslog.yaml` file, add the following contents - 

  ```
  logs:
    - type: udp
      port: 514
      service: "node-app"
      source: syslog
  ```

#### Define the datadog.yaml file

The `datadog.yaml` file is used to instruct the agent to send logs to Datadog over `http` instead of the default `tcp`.

- Within the `datadog.yaml` file, add the following contents -

  ```
  logs_config:
    force_use_http: true
  ```

## 3. Set Up the Node Express App

Now let's build a Node Express App that will send logs and metrics to the Datadog Agent over the [Private Network](/reference/private-networking).

- Create an `app.js` file inside of the `expressapi` folder you created in Step 1.
- Use `npm` (or your preferred package manager) to install the required dependencies - 

  ```npm
  npm i express winston winston-syslog
  ```

#### Define the app.js file

The `app.js` file defines your express server.  This is where we will initialize the StatsD client and the Winston logger, which will send metrics and logs, respectively, to the Datadog agent.

- Within the `app.js` file, add the following contents -

  ```javascript
  const express = require('express');
  const app = express();

  const StatsD = require('hot-shots');
  const { createLogger, format, transports } = require('winston');
  require('winston-syslog').Syslog;
  const port = process.env.PORT || 3000;

  // Configure the StatsD client
  const statsdClient = new StatsD({
    host: process.env.DD_AGENT_HOST,
    port: process.env.DD_AGENT_STATSD_PORT,
    protocol: 'udp',
    cacheDns: true,
    udpSocketOptions: {
      type: 'udp6',
      reuseAddr: true,
      ipv6Only: true,
    },
  });

  // Configure Winston logger
  const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.json(),
    transports: [
      new transports.Syslog({
        host: process.env.DD_AGENT_HOST,
        port: process.env.DD_AGENT_SYSLOG_PORT,
        protocol: 'udp6',
        format: format.json(),
        app_name: 'node-app',
      }),
    ],
  });

  app.get('/', (req, res) => {
    // Increment a counter for the root path
    statsdClient.increment('data_dog_example.homepage.hits');
    statsdClient.gauge('data_dog_example.homepage.hits', 124);

    // forward logs from root path
    logger.info('Root route was accessed');

    res.send('Hello World!');
  });

  app.get('/test', (req, res) => {
    // Increment a counter for the test path
    statsdClient.increment('data_dog_example.testpage.hits');

    // forward logs from test path
    logger.info('Test route was accessed');

    res.send('This is the test endpoint!');
  });

  app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
  });

  ```

#### Winston and hot-shots

In this example app, we are using `Winston` as the logger and `hot-shots` as the StatsD client.  

- `Winston` is configured using `winston-syslog` to transport **logs** to the Datadog agent via Syslog over `udp6`.
- `hot-shots` is configured to send **metrics** to the Datadog agent over `udp6`.

## 4. Set Up the Railway Project

Now let's create the project using the CLI, then create the services and variables from within the project in Railway.

You will need your **Datadog API key** and **Site** value in this step.

If you have not already done so, please [install the CLI](/guides/cli#installing-the-cli) and [authenticate](/guides/cli#authenticating-with-the-cli).

#### Create a Project

- In your terminal, run the following command to create a new project -

    ```plaintext
    railway init
    ```

- Name your project `datadog-project` when prompted (you can change this later).

- Open your project in Railway by running the following - 

    ```plaintext
    railway open
    ```

#### Create the Services

-  In Railway, create an Empty Service by clicking `+ New` button in the top right-hand corner and choosing `Empty Service` in the prompt.
- Right click on the service that is created, select `Update Info` and name it `datadog-agent`.
- Repeat the above steps to create a second service, but name the second service `expressapi`.

#### Add the Variables

Each service requires unique variables listed below.  For each service, follow the steps to add the variables required for the service.

Variables -
<div style={{ display: 'flex', flexDirection: 'row', gap: '5px', fontSize: '0.9em', alignItems: 'stretch' }}>
    <div style={{ flex: '1 1 50%', overflow: 'auto', minWidth: '200px', maxWidth: '350px' }}>
        ```dockerfile
          DD_API_KEY=<YOUR_API_KEY>
        DD_HOSTNAME=${{RAILWAY_PRIVATE_DOMAIN}}
        DD_SITE=<YOUR_DATADOG_SITE>
        ```
        <p style={{ marginTop: '-0.2em', fontSize: '1em'}}>`datadog-agent` variables</p>
    </div>
    <div style={{ flex: '1 1 50%', overflow: 'auto', minWidth: '200px', maxWidth: '350px' }}>
        ```dockerfile
          DD_AGENT_HOST=${{datadog-agent.DD_HOSTNAME}}
        DD_AGENT_STATSD_PORT=8125
        DD_AGENT_SYSLOG_PORT=514
        ```
        <p style={{ marginTop: '-0.2em', fontSize: '1em'}}>`expressapi` variables</p>
    </div>
</div>

- Click on the service card
- Click on the `Variables` tab
- Click on `Raw Editor`
- Paste the required variables (be sure to update the Datadog API key and site with your own values)
- Click `Update Variables` and `Deploy`

## 5. Deploy to Railway

Now we're ready to deploy our services.  We will use the CLI to push code from our local machine to Railway.

#### Railway Up

Follow these steps for each service -

- In your local terminal, change directory into the `agent` folder.
- Link to `datadog-project` by running the following command - 
  ```plaintext
  railway link
  ```
- Follow the prompts, selecting the `datadog-project` and `production` environment.
- Link to the `datadog-agent` service by running the following command -
  ```plaintext
  railway service
  ```
- Follow the prompt, selecting the `datadog-agent` service.
- Deploy the agent by running the following command -
  ```plaintext
  railway up -d
  ```
- Change directory into your `expressapi` folder and repeat the steps above, but for the `expressapi` service.

#### Create a Domain for the Express App

The express app will send logs and metrics to the Datadog agent upon navigation to either of its two routes.  So let's give it a domain -
- Ensure that you are linked to the `datadog-project` and `expressapi` service (refer to the steps above)
- Assign the `expressapi` a domain by running the following command - 
  ```plaintext
  railway domain
  ```

## 6. Test and Confirm

Test that your Datadog Agent is receiving and forwarding data to Datadog by navigating to the routes in the Express app -
- `/`
- `/test`

Generate some traffic to these two routes and verify in your Datadog instance that the data is there.

## Conclusion

Congratulations!  You have deployed a Datadog Agent and a Node Express app that sends logs and metrics to Datadog.

This is a *very* basic implementation, and you should refer to the <a href="https://docs.datadoghq.com/" target="_blank">Datadog documentation</a> for information on how to customize the data you send.