const redirects = [
  {
    source: "/reference/s",
    destination: "/reference/templates",
    permanent: true,
  },
  {
    source: "/getting-started",
    destination: "/quick-start",
    permanent: true,
  },
  {
    source: "/develop/:slug*",
    destination: "/guides/:slug*",
    permanent: true,
  },
  {
    source: "/deploy/exposing-your-app",
    destination: "/guides/public-networking",
    permanent: true,
  },
  {
    source: "/deploy/logging",
    destination: "/guides/logs",
    permanent: true,
  },
  {
    source: "/deploy/deploy-on-railway-button",
    destination: "/guides/templates",
    permanent: true,
  },
  {
    source: "/deploy/healthchecks",
    destination: "/reference/healthchecks",
    permanent: true,
  },
  {
    source: "/deploy/integrations",
    destination: "/reference/integrations",
    permanent: true,
  },
  {
    source: "/deploy/railway-up",
    destination: "/guides/services",
    permanent: true,
  },
  {
    source: "/deploy/:slug*",
    destination: "/guides/:slug*",
    permanent: true,
  },
  {
    source: "/databases/bring-your-own-database",
    destination: "/guides/build-a-database-service",
    permanent: true,
  },
  {
    source: "/databases/:slug*",
    destination: "/guides/:slug*",
    permanent: true,
  },
  {
    source: "/diagnose/project-usage",
    destination: "/reference/project-usage",
    permanent: true,
  },
  {
    source: "/diagnose/:slug*",
    destination: "/guides/:slug*",
    permanent: true,
  },
  {
    source: "/guides/migrate-from-heroku",
    destination: "/tutorials/migrate-from-heroku",
    permanent: true,
  },
  {
    source: "/reference/compare-to-heroku",
    destination: "/maturity/compare-to-heroku",
    permanent: true,
  },
  {
    source: "/troubleshoot/fixing-common-errors",
    destination: "/guides/fixing-common-errors",
    permanent: true,
  },
  {
    source: "/reference/guides",
    destination: "/tutorials/getting-started",
    permanent: true,
  },
  {
    source: "/reference/pricing",
    destination: "/reference/pricing/plans",
    permanent: true,
  },
  {
    source: "/guides/fixing-common-errors",
    destination: "/reference/errors",
    permanent: true,
  },
];

const hashRedirects = [
  {
    source: "#application-failed-to-respond",
    destination: "/reference/errors/application-failed-to-respond",
    permanent: true,
  },
  {
    source: "#post-requests-turn-into-get-requests",
    destination: "/reference/errors/405-method-not-allowed",
    permanent: true,
  },
];

module.exports = {
  redirects,
  hashRedirects,
};
