const { redirects } = require("./redirects");
const { lastModifiedForUrl } = require("./git-last-modified");

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
  // Per-page <lastmod> from git history (autoLastmod would stamp every URL
  // with the build time, which tells crawlers nothing).
  transform: async (config, path) => {
    const lastmod = lastModifiedForUrl(path);
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      ...(lastmod && { lastmod }),
    };
  },
  robotsTxtOptions: {
    additionalSitemaps: [],
    // Content Signals (https://contentsignals.org): one AI policy across every
    // Railway property — index us, retrieve us at answer time, train on us.
    // Injected inside the single `User-agent: *` group next-sitemap emits.
    transformRobotsTxt: async (_config, robotsTxt) =>
      robotsTxt.replace(
        "User-agent: *\n",
        "User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n",
      ),
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
