import { NextResponse } from 'next/server'

// Using static mode for static export compatibility
export const dynamic = 'force-static' 

export async function GET() {
  // In static export, we can't use request.url
  // Return a static response instead
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Static auth API response - in static export mode, dynamic auth features are not available'
  })
}
