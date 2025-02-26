'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface WindowProps {
  title: string
  content: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onRestore: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
}

export function Window({
  title,
  content,
  position,
  size,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const handleDrag = (e: MouseEvent) => {
      onPositionChange({
        x: e.clientX - startX,
        y: e.clientY - startY,
      })
    }

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleDragEnd)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height

    const handleResize = (e: MouseEvent) => {
      onSizeChange({
        width: startWidth + (e.clientX - startX),
        height: startHeight + (e.clientY - startY),
      })
    }

    const handleResizeEnd = () => {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', handleResizeEnd)
    }

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', handleResizeEnd)
  }

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (isMinimized) {
    return null
  }

  const style: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
      }
    : {
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      }

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-[var(--vscode-editor-background)] shadow-lg',
        isMaximized
          ? 'absolute bottom-0 left-0 right-0 top-0 h-full w-full'
          : 'absolute'
      )}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex h-8 items-center justify-between border-b border-[var(--vscode-input-border)] px-3"
        onMouseDown={handleDragStart}
        role="button"
        tabIndex={0}
        aria-label={`Window title: ${title}`}
      >
        <div className="text-sm font-medium">{title}</div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="rounded p-1 hover:bg-[var(--vscode-toolbar-hoverBackground)]"
            onClick={onMinimize}
            aria-label="Minimize window"
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="5" width="8" height="2" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-[var(--vscode-toolbar-hoverBackground)]"
            onClick={isMaximized ? onRestore : onMaximize}
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
              {isMaximized ? (
                <path d="M3 3v6h6V3H3zm1 1h4v4H4V4z" />
              ) : (
                <path d="M2 2v8h8V2H2zm1 1h6v6H3V3z" />
              )}
            </svg>
          </button>
          <button
            type="button"
            className="rounded p-1 hover:bg-[var(--vscode-editorError-foreground)]"
            onClick={onClose}
            aria-label="Close window"
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M9.4 2.6L6 6l3.4 3.4-.8.8L5.2 6.8 2.6 9.4l-.8-.8L5.2 5.2 1.8 1.8l.8-.8L6 4.4 9.4 1l.8.8L6.8 5.2l3.4 3.4-.8.8z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">{content}</div>
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
          role="button"
          tabIndex={0}
          aria-label="Resize window"
        />
      )}
    </div>
  )
}
