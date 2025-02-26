import { NextRequest, NextResponse } from 'next/server'
import { logging } from '@/lib/utils/logging'
import { nanoid } from 'nanoid'

interface MonitoringError extends Error {
  requestId?: string
}

export async function middleware(request: NextRequest) {
  const requestId = nanoid()
  const start = Date.now()

  try {
    const response = await NextResponse.next()
    const duration = Date.now() - start

    logging.info('Request completed', {
      requestId,
      method: request.method,
      url: request.url,
      status: response.status,
      duration,
    })

    return response
  } catch (error) {
    const duration = Date.now() - start
    const monitoringError: MonitoringError =
      error instanceof Error ? error : new Error(String(error))
    monitoringError.requestId = requestId

    logging.error('Request failed', monitoringError, {
      method: request.method,
      url: request.url,
      duration,
    })

    return new NextResponse(
      JSON.stringify({
        error: {
          message: 'Internal Server Error',
          requestId,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export const config = {
  matcher: '/api/:path*',
}
