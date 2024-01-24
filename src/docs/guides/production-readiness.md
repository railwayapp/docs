---
title: Production Readiness Guide
---

*Is your application ready for production?*

In this guide, we'll explore key areas for production readiness, highlighting native features that support each area.  We recognize that this pursuit often extends beyond the scope of any single platform, so we will also suggest external tools where relevant.

Generally, these are the areas that you should focus on when preparing your project for production:
- [Performance and Reliability](#performance-and-reliability)
- [Observability and Monitoring](#observability-and-monitoring)
- [Quality Assurance](#quality-assurance)
- [Security](#security)
- [Disaster Recovery](#disaster-recovery)

---

## Performance and Reliability

One of the most critical aspects of production-readiness, is having confidence that your application is both performant and reliable under changing conditions, like load and external latency.

**Native Features**
- [Deployment Regions](/reference/deployment-regions): Minimize latency by deploying your services to the region that is closest to your users.
- [Scaling](/reference/scaling): By default, Railway will autoscale your services **vertically** up to the vCPU and memory limits of your [plan](/reference/pricing#plans).  
Scale your services **horizontally** by [increasing the number of replicas](/guides/optimize-performance#configure-horizontal-scaling).

**Performance Testing**

Consider running benchmark and performance tests to understand how your application performs under various conditions.  This can help you understand how many replicas your service needs, or to which region it is best suited.

**Additional Considerations**

Although Railway does not yet have a native solution, implementing a Content Delivery Network (CDN) and/or load balancing between regions can further enhance performance and reliability.

---

## Observability and Monitoring

Observability and monitoring refers to tracking the health and performance of your application over time.

**Native Features**
- [Logging](/guides/logs): View logs from any service or use the Log Explorer for a centralized view of application logs.
- [Deployment Status Webhooks](/guides/webhooks): Receive notifications upon service deployment status changes.

**Alerting**

It is standard practice to implement an alerting mechanism to notify of certain conditions in logging, like a spike in error rate.  It is possible to build a solution that uses our [Public API](/reference/public-api) to analyze logs, or you may want to consider using an existing tool like Prometheus AlertManager.

---

## Quality Assurance

Quality assurance involves following practices to ensure changes to your application code meet quality standards before they are deployed to production.

**Native Features**
- [Check Suites](/guides/github-autodeploys#check-suites): Enable check suites to ensure Railway does not deploy your code until your tests have completed successfully.
- [Environments](/guides/environments): Create separate environments for production, staging, and development, and/or [enable PR Environments](/guides/environments#enable-pr-environments) to test changes before merging.
- [Deployment Rollbacks](/guides/deployment-actions#rollback): Easily revert to previous versions if issues arise.
- [Config as Code](/guides/config-as-code): Manage and version your Railway configurations alongside your code for consistency and control.

---

## Security

Protecting your application and user data from malicious threats and vulnerabilities is mission-critical in production applications.

**Native Features**
- [TLS Encryption](/reference/public-networking#technical-specifications): All incoming traffic to Railway is encrypted by default.
- [Private Networking](/reference/private-networking): Secure communication between services in a project by using the private network wherever possible.

**Vulnerability Scanning**

Implement vulnerability scanning within your CI/CD or DevOps workflows to identify and mitigate risks early.

**Firewalls**

While Railway does have protections in place at the platform level, we do not currently offer a configurable firewall for users' services.  Because of this, we suggest using a service like Cloudflare to protect your application against malicious attacks.

---

## Disaster Recovery

Being prepared for major and unexpected issues helps minimize downtime and data loss.

**Native Features**
- [Deployment Regions](/reference/deployment-regions): Deploy your stack in different regions to maintain an Active/Inactive strategy and use [App Sleep](/reference/app-sleeping) to turn down resource usage on the Inactive instance.

**Data Backups**

Ensure you are performing regular backups of your data by implementing a cron service or other solution.  Check out one of our popular templates:
- <a href="https://railway.app/template/I4zGrH" target="_blank">PostgreSQL S3 Backups</a>

---

## Conclusion

Using a mix of native features and external tools, we hope you can feel confident that your applications on Railway meet the highest standards of performance, reliability, and security.

Remember, our team is always here to assist you with solutions.  Reach out in <a href="https://discord.com/channels/713503345364697088/1006629907067064482" target="_blank">Discord</a> or over email at [team@railway.app](mailto:team@railway.app) for assistance.