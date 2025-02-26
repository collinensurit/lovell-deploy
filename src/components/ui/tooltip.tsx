import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  delayDuration?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

const TooltipContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function Tooltip({
  children,
  content,
  delayDuration = 200,
  side = 'top',
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setIsOpen(true), delayDuration)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 rounded-md bg-popover px-2 py-1 text-sm text-popover-foreground shadow-md',
              side === 'top' && 'bottom-full left-1/2 mb-2 -translate-x-1/2',
              side === 'right' && 'left-full top-1/2 ml-2 -translate-y-1/2',
              side === 'bottom' && 'left-1/2 top-full mt-2 -translate-x-1/2',
              side === 'left' && 'right-full top-1/2 mr-2 -translate-y-1/2',
              className
            )}
            role="tooltip"
          >
            {content}
          </div>
        )}
      </div>
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = React.useContext(TooltipContext)
  if (!isOpen) return null
  return <>{children}</>
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
