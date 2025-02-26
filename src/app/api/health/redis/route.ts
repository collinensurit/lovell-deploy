import { NextResponse } from 'next/server'

// Using static mode for export compatibility
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({
    message: 'Static mock data: In static export mode, dynamic API routes are not available.'
  })
}

export async function POST() {
  return NextResponse.json({
    success: false,
    message: 'Static mock response: This API is not available in static export mode.'
  }, { status: 200 })
}
