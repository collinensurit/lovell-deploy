import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Use mock Redis during build time to prevent connection errors
const isMockMode = process.env.REDIS_MOCK === 'true'

// Create a dummy implementation for build time
class MockRatelimit {
  async limit(identifier: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 10000,
    };
  }
}

let redis: Redis;
let rateLimiter: Ratelimit | MockRatelimit;

if (isMockMode) {
  console.log('Using mock rate limiter for build');
  rateLimiter = new MockRatelimit();
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  });

  // Create a new ratelimiter that allows 10 requests per 10 seconds
  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
  });
}

// Export the rate limiter instance
export { rateLimiter };

interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  success: boolean
}

export interface RateLimitOptions {
  identifier?: (req: NextRequest) => string
  onRateLimit?: (req: NextRequest) => Promise<NextResponse>
}

const defaultIdentifier = (req: NextRequest) => {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous'
  return `${ip}:${req.method}:${req.nextUrl.pathname}`
}

const defaultOnRateLimit = async (req: NextRequest) => {
  const info = await getRateLimitInfo(defaultIdentifier(req))

  return NextResponse.json(
    {
      error: 'Too many requests',
      retryAfter: Math.ceil(info.reset / 1000),
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(info.reset / 1000)),
      },
    }
  )
}

export async function getRateLimitInfo(key: string) {
  const result = await checkRateLimit(key)
  return {
    remaining: result.remaining,
    reset: result.reset,
    limit: result.limit,
  }
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function checkRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  try {
    const result = await rateLimiter.limit(identifier)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset, // Already a number in milliseconds
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    return {
      success: false,
      limit: 10,
      remaining: 0,
      reset: 0,
    }
  }
}

export function createRateLimitedRoute(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions = {}
) {
  return async function rateLimitedHandler(req: NextRequest) {
    const identifier = (options.identifier || defaultIdentifier)(req)
    const result = await checkRateLimit(identifier)

    if (!result.success) {
      return (options.onRateLimit || defaultOnRateLimit)(req)
    }

    return handler(req)
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string = 'Too many requests',
    public readonly reset: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export async function enforceRateLimit(identifier: string): Promise<void> {
  const result = await checkRateLimit(identifier)

  if (!result.success) {
    throw new RateLimitError('Too many requests', result.reset)
  }
}
