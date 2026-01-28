---
title: Set Up a Datadog Agent in Railway
description: Learn how to set up a Datadog agent in Railway.
---

Datadog provides a centralized location for logs, metrics, and traces emitted from applications deployed in various locations.

While Railway has a native, [centralized logging mechanism](/guides/logs#log-explorer), you may have a need to ship this data to another location, to view it alongside data collected from systems outside of Railway.

**Objectives**

In this tutorial you will learn how to -

- Deploy a Datadog agent in Railway - listening for metrics, logs, and traces.
- Configure an application to send metrics, logs, and traces to the agent.

If you are looking for a quicker way to get started, you can also deploy this project from a <a href="https://railway.com/template/saGmYG" target="_blank">template</a>.

**Prerequisites**

To be successful, you should already have -

- Railway [CLI installed](/guides/cli#installing-the-cli)
- Datadog API key and site value

**Caveats**

Keep in mind that the Datadog agent sends data to Datadog over the Internet, meaning you will see an increase in egress cost. If this is a concern, you may be interested in exploring self-hosted solutions, and we encourage you to check out the [OpenTelemetry Tutorial](/tutorials/deploy-an-otel-collector-stack).

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
  ENV DD_APM_ENABLED=true
  ENV DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true
  ENV DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true
  ENV DD_APM_NON_LOCAL_TRAFFIC=true
  ENV DD_BIND_HOST=::1

  # Reference Variables defined in Railway
  ARG DD_API_KEY
  ARG DD_HOSTNAME
  ARG DD_SITE

  # Copy datadog.yaml into the container
  COPY datadog.yaml /etc/datadog-agent/datadog.yaml

  # Copy syslog configuration file
  COPY syslog.yaml /etc/datadog-agent/conf.d/syslog.d/

  # DogStatsD port, APM port, and the syslog port
  EXPOSE 8125/udp
  EXPOSE 8126
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
  npm i express winston winston-syslog dd-trace
  ```

#### Define the app.js file

The `app.js` file defines your express server. This is where we will import the DataDog tracer and initialize the StatsD client and the Winston logger, which will send traces, metrics, and logs, respectively, to the Datadog agent.

- Within the `app.js` file, add the following contents -

  ```javascript
  // ** it is important to import the tracer before anything else **
  const tracer = require("dd-trace").init();

  const express = require("express");
  const app = express();

  const StatsD = require("hot-shots");
  const { createLogger, format, transports } = require("winston");
  require("winston-syslog").Syslog;
  const port = process.env.PORT || 3000;

  // Configure the StatsD client
  const statsdClient = new StatsD({
    host: process.env.DD_AGENT_HOST,
    port: process.env.DD_AGENT_STATSD_PORT,
    protocol: "udp",
    cacheDns: true,
    udpSocketOptions: {
      type: "udp6",
      reuseAddr: true,
      ipv6Only: true,
    },
  });

  // Configure Winston logger
  const logger = createLogger({
    level: "info",
    exitOnError: false,
    format: format.json(),
    transports: [
      new transports.Syslog({
        host: process.env.DD_AGENT_HOST,
        port: process.env.DD_AGENT_SYSLOG_PORT,
        protocol: "udp6",
        format: format.json(),
        app_name: "node-app",
      }),
    ],
  });

  app.get("/", (req, res) => {
    // Increment a counter for the root path
    statsdClient.increment("data_dog_example.homepage.hits");
    statsdClient.gauge("data_dog_example.homepage.hits", 124);

    // forward logs from root path
    logger.info("Root route was accessed");

    res.send("Hello World!");
  });

  app.get("/test", (req, res) => {
    // Increment a counter for the test path
    statsdClient.increment("data_dog_example.testpage.hits");

    // forward logs from test path
    logger.info("Test route was accessed");

    res.send("This is the test endpoint!");
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

- In Railway, create an Empty Service by clicking `+ New` button in the top right-hand corner and choosing `Empty Service` in the prompt.
- Right click on the service that is created, select `Update Info` and name it `datadog-agent`.
- Repeat the above steps to create a second service, but name the second service `expressapi`.

#### Add the Variables

Each service requires unique variables listed below. For each service, follow the steps to add the variables required for the service.

`datadog-agent` Variables -

```plaintext
DD_API_KEY=<YOUR_API_KEY>
DD_HOSTNAME=${{RAILWAY_PRIVATE_DOMAIN}}
DD_SITE=<YOUR_DATADOG_SITE>
```

`expressapi` Variables -

```plaintext
DD_AGENT_HOST=${{datadog-agent.DD_HOSTNAME}}
DD_AGENT_STATSD_PORT=8125
DD_AGENT_SYSLOG_PORT=514
DD_TRACE_AGENT_PORT=8126
```

- Click on the service card
- Click on the `Variables` tab
- Click on `Raw Editor`
- Paste the required variables (be sure to update the Datadog API key and site with your own values)
- Click `Update Variables` and `Deploy`

## 5. Deploy to Railway

Now we're ready to deploy our services. We will use the CLI to push code from our local machine to Railway.

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

The express app will send logs and metrics to the Datadog agent upon navigation to either of its two routes. So let's give it a domain -

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

_Note: it can take a few minutes to see the data in Datadog, check the Datadog Agent's logs in Railway_

## Bonus - Add a Python service

Once you have your agent setup and working with a node app. It's easy to add more services and configure the agent to accept data from them. In this bonus section, we'll quickly cover a Python implementation.

In the following example, we are using the <a href="https://fastapi.tiangolo.com/" target="_blank">FastAPI Python framework</a>.

**In the `main.py` file we have configured both metrics and logs to be sent over StatsD and SysLog respectively -**

```python
import logging.handlers
from fastapi import FastAPI
from datadog import initialize, statsd, DogStatsd
import logging
import random
import os
import json_log_formatter

## Configuration for sending logs
formatter = json_log_formatter.JSONFormatter()

json_handler = logging.handlers.SysLogHandler(address=(os.getenv("DD_AGENT"), os.getenv("DD_AGENT_SYSLOG_PORT")))
json_handler.setFormatter(formatter)

logger = logging.getLogger('python-app')
logger.addHandler(json_handler)
logger.setLevel(logging.INFO)


# Configuration for sending metrics
config = {
    "api_key": os.getenv("DD_API_KEY"),
    "statsd_host": os.getenv("DD_AGENT_HOST"),
    "statsd_port": os.getenv("DD_AGENT_STATSD_PORT"),
    "statsd_constant_tags": ["env:prod"],
}

initialize(**config)

app = FastAPI()

# Use DogStatsd client for more custom metrics
dog_statsd = DogStatsd()

@app.get("/")
async def root():
    # Increment a simple counter
    statsd.increment('example_app.page.views')

    # Record a random gauge value
    gauge_value = random.uniform(1, 100)
    statsd.gauge('example_app.random_value', gauge_value)

    # Log a message
    logger.info(f"Page viewed, gauge value: {gauge_value}")

    # Custom metric using DogStatsd
    dog_statsd.histogram('example_app.response_time', random.uniform(50, 300))

    return {"message": "Hello World"}

# Additional route for testing
@app.get("/test")
async def test():
    # Custom metrics and logging
    statsd.increment('example_app.test.endpoint.hits')
    test_value = random.randint(1, 10)
    dog_statsd.gauge('example_app.test.value', test_value)
    logger.info(f"Test endpoint hit, value: {test_value}")

    return {"test_value": test_value}

```

**Ensure that you configure all of the required variables in the Python service in Railway -**

- DD_AGENT_HOST - _should be the private domain of the DataDog agent_
- DD_API_KEY
- DD_AGENT_STATSD_PORT - _should be 8125_
- DD_AGENT_SYSLOG_PORT - _should be **515** to work with the configuration below_

**Update the DataDog agent's `syslog.yaml` file to accept data from the new source -**

```plaintext
logs:
  - type: udp
    port: 514
    service: "node-app"
    source: syslog
  - type: udp
    port: 515
    service: "python-app"
    source: syslog
```

## Conclusion

Congratulations! You have deployed a Datadog Agent and a Node Express app (and maybe a Python service) that sends logs and metrics to Datadog.

This is a _very_ basic implementation, and you should refer to the <a href="https://docs.datadoghq.com/" target="_blank">Datadog documentation</a> for information on how to customize the data you send.
