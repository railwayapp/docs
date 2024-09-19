const { withContentlayer } = require("next-contentlayer");
const redirects = require("./redirects");

/** @type {import('next').NextConfig} */
const nextConfig = withContentlayer({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
      { protocol: 'https', hostname: 'railway.app' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'devicons.railway.app' },
    ],
  },
  async redirects() {
    return redirects;
  },
});

module.exports = nextConfig;
