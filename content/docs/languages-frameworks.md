---
title: Languages & Frameworks
description: Deploy applications using any language or framework on Railway.
---

Railway supports deploying applications built with virtually any programming language or framework. Railway's build system, [Railpack](/builds/railpack), automatically detects your stack and creates optimized container images.

## How it works

When you deploy code to Railway:

1. Railpack analyzes your repository to detect the language and framework
2. An optimized build plan is generated automatically
3. Your application is containerized and deployed

No configuration required for most applications. For advanced customization, see [Build Configuration](/builds/build-configuration).

## Framework guides

### JavaScript / TypeScript

- [Next.js](/quick-start)
- [Express](/guides/express)
- [Fastify](/guides/fastify)
- [Nest.js](/guides/nest)
- [Remix](/guides/remix)
- [Nuxt](/guides/nuxt)
- [Astro](/guides/astro)
- [SvelteKit](/guides/sveltekit)
- [React](/guides/react)
- [Vue](/guides/vue)
- [Angular](/guides/angular)
- [Solid](/guides/solid)
- [Sails](/guides/sails)

### Python

- [FastAPI](/guides/fastapi)
- [Flask](/guides/flask)
- [Django](/guides/django)

### PHP

- [Laravel](/guides/laravel)
- [Symfony](/guides/symfony)

### Ruby

- [Rails](/guides/rails)

### Go

- [Gin](/guides/gin)
- [Beego](/guides/beego)

### Rust

- [Axum](/guides/axum)
- [Rocket](/guides/rocket)

### Java

- [Spring Boot](/guides/spring-boot)

### Scala

- [Play](/guides/play)

### Elixir

- [Phoenix](/guides/phoenix)
- [Phoenix + Distillery](/guides/phoenix-distillery)

### Clojure

- [Luminus](/guides/luminus)

## Other languages

Don't see your language listed? Railway can still deploy it. Railpack supports many languages automatically, and you can always use a [Dockerfile](/builds/dockerfiles) for complete control over your build process.
