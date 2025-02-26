/** @type {import('next').NextConfig} */
module.exports = {
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Static export mode (no server)
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  // Disable all experimental features
  experimental: {
    // Disable CSS optimization which requires critters
    optimizeCss: false,
  },
  // Enable React strict mode
  reactStrictMode: true,
  // No trailing slashes in URLs
  trailingSlash: false,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Provide fallback environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    REDIS_MOCK: 'true'
  }
}
