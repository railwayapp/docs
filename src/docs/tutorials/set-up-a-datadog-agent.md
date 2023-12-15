---
title: Set Up a Datadog Agent in Railway
---

Datadog provides a centralized location for logs, metrics, and traces emitted from applications deployed in various locations.

Follow this tutorial to learn how to successfully deploy a Datadog agent in Railway and configure an application to send metrics and logs to it.

**Prerequisites**
- Railway CLI installed
- Datadog API key and site value

## Create the Project Structure

First, from your local machine, create a folder for your project called `railway-project`.  Inside of this folder, create two folders called `agent` and `expressapi`.

```
railway-project/
├── agent/
└── expressapi/
```

Within the `agent` folder, we'll create the files necessary for the Datadog agent.  In the `expressapi` folder we will create the application to send data to the agent which will be forwarded to Datadog.

## Set Up the Datadog Agent

Inside of the `agent` folder you just created, create three files -
- `Dockerfile`
- `syslog.yaml`
- `datadog.yaml`

#### Define the Dockerfile

The Dockerfile should be defined as follows -

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

# Copy your custom datadog.yaml into the container
COPY datadog.yaml /etc/datadog-agent/datadog.yaml

# Copy the syslog configuration file
COPY syslog.yaml /etc/datadog-agent/conf.d/syslog.d/

# Expose the DogStatsD port and the syslog port
EXPOSE 8125/udp
EXPOSE 514/udp
```

#### Define the syslog.yaml file

The `syslog.yaml` file is used to instruct the agent to listen for syslogs to be forwarded on the configured port.

```
logs:
  - type: udp
    port: 514
    service: "node-app"
    source: syslog
```

#### Define the datadog.yaml file

The `datadog.yaml` file is used to instruct the agent to send logs to Datadog over `http` instead of the default `tcp`.

```
logs_config:
  force_use_http: true
```

## Set Up the Node Express App

Inside of the `expressapi` folder you created, create an `app.js` file and use npm (or your preferred package manager) to install the required dependencies - 

```npm
npm i express winston winston-syslog
```

#### Define the app.js file

The `app.js` file defines your express server.  This is where we will initialize the StatsD client and the Winston logger, which will send metrics and logs, respectively, to the Datadog agent.

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

In this example app, we are using `Winston` as the logger and `hot-shots` as the statsD client.  

- `Winston` is configured using `winston-syslog` to transport logs to the Datadog agent via Syslog over `udp6`.
- `hot-shots` is configured to send metrics to the Datadog agent over `udp6`.

## Deploy to Railway

Now that our project is defined, we can deploy the services to Railway.

#### Create a Project and Services

1. Using the Railway CLI, run the following command to create a new project -

    ```
    railway init
    ```

    Give you project a name when prompted.

2. Open your project by running the following - 
    ```plaintext
    railway open
    ```
3. Create a new Empty Service by clicking `+ New` and choosing `Empty Service`.  Right click on the service, select `Update Info` and name it `datadog-agent`.

4. Repeat step 3, but name this service `expressapi`.

#### Use Railway Up