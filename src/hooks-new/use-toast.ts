'use client'

import { useState, useCallback } from 'react'

/**
 * Represents a toast notification
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Title of the toast */
  title?: string;
  /** Content message of the toast */
  message?: string;
  /** Alternative description field (for compatibility) */
  description?: string;
  /** Type/variant of the toast */
  type?: 'success' | 'error' | 'info' | 'warning';
  /** Alternative variant field (for compatibility) */
  variant?: 'default' | 'destructive';
  /** Duration in milliseconds before auto-dismissing (0 for no auto-dismiss) */
  duration?: number;
  /** Optional action for the toast */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback executed when toast is dismissed */
  onDismiss?: () => void;
}

let toastIdCounter = 0

/**
 * Hook for managing toast notifications
 * 
 * @returns Methods for creating and managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((options: Omit<Toast, 'id'>) => {
    const toastId = String(toastIdCounter++)
    const newToast = { ...options, id: toastId }

    setToasts((prev) => [...prev, newToast])

    if (options.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId))
        options.onDismiss?.()
      }, options.duration || 5000)
    }

    return toastId
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }, [])

  return { 
    toast, 
    dismiss, 
    toasts 
  }
}
