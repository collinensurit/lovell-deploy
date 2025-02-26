'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vscode-focusBorder)] focus-visible:ring-offset-2',
            'bg-[var(--vscode-input-background)] peer-checked:bg-[var(--vscode-inputOption-activeBackground)]',
            className
          )}
        >
          <div
            className={cn(
              'absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-[var(--vscode-input-foreground)] transition-transform',
              'peer-checked:translate-x-5'
            )}
          />
        </div>
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
