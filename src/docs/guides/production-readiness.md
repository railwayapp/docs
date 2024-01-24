---
title: Production Readiness
---

*Is your application ready for production?  Use this guide to help boost your confidence for launch day.*

Generally, these are the areas that you should focus when preparing your project for production.  Where applicable, we have referred to Railway features to help address the area of concern.
- [Performance and Reliability](#performance-and-reliability)
- [Observability and Monitoring](#observability-and-monitoring)
- [Quality Assurance](#quality-assurance)
- [Security](#security)
- [Disaster Recovery](#disaster-recovery)

## Performance and Reliability

Blurb on what this means

Features
- Regions
- Replicas

Blurb about using benchmarks and performance testing to dial it in

Blurb about load balancing regions

Blurb about implementing a CDN


## Observability and Monitoring

Blurb

Features:
- Observability tab, suggest saving helpful queries
- Webhooks

Couple-a blurbs about using a home-rolled solution like Prometheus and Grafana or shipping logs to Datadog and mention the guide


## Quality Assurance

Blurb

Features:
- Check Suites
- PR environments
- Rollbacks?

Maybe something about versioning and tagging?

## Security

Blurb

Features:
- https on all external traffic
- internal networking

blurb about vuln scanning

## Disaster Recovery

Blurb

Features:
- environments (totally a different use case for environments, but why not)
- regional service group

stuff about database backups
- mention templates that we have for backups

## Conclusion


 
 <a href="https://railway.app/dashboard" target="_blank">new tab</a>.