import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ActivityBarItem {
  id: string
  name: string
  icon: string
}

export interface ActivityBarProps {
  items: ActivityBarItem[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ActivityBar({ items, selectedId, onSelect }: ActivityBarProps) {
  return (
    <div className="flex h-full w-12 flex-col items-center border-r bg-[var(--vscode-sideBar-background)] py-2">
      {items.map((item) => (
        <button
          key={item.id}
          className={cn(
            'mb-2 flex h-12 w-12 items-center justify-center rounded-lg hover:bg-[var(--vscode-list-hoverBackground)]',
            selectedId === item.id &&
              'bg-[var(--vscode-list-activeSelectionBackground)]'
          )}
          onClick={() => onSelect(item.id)}
          title={item.name}
        >
          <span className="icon">{item.icon}</span>
        </button>
      ))}
    </div>
  )
}
