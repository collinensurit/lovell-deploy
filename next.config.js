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
  // Use standalone output for better compatibility with Vercel
  output: 'standalone',
  // Disable static image optimization to avoid build issues
  images: {
    unoptimized: true
  },
  // Experimental features
  experimental: {
    // These options can help with performance or cause issues, adjust as needed
    disableOptimizedLoading: false,
    optimizeCss: true,
  },
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Provide fallback environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    REDIS_MOCK: 'true'
  }
}
