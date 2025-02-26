import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

interface RateLimitOptions {
  limit: number
  window: number // in seconds
}

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  const { limit, window } = options

  // Get the current count
  const count = await redis.incr(key)

  // Set expiry on first request
  if (count === 1) {
    await redis.expire(key, window)
  }

  // Get remaining time
  const ttl = await redis.ttl(key)

  return {
    success: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    reset: Date.now() + ttl * 1000,
  }
}

export default redis
