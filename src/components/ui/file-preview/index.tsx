'use client'

import * as React from 'react'
import { Download, Maximize2, X, RotateCw } from 'lucide-react'
import { cn } from '@/lib-new/utils/cn'
import { downloadFile, FILE_TYPES } from '@/lib-new/utils/file'
import { useFileMetadata } from '@/lib-new/hooks/use-file-metadata'
import { resizeImage, convertFileFormat } from '@/lib-new/utils/file/transform'
import { Button } from '@/components/ui/button'

/**
 * Props for the FilePreview component
 */
interface FilePreviewProps {
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
 * File preview component that handles different file types
 */
export function FilePreview({
  file,
  className,
  onClose,
  onDownload,
  showActions = true,
  showInfo = true,
}: FilePreviewProps) {
  const [metadata] = useFileMetadata(file)
  const [fullscreen, setFullscreen] = React.useState(false)
  
  // Download the file
  const handleDownload = () => {
    downloadFile(file, file.name)
    onDownload?.(file)
  }
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }
  
  // Render appropriate preview based on file type
  const renderPreview = () => {
    if (metadata.isImage) {
      return (
        <div className="flex h-full items-center justify-center overflow-auto">
          <img 
            src={metadata.previewUrl}
            alt={file.name}
            className={cn(
              "max-h-full max-w-full object-contain",
              fullscreen ? "cursor-zoom-out" : "cursor-zoom-in"
            )}
            onClick={toggleFullscreen}
          />
        </div>
      )
    }
    
    if (metadata.isVideo) {
      return (
        <div className="flex h-full items-center justify-center">
          <video 
            src={URL.createObjectURL(file)} 
            controls 
            className="max-h-full max-w-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }
    
    if (metadata.isAudio) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-4">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium">{file.name}</h3>
            <p className="text-sm text-gray-500">{metadata.formattedSize}</p>
          </div>
          <audio src={URL.createObjectURL(file)} controls className="w-full max-w-md">
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    }
    
    // For other file types, show info
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <FileIcon file={file} size="large" />
        </div>
        <h3 className="text-lg font-medium">{file.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{metadata.formattedSize}</p>
        <p className="mt-1 text-sm text-gray-500">{metadata.mimeType}</p>
        
        <Button 
          className="mt-4"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg dark:bg-gray-900",
        fullscreen ? "fixed inset-0 z-50" : "h-[400px]",
        className
      )}
    >
      {/* Header */}
      {(showInfo || showActions) && (
        <div className="flex items-center justify-between border-b p-2 dark:border-gray-700">
          {showInfo ? (
            <div className="truncate px-2">
              <h3 className="truncate font-medium">{file.name}</h3>
              <p className="text-xs text-gray-500">{metadata.formattedSize}</p>
            </div>
          ) : (
            <div />
          )}
          
          {showActions && (
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={toggleFullscreen}
                title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              {onClose && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={onClose}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Preview content */}
      <div className="flex-1 overflow-auto">
        {renderPreview()}
      </div>
    </div>
  )
}

/**
 * File icon component for different file types
 */
interface FileIconProps {
  /**
   * File to show icon for
   */
  file: File
  
  /**
   * Icon size
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Icon component for different file types
 */
export function FileIcon({ file, size = 'medium', className }: FileIconProps) {
  const [metadata] = useFileMetadata(file, { generatePreviews: false })
  
  const sizeClass = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
  }[size]
  
  // Choose icon based on file type
  const getIconByType = () => {
    if (metadata.isImage) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(sizeClass, className)}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      )
    }
    
    if (metadata.isDocument) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(sizeClass, className)}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
    
    if (metadata.isAudio) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(sizeClass, className)}>
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      )
    }
    
    if (metadata.isVideo) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(sizeClass, className)}>
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
      )
    }
    
    if (metadata.isArchive) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(sizeClass, className)}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    }
    
    // Default file icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(sizeClass, className)}>
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
      </svg>
    )
  }
  
  return getIconByType()
}

/**
 * File preview with image editing capabilities
 */
export function ImageEditorPreview({
  file,
  className,
  onSave,
  onClose,
}: {
  file: File
  className?: string
  onSave?: (editedFile: File) => void
  onClose?: () => void
}) {
  const [metadata] = useFileMetadata(file)
  const [editedUrl, setEditedUrl] = React.useState<string | null>(null)
  const [format, setFormat] = React.useState<'jpeg' | 'png' | 'webp'>('jpeg')
  const [quality, setQuality] = React.useState(0.8)
  
  // Not an image file
  if (!metadata.isImage) {
    return <FilePreview file={file} className={className} onClose={onClose} />
  }
  
  // Save edited image
  const saveImage = async () => {
    try {
      // Resize or convert format
      let blob: Blob
      if (format !== 'jpeg' || quality !== 0.8) {
        blob = await convertFileFormat(file, format, quality)
      } else {
        blob = file
      }
      
      // Create new file with same name but different extension
      let fileName = file.name
      if (format !== metadata.extension) {
        const nameParts = file.name.split('.')
        nameParts.pop() // Remove current extension
        fileName = `${nameParts.join('.')}.${format}`
      }
      
      const newFile = new File([blob], fileName, { type: `image/${format}` })
      onSave?.(newFile)
      
      // Update preview
      if (editedUrl) {
        URL.revokeObjectURL(editedUrl)
      }
      setEditedUrl(URL.createObjectURL(newFile))
    } catch (error) {
      console.error('Error saving edited image:', error)
    }
  }
  
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-lg border", className)}>
      <div className="flex items-center justify-between border-b p-2">
        <div className="truncate px-2">
          <h3 className="truncate font-medium">{file.name}</h3>
          <p className="text-xs text-gray-500">{metadata.formattedSize}</p>
        </div>
        
        <div className="flex space-x-1">
          <Button
            size="sm"
            onClick={saveImage}
          >
            <RotateCw className="mr-1 h-3 w-3" />
            Save Changes
          </Button>
          
          {onClose && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Preview */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex h-full items-center justify-center">
            <img 
              src={editedUrl || metadata.previewUrl}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        
        {/* Settings */}
        <div className="w-64 border-l p-4">
          <h4 className="mb-3 font-medium">Export Settings</h4>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full rounded border p-1 text-sm"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          
          {(format === 'jpeg' || format === 'webp') && (
            <div className="mb-4">
              <label className="mb-1 block text-sm">Quality: {Math.round(quality * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
