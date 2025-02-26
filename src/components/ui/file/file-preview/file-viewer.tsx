'use client'

import * as React from 'react'
import { Download, Maximize2, X, RotateCw } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { downloadFile, formatFileSize } from '../../../../lib-new/utils/file/operations'
import { FILE_TYPES } from '../../../../lib-new/utils/file/types'
import { useFileMetadata } from '../../../../lib-new/hooks/use-file-metadata'
import { Button } from '../../button'
import dynamic from 'next/dynamic'

// Dynamically import the code preview component to prevent SSR issues
const CodePreview = dynamic(() => import('./code-preview').then(mod => ({ default: mod.CodePreview })), { 
  ssr: false,
  loading: () => <div className="p-4 bg-gray-100 rounded">Loading code preview...</div>
})

/**
 * Props for the FileViewer component
 */
interface FileViewerProps {
  /**
   * File to preview
   */
  file: File
  
  /**
   * Additional class name
   */
  className?: string
  
  /**
   * Called when the preview is closed
   */
  onClose?: () => void
  
  /**
   * Called when the file is downloaded
   */
  onDownload?: (file: File) => void
  
  /**
   * Whether to show file actions
   */
  showActions?: boolean
  
  /**
   * Whether to show file info
   */
  showInfo?: boolean
}

/**
 * File viewer component that handles different file types
 */
export function FileViewer({
  file,
  className,
  onClose,
  onDownload,
  showActions = true,
  showInfo = true,
}: FileViewerProps) {
  const [fullscreen, setFullscreen] = React.useState(false)
  const [objectUrl, setObjectUrl] = React.useState<string>('')
  const metadata = useFileMetadata(file)
  
  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setObjectUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])
  
  const handleDownload = () => {
    downloadFile(file, file.name)
    onDownload?.(file)
  }
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }
  
  const renderPreview = () => {
    if (!file) return null
    
    if (file.type.startsWith('image/')) {
      return (
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          <img 
            src={objectUrl} 
            alt={file.name} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )
    }
    
    if (file.type === 'application/pdf') {
      return (
        <iframe 
          src={objectUrl}
          title={file.name}
          className="h-full w-full border-0"
        />
      )
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <video 
          src={objectUrl} 
          controls 
          className="h-full w-full" 
        />
      )
    }
    
    if (file.type.startsWith('audio/')) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
          <FileIcon file={file} size="large" />
          <audio 
            src={objectUrl} 
            controls 
            className="mt-4 w-full"
          />
        </div>
      )
    }
    
    // Text files
    if (file.type === 'text/plain' || file.type.startsWith('text/') || file.type.includes('javascript') || file.type.includes('json')) {
      const reader = new FileReader()
      const [content, setContent] = React.useState<string>('')
      const [isLoading, setIsLoading] = React.useState(true)
      
      React.useEffect(() => {
        setIsLoading(true)
        reader.onload = (e) => {
          const text = e.target?.result as string
          setContent(text || '')
          setIsLoading(false)
        }
        reader.readAsText(file)
      }, [file])
      
      if (isLoading) {
        return <div className="flex h-full items-center justify-center">Loading content...</div>
      }
      
      const language = getLanguageFromFileName(file.name)
      return <CodePreview content={content} language={language} />
    }
    
    // Default preview for other file types
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <FileIcon file={file} size="large" />
        <p className="mt-4 text-center text-gray-500">
          Preview not available for this file type
        </p>
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm',
        fullscreen ? 'fixed inset-0 z-50' : 'relative',
        className
      )}
    >
      {/* Header */}
      {(showActions || onClose) && (
        <div className="flex items-center justify-between border-b p-2">
          {file.name && (
            <p className="truncate px-2 font-medium">{file.name}</p>
          )}
          <div className="flex space-x-1">
            {showActions && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  aria-label="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative flex-1 overflow-auto">{renderPreview()}</div>
      
      {/* Footer */}
      {showInfo && metadata && metadata.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {metadata[0].file.size && formatFileSize(metadata[0].file.size)}
          {' • '}
          {metadata[0].file.lastModified && `Modified ${new Date(metadata[0].file.lastModified).toLocaleDateString()} • `}
          {metadata[0].mimeType && metadata[0].mimeType}
        </div>
      )}
    </div>
  )
}

/**
 * File icon component for different file types
 */
interface FileIconProps {
  file: File
  size?: 'small' | 'medium' | 'large'
  className?: string
}

/**
 * Icon component for different file types
 */
export function FileIcon({ file, size = 'medium', className }: FileIconProps) {
  const getIconColor = (): string => {
    if (file.type === 'application/pdf') return 'text-red-500'
    if (file.type.startsWith('text/') || file.type.includes('javascript') || file.type.includes('json')) return 'text-blue-500'
    if (file.type.startsWith('image/')) return 'text-green-500'
    if (file.type.startsWith('audio/')) return 'text-purple-500'
    if (file.type.startsWith('video/')) return 'text-pink-500'
    if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('7z')) return 'text-gray-500'
    return 'text-gray-400'
  }
  
  const getIconSize = (): string => {
    switch (size) {
      case 'small':
        return 'h-6 w-6'
      case 'large':
        return 'h-20 w-20'
      case 'medium':
      default:
        return 'h-12 w-12'
    }
  }
  
  const extension = file.name.split('.').pop() || ''
  
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded border',
        getIconColor(),
        getIconSize(),
        className
      )}
    >
      <span className="text-center text-xs font-bold">{extension.toUpperCase()}</span>
    </div>
  )
}

/**
 * Image editor preview component
 */
interface ImageEditorPreviewProps {
  file: File
  className?: string
  onSave?: (editedFile: File) => void
  onClose?: () => void
}

/**
 * File preview with image editing capabilities
 */
export function ImageEditorPreview({
  file,
  className,
  onSave,
  onClose,
}: ImageEditorPreviewProps) {
  const [objectUrl, setObjectUrl] = React.useState<string>('')
  const [isEditing, setIsEditing] = React.useState(false)
  const [isRotating, setIsRotating] = React.useState(false)
  const [rotation, setRotation] = React.useState(0)
  
  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setObjectUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])
  
  const handleRotate = async () => {
    if (!file || isRotating) return
    
    setIsRotating(true)
    
    // Update rotation state
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    
    try {
      // Process the image rotation (this would normally use a canvas or image library)
      // For this example, we're just using a timeout to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // In a real implementation, we would create a new rotated image file and call onSave
      // onSave?.(rotatedFile)
    } catch (error) {
      console.error('Error rotating image:', error)
    } finally {
      setIsRotating(false)
    }
  }
  
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2">
        {file.name && (
          <p className="truncate px-2 font-medium">{file.name}</p>
        )}
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
            disabled={isRotating}
            aria-label="Rotate image"
          >
            <RotateCw className={cn('h-4 w-4', isRotating && 'animate-spin')} />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative flex-1 overflow-auto">
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          <img 
            src={objectUrl} 
            alt={file.name} 
            className={cn(
              'max-h-full max-w-full object-contain transition-transform',
              rotation && `rotate-${rotation}`
            )}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Gets the language from a filename for code highlighting
 */
function getLanguageFromFileName(filename: string): string | undefined {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
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
  return extensionToLanguage[extension]
}
