const { withContentlayer } = require("next-contentlayer");

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
    return [
      {
        source: "/reference/s",
        destination: "/reference/templates",
        permanent: true,
      },
      {
        source: "/develop/variables",
        destination: "/guides/variables",
        permanent: true,
      },
    ];
  },
});

module.exports = nextConfig;
