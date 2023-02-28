// import withPlugins from "next-compose-plugins";
// import withMdxEnhanced from "next-mdx-enhanced";
// import remarkAutolinkHeadings from "remark-autolink-headings";
// import remarkSlug from "remark-slug";

// export default withPlugins([
//   withMdxEnhanced({
//     layoutPath: "src/mdxLayouts",
//     defaultLayout: true,
//     fileExtensions: ["mdx", "md"],
//     remarkPlugins: [remarkAutolinkHeadings, remarkSlug],
//     rehypePlugins: [],
//     extendFrontMatter: {
//       process: (mdxContent, frontMatter) => {
//         return {
//           id: makeIdFromPath(frontMatter.__resourcePath),
//           wordCount: mdxContent.split(/\s+/g).length,
//         };
//       },
//     },
//   })({
//     images: {
//       domains: [
//         "user-images.githubusercontent.com",
//         "railway.app",
//         "res.cloudinary.com",
//         "devicons.railway.app",
//       ],
//     },
//     async redirects() {
//       return [
//         {
//           source: "/reference/s",
//           destination: "/reference/templates",
//           permanent: true,
//         },
//       ];
//     },
//   }),
// ]);

// function makeIdFromPath(resourcePath) {
//   return resourcePath.replace(".mdx", "").replace("/index", "");
// }
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
