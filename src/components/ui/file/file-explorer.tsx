import * as React from 'react'
import { useContextMenu } from '@/hooks-new/use-context-menu'
import { cn } from '@/lib-new/utils'

interface FileExplorerProps {
  className?: string
  files: FileItem[]
  onFileSelect?: (file: FileItem) => void
  selectedFile?: string | null
}

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'directory'
  children?: FileItem[]
}

export function FileExplorer({
  className,
  files,
  onFileSelect,
  selectedFile,
}: FileExplorerProps) {
  const { showMenu } = useContextMenu()

  const handleFileClick = (file: FileItem) => {
    onFileSelect?.(file)
  }

  return (
    <div className={cn('h-full w-full overflow-auto', className)}>
      {files.map((file) => (
        <div
          key={file.id}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleFileClick(file)
            }
          }}
          onClick={() => handleFileClick(file)}
          onContextMenu={(e) => {
            e.preventDefault()
            showMenu(e, [
              { label: 'Open', action: () => handleFileClick(file) },
              {
                label: 'Delete',
                action: () => {
                  // Handle file deletion
                },
              },
            ])
          }}
          className={cn(
            'flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          )}
          aria-label={`${file.name} (${file.type})`}
        >
          <span className="mr-2">
            {file.type === 'directory' ? '📁' : '📄'}
          </span>
          <span>{file.name}</span>
        </div>
      ))}
    </div>
  )
}
