import * as React from 'react'
import { cn } from '@/lib/utils'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  children?: React.ReactNode
}

interface AlertDialogContentProps {
  className?: string
  children?: React.ReactNode
}

interface AlertDialogActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

interface AlertDialogCancelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const AlertDialogContext = React.createContext<{
  isOpen: boolean
  onClose: () => void
}>({
  isOpen: false,
  onClose: () => {},
})

export function AlertDialog({
  isOpen,
  onClose,
  className,
  children,
}: AlertDialogProps) {
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AlertDialogContext.Provider value={{ isOpen, onClose }}>
      <>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClose?.()
            }
          }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />
        <div
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
            className
          )}
        >
          {children}
        </div>
      </>
    </AlertDialogContext.Provider>
  )
}

export function AlertDialogContent({
  className,
  children,
}: AlertDialogContentProps) {
  return <div className={cn('grid gap-4', className)}>{children}</div>
}

export function AlertDialogHeader({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-2 text-center sm:text-left',
        className
      )}
    >
      {children}
    </div>
  )
}

export function AlertDialogFooter({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export function AlertDialogTitle({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>
}

export function AlertDialogDescription({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </div>
  )
}

export function AlertDialogAction({
  className,
  children,
  ...props
}: AlertDialogActionProps) {
  const { onClose } = React.useContext(AlertDialogContext)

  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClose()
        if (props.onClick) {
          props.onClick(e)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function AlertDialogCancel({
  className,
  children,
  ...props
}: AlertDialogCancelProps) {
  const { onClose } = React.useContext(AlertDialogContext)

  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={(e) => {
        onClose()
        if (props.onClick) {
          props.onClick(e)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}
