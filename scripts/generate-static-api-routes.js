#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Base app directory and route paths to check
const APP_DIR = path.join(__dirname, '..', 'src', 'app');
const API_DIR = path.join(APP_DIR, 'api');
const AUTH_DIR = path.join(APP_DIR, '(auth)');

// Template for static API routes
const staticApiTemplate = `import { NextResponse } from 'next/server'

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
`;

// Template for auth callback route
const staticAuthCallbackTemplate = `import { NextResponse } from 'next/server'

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
    return NextResponse.redirect(\`\${baseUrl}/dashboard\`)
  } catch (error) {
    console.error('Auth callback error:', error)
    
    // Get the current URL to form a base for redirects
    const baseUrl = new URL(request.url).origin
    
    return NextResponse.redirect(\`\${baseUrl}/login\`)
  }
}
`;

// Function to recursively process directories
function processDirectory(dirPath, isAuthDir = false) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath, isAuthDir || entry.name === 'callback');
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      console.log(`Processing route: ${fullPath}`);
      
      // Read the file
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if it uses force-dynamic
      if (content.includes("dynamic = 'force-dynamic'") || content.includes('dynamic = "force-dynamic"')) {
        console.log(`- Converting to static route: ${fullPath}`);
        
        // Special handling for auth callback
        if (isAuthDir && fullPath.includes('callback')) {
          fs.writeFileSync(fullPath, staticAuthCallbackTemplate);
        } else {
          fs.writeFileSync(fullPath, staticApiTemplate);
        }
      }
    }
  }
}

console.log('Generating static routes for Vercel deployment...');
processDirectory(API_DIR);
processDirectory(AUTH_DIR, true);
console.log('Done generating static routes!');
