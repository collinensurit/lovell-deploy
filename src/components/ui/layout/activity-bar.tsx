'use client'

import * as React from 'react'
import { Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ActivityBarItem {
  icon: React.ReactNode
  label: string
  id: string
  onClick: () => void
}

interface ActivityBarProps {
  className?: string
  items: ActivityBarItem[]
  activeTool: string
  onToolSelect: (tool: string) => void
}

export function ActivityBar({
  className,
  items,
  activeTool,
  onToolSelect,
}: ActivityBarProps) {
  return (
    <div
      className={cn(
        'flex h-full w-14 flex-col items-center space-y-4 border-r bg-background px-2 py-4',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onToolSelect(item.id)}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground',
            'transition-colors hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            activeTool === item.id && 'bg-accent text-accent-foreground'
          )}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  )
}
