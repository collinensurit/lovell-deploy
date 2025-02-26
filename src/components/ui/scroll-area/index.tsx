import React, { useRef, useEffect } from 'react'
import cn from 'classnames'

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
  smoothScroll?: boolean
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className,
  orientation = 'vertical',
  smoothScroll = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (orientation === 'horizontal' && !e.shiftKey) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }

    if (orientation === 'horizontal') {
      el.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (orientation === 'horizontal') {
        el.removeEventListener('wheel', handleWheel)
      }
    }
  }, [orientation])

  return (
    <div
      ref={scrollRef}
      className={cn(
        'relative',
        {
          'overflow-y-auto overflow-x-hidden': orientation === 'vertical',
          'overflow-x-auto overflow-y-hidden': orientation === 'horizontal',
          'overflow-auto': orientation === 'both',
          'scroll-smooth': smoothScroll,
        },
        className
      )}
    >
      {children}
    </div>
  )
}
