// Static version of session utilities for static export
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
