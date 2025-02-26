import { useCallback } from 'react'

export interface Toast {
  id?: string
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'destructive'
  duration?: number
}

export function useToast() {
  const toast = useCallback((options: Toast) => {
    // Implementation will be added later with a proper toast context
    console.log('Toast:', options)
  }, [])

  return {
    toast,
  }
}
