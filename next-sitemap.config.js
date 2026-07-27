module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL || "https://docs.railway.com",
  generateRobotsTxt: true,
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
