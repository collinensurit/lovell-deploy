#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_DIR = path.join(__dirname, '..', 'src', 'app', 'api');

// Template for static API routes
const staticRouteTemplate = `import { NextResponse } from 'next/server'

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

// Function to recursively process directories
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      console.log(`Processing API route: ${fullPath}`);
      
      // Read the file
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if it uses force-dynamic
      if (content.includes("dynamic = 'force-dynamic'") || content.includes('dynamic = "force-dynamic"')) {
        console.log(`- Converting to static route: ${fullPath}`);
        fs.writeFileSync(fullPath, staticRouteTemplate);
      }
    }
  }
}

console.log('Generating static API routes for Vercel deployment...');
processDirectory(API_DIR);
console.log('Done generating static API routes!');
