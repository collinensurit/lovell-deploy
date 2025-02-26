import Redis from 'ioredis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import MockRedis from './services/redis-mock'

// Use mock Redis during build time to prevent connection errors
const isMockMode = process.env.REDIS_MOCK === 'true'
let redisClient: Redis | MockRedis

if (isMockMode) {
  console.log('Using mock Redis client for build')
  redisClient = new MockRedis() as any
} else {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
}

// Create rate limiter instance
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient as any,
  keyPrefix: 'ratelimit',
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
})

export const redis = redisClient

export async function checkRateLimit(key: string): Promise<boolean> {
  try {
    await rateLimiter.consume(key)
    return true
  } catch (error) {
    return false
  }
}

export async function getRateLimitInfo(key: string) {
  try {
    const res = await rateLimiter.get(key)
    return {
      remainingPoints: res?.remainingPoints ?? 0,
      msBeforeNext: res?.msBeforeNext ?? 0,
    }
  } catch (error) {
    return {
      remainingPoints: 0,
      msBeforeNext: 0,
    }
  }
}
