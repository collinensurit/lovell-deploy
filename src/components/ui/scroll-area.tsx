'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical' | 'both'
  className?: string
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          orientation === 'horizontal' && 'overflow-x-auto',
          orientation === 'vertical' && 'overflow-y-auto',
          orientation === 'both' && 'overflow-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ orientation = 'vertical', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex touch-none select-none transition-colors',
          orientation === 'horizontal'
            ? 'h-2.5 border-t border-transparent p-[1px]'
            : 'w-2.5 border-l border-transparent p-[1px]',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'relative flex-1 rounded-full bg-border',
            orientation === 'horizontal' ? 'h-1.5' : 'w-1.5'
          )}
        />
      </div>
    )
  }
)

ScrollBar.displayName = 'ScrollBar'
