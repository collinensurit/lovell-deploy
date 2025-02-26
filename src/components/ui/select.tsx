import * as React from 'react'
import { cn } from '@/lib-new/utils'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--vscode-input-border)] bg-[var(--vscode-input-background)] px-3 py-2 text-sm text-[var(--vscode-input-foreground)] ring-offset-[var(--vscode-input-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vscode-focusBorder)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export interface OptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string
}

const Option = React.forwardRef<HTMLOptionElement, OptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        className={cn(
          'relative flex w-full cursor-default select-none py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-[var(--vscode-list-activeSelectionBackground)] focus:text-[var(--vscode-list-activeSelectionForeground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </option>
    )
  }
)
Option.displayName = 'Option'

export { Select, Option }
