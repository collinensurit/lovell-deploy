'use client'

import React from 'react'
import cn from 'classnames'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'info' | 'warning' | 'danger'
  className?: string
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'info',
  className,
}) => {
  if (!isOpen) return null

  const variantStyles = {
    info: 'bg-blue-500 hover:bg-blue-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    danger: 'bg-red-500 hover:bg-red-600',
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose?.()
          }
        }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 focus:outline-none"
        aria-label="Close dialog"
      />
      <div
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform',
          'z-50 w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800',
          'p-6',
          className
        )}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={onClose}
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium text-white',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              variantStyles[variant]
            )}
            onClick={() => {
              onConfirm()
              onClose()
            }}
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}
