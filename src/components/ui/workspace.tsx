'use client'

import React from 'react'
import { FilePreview } from './file-preview/index'

export interface WorkspaceProps {
  selectedFile: string | null
  onFileSelect: (fileId: string) => void
  onFileOpen: (fileId: string) => void
  onFileDelete: (fileId: string) => void
}

export function Workspace({
  selectedFile,
  onFileSelect,
  onFileOpen,
  onFileDelete,
}: WorkspaceProps) {
  return (
    <div className="h-full overflow-auto">
      {selectedFile ? (
        <FilePreview
          file={{
            id: selectedFile,
            name: selectedFile.split('/').pop() || 'Unknown',
            type: 'file',
            content: '',
          }}
          onSelect={onFileSelect}
          onOpen={onFileOpen}
          onDelete={onFileDelete}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-500">
          No file selected
        </div>
      )}
    </div>
  )
}
