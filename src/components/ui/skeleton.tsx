import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'default' | 'circle' | 'rounded'
}

export function Skeleton({
  className,
  variant = 'default',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variant === 'default' && 'h-4 w-full',
        variant === 'circle' && 'h-8 w-8 rounded-full',
        variant === 'rounded' && 'h-4 w-full rounded-md',
        className
      )}
      {...props}
    />
  )
}
