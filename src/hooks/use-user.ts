'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserContextType } from '@/lib/types'

export function useUser(): UserContextType {
  const [state, setState] = useState<UserContextType>({
    user: null,
    loading: true,
  })

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setState({ user, loading: false })
      } catch (error) {
        setState({ user: null, loading: false, error: error as Error })
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState({ user: session?.user ?? null, loading: false })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return state
}
