'use client'

import React from 'react'
import cn from 'classnames'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  animation = 'pulse',
  width,
  height,
}) => {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        {
          'rounded-full': variant === 'circular',
          'rounded-md': variant === 'rectangular',
          rounded: variant === 'text',
          'animate-pulse': animation === 'pulse',
          'animate-wave': animation === 'wave',
        },
        className
      )}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  )
}

// Convenience components
export const TextSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (
  props
) => <Skeleton variant="text" {...props} />

export const CircularSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (
  props
) => <Skeleton variant="circular" {...props} />

export const RectangularSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (
  props
) => <Skeleton variant="rectangular" {...props} />
