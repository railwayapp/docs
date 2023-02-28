/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

module.exports = nextConfig;
