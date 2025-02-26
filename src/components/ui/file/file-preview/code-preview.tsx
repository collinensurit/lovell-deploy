'use client'

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { ScrollArea } from '../../scroll-area'

interface CodePreviewProps {
  /**
   * Content to display
   */
  content: string
  
  /**
   * Programming language for syntax highlighting
   */
  language?: string
  
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Component for displaying code with syntax highlighting
 */
export function CodePreview({
  content,
  language,
  className,
}: CodePreviewProps) {
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
