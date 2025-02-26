'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  message?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onDismiss?: () => void
}

let id = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const toastId = String(id++)
    const newToast = { ...toast, id: toastId }

    setToasts((prev) => [...prev, newToast])

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId))
        toast.onDismiss?.()
      }, toast.duration || 5000)
    }

    return toastId
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }, [])

  return { toast, dismiss, toasts }
}
