const { withContentCollections } = require("@content-collections/next");
const { redirects } = require("./redirects");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/api/llms.txt" },
      { source: "/llms-full.txt", destination: "/api/llms-full.txt" },
    ];
  },
};

module.exports = withContentCollections(nextConfig);
