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
  {
    source: "/reference/production-readiness-checklist",
    destination: "/overview/production-readiness-checklist",
    permanent: true,
  },
  {
    source: "/overview/about-railway",
    destination: "/platform/about-railway",
    permanent: true,
  },
  {
    source: "/maturity/philosophy",
    destination: "/platform/philosophy",
    permanent: true,
  },
  {
    source: "/maturity/use-cases",
    destination: "/platform/use-cases",
    permanent: true,
  },
  {
    source: "/reference/support",
    destination: "/platform/support",
    permanent: true,
  },
  {
    source: "/maturity/incident-management",
    destination: "/platform/incident-management",
    permanent: true,
  },
  {
    source: "/railway-metal",
    destination: "/platform/railway-metal",
    permanent: true,
  },
  {
    source: "/maturity/compare-to-heroku",
    destination: "/platform/compare-to-heroku",
    permanent: true,
  },
  {
    source: "/maturity/compare-to-render",
    destination: "/platform/compare-to-render",
    permanent: true,
  },
  {
    source: "/maturity/compare-to-fly",
    destination: "/platform/compare-to-fly",
    permanent: true,
  },
  {
    source: "/maturity/compare-to-vercel",
    destination: "/platform/compare-to-vercel",
    permanent: true,
  },
  {
    source: "/maturity/compare-to-digitalocean",
    destination: "/platform/compare-to-digitalocean",
    permanent: true,
  },
  {
    source: "/maturity/compare-to-vps",
    destination: "/platform/compare-to-vps",
    permanent: true,
  },
  {
    source: "/reference/pricing/plans",
    destination: "/pricing/plans",
    permanent: true,
  },
  {
    source: "/reference/pricing/free-trial",
    destination: "/pricing/free-trial",
    permanent: true,
  },
  {
    source: "/reference/pricing/faqs",
    destination: "/pricing/faqs",
    permanent: true,
  },
  {
    source: "/reference/pricing/refunds",
    destination: "/pricing/refunds",
    permanent: true,
  },
  {
    source: "/reference/pricing/aws-marketplace",
    destination: "/pricing/aws-marketplace",
    permanent: true,
  },
  {
    source: "/reference/pricing/understanding-your-bill",
    destination: "/pricing/understanding-your-bill",
    permanent: true,
  },
  {
    source: "/reference/mcp-server",
    destination: "/ai/mcp-server",
    permanent: true,
  },
  {
    source: "/reference/accounts",
    destination: "/access/accounts",
    permanent: true,
  },
  {
    source: "/reference/two-factor-enforcement",
    destination: "/access/two-factor-enforcement",
    permanent: true,
  },
  {
    source: "/maturity/enterprise",
    destination: "/enterprise",
    permanent: true,
  },
  {
    source: "/reference/audit-logs",
    destination: "/enterprise/audit-logs",
    permanent: true,
  },
  {
    source: "/maturity/compliance",
    destination: "/enterprise/compliance",
    permanent: true,
  },
  {
    source: "/reference/saml",
    destination: "/enterprise/saml",
    permanent: true,
  },
  {
    source: "/reference/project-members",
    destination: "/projects/project-members",
    permanent: true,
  },
  {
    source: "/reference/project-usage",
    destination: "/projects/project-usage",
    permanent: true,
  },
  {
    source: "/reference/teams",
    destination: "/projects/teams",
    permanent: true,
  },
  {
    source: "/reference/variables",
    destination: "/variables/reference",
    permanent: true,
  },
  {
    source: "/guides/pre-deploy-command",
    destination: "/deployments/pre-deploy-command",
    permanent: true,
  },
  {
    source: "/guides/start-command",
    destination: "/deployments/start-command",
    permanent: true,
  },
  {
    source: "/guides/deployment-actions",
    destination: "/deployments/deployment-actions",
    permanent: true,
  },
  {
    source: "/guides/github-autodeploys",
    destination: "/deployments/github-autodeploys",
    permanent: true,
  },
  {
    source: "/guides/image-auto-updates",
    destination: "/deployments/image-auto-updates",
    permanent: true,
  },
  {
    source: "/guides/optimize-performance",
    destination: "/deployments/optimize-performance",
    permanent: true,
  },
  {
    source: "/guides/restart-policy",
    destination: "/deployments/restart-policy",
    permanent: true,
  },
  {
    source: "/guides/deployment-teardown",
    destination: "/deployments/deployment-teardown",
    permanent: true,
  },
  {
    source: "/guides/monorepo",
    destination: "/deployments/monorepo",
    permanent: true,
  },
  {
    source: "/guides/staged-changes",
    destination: "/deployments/staged-changes",
    permanent: true,
  },
  // Phase 12: Move Deployments Reference
  {
    source: "/reference/app-sleeping",
    destination: "/deployments/app-sleeping",
    permanent: true,
  },
  {
    source: "/reference/deployments",
    destination: "/deployments/reference",
    permanent: true,
  },
  {
    source: "/reference/scaling",
    destination: "/deployments/scaling",
    permanent: true,
  },
  {
    source: "/guides/builds",
    destination: "/builds",
    permanent: true,
  },
  {
    source: "/guides/build-configuration",
    destination: "/builds/build-configuration",
    permanent: true,
  },
  {
    source: "/guides/private-registries",
    destination: "/builds/private-registries",
    permanent: true,
  },
  {
    source: "/reference/build-and-start-commands",
    destination: "/builds/build-and-start-commands",
    permanent: true,
  },
  {
    source: "/reference/railpack",
    destination: "/builds/railpack",
    permanent: true,
  },
  {
    source: "/reference/nixpacks",
    destination: "/builds/nixpacks",
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
  {
    source: "/guides/healthchecks-and-restarts#restart-policy",
    destination: "/guides/restart-policy",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts#configure-healthcheck-path",
    destination: "/guides/healthchecks#configure-the-healthcheck-path",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts#configure-healthcheck-port",
    destination: "/guides/healthchecks#configure-the-healthcheck-port",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts#healthcheck-timeout",
    destination: "/guides/healthchecks#healthcheck-timeout",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts#services-with-attached-volumes",
    destination: "/guides/healthchecks#services-with-attached-volumes",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts#healthcheck-hostname",
    destination: "/guides/healthchecks#healthcheck-hostname",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts#continuous-healthchecks",
    destination: "/guides/healthchecks#continuous-healthchecks",
    permanent: true,
  },
];

module.exports = {
  redirects,
  hashRedirects,
};
