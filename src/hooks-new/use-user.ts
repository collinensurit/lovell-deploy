'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Interface for the user hook return value
 */
export interface UserState {
  /** The current authenticated user */
  user: User | null;
  /** Whether the authentication state is still loading */
  loading: boolean;
  /** Any error that occurred during authentication */
  error: Error | null;
}

/**
 * Hook for accessing and monitoring the current authenticated user
 * 
 * @returns The current user state
 */
export function useUser(): UserState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        setUser(session?.user ?? null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get user session'))
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
