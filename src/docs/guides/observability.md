---
title: Observability Dashboard
description: Explore the built-in observability dashboard on Railway.
---

Railway provides a built-in observability dashboard that provides a customizable view into chosen metrics, logs, and data all in one place.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1717179720/Wholescreenshot_vc5l5e.png"
alt="Screenshot of the Observability Dashboard"
layout="responsive"
width={1111} height={649} quality={80} />

[Shape the future of this dashboard! We are actively collecting feedback on usecases and bugs you may encounter.](https://station.railway.com/feedback/observability-dashboard-51871a24)

## Navigating to the Observability Dashboard

<Image
src="https://res.cloudinary.com/railway/image/upload/v1743129656/docs/observability_hsja97.png"
alt="Screenshot of the Updated Project Navigation"
layout="responsive"
width={1200} height={260} quality={80} />

_Users may notice that the project navigation is updated with the feature._

1. Navigate to the Observability tab from the main project top bar.
2. Ensure you are in the correct environment (e.g., production).

The Observability Dashboard is uniquely scoped to each project environment as services may differ between each environment.

### Getting Started

By default the Observability Dashboard starts with no configured widgets.

- When you first access a new environment, you will be prompted to "Start with a simple dashboard" or "Add new item".
- Click on "Start with a simple dashboard" to create your initial layout, Railway will autogenerate graphs and widgets with spend, service metrics and logs.

## Creating Widgets

Clicking "New" in the top right corner of the dashboard will open the Widget creation modal. Widget types depend on the data source provided, where they can be a graph, displayed data, or logs.

<Image
src="https://res.cloudinary.com/railway/image/upload/v1717179725/erroronly_xdfscq.png"
alt="Screenshot of the Widget Creation Flow"
layout="responsive"
width={1101} height={830} quality={80} />

Widgets have a name and a description attached to them. By default Railway will provide a suggested name for the widget upon creation and display a preview of the content that is to be displayed on the dashboard.

### Available Data Sources

On the top right, you can select a data source to display within a widget.

- CPU Usage: Track the CPU usage for various services over time.
- Memory Usage: Monitor the memory consumption for your services.
- Network In/Out: Keep track of network traffic.
- Disk Usage: Observe disk usage trends.
- Logs: Select logs from a single service or multiple services with filtering
- Project Usage: report the spend of your project and track the overall resource usage of your project.

### Filtering Widget Information

When creating a widget, you can use Railway's filtering syntax to select services, select data, and perform logical negations to define rules.

- `<keyword>` or `"key phrase"` → Filter by exact text
- `@key:value` → Filter by key/value pair
  - Valid keys are replica, deployment, service, plugin
- `@attribute:value` → Filter by custom attribute (see structured logs below)

Any of the above expressions can be combined with boolean operators `AND`,
`OR`, and `-` (negation).

## Arranging the Dashboard

The Dashboard is customizable in content and layout. Widgets can be stacked, repositioned and resized.

Clicking the "Edit" button on the top right corner of the dashboard will transition the dashboard into edit mode, the dashboard then allows the ability to resize and reposition your widgets using the provided handle on each widget. To persist your changes, select "Save".

<Image
src="https://res.cloudinary.com/railway/image/upload/v1717179246/dragandmoveob_xg6qfz.gif"
alt="Screenshot of Widget Interaction"
layout="responsive"
width={800} height={491} quality={80} />

Resizing and Moving Widgets:

- Drag and drop items to rearrange them on the grid by dragging the arrow handle.
- Resize widgets by dragging the bottom right corner handle

_Note for Small Screens: On smaller screens, items stack vertically and respect their configured height to ensure readability and usability. Editing is disabled at smaller visual breakpoints._

## Editing/Deleting Widgets

Under Edit mode, each widget will have a three dot menu at the upper right corner at the bounding box of the widget. Clicking into this menu will allow you to edit the data source or delete the widget.

To persist your changes, make sure you press Save at the top right corner.

## Monitors

The Observability Dashboard includes configurable monitoring alerts that send
email and in-app notifications when thresholds are reached. You can also
configure [webhooks](/guides/webhooks) to receive notifications when thresholds are reached.

<Banner variant="info">
Monitors requires a [Pro plan](/reference/pricing/plans#plans).
</Banner>

Alerting thresholds can be configured to trigger above or below specified limits for:

- CPU
- RAM
- Disk usage
- Network egress

### Creating Monitors


To create a monitor, navigate to any widget in the Observability Dashboard and click the three dot menu at the upper right corner of the widget. Select "Add monitor" from the dropdown menu to configure alerting for that specific widget.

<video
  src="https://res.cloudinary.com/railway/video/upload/v1761099058/docs/guides/observability/monitors-demo_hfklkm.webm"
  autoPlay
  loop
  muted
  playsInline
  style={{width: "100%", maxWidth: "800px", height: "auto", borderRadius: "8px"}}
/>


### Editing Monitors

To edit an existing monitor, navigate to any widget that has monitoring configured and click the three dot menu at the upper right corner of the widget. Select "Edit monitor" from the dropdown menu to modify the monitor configuration for that widget.
