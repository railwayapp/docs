module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_RAILWAY_DOCS_URL || "https://docs.railway.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/" },
    ],
    additionalPaths: async () => [
      { route: "/llms.txt", changefreq: "daily", priority: 0.9 },
      { route: "/llms-full.txt", changefreq: "daily", priority: 0.9 },
    ],
  },
};
