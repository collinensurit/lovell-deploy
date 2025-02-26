import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware ensures dynamic rendering
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Force dynamic rendering by adding a unique header or query param
  // This prevents static generation problems with client-side state
  response.headers.set('x-middleware-cache', 'no-cache')
  
  return response
}

// Configure all routes to use this middleware
export const config = {
  matcher: [
    // Apply to all routes except API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
