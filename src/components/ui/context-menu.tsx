'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ContextMenuItem {
  label: string
  onSelect: () => void
  disabled?: boolean
  icon?: React.ReactNode
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  children: React.ReactNode
}

export function ContextMenu({ items, children }: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
    setIsOpen(true)
  }

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onSelect()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" onContextMenu={handleContextMenu}>
      {children}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 min-w-[160px] rounded-md border border-[var(--vscode-input-border)] bg-[var(--vscode-menu-background)] py-1 shadow-lg"
          style={{ left: position.x, top: position.y }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={cn(
                'flex w-full items-center px-3 py-1.5 text-sm hover:bg-[var(--vscode-menu-selectionBackground)]',
                item.disabled && 'opacity-50'
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
