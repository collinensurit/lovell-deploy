'use client'

import React from 'react'
import { useToast } from '@/hooks-new/use-toast'

export interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function Toaster({ position = 'bottom-right' }: ToasterProps) {
  const { toasts } = useToast()

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 p-4 ${
        position.includes('top') ? 'top-0' : 'bottom-0'
      } ${position.includes('right') ? 'right-0' : 'left-0'}`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 ${
            toast.type === 'error' ? 'border-red-500' : 'border-gray-200'
          }`}
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-1">
              {toast.title && (
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {toast.title}
                </h3>
              )}
              {toast.message && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => toast.onDismiss?.()}
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
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
          </div>
        </div>
      ))}
    </div>
  )
}
