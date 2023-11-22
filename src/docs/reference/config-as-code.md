---
title: Config as Code
---

Railway supports defining the configuration for a single deployment in a file
alongside your code. By default, we will look for a `railway.toml` or
`railway.json` file. 

Everything in the build and deploy sections of the service
settings page can be specified in this configuration file.

### How does it work?

When a new deployment is triggered, Railway will look for any config files in your
code and combine these values with the settings from the dashboard. 

The resulting build and deploy config will be used **only for the current deployment**.


The settings in the dashboard will not be updated with the settings defined in
code.

Configuration defined in code will always override values from the
dashboard.

## Config Source Location

On the deployment details page, all the settings that a deployment went out with are shown. For settings that come from a configuration file, there is a little file icon. Hovering over the icon will show exactly what part of the file the values originated from.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1666388941/docs/details-page-config-tooltip_jvy1qu.png"
alt="Screenshot of Deployment Details Pane"
layout="responsive"
width={948} height={419} quality={100} />

## Configurable Settings

For information on configurable settings using config as code, refer to [this guide](/how-to/use-config-as-code).