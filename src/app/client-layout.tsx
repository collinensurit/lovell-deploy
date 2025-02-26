'use client'

import React, { useState } from 'react'
import { ResizablePanel } from '@/components/ui/resizable-panel'
import { FileExplorer, type FileItem } from '@/components/ui/file/file-explorer'
import { Chat } from '@/components/ui/chat'
import { usePanelShortcuts } from '@/hooks-new/use-panel-shortcuts'
import { TemplatePanel } from '@/components/ui/template-management/template-panel'
import { ActivityBar, type ActivityBarItem } from '@/components/ui/activity-bar'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [activeTool, setActiveTool] = useState('files')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file.id)
  }

  // Sample files for demo
  const demoFiles: FileItem[] = [
    {
      id: 'file1',
      name: 'README.md',
      type: 'file',
    },
    {
      id: 'dir1',
      name: 'src',
      type: 'directory',
      children: [
        {
          id: 'file2',
          name: 'index.ts',
          type: 'file',
        },
      ],
    },
  ]

  const activityBarItems: ActivityBarItem[] = [
    { id: 'files', name: 'Files', icon: 'file' },
    { id: 'chat', name: 'Chat', icon: 'message' },
    { id: 'templates', name: 'Templates', icon: 'template' },
  ]

  usePanelShortcuts({
    onTogglePanel: () =>
      setActiveTool((prev) => (prev === 'none' ? 'files' : 'none')),
    onToggleSidebar: () => setActiveTool('files'),
    onToggleChat: () => setActiveTool('chat'),
  })

  const renderTool = () => {
    switch (activeTool) {
      case 'files':
        return (
          <FileExplorer
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            files={demoFiles}
          />
        )
      case 'chat':
        return <Chat />
      case 'templates':
        return <TemplatePanel />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      <ActivityBar
        selectedId={activeTool}
        onSelect={setActiveTool}
        items={activityBarItems}
      />
      <ResizablePanel defaultSize={280} minSize={200} maxSize={400}>
        {renderTool()}
      </ResizablePanel>
      <div className="flex-1">{children}</div>
    </div>
  )
}
