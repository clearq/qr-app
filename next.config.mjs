/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.clearq.se']
  },
};

export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.clearq.se',
//         pathname: '/api/Content/**',
//       },
//     ],
//   },
// };

// export default nextConfig;