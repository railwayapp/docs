import { IPage, ISidebarContent } from "../types";

const makePage = (title: string, category?: string, slug?: string): IPage => ({
  title,
  category,
  slug:
    slug ??
    `/${category != null ? category + "/" : ""}${title
      .toLowerCase()
      .replace(/[\s/]+/g, '-')}`,
});

export const sidebarContent: ISidebarContent = [
  // The goal is to have the docs be in a narrative structure
  {
    title: "",
    content: [
      makePage("Home", undefined, "/"),
      makePage("Quick Start", undefined),
      {title: "Template Kickback Program", url: "https://blog.railway.app/p/incentivized-templates"},
    ],
  },
  {
    title: "Overview",
    content: [
      makePage("About Railway", "overview"),
      makePage("The Basics", "overview"),
      makePage("Advanced Concepts", "overview"),
    ],
  },
  {
    title: "Maturity",
    content: [
      makePage("Philosophy", "maturity"),
      makePage("Use Cases", "maturity"),
      makePage("Compliance", "maturity"),
    ],
  },
  {
    title: "How To Guides",
    content: [
      makePage("Overview", "how-to"),
      {
        subTitle: makePage("Get Started","how-to"),
        pages: [
          makePage("Projects", "how-to"),
          makePage("Services", "how-to"),
          makePage("Variables", "how-to"),
          makePage("Volumes", "how-to"),
          makePage("Understanding Pricing", "how-to"),
        ]
      },
      {
        subTitle: makePage("Configure Networking", "how-to"),
        pages: [
          makePage("Exposing Your App", "how-to"),
          makePage("Setup Private Networking", "how-to"),
        ]
      },
      makePage("Customize Builds", "how-to"),
      {
        subTitle: makePage("Customize Deployments", "how-to"),
        pages: [
          makePage("Configure Replicas", "how-to"),
          makePage("Configure Regions", "how-to"),
          makePage("Run a Cron", "how-to"),
          makePage("Deploy a Monorepo", "how-to"),
          makePage("Configure Health Checks", "how-to"),
          makePage("Enable App Sleep", "how-to"),
          makePage("Restart Policy", "how-to"),
        ]
      },
      makePage("Setup Environments", "how-to"),
      {
        subTitle: makePage("Templates", "how-to"),
        pages: [
          makePage("Create a Template", "how-to"),
          makePage("Deploy a Template", "how-to"),
        ]
      },
      {
        subTitle: makePage("Databases", "how-to"),
        pages: [
          makePage("Bring Your Own", "how-to"),
          makePage("Using the Database View", "how-to"),
          makePage("PostgreSQL", "how-to"),
          makePage("MySQL", "how-to"),
          makePage("Redis", "how-to"),
          makePage("MongoDB", "how-to"),
        ]
      },
    ],
  },
  {
    title: "Tutorials",
    content: [
      makePage("Introduction to Tutorials", 'tutorials'),
      makePage("Migrate from Heroku", 'tutorials'),
      makePage("Database Migration Guide", 'tutorials'),
    ]
  },
  {
    title: "Reference",
    content: [
      {
        subTitle: makePage("Primitives", "reference"),
        pages: [
          makePage("Projects", "reference"),
          makePage("Services", "reference"),
          makePage("Variables", "reference"),
          makePage("Public API", "reference"),
          makePage("Templates", "reference"),
          makePage("Volumes", "reference"),
          makePage("Accounts", "reference"),
          makePage("Teams", "reference"),
          makePage("CLI API", "reference"),
        ]
      },
      {
        subTitle: makePage("Features", "reference"),
        pages: [
          makePage("Private Networking", "reference"),
          makePage("App Sleeping", "reference"),
          makePage("Cron Jobs", "reference"),
          makePage("Usage Limits", "reference"),
        ]
      },
      {
        subTitle: makePage("Operations", "reference"),
        pages: [
          makePage("Pricing", "reference"),
          makePage("Support", "reference"),
          makePage("Project Members", "reference"),
        ]
      },
      makePage("Guides", "reference"),
      makePage("Priority Boarding", "reference"),
      makePage("Compare to Heroku", "reference"),
    ],
  },

];
