import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000',
]
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100')
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '60000'
)

// Security headers following OWASP recommendations
const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:;",
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
}

// Rate limiting using a simple token bucket algorithm
const ipBuckets = new Map<string, { tokens: number; lastRefill: number }>()

const refillBucket = (bucket: { tokens: number; lastRefill: number }) => {
  const now = Date.now()
  const timePassed = now - bucket.lastRefill
  const tokensToAdd =
    Math.floor(timePassed / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_MAX

  bucket.tokens = Math.min(RATE_LIMIT_MAX, bucket.tokens + tokensToAdd)
  bucket.lastRefill = now

  return bucket.tokens > 0
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Handle CORS
  const origin = request.headers.get('origin')
  if (origin && CORS_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
  }

  // Rate limiting
  const ip = request.ip || 'unknown'
  let bucket = ipBuckets.get(ip)

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_MAX, lastRefill: Date.now() }
    ipBuckets.set(ip, bucket)
  } else if (!refillBucket(bucket)) {
    return new NextResponse(null, {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Retry-After': '60',
        'Content-Type': 'application/json',
      },
    })
  }

  bucket.tokens--

  return response
}

export const config = {
  matcher: '/api/:path*',
}
