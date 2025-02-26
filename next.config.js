/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for Vercel deployment
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Disable features incompatible with static export
  experimental: {
    // Disable app directory RSC streaming
    appDocumentPreloading: false,
    // Disable any other experimental features
    serverActions: false
  },

  // Modify webpack config to handle specific issues
  webpack: (config) => {
    // Return the modified config
    return config;
  },

  // Disable strict mode for development
  reactStrictMode: false,

  // Add redirects if needed
  async redirects() {
    return [];
  },
  
  // Disable any unused features
  swcMinify: true,
  poweredByHeader: false,
}

module.exports = nextConfig
