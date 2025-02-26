'use client'

import * as React from 'react'
import { cn } from '@/lib-new/utils'

interface SheetProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sheet({
  children,
  className,
  side = 'right',
  open = false,
  onOpenChange = () => {},
  ...props
}: SheetProps) {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    onOpenChange(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close sheet overlay"
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-100"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
          {
            'inset-x-0 top-0 border-b': side === 'top',
            'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm':
              side === 'right',
            'inset-x-0 bottom-0 border-t': side === 'bottom',
            'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm':
              side === 'left',
          },
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
