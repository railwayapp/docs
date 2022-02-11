---
title: Plugins
---

Railway projects allow you to provision additional infrastructure on top of your existing deployment in the form of Plugins.

Railway currently offers the following Plugins

- [PostgreSQL](/plugins/postgresql)
- [MySQL](/plugins/mysql)
- [MongoDB](/plugins/mongodb)
- [Redis](/plugins/redis)

You can add a plugin in the Command + K menu or by clicking the New Service button on the Project Canvas.

Railway maintains separate plugins for each Environment created.

## Connecting to Your Plugin

Railway provides connection strings and project variables that let your application connect to the plugin.

You can access your plugin's connection strings under the Connect tab in the plugin interface.

Railway injects your plugin variables whenever you run `railway run` locally to facilitate local development.

## Managing Plugin Data

Railway provides a user interface into your plugin's data that allow you to introspect the tables and the data in your plugin.

For non-SQL based plugins like Redis and Mongo, we allow you to create keys and entries into your plugin using a tailored interface into those Plugins.

## Plugin Management

We expose two high level administrative actions through the interface for Plugin interface.

- Reset Plugin Credentials
- Wipe Plugin Data

## Plugin Metrics

You can see Plugin usage such as CPU/RAM/Bandwidth under the Metrics pane.
