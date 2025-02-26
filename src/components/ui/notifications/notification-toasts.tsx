'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cva } from 'class-variance-authority'

import { notifications, type Notification } from '@/lib-new/utils/notification'
import { cn } from '@/lib-new/utils/cn'

const toastVariants = cva(
  "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg",
  {
    variants: {
      variant: {
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-50",
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-50",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

/**
 * Map notification types to toast variants
 */
const variantMap: Record<Notification['type'], any> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
}

/**
 * Individual notification toast component
 */
function NotificationToast({ notification }: { notification: Notification }) {
  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-4 py-2"
    >
      <div className={cn(toastVariants({ variant: variantMap[notification.type] }))}>
        <div className="flex flex-col space-y-1">
          {notification.title && <h4 className="font-medium">{notification.title}</h4>}
          <p className="text-sm">{notification.message}</p>
        </div>
        <button
          onClick={() => notifications.remove(notification.id)}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Notification toasts container that displays all active notifications
 */
export function NotificationToasts() {
  const [activeNotifications, setActiveNotifications] = React.useState<Notification[]>([])
  
  React.useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notifications.subscribe(updatedNotifications => {
      setActiveNotifications(updatedNotifications)
    })
    
    // Cleanup subscription on unmount
    return unsubscribe
  }, [])
  
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]">
      <AnimatePresence>
        {activeNotifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  )
}
