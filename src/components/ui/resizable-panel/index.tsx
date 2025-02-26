import React, { useState, useEffect, useCallback } from 'react'

export interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  visible?: boolean
  className?: string
}

export function ResizablePanel({
  children,
  defaultSize = 280,
  minSize = 200,
  maxSize = 600,
  visible = true,
  className = '',
}: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const newSize = e.clientX
      if (newSize >= minSize && newSize <= maxSize) {
        setSize(newSize)
      }
    },
    [isResizing, minSize, maxSize]
  )

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  if (!visible) return null

  return (
    <div
      className={`relative flex h-full ${className}`}
      style={{ width: size }}
    >
      <div className="h-full flex-1 overflow-auto">{children}</div>
      <button
        type="button"
        onMouseDown={startResizing}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Resize panel"
      />
    </div>
  )
}
