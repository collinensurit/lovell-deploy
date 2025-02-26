import { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

interface RateLimitConfig {
  limit?: number
  window?: number // in seconds
}

export function createRateLimitedRoute(
  handler: (req: NextRequest) => Promise<Response>,
  config: RateLimitConfig = {}
) {
  const { limit = 10, window = 60 } = config

  return async function rateLimitedHandler(
    req: NextRequest
  ): Promise<Response> {
    try {
      const ip = req.ip || 'anonymous'
      const key = `rate-limit:${ip}`

      // Get the current count
      const count = await redis.incr(key)

      // Set expiry on first request
      if (count === 1) {
        await redis.expire(key, window)
      }

      // Set rate limit headers
      const headers = new Headers()
      headers.set('X-RateLimit-Limit', limit.toString())
      headers.set(
        'X-RateLimit-Remaining',
        Math.max(0, limit - count).toString()
      )

      // Check if over limit
      if (count > limit) {
        return new Response('Too Many Requests', {
          status: 429,
          headers,
        })
      }

      // Call the original handler
      const response = await handler(req)

      // Copy the rate limit headers to the response
      const newHeaders = new Headers(response.headers)
      headers.forEach((value, key) => {
        newHeaders.set(key, value)
      })

      // Return new response with headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      })
    } catch (error) {
      console.error('Rate limit error:', error)
      return handler(req)
    }
  }
}
