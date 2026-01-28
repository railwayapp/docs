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
    source: "/develop/variables",
    destination: "/variables",
    permanent: true,
  },
  {
    source: "/develop/:slug*",
    destination: "/guides/:slug*",
    permanent: true,
  },
  {
    source: "/deploy/exposing-your-app",
    destination: "/networking/public-networking",
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
  {
    source: "/reference/functions",
    destination: "/functions",
    permanent: true,
  },
  {
    source: "/guides/databases",
    destination: "/databases",
    permanent: true,
  },
  {
    source: "/guides/build-a-database-service",
    destination: "/databases/build-a-database-service",
    permanent: true,
  },
  {
    source: "/guides/postgresql",
    destination: "/databases/postgresql",
    permanent: true,
  },
  {
    source: "/guides/mysql",
    destination: "/databases/mysql",
    permanent: true,
  },
  {
    source: "/guides/redis",
    destination: "/databases/redis",
    permanent: true,
  },
  {
    source: "/guides/mongodb",
    destination: "/databases/mongodb",
    permanent: true,
  },
  {
    source: "/guides/database-view",
    destination: "/databases/database-view",
    permanent: true,
  },
  {
    source: "/reference/databases",
    destination: "/databases/reference",
    permanent: true,
  },
  {
    source: "/guides/volumes",
    destination: "/volumes",
    permanent: true,
  },
  {
    source: "/reference/volumes",
    destination: "/volumes/reference",
    permanent: true,
  },
  {
    source: "/reference/backups",
    destination: "/volumes/backups",
    permanent: true,
  },
  {
    source: "/guides/storage-buckets",
    destination: "/storage-buckets",
    permanent: true,
  },
  {
    source: "/reference/outbound-networking",
    destination: "/networking/outbound-networking",
    permanent: true,
  },
  {
    source: "/reference/static-outbound-ips",
    destination: "/networking/static-outbound-ips",
    permanent: true,
  },
  {
    source: "/reference/edge-networking",
    destination: "/networking/edge-networking",
    permanent: true,
  },
  {
    source: "/reference/network-diagnostics",
    destination: "/networking/network-diagnostics",
    permanent: true,
  },
  {
    source: "/guides/troubleshooting-ssl",
    destination: "/networking/troubleshooting-ssl",
    permanent: true,
  },
  {
    source: "/guides/observability",
    destination: "/observability",
    permanent: true,
  },
  {
    source: "/guides/config-as-code",
    destination: "/config-as-code",
    permanent: true,
  },
  {
    source: "/reference/config-as-code",
    destination: "/config-as-code/reference",
    permanent: true,
  },
  {
    source: "/guides/manage-projects",
    destination: "/public-api/manage-projects",
    permanent: true,
  },
  {
    source: "/guides/manage-services",
    destination: "/public-api/manage-services",
    permanent: true,
  },
  {
    source: "/guides/manage-deployments",
    destination: "/public-api/manage-deployments",
    permanent: true,
  },
  {
    source: "/guides/manage-variables",
    destination: "/public-api/manage-variables",
    permanent: true,
  },
  {
    source: "/reference/errors",
    destination: "/troubleshooting",
    permanent: true,
  },
  {
    source: "/reference/errors/application-failed-to-respond",
    destination: "/troubleshooting/application-failed-to-respond",
    permanent: true,
  },
  {
    source: "/reference/errors/no-start-command-could-be-found",
    destination: "/troubleshooting/no-start-command-could-be-found",
    permanent: true,
  },
  {
    source: "/reference/errors/405-method-not-allowed",
    destination: "/troubleshooting/405-method-not-allowed",
    permanent: true,
  },
  {
    source: "/reference/errors/nixpacks-was-unable-to-generate-a-build-plan",
    destination: "/troubleshooting/nixpacks-was-unable-to-generate-a-build-plan",
    permanent: true,
  },
  {
    source: "/reference/errors/enotfound-redis-railway-internal",
    destination: "/troubleshooting/enotfound-redis-railway-internal",
    permanent: true,
  },
  {
    source: "/guides/nodejs-sigterm",
    destination: "/troubleshooting/nodejs-sigterm",
    permanent: true,
  },
  {
    source: "/guides/deploy",
    destination: "/templates/deploy",
    permanent: true,
  },
  {
    source: "/guides/create",
    destination: "/templates/create",
    permanent: true,
  },
  {
    source: "/guides/templates-best-practices",
    destination: "/templates/best-practices",
    permanent: true,
  },
  {
    source: "/guides/publish-and-share",
    destination: "/templates/publish-and-share",
    permanent: true,
  },
  {
    source: "/tutorials/getting-started",
    destination: "/guides/getting-started",
    permanent: true,
  },
  {
    source: "/tutorials/set-up-a-datadog-agent",
    destination: "/guides/set-up-a-datadog-agent",
    permanent: true,
  },
  {
    source: "/tutorials/deploy-an-otel-collector-stack",
    destination: "/guides/deploy-an-otel-collector-stack",
    permanent: true,
  },
  {
    source: "/tutorials/add-a-cdn-using-cloudfront",
    destination: "/guides/add-a-cdn-using-cloudfront",
    permanent: true,
  },
  {
    source: "/tutorials/deploying-a-monorepo",
    destination: "/guides/deploying-a-monorepo",
    permanent: true,
  },
  {
    source: "/tutorials/set-up-a-tailscale-subnet-router",
    destination: "/guides/set-up-a-tailscale-subnet-router",
    permanent: true,
  },
  {
    source: "/tutorials/bridge-railway-to-rds-with-tailscale",
    destination: "/guides/bridge-railway-to-rds-with-tailscale",
    permanent: true,
  },
  {
    source: "/tutorials/github-actions-post-deploy",
    destination: "/guides/github-actions-post-deploy",
    permanent: true,
  },
  {
    source: "/tutorials/github-actions-pr-environment",
    destination: "/guides/github-actions-pr-environment",
    permanent: true,
  },
  {
    source: "/tutorials/github-actions-runners",
    destination: "/guides/github-actions-runners",
    permanent: true,
  },
  {
    source: "/guides/projects",
    destination: "/projects",
    permanent: true,
  },
  {
    source: "/reference/projects",
    destination: "/projects",
    permanent: true,
  },
  {
    source: "/guides/services",
    destination: "/services",
    permanent: true,
  },
  {
    source: "/reference/services",
    destination: "/services",
    permanent: true,
  },
  {
    source: "/guides/healthchecks",
    destination: "/deployments/healthchecks",
    permanent: true,
  },
  {
    source: "/reference/healthchecks",
    destination: "/deployments/healthchecks",
    permanent: true,
  },
  {
    source: "/reference/deployment-regions",
    destination: "/deployments/regions",
    permanent: true,
  },
  {
    source: "/reference/regions",
    destination: "/deployments/regions",
    permanent: true,
  },
  {
    source: "/guides/dockerfiles",
    destination: "/builds/dockerfiles",
    permanent: true,
  },
  {
    source: "/reference/dockerfiles",
    destination: "/builds/dockerfiles",
    permanent: true,
  },
  {
    source: "/guides/cron-jobs",
    destination: "/cron-jobs",
    permanent: true,
  },
  {
    source: "/reference/cron-jobs",
    destination: "/cron-jobs",
    permanent: true,
  },
  {
    source: "/guides/public-networking",
    destination: "/networking/public-networking",
    permanent: true,
  },
  {
    source: "/reference/public-networking",
    destination: "/networking/public-networking",
    permanent: true,
  },
  {
    source: "/public-networking",
    destination: "/networking/public-networking",
    permanent: true,
  },
  {
    source: "/public-networking/:slug*",
    destination: "/networking/public-networking/:slug*",
    permanent: true,
  },
  {
    source: "/reference/public-domains",
    destination: "/networking/domains",
    permanent: true,
  },
  {
    source: "/reference/tcp-proxy",
    destination: "/networking/tcp-proxy",
    permanent: true,
  },
  {
    source: "/guides/private-networking",
    destination: "/networking/private-networking",
    permanent: true,
  },
  {
    source: "/reference/private-networking",
    destination: "/networking/private-networking",
    permanent: true,
  },
  {
    source: "/private-networking",
    destination: "/networking/private-networking",
    permanent: true,
  },
  {
    source: "/private-networking/:slug*",
    destination: "/networking/private-networking/:slug*",
    permanent: true,
  },
  {
    source: "/guides/logs",
    destination: "/observability/logs",
    permanent: true,
  },
  {
    source: "/reference/logging",
    destination: "/observability/logs",
    permanent: true,
  },
  {
    source: "/guides/metrics",
    destination: "/observability/metrics",
    permanent: true,
  },
  {
    source: "/reference/metrics",
    destination: "/observability/metrics",
    permanent: true,
  },
  {
    source: "/guides/webhooks",
    destination: "/observability/webhooks",
    permanent: true,
  },
  {
    source: "/reference/webhooks",
    destination: "/observability/webhooks",
    permanent: true,
  },
  {
    source: "/guides/environments",
    destination: "/environments",
    permanent: true,
  },
  {
    source: "/reference/environments",
    destination: "/environments",
    permanent: true,
  },
  {
    source: "/guides/public-api",
    destination: "/public-api",
    permanent: true,
  },
  {
    source: "/reference/public-api",
    destination: "/public-api",
    permanent: true,
  },
  {
    source: "/guides/templates",
    destination: "/templates",
    permanent: true,
  },
  {
    source: "/reference/templates",
    destination: "/templates",
    permanent: true,
  },
  {
    source: "/reference/priority-boarding",
    destination: "/platform/priority-boarding",
    permanent: true,
  },
  {
    source: "/guides/join-priority-boarding",
    destination: "/platform/priority-boarding",
    permanent: true,
  },
  {
    source: "/guides/optimize-usage",
    destination: "/pricing/cost-control",
    permanent: true,
  },
  {
    source: "/reference/usage-limits",
    destination: "/pricing/cost-control",
    permanent: true,
  },
  {
    source: "/guides/cli",
    destination: "/cli",
    permanent: true,
  },
  {
    source: "/reference/cli-api",
    destination: "/cli",
    permanent: true,
  },
  {
    source: "/migration/migrate-from-heroku",
    destination: "/platform/migrate-from-heroku",
    permanent: true,
  },
  {
    source: "/migration/migrate-from-render",
    destination: "/platform/migrate-from-render",
    permanent: true,
  },
  {
    source: "/migration/migrate-from-fly",
    destination: "/platform/migrate-from-fly",
    permanent: true,
  },
  {
    source: "/migration/migrate-from-vercel",
    destination: "/platform/migrate-from-vercel",
    permanent: true,
  },
  {
    source: "/migration/migrate-from-digitalocean",
    destination: "/platform/migrate-from-digitalocean",
    permanent: true,
  },
  {
    source: "/guides/foundations",
    destination: "/overview/the-basics",
    permanent: true,
  },
  {
    source: "/guides/networking",
    destination: "/networking",
    permanent: true,
  },
  {
    source: "/guides/monitoring",
    destination: "/observability",
    permanent: true,
  },
  {
    source: "/guides/deployments",
    destination: "/deployments",
    permanent: true,
  },
  {
    source: "/guides/healthchecks-and-restarts",
    destination: "/deployments/healthchecks",
    permanent: true,
  },
  {
    source: "/reference/migrate-to-railway-metal",
    destination: "/",
    permanent: true,
  },
  {
    source: "/guides/variables",
    destination: "/variables",
    permanent: true,
  },
  // Serverless redirect (previously app-sleeping)
  {
    source: "/deployments/app-sleeping",
    destination: "/deployments/serverless",
    permanent: true,
  },
  {
    source: "/reference/integrations",
    destination: "/public-api",
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
