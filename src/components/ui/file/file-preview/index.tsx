import React from 'react'
import cn from 'classnames'
import { ScrollArea } from '../../scroll-area'

interface FilePreviewProps {
  content: string
  language?: string
  className?: string
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  content,
  language,
  className,
}) => {
  return (
    <ScrollArea className={cn('h-full', className)}>
      <pre
        className={cn(
          'p-4 font-mono text-sm',
          'bg-white dark:bg-gray-900',
          'text-gray-900 dark:text-gray-100'
        )}
      >
        <code className={language ? `language-${language}` : undefined}>
          {content}
        </code>
      </pre>
    </ScrollArea>
  )
}
