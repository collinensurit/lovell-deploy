'use client'

import React from 'react'
import { FileExplorer, type FileItem } from '@/components/ui/file/file-explorer'
import type { FileNode } from '@/lib/types'

interface WorkspaceProps {
  onFileSelect: (file: FileNode) => void
  className?: string
}

export function Workspace({ onFileSelect, className }: WorkspaceProps) {
  // Convert FileNode handler to FileItem handler
  const handleFileSelect = (file: FileItem) => {
    // Create a compatible FileNode from FileItem
    const fileNode: FileNode = {
      id: file.id,
      name: file.name,
      type: file.type as any, // Type conversion
      children: [],
    }
    onFileSelect(fileNode)
  }

  // Create sample files in the FileItem format
  const files: FileItem[] = [
    {
      id: 'root',
      name: 'Project Root',
      type: 'directory',
      children: [],
    },
  ]

  return (
    <div className={className}>
      <FileExplorer files={files} onFileSelect={handleFileSelect} />
    </div>
  )
}
