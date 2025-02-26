import { NextRequest, NextResponse } from 'next/server'
import { createRateLimitedRoute } from '@/lib/rate-limit'

export const GET = createRateLimitedRoute(async (request: NextRequest) => {
  const url = new URL(request.url)
  return NextResponse.json({ status: 'ok', url: url.toString() })
})
