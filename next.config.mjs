/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.clearq.se'],
  },
  webpack(config) {
    // Add SVGR loader to handle SVG files as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
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