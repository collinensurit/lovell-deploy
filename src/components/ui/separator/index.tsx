'use client'

import React from 'react'
import cn from 'classnames'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className,
}) => {
  return (
    <div
      role="separator"
      className={cn(
        'shrink-0 bg-gray-200 dark:bg-gray-700',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
    />
  )
}
