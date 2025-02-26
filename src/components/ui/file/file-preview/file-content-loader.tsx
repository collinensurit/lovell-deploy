'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { CodePreview } from './code-preview'

interface FileContentLoaderProps {
  /**
   * Path to the file on the server
   */
  filePath: string
  
  /**
   * Additional class name
   */
  className?: string
  
  /**
   * Language for syntax highlighting (auto-detected from file extension if not provided)
   */
  language?: string
}

/**
 * Component for loading and displaying file contents from a server path
 */
export function FileContentLoader({ 
  filePath,
  className,
  language
}: FileContentLoaderProps) {
  const [content, setContent] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [detectedLanguage, setDetectedLanguage] = React.useState<string | undefined>(language)

  const fetchFileContent = React.useCallback(async () => {
    if (!filePath) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/files/content?path=${encodeURIComponent(filePath)}`
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`)
      }
      const data = await response.json()
      setContent(data.content)
      
      // Auto-detect language from file extension if not provided
      if (!language) {
        const fileExtension = filePath.split('.').pop()?.toLowerCase()
        if (fileExtension) {
          const extensionToLanguage: Record<string, string> = {
            'js': 'javascript',
            'ts': 'typescript',
            'jsx': 'jsx',
            'tsx': 'tsx',
            'css': 'css',
            'html': 'html',
            'json': 'json',
            'md': 'markdown',
            'py': 'python',
            'rb': 'ruby',
            'java': 'java',
            'php': 'php',
            'go': 'go',
            'rust': 'rust',
            'c': 'c',
            'cpp': 'cpp',
            'cs': 'csharp',
            'sh': 'bash',
            'swift': 'swift',
            'sql': 'sql',
            'yml': 'yaml',
            'yaml': 'yaml',
          }
          setDetectedLanguage(extensionToLanguage[fileExtension])
        }
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load file content'
      )
    } finally {
      setLoading(false)
    }
  }, [filePath, language])

  React.useEffect(() => {
    fetchFileContent()
  }, [fetchFileContent])

  if (loading) {
    return (
      <div className={cn('flex h-40 items-center justify-center', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('p-4 text-red-500', className)}>
        <p className="font-semibold">Error loading file:</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <CodePreview 
      content={content} 
      language={detectedLanguage} 
      className={className} 
    />
  )
}
