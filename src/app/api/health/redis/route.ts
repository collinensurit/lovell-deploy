import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const pong = await redis.ping()
    return NextResponse.json({ status: 'ok', pong }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Redis connection failed',
      },
      { status: 500 }
    )
  }
}
