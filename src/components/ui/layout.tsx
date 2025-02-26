'use client'

import React from 'react'
import { TopBar } from './top-bar'
import { ActivityBar } from './activity-bar'
import { ToolPanel } from './tool-panel'
import { Workspace } from './workspace'
import { cn } from '@/lib/utils/cn'

export interface LayoutProps {
  title: string
  selectedFile: string | null
  onFileSelect: (file: string) => void
  onFileOpen: (file: string) => void
  onFileDelete: (file: string) => void
  className?: string
}

export function Layout({
  title,
  selectedFile,
  onFileSelect,
  onFileOpen,
  onFileDelete,
  className,
}: LayoutProps) {
  const [activeTab, setActiveTab] = React.useState('files')

  const activityBarItems = [
    { id: 'files', name: 'Files', icon: 'file' },
    { id: 'chat', name: 'Chat', icon: 'message' },
    { id: 'templates', name: 'Templates', icon: 'template' },
  ]

  if (!title) {
    return (
      <div
        className={cn('flex h-screen items-center justify-center', className)}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Lovell</h1>
          <p className="mt-2 text-[var(--vscode-descriptionForeground)]">
            Open a project to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex h-screen flex-col', className)}>
      <ActivityBar
        selectedId={activeTab}
        onSelect={setActiveTab}
        items={activityBarItems}
      />
      <div className="flex flex-1 flex-col">
        <TopBar title={title} />
        <div className="flex flex-1">
          <ToolPanel selectedId={activeTab} onSelect={setActiveTab}>
            <div id="files" title="Files">
              {/* Files content */}
            </div>
            <div id="chat" title="Chat">
              {/* Chat content */}
            </div>
            <div id="templates" title="Templates">
              {/* Templates content */}
            </div>
          </ToolPanel>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <Workspace
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                onFileOpen={onFileOpen}
                onFileDelete={onFileDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
