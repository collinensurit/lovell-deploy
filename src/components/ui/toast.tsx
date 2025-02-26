'use client'

import * as React from 'react'
import { cn } from '@/lib-new/utils'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
  onClose?: () => void
  visible?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      title,
      description,
      action,
      variant = 'default',
      onClose,
      visible = true,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        onClose?.()
      }, 5000)

      return () => clearTimeout(timer)
    }, [onClose])

    if (!visible) return null

    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-start gap-4 rounded-lg border p-4 shadow-lg transition-all',
          variant === 'default' &&
            'border-[var(--vscode-notifications-border)] bg-[var(--vscode-notifications-background)]',
          variant === 'destructive' &&
            'bg-[var(--vscode-notificationsErrorIcon-foreground)] text-white',
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {action && <div className="flex shrink-0">{action}</div>}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-[var(--vscode-notifications-foreground)] opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--vscode-focusBorder)]"
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'

export interface ToasterProps {
  children?: React.ReactNode
}

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        {...props}
      >
        {children}
      </div>
    )
  }
)
Toaster.displayName = 'Toaster'

export { Toast, Toaster }
