import { NextResponse } from 'next/server'

// Use static mode for compatibility with static export
export const dynamic = 'force-static'

export async function GET(request: Request) {
  try {
    // In static export mode, we can't exchange code for session
    // This is a mock implementation that redirects to the dashboard
    console.log('Static auth callback - redirecting to dashboard')
    
    // Get the current URL to form a base for redirects
    const baseUrl = new URL(request.url).origin
    
    // In a real deployment, this would handle the auth code
    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (error) {
    console.error('Auth callback error:', error)
    
    // Get the current URL to form a base for redirects
    const baseUrl = new URL(request.url).origin
    
    return NextResponse.redirect(`${baseUrl}/login`)
  }
}
