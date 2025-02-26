import React from 'react'

export interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b bg-[var(--vscode-titleBar-activeBackground)] px-4">
      <h1 className="text-lg font-medium">{title}</h1>
    </div>
  )
}
