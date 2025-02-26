import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib-new/utils'

interface Tab {
  id: string
  title: string
  content: React.ReactNode
  isDirty?: boolean
}

interface TabWindowProps {
  className?: string
  tabs: Tab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

export function TabWindow({
  className,
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
}: TabWindowProps) {
  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div
      className={cn('flex h-full flex-col', className)}
      role="tablist"
      aria-orientation="horizontal"
    >
      <div className="flex border-b">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              'group flex items-center border-r',
              activeTabId === tab.id
                ? 'bg-white dark:bg-gray-800'
                : 'bg-gray-100 dark:bg-gray-900'
            )}
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className="flex items-center px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`tab-content-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.title}
              {tab.isDirty && (
                <span className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => onTabClose(tab.id)}
              className="mr-1 rounded-sm p-1 opacity-0 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group-hover:opacity-100 dark:hover:bg-gray-700"
              aria-label={`Close ${tab.title} tab`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab && (
          <div
            role="tabpanel"
            aria-labelledby={`tab-${activeTab.id}`}
            id={`tab-content-${activeTab.id}`}
            className="h-full"
          >
            {activeTab.content}
          </div>
        )}
      </div>
    </div>
  )
}
