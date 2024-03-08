---
title: Deploy an OpenTelemetry Stack on Railway
---

OpenTelemetry is an observability framework for cloud-native software.  It provides tools, APIs, and SDKs to instrument, collect, and export telemetry data (metrics, logs, and traces), enabling engineering teams to monitor the performance and health of their services.

There is an overwhelming number of options for applying OpenTelemetry in your software stack.  This tutorial uses the libraries and tools endorsed and maintained by the OpenTelemetry community.

**Objectives**

In this tutorial you will learn how to -
- Deploy the <a href="https://opentelemetry.io/docs/collector/" target="_blank">OpenTelemetry Collector</a>, listening for traces, metrics, and logs.
- Deploy a backend stack ([Jaeger](https://www.jaegertracing.io/), [Zipkin](https://zipkin.io/), and [Prometheus](https://prometheus.io/)) to receive the traces, metrics, and logs from the collector
- Build and instrument an Express application to send data to the collector.

If you are looking for a quicker way to get started, you can also deploy the collector and backend stack from a <a href="https://railway.app/template/7KNDff" target="_blank">template</a>.

**Prerequisites**

To be successfull, you should already have - 

- Railway [CLI installed](guides/cli#installing-the-cli)
- A GitHub account

## Deploy the Backend Services

Let's deploy the backend services - Jaeger, Zipkin, and Prometheus.  Each step should be completed in the same Railway project.

### 1. Add Jaeger Service

- Add a New service by clicking `+ New`
- Select Docker Image as the Source
- Add `jaegertracing/all-in-one` as the image name and hit Enter
- Add the following variable to the service
    ```plaintext
    PORT=16686
    ```
    *This is the port that serves the UI.  Setting this variable allows you to access the Jaeger UI from your browser*
- In the Settings tab, rename the service `Jaeger`
- Click `Deploy` to apply and deploy the service
- In the service settings, under Networking, click `Generate Domain`

You should be able to acess the Jaeger UI by clicking on the service domain.

### 2. Add Zipkin Service

- Add a New service by clicking `+ New`
- Select Docker Image as the Source
- Add `openzipkin/zipkin` as the image name and hit Enter
- Add the following variable to the service
    ```plaintext
    PORT=9411
    ```
    *This is the port that serves the UI.  Setting this variable allows you to access the Zipkin UI from your browser*
- In the Settings tab, rename the service `Zipkin`
- Click `Deploy` to apply and deploy the service
- In the service settings, under Networking, click `Generate Domain`

You should be able to acess the Zipkin UI by clicking on the service domain.

### 3. Add Prometheus Service

- Add a New service by clicking `+ New`
- Select Template as the Source
- Type Prometheus and select the Prometheus template
- Click `Deploy` to apply and deploy the service

*The template deploys with the proper UI port already configured to enable accessing the Prometheus UI from your browser*

You should be able to acess the Prometheus UI by clicking on the service domain.

## Deploy the OpenTelemetry Collector

### 1. Fork the Open Telemetry Collector repository
- Navigate to the <a href="https://github.com/railwayapp-templates/opentelemetry-collector-stack" target="_blank">Open Telemetry Collector repository</a> in GitHub
- Click `Fork` then `Create fork`

### 2. Add the Open Telemetry Service
In the same Railway project -
- Add a New service by clicking `+ New`
- Select GitHub Repo as the Source
- Select the `opentelemetry-collector-stack` repository (if you renamed the repo in the previous step, yours will be named differently) 
- Add the following variable to the service
    ```plaintext
    PORT=55679
    ```
    *This is the port that serves the UI.  Setting this variable allows you to access the Zipkin UI from your browser*
- In the Settings tab, rename the service `OpenTelemetry Collector`
- Click `Deploy` to apply and deploy the service
- In the service settings, under Networking, click `Generate Domain`

You should be able to access the Collector's debugging UI at....
- https://github.com/open-telemetry/opentelemetry-collector/blob/main/extension/zpagesextension/README.md
- this is driven by zpages

# Add an image here to show "This is what your project should look like so far"

## Build and Instrument an Express App

Now that the collector stack is up, let's build and instrument an application!

### 1. Create and initialize the project

From your local machine -

- Create a folder for your project called `otel-example-app`
- Use `npm` (or your preferred package manager) to install the required dependencies - 

  ```npm
  npm i express @opentelemetry/api @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-metrics-otlp-proto @opentelemetry/exporter-trace-otlp-proto @opentelemetry/resources @opentelemetry/sdk-metrics @opentelemetry/sdk-node @opentelemetry/semantic-conventions
  ```

### 2. Build the App

- In the `otel-example-app` folder, create an `app.js` file and add the following code - 
  ```javascript
  // Otel Docs Reference - https://opentelemetry.io/docs/languages/js/getting-started/nodejs/
  const express = require('express');
  const { rollTheDice } = require('./dice.js');

  const PORT = parseInt(process.env.PORT || '8080');
  const app = express();

  app.get('/rolldice', (req, res) => {
    const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
    if (isNaN(rolls)) {
      res
        .status(400)
        .send("Request parameter 'rolls' is missing or not a number.");
      return;
    }
    res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
  });

  app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
  });

  ```
- Create the `dice.js` file in the project folder and add the following code -
  ```javascript
  // Otel Docs Reference - https://opentelemetry.io/docs/languages/js/instrumentation/
  const { trace } = require('@opentelemetry/api');

  const tracer = trace.getTracer('dice-lib');

  function rollOnce(i, min, max) {
    return tracer.startActiveSpan(`rollOnce:${i}`, (span) => {
      const result = Math.floor(Math.random() * (max - min) + min);

      // Add an attribute to the span
      span.setAttribute('dicelib.rolled', result.toString());

      span.end();
      return result;
    });
  }
    
  function rollTheDice(rolls, min, max) {
    // Create a span. A span must be closed.
    return tracer.startActiveSpan('rollTheDice', (parentSpan) => {
      const result = [];
      for (let i = 0; i < rolls; i++) {
        result.push(rollOnce(i, min, max));
      }
      // Be sure to end the span!
      parentSpan.end();
      return result;
    });
  }

  module.exports = { rollTheDice };
  ```

### 3. Add Instrumentation

- In the `otel-example-app` folder, create an `instrumentation.js` file and add the following code -

  ```javascript
  // Otel Docs Reference - https://opentelemetry.io/docs/languages/js/instrumentation
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
  const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
  const { Resource } = require('@opentelemetry/resources')
  const { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, } = require('@opentelemetry/semantic-conventions')
  const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
  const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');


  const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'dice-server',
      [SEMRESATTRS_SERVICE_VERSION]: '0.1.0',
    }),
    traceExporter: new OTLPTraceExporter({
      url: `http://${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
          url: `http://${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`
        }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  ```

## Deploy the Express App

### 1. Create an Empty Service and Configure the Variable
- In the same Railway project, add a New service by clicking `+ New`
- Select `Empty Service`
- Add the following variable to the service
    ```plaintext
    OTEL_EXPORTER_OTLP_ENDPOINT=${{OpenTelemetry Collector.RAILWAY_PRIVATE_DOMAIN}}:4318
    ```
    *This is used by your Express App to connect to the OpenTelemetry Collector*
- Click Deploy to Apply and create the service

### 2. Deploy from the CLI
On your local machine -
- Open your terminal and change directory to the `otel-example-app` folder
- Link to the Railway project by running the following command - 
  ```plaintext
  railway link
  ```
- Follow the prompts, selecting the correct project name and `production` environment.
- Link to the empty service you created by running the following command -
  ```plaintext
  railway service
  ```
- Follow the prompt, selecting the correct service name
- Deploy the Express App by running the following command -
  ```plaintext
  railway up -d
  ```

## Test and Confirm

Test that your Datadog Agent is receiving and forwarding data to Datadog by navigating to the routes in the Express app -
- `/`
- `/test`

Generate some traffic to these two routes and verify in your Datadog instance that the data is there.

## Conclusion

Congratulations!  You have deployed a Datadog Agent and a Node Express app that sends logs and metrics to Datadog.

This is a *very* basic implementation, and you should refer to the <a href="https://docs.datadoghq.com/" target="_blank">Datadog documentation</a> for information on how to customize the data you send.