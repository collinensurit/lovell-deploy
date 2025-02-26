'use client'

import React from 'react'
import { ActivityBar, type ActivityBarItem } from './activity-bar'
import { ToolPanel } from './tool-panel'

export interface LayoutProps {
  children: React.ReactNode
  className?: string
}

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

export function Layout({ children, className }: LayoutProps) {
  const [activeTab, setActiveTab] = React.useState('files')

  const activityBarItems: ActivityBarItem[] = [
    {
      id: 'files',
      label: 'Files',
      icon: <span className="icon">F</span>,
      onClick: () => setActiveTab('files'),
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: <span className="icon">C</span>,
      onClick: () => setActiveTab('chat'),
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <span className="icon">T</span>,
      onClick: () => setActiveTab('templates'),
    },
  ]

  return (
    <div className={`flex h-screen ${className || ''}`}>
      <ActivityBar
        items={activityBarItems}
        activeTool={activeTab}
        onToolSelect={setActiveTab}
      />
      <ToolPanel
        activeTabId={activeTab}
        setActiveTabId={setActiveTab}
        onClose={() => {
          /* handle close */
        }}
        className="w-64 border-r"
        tabs={[
          {
            id: 'files',
            title: 'Files',
            content: <div>Files content</div>,
          },
          {
            id: 'chat',
            title: 'Chat',
            content: <div>Chat content</div>,
          },
          {
            id: 'templates',
            title: 'Templates',
            content: <div>Templates content</div>,
          },
        ]}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
