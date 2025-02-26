import React, { useState } from 'react'
import cn from 'classnames'
import { ScrollArea } from '../../scroll-area'
import { Tooltip } from '../../tooltip'
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  path: string
  size?: number
  modified?: string
}

interface FileExplorerProps {
  files: FileNode[]
  onFileSelect?: (file: FileNode) => void
  onDirectorySelect?: (directory: FileNode) => void
  className?: string
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  onDirectorySelect,
  className,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedPaths)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedPaths(newExpanded)
  }

  const handleKeyDown = (e: React.KeyboardEvent, node: FileNode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (node.type === 'directory') {
        toggleDirectory(node.path)
        onDirectorySelect?.(node)
      } else {
        onFileSelect?.(node)
      }
      e.preventDefault()
    }
  }

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedPaths.has(node.path)

    return (
      <div
        key={node.id}
        role={node.type === 'directory' ? 'treeitem' : 'none'}
        aria-expanded={node.type === 'directory' ? isExpanded : undefined}
      >
        <button
          className={cn(
            'flex w-full items-center rounded-md px-2 py-1 text-left',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            { 'pl-[calc(0.5rem+var(--level-indent))]': depth > 0 }
          )}
          style={
            { '--level-indent': `${depth * 1.5}rem` } as React.CSSProperties
          }
          onClick={() => {
            if (node.type === 'directory') {
              toggleDirectory(node.path)
              onDirectorySelect?.(node)
            } else {
              onFileSelect?.(node)
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, node)}
          aria-label={`${node.type === 'directory' ? 'Directory' : 'File'}: ${node.name}`}
          tabIndex={0}
        >
          <span className="mr-2 flex items-center">
            {node.type === 'directory' && (
              <span className="mr-1 text-gray-500">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
            {node.type === 'directory' ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <File className="h-4 w-4 text-gray-500" />
            )}
          </span>
          <Tooltip content={node.path}>
            <span className="truncate text-sm">{node.name}</span>
          </Tooltip>
        </button>

        {node.type === 'directory' &&
          isExpanded &&
          node.children?.map((child) => renderFileNode(child, depth + 1))}
      </div>
    )
  }

  return (
    <ScrollArea
      className={cn('h-full', className)}
      role="tree"
      aria-label="File Explorer"
    >
      <div className="py-2">{files.map((file) => renderFileNode(file))}</div>
    </ScrollArea>
  )
}
