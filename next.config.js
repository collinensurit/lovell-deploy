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
  // Disable SWC minification
  swcMinify: false,
  // Use standalone output for better compatibility with Vercel
  output: 'standalone',
  // Disable static image optimization
  images: {
    unoptimized: true
  },
  // Experimental features
  experimental: {
    disableOptimizedLoading: true,
    optimizeCss: false,
  },
  // Disable static generation
  staticPageGenerationTimeout: 1000,
  trailingSlash: true,
  // Always use development mode for server
  reactStrictMode: false,
  // Provide fallback environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    REDIS_MOCK: 'true'
  }
}
