---
title: Elasticsearch
---

The Railway Elasticsearch plugin allows you to provision and connect to a
Elasticsearch database with zero configuration.

### Install

When you run `railway run` in a project with the Elasticsearch plugin installed,
we inject several environment variables.

- `ELASTICHOST`
- `ELASTICPORT`
- `ELASTICUSER`
- `ELASTICPASSWORD`
- `ELASTIC_URL`

Run queries on your elastic search container by making requests to `ELASTIC_URL`.
