const { redirects } = require("./redirects");

// Auto-exclude every redirect source from the sitemap so search engines only
// index the canonical destination. Wildcard patterns (containing ":") are
// skipped because they don't map to concrete pages.
const redirectSources = redirects
  .map((r) => r.source)
  .filter((s) => !s.includes(":"));

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL || "https://docs.railway.com",
  generateRobotsTxt: true,
  autoLastmod: false,
  exclude: redirectSources,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/" },
    ],
  },
  // additionalPaths is a top-level next-sitemap option taking sitemap fields
  // ({ loc, ... }); nested inside robotsTxtOptions (with `route` keys) it was
  // silently ignored and llms.txt never reached the sitemap.
  additionalPaths: async () => [
    { loc: "/llms.txt", changefreq: "daily", priority: 0.9 },
    { loc: "/llms-full.txt", changefreq: "daily", priority: 0.9 },
  ],
};
