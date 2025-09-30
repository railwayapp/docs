const { withContentlayer } = require("next-contentlayer");
const { redirects } = require("./redirects");

/** @type {import('next').NextConfig} */
const nextConfig = withContentlayer({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'railway.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'devicons.railway.com' },
    ],
  },
  async redirects() {
    return redirects;
  },
});

module.exports = nextConfig;
