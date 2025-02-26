'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { User } from '@/lib/types/user'

/**
 * Get a Supabase client for server components
 * 
 * @returns A Supabase client configured with cookies
 */
export async function getSupabaseServerClient() {
  const cookieStore = cookies()
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

/**
 * Get the current authenticated user for server actions
 * 
 * @returns The authenticated user or null
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  
  if (!data.user) {
    return null
  }
  
  // Get additional user data from the database if needed
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()
  
  if (!userData) {
    return null
  }
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: userData.name,
    avatar: userData.avatar,
    settings: userData.settings,
  }
}

/**
 * Require an authenticated user or redirect to login
 * 
 * @param redirectTo - URL to redirect to if not authenticated
 * @returns The authenticated user
 */
export async function requireUser(redirectTo = '/login'): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(redirectTo)
  }
  
  return user
}
