'use client'

import * as React from 'react'
import { cn } from '@/lib-new/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  htmlFor: string
}

export function Label({ className, children, htmlFor, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
