'use client'

import React from 'react'
import { ResizablePanel } from '../resizable-panel'
import { cn } from '@/lib-new/utils'

export interface ToolPanelProps {
  selectedId: string
  onSelect: (id: string) => void
  children: React.ReactNode
}

export function ToolPanel({ selectedId, onSelect, children }: ToolPanelProps) {
  return (
    <ResizablePanel defaultSize={280} minSize={200} maxSize={400}>
      <div className="flex h-full flex-col">
        <div className="flex border-b">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null
            const id = child.props.id
            return (
              <button
                key={id}
                className={cn(
                  'flex-1 p-2 text-sm hover:bg-[var(--vscode-list-hoverBackground)]',
                  selectedId === id &&
                    'bg-[var(--vscode-list-activeSelectionBackground)]'
                )}
                onClick={() => onSelect(id)}
              >
                {child.props.title}
              </button>
            )
          })}
        </div>
        <div className="flex-1 overflow-auto">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null
            return child.props.id === selectedId ? child : null
          })}
        </div>
      </div>
    </ResizablePanel>
  )
}
