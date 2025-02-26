#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Server action file to modify
const SESSION_FILE = path.join(__dirname, '..', 'src', 'lib-new', 'utils', 'auth', 'session.ts');
const STATIC_SESSION_FILE = path.join(__dirname, '..', 'src', 'lib-new', 'utils', 'auth', 'static-session.ts');

// Static version content
const staticSessionContent = `// Static version of session utilities for static export
// Original file used 'use server' directive which is incompatible with static export

import { User } from '@/lib/types/user'

// Mock Supabase client for static export
const mockSupabaseClient = {
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null
    }),
    getUser: async () => ({
      data: { user: null },
      error: null
    })
  }
};

/**
 * Get a mock Supabase client for static build
 * 
 * @returns A mock Supabase client
 */
export async function getSupabaseServerClient() {
  // Return mock client for static build
  return mockSupabaseClient;
}

/**
 * Get the current authenticated user - static version
 * Always returns null in static export
 * 
 * @returns null for static export
 */
export async function getCurrentUser() {
  // In static export, we can't get the current user
  console.log('Static getCurrentUser called - returning null');
  return null;
}

/**
 * Require an authenticated user - static version
 * In static export, we can't enforce authentication
 * 
 * @param redirectTo - URL to redirect to if not authenticated
 * @returns null for static export
 */
export async function requireUser(redirectTo = '/login') {
  // In static export, we can't require a user
  console.log('Static requireUser called - returning null');
  return null;
}
`;

// Function to disable server actions
function disableServerActions() {
  console.log('Disabling server actions for static export...');
  
  // Check if the session file exists
  if (!fs.existsSync(SESSION_FILE)) {
    console.log(`Session file not found: ${SESSION_FILE}`);
    return;
  }
  
  // Create a backup of the original file
  const backupFile = `${SESSION_FILE}.bak`;
  fs.copyFileSync(SESSION_FILE, backupFile);
  console.log(`Created backup of original file: ${backupFile}`);
  
  // Create a static version of the session utilities
  fs.writeFileSync(STATIC_SESSION_FILE, staticSessionContent);
  console.log(`Created static session file: ${STATIC_SESSION_FILE}`);
  
  // Modify the original file to import and re-export from the static version
  const importContent = `// Static export version - original file used 'use server' directive
// This file now re-exports from the static version

export { getSupabaseServerClient, getCurrentUser, requireUser } from './static-session';
`;
  
  fs.writeFileSync(SESSION_FILE, importContent);
  console.log(`Updated session file to use static version`);
}

disableServerActions();
console.log('Done disabling server actions!');
