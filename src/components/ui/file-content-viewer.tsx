import React from 'react'
import { cn } from '@/lib-new/utils'

interface FileContentViewerProps {
  content: string
  className?: string
}

export function FileContentViewer({
  content,
  className,
}: FileContentViewerProps) {
  return (
    <div
      className={cn(
        'h-full w-full overflow-auto bg-[var(--vscode-editor-background)] p-4 text-[var(--vscode-editor-foreground)]',
        className
      )}
    >
      <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    </div>
  )
}
