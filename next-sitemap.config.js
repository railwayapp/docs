const RAILWAY_STATIC_URL = process.env.RAILWAY_STATIC_URL;
module.exports = {
  siteUrl:
    // If we're on the prod environment, remap to the linked domain,
    // otherwise use the provided static URL.
    RAILWAY_STATIC_URL === "railway-docs-production.up.railway.app"
      ? "https://docs.railway.app/"
      : `https://${RAILWAY_STATIC_URL}`,
  generateRobotsTxt: true,
};
