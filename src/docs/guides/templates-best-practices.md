---
title: Template Best Practices
description: Learn the best practices for template creation.
---

Creating templates can get complex, but these best practices will help you create templates that are easy to use and maintain.

## Checklist

Depending on the type of template, there are different things to consider.

- [ ] Template and Service Icons
- [ ] Naming Conventions
- [ ] Environment Variables
- [ ] Health Checks
- [ ] Overview

### Template and Service Icons

Template and service icons are important for branding and recognition, they give the template a more professional look and feel.

Always use 1:1 Aspect Ratio icons with transparent backgrounds, for both the template itself and the services it includes.

### Naming Conventions

Naming conventions are important for readability and consistency, they help users understand the template and the services it includes.

Always follow the naming conventions for the software that the template is made for.

Example, The template is ClickHouse, the service and template name should be named `ClickHouse` since that is how the brand name is spelled.

For anything else, such as custom software, use capital case and avoid using special characters or dashes, space delimitaed is the way to go.

### Environment Variables

Properly set up environment variables are a great way to increase the usability of your template.

When using environment variables:

- Always include a description of what the variable is for.

- For any secrets, passwords, keys, etc, use [template variable functions](/guides/create#template-variable-functions) to generate them.

- Use [referance variables](/guides/variables#referencing-another-services-variable) when possible.

- Include helpful pre-built variables that the user may need, such as database connection strings, api keys, ports, etc.

### Health Checks

Health checks are important for ensuring that the service is running properly, before traffic is routed to it.

Although a health check might not be needed for all software, such as Discord bots, but when it is applicable, it is a good idea to include a health check.

A readiness probe is the best option, if thats not possible, then a liveness probe should be used.

### Overview

The overview is the first thing users will see when they click on the template, so it is important to make it count.

The overview should include the following:

- Template Name or Title Logo

- A description of the software the template deploys.

- Infromation about hosting the software on Railway.

- Why the user should use this template.

- Some common use cases of the software.

- Information on other dependencies the template requires.

- Implementation notes, such as how to use the service, how to connect to the database, etc.




