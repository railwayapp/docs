const { withContentlayer } = require("next-contentlayer");
const redirects = require("./redirects"); 

/** @type {import('next').NextConfig} */
const nextConfig = withContentlayer({
  reactStrictMode: true,
  images: {
    domains: [
      "user-images.githubusercontent.com",
      "railway.app",
      "res.cloudinary.com",
      "devicons.railway.app",
    ],
  },
  async redirects() {
    return redirects;
  },
  async rewrites() {
    return [
      {
        source: '/metrics',
        destination: '/api/metrics'
      },
    ]
  },
});

module.exports = nextConfig;
