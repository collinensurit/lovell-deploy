import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  title: string
  content: React.ReactNode
}

interface ToolPanelProps {
  className?: string
  tabs: Tab[]
  activeTabId: string
  onClose: () => void
  setActiveTabId: (id: string) => void
}

export function ToolPanel({
  className,
  tabs,
  activeTabId,
  onClose,
  setActiveTabId,
}: ToolPanelProps) {
  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div
      className={cn(
        'flex h-full flex-col border-l border-t bg-background',
        className
      )}
      role="tablist"
      aria-orientation="horizontal"
    >
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                'px-3 py-1 text-sm',
                activeTabId === tab.id
                  ? 'bg-gray-100 font-medium'
                  : 'hover:bg-gray-50'
              )}
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`tab-content-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {activeTab && (
          <div
            role="tabpanel"
            aria-labelledby={`tab-${activeTab.id}`}
            id={`tab-content-${activeTab.id}`}
          >
            {activeTab.content}
          </div>
        )}
      </div>
    </div>
  )
}
