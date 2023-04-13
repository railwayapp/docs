const RAILWAY_STATIC_URL = process.env.RAILWAY_STATIC_URL;
module.exports = {
  siteUrl: RAILWAY_STATIC_URL
    ? `https://${RAILWAY_STATIC_URL}`
    : "https://docs.railway.app/",
  generateRobotsTxt: true,
};
