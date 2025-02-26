import React from 'react'

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

  if (isMinimized) {
    return null
  }

  return (
    <div
      className="absolute overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      <div
        className="flex h-[40px] items-center justify-between border-b bg-background p-2"
        aria-label="Window header"
      >
        <button
          type="button"
          className="flex items-center px-2"
          onClick={handleDragStart}
          aria-label={`Window: ${title}`}
        >
          <span className="text-sm font-medium">{title}</span>
        </button>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            className="rounded-sm p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={onMinimize}
            aria-label="Minimize window"
          >
            -
          </button>
          <button
            type="button"
            className="rounded-sm p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={isMaximized ? onRestore : onMaximize}
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
          >
            □
          </button>
          <button
            type="button"
            className="rounded-sm p-1.5 hover:bg-gray-200 dark:hover:bg-red-800"
            onClick={onClose}
            aria-label="Close window"
          >
            ×
          </button>
        </div>
      </div>
      <div className="h-full overflow-auto">{content}</div>
      {!isMaximized && (
        <button
          type="button"
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onClick={handleResizeStart}
          onMouseDown={handleResizeStart}
          aria-label="Resize window"
        />
      )}
    </div>
  )
}
