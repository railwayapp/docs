---
title: Languages & Frameworks
description: Deploy applications using any language or framework on Railway.
---

Railway supports deploying applications built with virtually any programming language or framework. Our build system, [Railpack](/builds/railpack), automatically detects your stack and creates optimized container images.

## How it works

When you deploy code to Railway:

1. **Railpack** analyzes your repository to detect the language and framework
2. An optimized build plan is generated automatically
3. Your application is containerized and deployed

No configuration required for most applications. For advanced customization, see [Build Configuration](/builds/build-configuration).

## Framework guides

### JavaScript / TypeScript

| Framework | Guide |
| --------- | ----- |
| Next.js | [Quick Start](/quick-start) |
| Express | [Express Guide](/guides/express) |
| Fastify | [Fastify Guide](/guides/fastify) |
| Nest.js | [Nest Guide](/guides/nest) |
| Remix | [Remix Guide](/guides/remix) |
| Nuxt | [Nuxt Guide](/guides/nuxt) |
| Astro | [Astro Guide](/guides/astro) |
| SvelteKit | [SvelteKit Guide](/guides/sveltekit) |
| React | [React Guide](/guides/react) |
| Vue | [Vue Guide](/guides/vue) |
| Angular | [Angular Guide](/guides/angular) |
| Solid | [Solid Guide](/guides/solid) |
| Sails | [Sails Guide](/guides/sails) |

### Python

| Framework | Guide |
| --------- | ----- |
| FastAPI | [FastAPI Guide](/guides/fastapi) |
| Flask | [Flask Guide](/guides/flask) |
| Django | [Django Guide](/guides/django) |

### PHP

| Framework | Guide |
| --------- | ----- |
| Laravel | [Laravel Guide](/guides/laravel) |
| Symfony | [Symfony Guide](/guides/symfony) |

### Ruby

| Framework | Guide |
| --------- | ----- |
| Rails | [Rails Guide](/guides/rails) |

### Go

| Framework | Guide |
| --------- | ----- |
| Gin | [Gin Guide](/guides/gin) |
| Beego | [Beego Guide](/guides/beego) |

### Rust

| Framework | Guide |
| --------- | ----- |
| Axum | [Axum Guide](/guides/axum) |
| Rocket | [Rocket Guide](/guides/rocket) |

### Java

| Framework | Guide |
| --------- | ----- |
| Spring Boot | [Spring Boot Guide](/guides/spring-boot) |

### Scala

| Framework | Guide |
| --------- | ----- |
| Play | [Play Guide](/guides/play) |

### Elixir

| Framework | Guide |
| --------- | ----- |
| Phoenix | [Phoenix Guide](/guides/phoenix) |
| Phoenix + Distillery | [Phoenix Distillery Guide](/guides/phoenix-distillery) |

### Clojure

| Framework | Guide |
| --------- | ----- |
| Luminus | [Luminus Guide](/guides/luminus) |

## Other languages

Don't see your language listed? Railway can still deploy it! Railpack supports many languages automatically, and you can always use a [Dockerfile](/builds/dockerfiles) for complete control over your build process.
