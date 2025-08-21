---
title: Production Readiness Checklist
description: Ensure your app is production-ready with this comprehensive Railway checklist.
---

_Is your application ready for production?_

In this page, we'll explore key areas for production readiness, suggesting actions to take to address each one:

- [Performance and Reliability](#performance-and-reliability)
- [Observability and Monitoring](#observability-and-monitoring)
- [Quality Assurance](#quality-assurance)
- [Security](#security)
- [Disaster Recovery](#disaster-recovery)

---

## Performance and Reliability

Ensuring your application is performant and reliable under changing conditions like load and external latency is critical for production-readiness. Consider taking the following actions to ensure your application is performant and reliable -

**&check; Serve your application from the right region**

- Deploying your application as close to your users as possible minimizes the number of network hops, reducing latency and improving performance.

  Railway offers multiple [deployment regions](/reference/deployment-regions) around the globe.

  You may also consider implementing a CDN to cache server responses on an edge network.

**&check; Use private networking between services**

- When communicating between services over the public network, latency is introduced by the network hops that requests must make to reach their destination.

  To reduce latency, ensure communication between services in the same project and environment happens over the [private network](/reference/private-networking).

**&check; Configure a restart policy**

- Services can crash for different reasons, frequently due to unhandled exceptions in code, and it is important to implement a strategy to mitigate performance degradation and user impact.

  Ensure that you have properly configured your services [restart policy](/guides/restart-policy).

**&check; Configure at least 2 replicas**

- If a service crashes or becomes unavailable due to a long-running request, your application could experience downtime or degraded performance.

  Increase the [number of replicas](/guides/optimize-performance#configure-horizontal-scaling) to at least 2, so if one instance of your service crashes or becomes unavailable, there is another to continue handling requests.

**&check; Confirm your compute capacity**

- The vCPU and memory capacity of your services greatly impacts their ability to perform efficiently.

  The compute allocation for your services is handled automatically by Railway, and the limits are determined by your chosen subscription [plan](/reference/pricing#plans). You should review your plan limits and consider if upgrading is necessary to achieve the desired compute.

**&check; Consider deploying a database cluster or replica set**

- Data is critical to most applications, and you should ensure that the data layer in your stack is highly available and fault tolerant.

  Consider implementing a cluster or replica set, similar to the <a href="https://railway.com/template/q589Jl" target="_blank">Redis HA with Sentinel</a> template, to ensure that your data remains available even if one node becomes unstable.

  We are hard at work developing other templated solutions for more production-ready datastores, keep an eye on the template marketplace for more to become available.

---

## Observability and Monitoring

Observability and monitoring refers to tracking the health and performance of your application. Consider taking the following actions to ensure you are able to track your application health -

**&check; Get familiar with the log explorer**

- When researching an application issue across multiple services, it can be disruptive and time-consuming to move between log views for each service individually.

  Familiarize yourself with the [Log Explorer](/guides/logs#log-explorer) so you can query logs across all of your services in one place.

**&check; Setup webhooks and email notifications**

- Ensure you are alerted if the [deployment status](/reference/deployments#deployment-states) of your services change.

  Enable email notifications in you Account Settings to receive these alerts via email.

  Setup [webhooks](/reference/deployments#deployment-states) to have the alerts sent to another system, like Slack or Discord.

_What's next for observability features in Railway? We have a ton of ideas, but we would love to hear yours in our <a href="https://station.railway.com/feature-request/better-logging-support-1e6f5676" target="_blank">community forums</a>._

---

## Quality Assurance

Quality assurance involves following practices to ensure changes to your application code meet quality standards before they are deployed to production. Consider the following actions to ensure you're set up for success -

**&check; Implement check suites**

- Common practice is to run a suite of tests, scans, or other automated jobs against your code before it is merged into production. You may want to configure your deployments to wait until those jobs have completed successfully before triggering a build.

  Enable [check suites](/guides/github-autodeploys#check-suites) to have Railway wait for your GitHub workflows to complete successfully before triggering a deployment.

**&check; Use environments**

- Maintaining separate environments for production and development is good practice for controlling changes in a production environment.

  Consider setting up [environments](/guides/environments) to properly test changes before merging to production.

  Additionally, [PR environments](/guides/environments#enable-pr-environments) can be enabled to create environments when PRs are opened on your production branch.

**&check; Use config as code**

- Along with your source code, you can maintain your Railway configuration in a `json` or `toml` file, enabling you to keep track of changes, just as you do with your source code.

  Take advantage of [config as code](/guides/config-as-code) to control and track changes to your Railway configuration.

**&check; Understand the deployment rollback feature**

- Introducing breaking changes to your application code is sometimes unavoidable, and it can be a headache reverting to previous commits.

  Be sure to check out the [deployment rollback feature](/guides/deployment-actions#rollback), in case you need to rollback to a previous deployment.

---

## Security

Protecting your application and user data from malicious threats and vulnerabilities is mission-critical in production applications. Consider the following for peace of mind -

**&check; Use private networking**

- The easiest way to protect your services from malicious threats, is to keep them unexposed to the public network.

  Secure communication between services in the same project and environment by using the [private network](/reference/private-networking).

**&check; Implement a security layer**

- While Railway does have protections in place at the platform level, we do not currently offer a configurable service for users' applications.

  Consider using a service like Cloudflare that offers both WAF and DDoS mitigation, to protect your services against web threats and ensure availability and performance.

  _In the future, we would love to offer a native security solution. If you agree, <a href="https://station.railway.com/feature-request/implement-a-waf-firewall-security-54fe2aaf" target="_blank">let us know</a>._

---

## Disaster Recovery

Being prepared for major and unexpected issues helps minimize downtime and data loss. Consider taking the following actions to ensure you are prepared -

**&check; Set up an instance of your application in two regions**

- In the event of a major disaster, an entire region may become unavailable.

  Using [deployment regions](/reference/deployment-regions), you can deploy an entire instance of your application in another region.

  To save on cost of running a separate instance of your application, use [App Sleep](/reference/app-sleeping) to turn down resource usage on the inactive services.

**&check; Regularly back up your data**

- Data is critical to preserve in many applications. You should ensure you have a backup strategy in place for your data.

  Enable and configure [backups](/reference/backups) for your services with volumes to ensure you can restore your data in case of any data loss.

---

## Conclusion

Using a mix of native features and external tools, we hope you can feel confident that your applications on Railway meet the highest standards of performance, reliability, and security.

Remember, our team is always here to assist you with solutions. Reach out in <a href="https://discord.com/channels/713503345364697088/1006629907067064482" target="_blank">Discord</a> or over email at [team@railway.com](mailto:team@railway.com) for assistance.

Finally, as suggested on several sections above, we are working tirelessly to give you the best experience imaginable on Railway. If you have requests or suggestions, please <a href="https://station.railway.com" target="_blank">let us know</a>!
