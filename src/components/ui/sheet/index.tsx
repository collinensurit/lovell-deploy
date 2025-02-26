import React, { useEffect, useRef } from 'react'
import cn from 'classnames'

interface SheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: string
  className?: string
  overlayClassName?: string
}

export const Sheet: React.FC<SheetProps> = ({
  children,
  isOpen,
  onClose,
  position = 'right',
  size = '400px',
  className,
  overlayClassName,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const positionStyles = {
    left: {
      sheet: 'left-0 top-0 h-full',
      transform: 'translate-x-[-100%]',
      enter: 'translate-x-0',
    },
    right: {
      sheet: 'right-0 top-0 h-full',
      transform: 'translate-x-[100%]',
      enter: 'translate-x-0',
    },
    top: {
      sheet: 'top-0 left-0 w-full',
      transform: 'translate-y-[-100%]',
      enter: 'translate-y-0',
    },
    bottom: {
      sheet: 'bottom-0 left-0 w-full',
      transform: 'translate-y-[100%]',
      enter: 'translate-y-0',
    },
  }[position]

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black bg-opacity-50 transition-opacity',
          overlayClassName
        )}
      />
      <div
        ref={sheetRef}
        className={cn(
          'fixed bg-white shadow-lg transition-transform duration-300 dark:bg-gray-900',
          positionStyles.sheet,
          {
            [positionStyles.transform]: !isOpen,
            [positionStyles.enter]: isOpen,
          },
          className
        )}
        style={{
          [position === 'left' || position === 'right' ? 'width' : 'height']:
            size,
        }}
      >
        {children}
      </div>
    </>
  )
}
