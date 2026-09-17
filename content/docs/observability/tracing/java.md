---
title: Tracing for Java
description: Export OpenTelemetry traces from a Java service on Railway with the OpenTelemetry Java agent, including Spring Boot apps.
---

Java apps export traces to Railway with the OpenTelemetry Java agent. The agent attaches to the JVM at startup and instruments Spring, Jakarta servlets, JDBC, HTTP clients, and hundreds of other libraries without code changes.

Before you start, [enable tracing](/observability/tracing#enable-tracing) for the service. Railway adds the `OTEL_*` variables on the next deploy, and the agent reads them.

## Add the agent to your image

The agent is a single JAR file. Download it during the build so it's available at runtime. With a Dockerfile:

```dockerfile filename="Dockerfile"
FROM eclipse-temurin:21-jre
WORKDIR /app

ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar \
    /app/opentelemetry-javaagent.jar

COPY build/libs/app.jar /app/app.jar
CMD ["java", "-javaagent:/app/opentelemetry-javaagent.jar", "-jar", "/app/app.jar"]
```

Pin a release version in the URL rather than `latest` for reproducible builds. Without a Dockerfile, download the JAR in your [build command](/builds/build-and-start-commands) with `curl -L -o opentelemetry-javaagent.jar <url>`, and reference it from the start command.

## Set the start command

Pass the agent to the JVM with `-javaagent`:

```bash
java -javaagent:opentelemetry-javaagent.jar -jar app.jar
```

Or leave the start command alone and set `JAVA_TOOL_OPTIONS` as a service variable, which the JVM reads at startup:

```plaintext
JAVA_TOOL_OPTIONS=-javaagent:/app/opentelemetry-javaagent.jar
```

The agent configures itself from environment variables. Besides the variables Railway provides, set these two on the service. The agent exports metrics and logs by default, and Railway's receiver accepts traces only:

```plaintext
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

## Spring Boot

The agent instruments Spring MVC, Spring WebFlux, Spring Data, and the rest of the framework. Each incoming request produces a server span named after the method and the controller's route pattern, with `http.route` and `http.response.status_code` attributes. Calls made with `RestTemplate`, `WebClient`, or `RestClient` produce client spans and carry the trace context onward. JDBC queries produce client spans with the statement.

If you'd rather not run an agent, the <a href="https://opentelemetry.io/docs/zero-code/java/spring-boot-starter/" target="_blank">OpenTelemetry Spring Boot starter</a> adds the same instrumentation as a dependency and reads the same `OTEL_*` variables.

## Add a custom span

Add the `opentelemetry-api` dependency and annotate a method with `@WithSpan`, which the agent turns into a span:

```java
import io.opentelemetry.instrumentation.annotations.SpanAttribute;
import io.opentelemetry.instrumentation.annotations.WithSpan;

public class CheckoutService {
    @WithSpan("calculate-total")
    public int calculateTotal(@SpanAttribute("cart.items") int itemCount, Cart cart) {
        return priceItems(cart);
    }
}
```

The annotations come from the `opentelemetry-instrumentation-annotations` artifact. For spans that don't map to a method, use the `Tracer` from `GlobalOpenTelemetry.getTracer("checkout")` directly.

## Verify

1. Deploy the service and send it a few requests.
2. Open the **Traces** page. In the **Tracing setup** panel, the **App** indicator for the service turns green when its first span arrives.
3. Open a trace. The request's server span and any child spans appear under the edge and proxy spans.

If spans from the app don't arrive, see [Troubleshooting](/observability/tracing#troubleshooting). Set `OTEL_JAVAAGENT_DEBUG=true` on the service to have the agent log its configuration and export attempts. The agent adds a few seconds to JVM startup, so give the service a [health check](/deployments/healthchecks) if it doesn't have one.
