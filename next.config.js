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
  // Use fully dynamic mode for Vercel
  output: 'standalone',
  // Disable static image optimization
  images: {
    unoptimized: true
  },
  // Disable all experimental features that might cause issues
  experimental: {
    // Disable CSS optimization which requires critters
    optimizeCss: false,
    // Don't optimize loading for SSR
    disableOptimizedLoading: true,
  },
  // Completely disable static generation
  staticPageGenerationTimeout: 0,
  // Enable React strict mode
  reactStrictMode: true,
  // Provide fallback environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    REDIS_MOCK: 'true'
  }
}
